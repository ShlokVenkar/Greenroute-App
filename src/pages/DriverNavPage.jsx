import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import DemoMumbaiMap from '../components/DemoMumbaiMap';
import { SEVERITY_CONFIG } from '../data/mumbaiRoutes';
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
  PhoneCall,
} from 'lucide-react';

export default function DriverNavPage() {
  const { state, actions, t } = useSimulation();
  const [showTriageMenu, setShowTriageMenu] = useState(false);

  const currentRoute = state.currentRoute;
  const currentSignal = state.signals.find((s) => !s.preempted) || state.signals[state.signals.length - 1];
  const activePreemptedSignal = state.signals.find((s) => s.id === state.activePreemptedSignalId);
  const sevConfig = SEVERITY_CONFIG[state.severity] || SEVERITY_CONFIG.CODE_RED;

  // Format ETA minutes & seconds
  const mins = Math.max(1, Math.round(state.etaSeconds / 60));
  const kmRemaining = (state.distanceRemainingMeters / 1000).toFixed(1);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* ─── 1. Ultra-Clean Top Turn Banner (Google Maps Navigation Style) ─── */}
      <div className="bg-emerald-600 text-white p-3.5 shadow-xl z-20 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0 shadow-inner">
              <Navigation className="w-6 h-6 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-100 uppercase tracking-wide">
                {t('nextTurn')}
              </div>
              <div className="text-sm sm:text-base font-extrabold tracking-tight truncate max-w-[240px] sm:max-w-md">
                Dr. Ambedkar Rd ➔ KEM Hospital
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-base font-black leading-tight">{mins} min</div>
            <div className="text-[11px] text-emerald-100 font-medium">{kmRemaining} km</div>
          </div>
        </div>

        {/* ─── Glanceable Ahead-of-Time Signal Status Bar ─── */}
        <div className="mt-2.5 bg-emerald-700/80 rounded-xl px-3 py-1.5 flex items-center justify-between border border-emerald-500/50 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping shrink-0"></span>
            <span className="text-emerald-100 font-medium truncate">
              Signal Ahead:{' '}
              <b className="text-white">
                {activePreemptedSignal ? activePreemptedSignal.name : currentSignal?.name || 'Hindmata'}
              </b>
            </span>
          </div>
          <span className="text-[10px] font-black tracking-wider bg-white text-emerald-800 px-2 py-0.5 rounded-md shadow-sm shrink-0">
            🟢 GREEN WAVE ACTIVE
          </span>
        </div>
      </div>

      {/* ─── 2. Full Center Stage Map (Clean, Immersive & Distraction-Free) ─── */}
      <div className="flex-1 w-full relative min-h-0">
        <DemoMumbaiMap
          vehicleLocation={state.vehicleLocation}
          vehicleHeading={state.vehicleHeading}
          routeCoordinates={currentRoute.pathCoordinates}
          signals={state.signals}
          hospitalLocation={[19.0028, 72.8423]}
          pickupLocation={[19.0178, 72.8478]}
          activeRouteName="Dadar ➔ KEM Hospital"
          preemptedSignalId={state.activePreemptedSignalId}
          severity={state.severity}
          height="100%"
        />

        {/* Floating Speed HUD over Map */}
        <div className="absolute bottom-3 left-3 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl shadow-2xl flex items-center gap-2.5">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white font-mono">{state.speedKmh}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">KM/H</span>
          </div>
        </div>

        {/* Triage Badge Floating button */}
        <div className="absolute bottom-3 right-3 z-10">
          <button
            onClick={() => setShowTriageMenu(!showTriageMenu)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border backdrop-blur-md shadow-xl transition-all ${
              state.severity === 'CODE_RED'
                ? 'bg-red-600/90 text-white border-red-400'
                : state.severity === 'CODE_AMBER'
                ? 'bg-amber-600/90 text-white border-amber-400'
                : 'bg-emerald-600/90 text-white border-emerald-400'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              {state.severity === 'CODE_RED'
                ? 'Code Red (Critical)'
                : state.severity === 'CODE_AMBER'
                ? 'Code Amber (Urgent)'
                : 'Code Yellow'}
            </span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Quick Triage Popover */}
          {showTriageMenu && (
            <div className="absolute bottom-12 right-0 w-56 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl space-y-1.5 z-30">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5">
                Set Patient Triage
              </div>
              <button
                onClick={() => {
                  actions.setSeverity('CODE_RED');
                  setShowTriageMenu(false);
                }}
                className={`w-full text-left p-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                  state.severity === 'CODE_RED' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Code Red (Critical)</span>
                <span className="text-[10px] opacity-80">Cardiac/Trauma</span>
              </button>
              <button
                onClick={() => {
                  actions.setSeverity('CODE_AMBER');
                  setShowTriageMenu(false);
                }}
                className={`w-full text-left p-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                  state.severity === 'CODE_AMBER' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Code Amber (Urgent)</span>
                <span className="text-[10px] opacity-80">Fracture/Asthma</span>
              </button>
              <button
                onClick={() => {
                  actions.setSeverity('CODE_YELLOW');
                  setShowTriageMenu(false);
                }}
                className={`w-full text-left p-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                  state.severity === 'CODE_YELLOW' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Code Yellow (Stable)</span>
                <span className="text-[10px] opacity-80">Non-Critical</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── 3. Glanceable Bottom Cockpit Controls (Simple, Non-Cluttered) ─── */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-3 shrink-0 space-y-2">
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
              <span>ARRIVED AT KEM</span>
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
    </div>
  );
}
