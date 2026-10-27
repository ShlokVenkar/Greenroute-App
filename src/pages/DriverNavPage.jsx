import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import MumbaiMap from '../components/MumbaiMap';
import { MUMBAI_HOSPITALS, SEVERITY_CONFIG } from '../data/mumbaiRoutes';
import {
  Navigation,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  RotateCcw,
  Gauge,
  ShieldAlert,
  ChevronDown,
  Smartphone,
  MapPin,
  Building2,
  HeartPulse,
  Flame,
  AlertTriangle,
  Locate,
  X,
  Search,
} from 'lucide-react';

export default function DriverNavPage() {
  const { state, actions, t } = useSimulation();

  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showSeverityModal, setShowSeverityModal] = useState(false);
  const [destinationSearch, setDestinationSearch] = useState('');

  const currentRoute = state.currentRoute;
  const activeManeuver = currentRoute.maneuvers?.[state.routeIndex] || currentRoute.maneuvers?.[0];
  const currentSignal = state.signals.find((s) => !s.preempted) || state.signals[state.signals.length - 1];
  const activePreemptedSignal = state.signals.find((s) => s.id === state.activePreemptedSignalId);
  const sevConfig = SEVERITY_CONFIG[state.severity] || SEVERITY_CONFIG.CODE_RED;

  // Selected hospital
  const selectedHospital =
    MUMBAI_HOSPITALS.find((h) => h.id === state.selectedHospitalId) || MUMBAI_HOSPITALS[0];

  // Filtered hospitals
  const filteredHospitals = MUMBAI_HOSPITALS.filter(
    (h) =>
      h.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
      h.area.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  // Format ETA minutes & seconds
  const mins = Math.max(1, Math.round(state.etaSeconds / 60));
  const kmRemaining = (state.distanceRemainingMeters / 1000).toFixed(1);

  // Emergency clinical categories
  const emergencyCategories = [
    {
      severity: 'CODE_RED',
      levelTitle: 'HIGH SEVERITY — Critical Emergency',
      levelDesc: '500m Advance Signal Clearing • All Cross-Traffic Red • Emergency Siren',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/50',
      conditions: [
        { name: 'Heart Attack (Cardiac Arrest)', icon: '❤️' },
        { name: 'Severe Seizures (Status Epilepticus)', icon: '⚡' },
        { name: 'Major Trauma / Heavy Hemorrhage', icon: '🩸' },
        { name: 'Brain Stroke / Unconscious Patient', icon: '🧠' },
      ],
    },
    {
      severity: 'CODE_AMBER',
      levelTitle: 'MEDIUM SEVERITY — Urgent Care',
      levelDesc: '300m Advance Signal Clearing • Dynamic Green Extension',
      badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      conditions: [
        { name: 'Severe Asthma / Acute Breathing Distress', icon: '🫁' },
        { name: 'Compound Bone Fracture', icon: '🦴' },
        { name: 'Second/Third Degree Burns', icon: '🔥' },
        { name: 'Active Labor / Complicated Pregnancy', icon: '👶' },
      ],
    },
    {
      severity: 'CODE_YELLOW',
      levelTitle: 'LOW SEVERITY — Non-Emergency / Transport',
      levelDesc: '180m Coordinated Green Phase • Zero Traffic Gridlock',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      conditions: [
        { name: 'General Patient Transport for Check-up', icon: '🩺' },
        { name: 'Routine Dialysis Transfer', icon: '🏥' },
        { name: 'Stable Inter-Hospital Transfer', icon: '📋' },
        { name: 'Non-Emergency OPD Visit', icon: '🚶' },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden relative select-none">
      {/* ─── 1. Top Turn-by-Turn Guidance Banner ─── */}
      <div className="bg-emerald-600 text-white p-3.5 shadow-xl z-20 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0 shadow-inner">
              <Navigation className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wide flex items-center gap-1.5">
                <span>{activeManeuver ? 'Nav Guidance' : t('nextTurn')}</span>
                <span>•</span>
                <span className="truncate">Destination: {selectedHospital.shortName}</span>
              </div>
              <div
                onClick={() => setShowDestinationModal(true)}
                className="text-xs sm:text-sm font-extrabold tracking-tight truncate cursor-pointer hover:underline flex items-center gap-1.5"
                title="Tap to change destination hospital"
              >
                <span className="truncate">{activeManeuver?.text || `➔ ${selectedHospital.name}`}</span>
                <span className="text-[10px] bg-emerald-700/90 px-1.5 py-0.5 rounded text-emerald-200 border border-emerald-500/40 shrink-0">
                  Change
                </span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 ml-2">
            <div className="text-base font-black leading-tight">{mins} min</div>
            <div className="text-[11px] text-emerald-100 font-medium">{kmRemaining} km</div>
          </div>
        </div>

        {/* ─── Ahead-of-Time Signal Clearing Status Strip ─── */}
        <div className="mt-2.5 bg-emerald-700/80 rounded-xl px-3 py-1.5 flex items-center justify-between border border-emerald-500/50 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping shrink-0"></span>
            <span className="text-emerald-100 font-medium truncate">
              Signal Ahead:{' '}
              <b className="text-white">
                {activePreemptedSignal ? activePreemptedSignal.name : currentSignal?.name || 'Vidyalankar Campus Junction'}
              </b>
            </span>
          </div>
          <span className="text-[10px] font-black tracking-wider bg-white text-emerald-800 px-2 py-0.5 rounded-md shadow-sm shrink-0">
            🟢 GREEN WAVE ACTIVE
          </span>
        </div>
      </div>

      {/* ─── 2. Full Center Stage OpenStreetMap ─── */}
      <div className="flex-1 w-full relative min-h-[280px]">
        <MumbaiMap
          vehicleLocation={state.vehicleLocation}
          vehicleHeading={state.vehicleHeading}
          routeCoordinates={currentRoute.pathCoordinates}
          signals={state.signals}
          hospitalLocation={[selectedHospital.lat, selectedHospital.lng]}
          pickupLocation={currentRoute.pathCoordinates?.[0] || [19.0222, 72.8682]}
          activeRouteName={currentRoute.name || `Vidyalankar Polytechnic ➔ ${selectedHospital.shortName}`}
          preemptedSignalId={state.activePreemptedSignalId}
          severity={state.severity}
          height="100%"
          isLiveGps={state.isUsingDeviceGps}
          gpsAccuracy={state.gpsAccuracy}
        />

        {/* Floating Speed HUD over Map */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl shadow-2xl flex items-center gap-2.5">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white font-mono">{state.speedKmh}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">KM/H</span>
          </div>
        </div>

        {/* Floating Triage & Medical Reason Button */}
        <div className="absolute bottom-3 right-16 z-[1000]">
          <button
            onClick={() => setShowSeverityModal(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border backdrop-blur-md shadow-xl transition-all ${
              state.severity === 'CODE_RED'
                ? 'bg-red-600/90 text-white border-red-400 animate-pulse'
                : state.severity === 'CODE_AMBER'
                ? 'bg-amber-600/90 text-white border-amber-400'
                : 'bg-emerald-600/90 text-white border-emerald-400'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px] sm:max-w-[180px]">
              {state.medicalReason || sevConfig.shortLabel}
            </span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        {/* Mobile GPS Toggle Pill on Map */}
        <div className="absolute top-14 left-3 z-[1000]">
          <button
            onClick={actions.toggleDeviceGps}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border shadow-lg transition-all ${
              state.isUsingDeviceGps
                ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Smartphone className="w-3 h-3 text-blue-400" />
            <span>{state.isUsingDeviceGps ? 'Live Mobile GPS Active' : 'Tap to Use Phone GPS'}</span>
          </button>
        </div>
      </div>

      {/* ─── 3. Glanceable Bottom Cockpit Controls ─── */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-3 shrink-0 space-y-2 z-20">
        {/* Active Medical Condition Strip */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-400 font-medium">Condition:</span>
            <span className="font-bold text-white truncate">{state.medicalReason}</span>
          </div>
          <button
            onClick={() => setShowSeverityModal(true)}
            className="text-[10px] text-emerald-400 font-bold hover:underline shrink-0"
          >
            Adjust Triage
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Siren Button */}
          <button
            onClick={actions.toggleSiren}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs font-black transition-all shadow-md ${
              state.sirenOn
                ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {state.sirenOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{state.sirenOn ? 'SIREN ACTIVE' : 'SIREN OFF'}</span>
          </button>

          {/* Arrived / Finish Mission Button */}
          {state.missionActive ? (
            <button
              onClick={actions.completePassage || actions.completeMission}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-2xl shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ARRIVED AT HOSPITAL</span>
            </button>
          ) : (
            <button
              onClick={actions.startNewMission}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-2xl shadow-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>START NEW RUN</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── 4. Destination Hospital Selector Modal ─── */}
      {showDestinationModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[2000] flex flex-col justify-end">
          <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl p-4 max-h-[85%] flex flex-col shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Select Destination Hospital</h3>
              </div>
              <button
                onClick={() => setShowDestinationModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Box */}
            <div className="relative my-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hospital or Mumbai area..."
                value={destinationSearch}
                onChange={(e) => setDestinationSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Hospitals List */}
            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {filteredHospitals.map((hosp) => {
                const isSelected = hosp.id === state.selectedHospitalId;
                return (
                  <div
                    key={hosp.id}
                    onClick={() => {
                      actions.setDestinationHospital(hosp.id);
                      actions.logEvent('request', `Driver changed destination to ${hosp.name} (${hosp.area}).`);
                      setShowDestinationModal(false);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/40 shadow-lg'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{hosp.name}</span>
                        {isSelected && (
                          <span className="text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{hosp.area}</div>
                      <div className="text-[9px] text-emerald-400 mt-1">
                        {hosp.type} • Emergency: {hosp.emergencyPhone}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-white">{hosp.etaDefaultMins} min</div>
                      <div className="text-[9px] text-slate-400">Green Route</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. Medical Emergency Severity & Condition Modal ─── */}
      {showSeverityModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[2000] flex flex-col justify-end">
          <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl p-4 max-h-[85%] flex flex-col shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Select Emergency Condition</h3>
                  <p className="text-[10px] text-slate-400">Sets signal priority wave and cross-traffic preemption</p>
                </div>
              </div>
              <button
                onClick={() => setShowSeverityModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Severity Levels & Conditions List */}
            <div className="overflow-y-auto space-y-4 my-3 flex-1 pr-1">
              {emergencyCategories.map((cat) => (
                <div key={cat.severity} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{cat.levelTitle}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeClass}`}>
                      {cat.severity.replace('CODE_', '')}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{cat.levelDesc}</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.conditions.map((item) => {
                      const isSelected =
                        state.medicalReason === item.name && state.severity === cat.severity;
                      return (
                        <div
                          key={item.name}
                          onClick={() => {
                            actions.setMedicalEmergency(item.name, cat.severity);
                            actions.logEvent(
                              'priority',
                              `Driver set emergency condition: "${item.name}" [${cat.severity}].`
                            );
                            setShowSeverityModal(false);
                          }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/40 font-bold'
                              : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-base">{item.icon}</span>
                          <span className="text-xs text-white leading-tight">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
