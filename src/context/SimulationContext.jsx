import React, { createContext, useContext, useReducer, useRef, useCallback } from 'react';
import {
  SIGNAL_PHASE,
  DIRECTION_TO_EMERGENCY_PHASE,
  getYellowPhaseFor,
  requiresPhaseChange,
  phaseLabel,
  PHASE_GREEN_DIRECTIONS,
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

// ─── Simulation Config ────────────────────────────────────────────────────────
export const SIM_CONFIG = {
  YELLOW_DURATION_MS: 3000,
  ALL_RED_DURATION_MS: 2000,
  NORMAL_GREEN_DURATION_MS: 15000,
};

// ─── Event Categories ─────────────────────────────────────────────────────────
export const EVENT_CATEGORY = {
  SYSTEM: 'system',
  REQUEST: 'request',
  AUTH: 'auth',
  PRIORITY: 'priority',
  SIGNAL: 'signal',
  PASSAGE: 'passage',
  RESTORE: 'restore',
};

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  // Simulation control
  simRunning: false,
  simPaused: false,

  // Signal state
  currentPhase: SIGNAL_PHASE.NS_GREEN,
  transitioning: false,
  transitionProgress: 0,

  // Requests
  requests: [],
  activeRequestId: null,

  // Event log
  events: [],

  // Metrics
  totalRequests: 0,
  completedRequests: 0,
  rejectedRequests: 0,
  totalWaitTimeMs: 0,

  // Active priority panel data
  priorityPanel: null,
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function simReducer(state, action) {
  switch (action.type) {
    case 'SIM_START':
      return { ...state, simRunning: true, simPaused: false };

    case 'SIM_PAUSE':
      return { ...state, simPaused: true };

    case 'SIM_RESUME':
      return { ...state, simPaused: false };

    case 'SIM_RESET': {
      resetRequestCounter();
      return {
        ...initialState,
        events: [{
          id: Date.now(),
          timestamp: new Date(),
          category: EVENT_CATEGORY.SYSTEM,
          description: 'Simulation reset. System initialized.',
          requestId: null,
        }],
      };
    }

    case 'SET_PHASE':
      return {
        ...state,
        currentPhase: action.phase,
        transitioning: action.transitioning ?? false,
        transitionProgress: action.transitionProgress ?? 0,
      };

    case 'SET_TRANSITION_PROGRESS':
      return { ...state, transitionProgress: action.progress };

    case 'ADD_REQUEST': {
      const req = action.request;
      return {
        ...state,
        requests: [...state.requests, req],
        totalRequests: state.totalRequests + 1,
      };
    }

    case 'UPDATE_REQUEST': {
      return {
        ...state,
        requests: state.requests.map(r =>
          r.id === action.id ? { ...r, ...action.updates } : r
        ),
      };
    }

    case 'SET_ACTIVE_REQUEST':
      return { ...state, activeRequestId: action.id };

    case 'COMPLETE_REQUEST': {
      const req = state.requests.find(r => r.id === action.id);
      const waitMs = req ? Date.now() - req.createdAt : 0;
      return {
        ...state,
        activeRequestId: state.activeRequestId === action.id ? null : state.activeRequestId,
        completedRequests: state.completedRequests + 1,
        totalWaitTimeMs: state.totalWaitTimeMs + waitMs,
        requests: state.requests.map(r =>
          r.id === action.id
            ? { ...r, status: REQUEST_STATUS.COMPLETED, completedAt: Date.now() }
            : r
        ),
      };
    }

    case 'REJECT_REQUEST':
      return {
        ...state,
        rejectedRequests: state.rejectedRequests + 1,
        requests: state.requests.map(r =>
          r.id === action.id
            ? { ...r, status: REQUEST_STATUS.REJECTED }
            : r
        ),
      };

    case 'ADD_EVENT':
      return {
        ...state,
        events: [action.event, ...state.events].slice(0, 200),
      };

    case 'CLEAR_EVENTS':
      return { ...state, events: [] };

    case 'SET_PRIORITY_PANEL':
      return { ...state, priorityPanel: action.data };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const SimContext = createContext(null);

export function SimProvider({ children }) {
  const [state, dispatch] = useReducer(simReducer, {
    ...initialState,
    events: [{
      id: Date.now(),
      timestamp: new Date(),
      category: EVENT_CATEGORY.SYSTEM,
      description: 'GreenRoute simulation initialized. System ready.',
      requestId: null,
    }],
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const transitionTimerRef = useRef(null);
  const normalCycleTimerRef = useRef(null);
  const progressTimerRef = useRef(null);

  const clearAllTimers = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (normalCycleTimerRef.current) {
      clearTimeout(normalCycleTimerRef.current);
      normalCycleTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  // Log an event
  const logEvent = useCallback((category, description, requestId = null) => {
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

  // Animate transition progress
  const animateProgress = useCallback((durationMs, onComplete) => {
    const startTime = Date.now();
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      dispatch({ type: 'SET_TRANSITION_PROGRESS', progress });
      if (progress >= 1) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
        onComplete?.();
      }
    }, 50);
  }, []);

  // Normal signal cycle (simple alternating)
  const startNormalCycle = useCallback(() => {
    clearAllTimers();
    const cycle = () => {
      if (!stateRef.current.simRunning || stateRef.current.simPaused) return;
      if (stateRef.current.activeRequestId) return; // don't cycle during emergency

      const cur = stateRef.current.currentPhase;
      let yellowPhase, nextGreen;
      if (cur === SIGNAL_PHASE.NS_GREEN) {
        yellowPhase = SIGNAL_PHASE.NS_YELLOW;
        nextGreen = SIGNAL_PHASE.EW_GREEN;
      } else if (cur === SIGNAL_PHASE.EW_GREEN) {
        yellowPhase = SIGNAL_PHASE.EW_YELLOW;
        nextGreen = SIGNAL_PHASE.NS_GREEN;
      } else {
        return; // in a special phase, don't override
      }

      dispatch({ type: 'SET_PHASE', phase: yellowPhase, transitioning: true });
      logEvent(EVENT_CATEGORY.SIGNAL, `Routine cycle: ${phaseLabel(yellowPhase)}`);

      transitionTimerRef.current = setTimeout(() => {
        dispatch({ type: 'SET_PHASE', phase: SIGNAL_PHASE.ALL_RED, transitioning: true });
        logEvent(EVENT_CATEGORY.SIGNAL, 'All-red clearance interval');

        transitionTimerRef.current = setTimeout(() => {
          dispatch({ type: 'SET_PHASE', phase: nextGreen, transitioning: false });
          logEvent(EVENT_CATEGORY.SIGNAL, `Routine cycle: ${phaseLabel(nextGreen)}`);
          normalCycleTimerRef.current = setTimeout(cycle, SIM_CONFIG.NORMAL_GREEN_DURATION_MS);
        }, SIM_CONFIG.ALL_RED_DURATION_MS);
      }, SIM_CONFIG.YELLOW_DURATION_MS);
    };

    normalCycleTimerRef.current = setTimeout(cycle, SIM_CONFIG.NORMAL_GREEN_DURATION_MS);
  }, [clearAllTimers, logEvent]);

  // Execute emergency priority transition sequence
  const executeEmergencyTransition = useCallback((request) => {
    const currentState = stateRef.current;
    const targetPhase = DIRECTION_TO_EMERGENCY_PHASE[request.direction];
    const currentPhase = currentState.currentPhase;

    // Check if phase change is needed
    const needsChange = requiresPhaseChange(currentPhase, request.direction);

    if (!needsChange) {
      // Already in compatible phase — activate immediately
      dispatch({ type: 'SET_PHASE', phase: targetPhase, transitioning: false });
      dispatch({ type: 'SET_ACTIVE_REQUEST', id: request.id });
      dispatch({
        type: 'UPDATE_REQUEST',
        id: request.id,
        updates: { status: REQUEST_STATUS.ACTIVE },
      });
      dispatch({
        type: 'SET_PRIORITY_PANEL',
        data: {
          requestId: request.id,
          vehicleType: request.vehicleType,
          direction: request.direction,
          phase: targetPhase,
          status: 'active',
          nextAction: 'Awaiting vehicle passage confirmation.',
        },
      });
      logEvent(EVENT_CATEGORY.SIGNAL, `Emergency priority activated — ${phaseLabel(targetPhase)}`, request.id);
      return;
    }

    // Step 1: Yellow transition
    const yellowPhase = currentPhase === SIGNAL_PHASE.NS_GREEN || currentPhase === SIGNAL_PHASE.EMERGENCY_N || currentPhase === SIGNAL_PHASE.EMERGENCY_S
      ? SIGNAL_PHASE.NS_YELLOW
      : SIGNAL_PHASE.EW_YELLOW;

    dispatch({ type: 'SET_PHASE', phase: yellowPhase, transitioning: true, transitionProgress: 0 });
    logEvent(EVENT_CATEGORY.SIGNAL, `Yellow transition started — ${phaseLabel(yellowPhase)}`, request.id);

    dispatch({
      type: 'SET_PRIORITY_PANEL',
      data: {
        requestId: request.id,
        vehicleType: request.vehicleType,
        direction: request.direction,
        phase: yellowPhase,
        status: 'transitioning',
        nextAction: 'Executing yellow clearance interval.',
      },
    });

    animateProgress(SIM_CONFIG.YELLOW_DURATION_MS, null);

    transitionTimerRef.current = setTimeout(() => {
      // Step 2: All-red clearance
      dispatch({ type: 'SET_PHASE', phase: SIGNAL_PHASE.ALL_RED, transitioning: true, transitionProgress: 0 });
      logEvent(EVENT_CATEGORY.SIGNAL, 'All-red clearance interval started.', request.id);
      dispatch({
        type: 'SET_PRIORITY_PANEL',
        data: {
          requestId: request.id,
          vehicleType: request.vehicleType,
          direction: request.direction,
          phase: SIGNAL_PHASE.ALL_RED,
          status: 'clearing',
          nextAction: 'All-red clearance — intersection clearing.',
        },
      });

      animateProgress(SIM_CONFIG.ALL_RED_DURATION_MS, null);

      transitionTimerRef.current = setTimeout(() => {
        // Step 3: Emergency priority phase
        dispatch({ type: 'SET_PHASE', phase: targetPhase, transitioning: false, transitionProgress: 0 });
        dispatch({ type: 'SET_ACTIVE_REQUEST', id: request.id });
        dispatch({
          type: 'UPDATE_REQUEST',
          id: request.id,
          updates: { status: REQUEST_STATUS.ACTIVE },
        });
        dispatch({
          type: 'SET_PRIORITY_PANEL',
          data: {
            requestId: request.id,
            vehicleType: request.vehicleType,
            direction: request.direction,
            phase: targetPhase,
            status: 'active',
            nextAction: 'Awaiting vehicle passage confirmation.',
          },
        });
        logEvent(EVENT_CATEGORY.SIGNAL, `Emergency priority activated — ${phaseLabel(targetPhase)}`, request.id);
        logEvent(EVENT_CATEGORY.PASSAGE, `${VEHICLE_LABELS[request.vehicleType]} approaching from ${DIRECTION_LABELS[request.direction]}. Awaiting passage.`, request.id);
      }, SIM_CONFIG.ALL_RED_DURATION_MS);
    }, SIM_CONFIG.YELLOW_DURATION_MS);
  }, [animateProgress, logEvent]);

  // Submit a new emergency request
  const submitRequest = useCallback(({ vehicleType, direction, estimatedArrival, authorized }) => {
    const currentState = stateRef.current;
    const request = createRequest({ vehicleType, direction, estimatedArrival, authorized });

    dispatch({ type: 'ADD_REQUEST', request });
    logEvent(EVENT_CATEGORY.REQUEST, `Emergency request received: ${VEHICLE_LABELS[vehicleType]} from ${DIRECTION_LABELS[direction]}.`, request.id);

    // Validate authorization
    dispatch({
      type: 'UPDATE_REQUEST',
      id: request.id,
      updates: { status: REQUEST_STATUS.VALIDATING },
    });
    logEvent(EVENT_CATEGORY.AUTH, `Authorization check in progress for ${request.id}.`, request.id);

    setTimeout(() => {
      if (!authorized) {
        dispatch({ type: 'REJECT_REQUEST', id: request.id });
        dispatch({
          type: 'UPDATE_REQUEST',
          id: request.id,
          updates: {
            priorityDecision: 'Request rejected — authorization check failed.',
          },
        });
        logEvent(EVENT_CATEGORY.AUTH, `Authorization FAILED for ${request.id}. Request rejected.`, request.id);
        return;
      }

      logEvent(EVENT_CATEGORY.AUTH, `Authorization PASSED for ${request.id}.`, request.id);

      // Check for active request
      const active = currentState.activeRequestId;
      const waitingRequests = stateRef.current.requests.filter(
        r => r.id !== request.id && r.authorized && r.status === REQUEST_STATUS.WAITING
      );
      const competing = stateRef.current.requests.filter(
        r => r.id !== request.id && r.status === REQUEST_STATUS.ACTIVE
      );

      const decision = generatePriorityDecision(request, 1 + waitingRequests.length, competing);

      dispatch({
        type: 'UPDATE_REQUEST',
        id: request.id,
        updates: { priorityDecision: decision, status: REQUEST_STATUS.WAITING },
      });
      logEvent(EVENT_CATEGORY.PRIORITY, `Priority decision: ${decision}`, request.id);

      // If no active request, serve immediately
      if (!stateRef.current.activeRequestId) {
        executeEmergencyTransition({ ...request, status: REQUEST_STATUS.WAITING, priorityDecision: decision });
      }
    }, 800); // Brief simulated validation delay
  }, [logEvent, executeEmergencyTransition]);

  // Complete vehicle passage
  const completePassage = useCallback(() => {
    const currentState = stateRef.current;
    const activeId = currentState.activeRequestId;
    if (!activeId) return;

    const activeReq = currentState.requests.find(r => r.id === activeId);
    if (!activeReq) return;

    logEvent(EVENT_CATEGORY.PASSAGE, `${VEHICLE_LABELS[activeReq.vehicleType]} passage completed from ${DIRECTION_LABELS[activeReq.direction]}.`, activeId);
    dispatch({ type: 'COMPLETE_REQUEST', id: activeId });

    clearAllTimers();

    // All-red after passage
    dispatch({ type: 'SET_PHASE', phase: SIGNAL_PHASE.ALL_RED, transitioning: true });
    logEvent(EVENT_CATEGORY.SIGNAL, 'Post-passage all-red clearance.', activeId);

    transitionTimerRef.current = setTimeout(() => {
      // Check for waiting requests
      const nextReq = selectNextRequest(stateRef.current.requests);
      if (nextReq) {
        logEvent(EVENT_CATEGORY.PRIORITY, `Serving next queued request: ${nextReq.id}`, nextReq.id);
        executeEmergencyTransition(nextReq);
      } else {
        // Restore normal operation
        dispatch({ type: 'SET_PHASE', phase: SIGNAL_PHASE.NS_GREEN, transitioning: false });
        dispatch({ type: 'SET_PRIORITY_PANEL', data: null });
        logEvent(EVENT_CATEGORY.RESTORE, 'Normal traffic operation restored.');
        startNormalCycle();
      }
    }, SIM_CONFIG.ALL_RED_DURATION_MS);
  }, [logEvent, clearAllTimers, executeEmergencyTransition, startNormalCycle]);

  // Start simulation
  const startSim = useCallback(() => {
    dispatch({ type: 'SIM_START' });
    logEvent(EVENT_CATEGORY.SYSTEM, 'Simulation started. Normal signal cycle active.');
    startNormalCycle();
  }, [logEvent, startNormalCycle]);

  // Pause simulation
  const pauseSim = useCallback(() => {
    dispatch({ type: 'SIM_PAUSE' });
    clearAllTimers();
    logEvent(EVENT_CATEGORY.SYSTEM, 'Simulation paused.');
  }, [clearAllTimers, logEvent]);

  // Resume simulation
  const resumeSim = useCallback(() => {
    dispatch({ type: 'SIM_RESUME' });
    logEvent(EVENT_CATEGORY.SYSTEM, 'Simulation resumed.');
    if (!stateRef.current.activeRequestId) {
      startNormalCycle();
    }
  }, [logEvent, startNormalCycle]);

  // Reset simulation
  const resetSim = useCallback(() => {
    clearAllTimers();
    dispatch({ type: 'SIM_RESET' });
  }, [clearAllTimers]);

  const clearEvents = useCallback(() => {
    dispatch({ type: 'CLEAR_EVENTS' });
  }, []);

  const avgWaitTime = state.completedRequests > 0
    ? Math.round(state.totalWaitTimeMs / state.completedRequests / 1000)
    : 0;

  const value = {
    state,
    avgWaitTime,
    actions: {
      startSim,
      pauseSim,
      resumeSim,
      resetSim,
      submitRequest,
      completePassage,
      clearEvents,
    },
  };

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSimulation() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSimulation must be used within SimProvider');
  return ctx;
}
