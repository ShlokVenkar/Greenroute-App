import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import { MUMBAI_ROUTES, MUMBAI_HOSPITALS, MUMBAI_PICKUP_LOCATIONS, SEVERITY_CONFIG } from '../data/mumbaiRoutes';
import {
  SIGNAL_PHASE,
  DIRECTION_TO_EMERGENCY_PHASE,
  requiresPhaseChange,
  phaseLabel,
} from '../simulation/signalStateMachine';
import {
  createRequest,
  resetRequestCounter,
  selectNextRequest,
  generatePriorityDecision,
  REQUEST_STATUS,
  VEHICLE_LABELS,
  DIRECTION_LABELS,
} from '../simulation/priorityEngine';

// Default route is Dadar to KEM Hospital
const DEFAULT_ROUTE = MUMBAI_ROUTES[0];

const initialMumbaiState = {
  // Authentication & Persona
  currentUser: null, // null when logged out, or { role: 'driver' | 'citizen' | 'admin', name: string, badge: string }
  languageChosen: false, // After login, user is prompted to choose language first

  // App Shell & Mode
  language: 'en', // 'en' | 'hi' | 'mr'
  isMobileFrame: true, // Show realistic smartphone frame on desktop by default
  activeTab: 'main', // Sub-tab within current role

  // Mission & Driver State
  missionActive: true,
  sirenOn: true,
  severity: 'CODE_RED', // 'CODE_RED' | 'CODE_AMBER' | 'CODE_YELLOW'
  medicalReason: 'Heart Attack / Cardiac Arrest',
  selectedHospitalId: 'kem',
  currentRoute: DEFAULT_ROUTE,
  routeIndex: 0, // current index in pathCoordinates
  vehicleLocation: DEFAULT_ROUTE.pathCoordinates[0],
  vehicleHeading: 180,
  speedKmh: 54,
  distanceRemainingMeters: 2400,
  etaSeconds: 270, // 4.5 mins
  isUsingDeviceGps: false,
  gpsAccuracy: 12,

  // Signals on current route
  signals: DEFAULT_ROUTE.signals,
  activePreemptedSignalId: 'SIG_101',
  clearedSignalCount: 1,

  // Citizen SOS state
  citizenSos: {
    requested: false,
    dispatchedVehicleId: 'MH-01-EQ-4421',
    driverName: 'Ramesh Shinde',
    emergencyType: 'ambulance',
    severity: 'CODE_RED',
    pickupLocation: 'Dadar TT Circle, Mumbai',
    hospitalId: 'kem',
    etaMinutes: 4,
  },

  // Hardware Prototype Bridge State
  hardware: {
    connected: false,
    baudRate: 115200,
    port: 'COM3 (ESP32)',
    lastPacketTime: Date.now(),
    gpioPins: {
      pin12: false, // North Red
      pin13: false, // North Yellow
      pin14: true,  // North Green (Corridor Active)
      pin25: true,  // East Red (Hold)
      pin26: false, // East Yellow
      pin27: false, // East Green
    },
    rawTelemetry: '',
  },

  // Base Simulator State (Kept for compatibility)
  simRunning: true,
  simPaused: false,
  currentPhase: SIGNAL_PHASE.EMERGENCY_N,
  transitioning: false,
  transitionProgress: 0,
  requests: [],
  activeRequestId: 'REQ-001',
  events: [
    {
      id: 1,
      timestamp: new Date(),
      category: 'priority',
      description: 'Emergency corridor activated for Ambulance MH-01-EQ-4421 towards KEM Hospital.',
      requestId: 'REQ-001',
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 30000),
      category: 'signal',
      description: 'Signal SIG_101 Dadar TT locked GREEN. Cross traffic safe clearance completed.',
      requestId: 'REQ-001',
    },
  ],
  totalRequests: 1,
  completedRequests: 0,
  rejectedRequests: 0,
  totalWaitTimeMs: 0,
};

function mumbaiReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        currentUser: action.user,
        languageChosen: false,
        activeTab: 'main',
      };

    case 'CONFIRM_LANGUAGE':
      return {
        ...state,
        language: action.lang,
        languageChosen: true,
      };

    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        languageChosen: false,
        activeTab: 'main',
      };

    case 'SET_LANGUAGE':
      return { ...state, language: action.lang };

    case 'TOGGLE_MOBILE_FRAME':
      return { ...state, isMobileFrame: !state.isMobileFrame };

    case 'SET_MOBILE_FRAME':
      return { ...state, isMobileFrame: action.value };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab };

    case 'SET_SEVERITY':
      return { ...state, severity: action.severity };

    case 'SET_DESTINATION_HOSPITAL': {
      const hosp = MUMBAI_HOSPITALS.find((h) => h.id === action.hospitalId) || MUMBAI_HOSPITALS[0];
      return {
        ...state,
        selectedHospitalId: hosp.id,
        etaSeconds: (hosp.etaDefaultMins || 5) * 60,
      };
    }

    case 'SET_MEDICAL_EMERGENCY':
      return {
        ...state,
        medicalReason: action.reason,
        severity: action.severity,
      };

    case 'TOGGLE_SIREN':
      return { ...state, sirenOn: !state.sirenOn };

    case 'SET_VEHICLE_POSITION':
      return {
        ...state,
        vehicleLocation: action.location,
        vehicleHeading: action.heading ?? state.vehicleHeading,
        speedKmh: action.speedKmh ?? state.speedKmh,
        routeIndex: action.routeIndex ?? state.routeIndex,
        distanceRemainingMeters: action.distanceRemainingMeters ?? state.distanceRemainingMeters,
        etaSeconds: action.etaSeconds ?? state.etaSeconds,
      };

    case 'SET_SIGNALS':
      return { ...state, signals: action.signals };

    case 'SET_PREEMPTED_SIGNAL':
      return {
        ...state,
        activePreemptedSignalId: action.signalId,
        signals: state.signals.map(s =>
          s.id === action.signalId
            ? { ...s, preempted: true, currentPhase: 'GREEN' }
            : s
        ),
      };

    case 'INCREMENT_CLEARED_SIGNALS':
      return { ...state, clearedSignalCount: state.clearedSignalCount + 1 };

    case 'SET_ROUTE':
      return {
        ...state,
        currentRoute: action.route,
        routeIndex: 0,
        vehicleLocation: action.route.pathCoordinates[0],
        signals: action.route.signals,
        distanceRemainingMeters: action.route.totalDistanceKm * 1000,
        etaSeconds: action.route.estimatedGreenRouteMinutes * 60,
      };

    case 'COMPLETE_MISSION':
      return {
        ...state,
        missionActive: false,
        speedKmh: 0,
        distanceRemainingMeters: 0,
        etaSeconds: 0,
        activePreemptedSignalId: null,
      };

    case 'START_NEW_MISSION':
      return {
        ...state,
        missionActive: true,
        routeIndex: 0,
        vehicleLocation: state.currentRoute.pathCoordinates[0],
        speedKmh: 54,
        distanceRemainingMeters: state.currentRoute.totalDistanceKm * 1000,
        etaSeconds: state.currentRoute.estimatedGreenRouteMinutes * 60,
        activePreemptedSignalId: state.signals[0]?.id || null,
      };

    case 'SUBMIT_CITIZEN_SOS':
      return {
        ...state,
        citizenSos: {
          ...state.citizenSos,
          requested: true,
          emergencyType: action.payload.emergencyType,
          severity: action.payload.severity,
          pickupLocation: action.payload.pickupLocation,
          hospitalId: action.payload.hospitalId,
          etaMinutes: 4,
        },
        severity: action.payload.severity,
        missionActive: true,
        activeTab: 'citizen',
      };

    case 'SET_DEVICE_GPS':
      return { ...state, isUsingDeviceGps: action.enabled };

    case 'UPDATE_HARDWARE_PINS':
      return {
        ...state,
        hardware: {
          ...state.hardware,
          gpioPins: { ...state.hardware.gpioPins, ...action.pins },
          lastPacketTime: Date.now(),
        },
      };

    case 'TOGGLE_HARDWARE_CONNECTION':
      return {
        ...state,
        hardware: {
          ...state.hardware,
          connected: !state.hardware.connected,
        },
      };

    case 'ADD_EVENT':
      return {
        ...state,
        events: [action.event, ...state.events].slice(0, 100),
      };

    default:
      return state;
  }
}

const SimContext = createContext(null);

export function SimProvider({ children }) {
  const [state, dispatch] = useReducer(mumbaiReducer, initialMumbaiState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const navIntervalRef = useRef(null);

  // Helper to get translated string
  const t = useCallback((key) => {
    const lang = state.language;
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  }, [state.language]);

  // Log an event
  const logEvent = useCallback((category, description, requestId = 'REQ-001') => {
    dispatch({
      type: 'ADD_EVENT',
      event: {
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        category,
        description,
        requestId,
      },
    });
  }, []);

  // Distance calculation helper (Haversine formula in meters)
  const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Automated GPS Navigation & Signal Preemption Loop
  useEffect(() => {
    if (!state.missionActive || state.isUsingDeviceGps) return;

    navIntervalRef.current = setInterval(() => {
      const curState = stateRef.current;
      const coords = curState.currentRoute.pathCoordinates;
      let nextIdx = curState.routeIndex + 1;

      if (nextIdx >= coords.length) {
        // Mission complete!
        dispatch({ type: 'COMPLETE_MISSION' });
        logEvent('passage', 'Ambulance successfully reached KEM Hospital Emergency Casualty.');
        clearInterval(navIntervalRef.current);
        return;
      }

      const nextLoc = coords[nextIdx];
      const prevLoc = coords[curState.routeIndex];

      // Calculate bearing
      const y = Math.sin((nextLoc[1] - prevLoc[1]) * Math.PI / 180) * Math.cos(nextLoc[0] * Math.PI / 180);
      const x =
        Math.cos(prevLoc[0] * Math.PI / 180) * Math.sin(nextLoc[0] * Math.PI / 180) -
        Math.sin(prevLoc[0] * Math.PI / 180) * Math.cos(nextLoc[0] * Math.PI / 180) * Math.cos((nextLoc[1] - prevLoc[1]) * Math.PI / 180);
      const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

      // Calculate remaining route distance
      let remainingDist = 0;
      for (let i = nextIdx; i < coords.length - 1; i++) {
        remainingDist += calculateDistanceMeters(coords[i][0], coords[i][1], coords[i + 1][0], coords[i + 1][1]);
      }
      const speed = Math.floor(48 + Math.random() * 12); // 48 - 60 km/h
      const remainingSeconds = Math.max(10, Math.round((remainingDist / (speed * 1000 / 3600))));

      dispatch({
        type: 'SET_VEHICLE_POSITION',
        location: nextLoc,
        heading: Math.round(bearing),
        speedKmh: speed,
        routeIndex: nextIdx,
        distanceRemainingMeters: Math.round(remainingDist),
        etaSeconds: remainingSeconds,
      });

      // Signal Preemption Check
      const sevConfig = SEVERITY_CONFIG[curState.severity] || SEVERITY_CONFIG.CODE_RED;
      const preemptionRadius = sevConfig.preemptionRadiusMeters;

      curState.signals.forEach(sig => {
        const distToSig = calculateDistanceMeters(nextLoc[0], nextLoc[1], sig.lat, sig.lng);

        if (distToSig <= preemptionRadius && !sig.preempted) {
          // Preempt this signal!
          dispatch({ type: 'SET_PREEMPTED_SIGNAL', signalId: sig.id });
          dispatch({ type: 'INCREMENT_CLEARED_SIGNALS' });
          logEvent('signal', `Advance Preemption: ${sig.name} (${sig.road}) cleared to GREEN for incoming ambulance. Distance: ${Math.round(distToSig)}m.`);

          // Update Hardware GPIO outputs
          dispatch({
            type: 'UPDATE_HARDWARE_PINS',
            pins: {
              pin12: false, // North Red OFF
              pin13: false, // North Yellow OFF
              pin14: true,  // North Green ON
              pin25: true,  // East Red ON (Hold cross-traffic)
              pin26: false, // East Yellow OFF
              pin27: false, // East Green OFF
            },
          });
        }
      });
    }, 2500);

    return () => {
      if (navIntervalRef.current) clearInterval(navIntervalRef.current);
    };
  }, [state.missionActive, state.isUsingDeviceGps, logEvent]);

  // Physical Device Mobile GPS continuous integration
  const gpsWatchIdRef = useRef(null);

  const toggleDeviceGps = useCallback(() => {
    if (stateRef.current.isUsingDeviceGps) {
      if (gpsWatchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
        gpsWatchIdRef.current = null;
      }
      dispatch({ type: 'SET_DEVICE_GPS', enabled: false });
      logEvent('system', 'Switched back to Mumbai simulation route.');
    } else {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            dispatch({ type: 'SET_DEVICE_GPS', enabled: true });
            dispatch({
              type: 'SET_VEHICLE_POSITION',
              location: [pos.coords.latitude, pos.coords.longitude],
              speedKmh: Math.round((pos.coords.speed || 0) * 3.6),
            });
            logEvent('system', `Connected to device live GPS: [${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}] (Accuracy: ±${Math.round(pos.coords.accuracy)}m)`);
          },
          (err) => {
            alert('Could not access mobile GPS: ' + err.message + '. Please allow location access in your browser/phone settings.');
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );

        // Continuous mobile GPS updates
        gpsWatchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            dispatch({
              type: 'SET_VEHICLE_POSITION',
              location: [pos.coords.latitude, pos.coords.longitude],
              speedKmh: Math.round((pos.coords.speed || 0) * 3.6),
            });
          },
          (err) => {
            console.warn('GPS Watch Notice:', err);
          },
          { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        );
      } else {
        alert('Geolocation is not supported by your mobile browser.');
      }
    }
  }, [logEvent]);

  const value = {
    state,
    t,
    actions: {
      login: (role, userDetails) => dispatch({
        type: 'LOGIN',
        user: {
          role,
          name: userDetails?.name || (role === 'driver' ? 'Ramesh Shinde' : role === 'citizen' ? 'Citizen of Mumbai' : 'Insp. Sanjay Deshmukh'),
          badge: userDetails?.badge || (role === 'driver' ? 'AMB-MH01-4421' : role === 'citizen' ? 'Citizen SOS' : 'TMC-Worli-HQ'),
          ...userDetails,
        },
      }),
      logout: () => {
        if (gpsWatchIdRef.current !== null && 'geolocation' in navigator) {
          navigator.geolocation.clearWatch(gpsWatchIdRef.current);
          gpsWatchIdRef.current = null;
        }
        dispatch({ type: 'LOGOUT' });
      },
      confirmLanguage: (lang) => dispatch({ type: 'CONFIRM_LANGUAGE', lang }),
      setLanguage: (lang) => dispatch({ type: 'SET_LANGUAGE', lang }),
      toggleMobileFrame: () => dispatch({ type: 'TOGGLE_MOBILE_FRAME' }),
      setMobileFrame: (val) => dispatch({ type: 'SET_MOBILE_FRAME', value: val }),
      setActiveTab: (tab) => dispatch({ type: 'SET_ACTIVE_TAB', tab }),
      setSeverity: (severity) => dispatch({ type: 'SET_SEVERITY', severity }),
      setDestinationHospital: (hospitalId) => dispatch({ type: 'SET_DESTINATION_HOSPITAL', hospitalId }),
      setMedicalEmergency: (reason, severity) => dispatch({ type: 'SET_MEDICAL_EMERGENCY', reason, severity }),
      toggleSiren: () => dispatch({ type: 'TOGGLE_SIREN' }),
      completeMission: () => dispatch({ type: 'COMPLETE_MISSION' }),
      startNewMission: () => dispatch({ type: 'START_NEW_MISSION' }),
      submitCitizenSos: (payload) => dispatch({ type: 'SUBMIT_CITIZEN_SOS', payload }),
      toggleDeviceGps,
      toggleHardwareConnection: () => dispatch({ type: 'TOGGLE_HARDWARE_CONNECTION' }),
      logEvent,
    },
  };

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSimulation() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSimulation must be used within SimProvider');
  return ctx;
}
