import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import DemoMumbaiMap from '../components/DemoMumbaiMap';
import { SEVERITY_CONFIG } from '../data/mumbaiRoutes';
import {
  Navigation,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Compass,
  MapPin,
  Clock,
  Gauge,
  ShieldAlert,
  Smartphone,
} from 'lucide-react';

export default function DriverNavPage() {
  const { state, actions, t } = useSimulation();

  const currentRoute = state.currentRoute;
  const currentSignal = state.signals.find(s => !s.preempted) || state.signals[state.signals.length - 1];
  const activePreemptedSignal = state.signals.find(s => s.id === state.activePreemptedSignalId);
  const sevConfig = SEVERITY_CONFIG[state.severity] || SEVERITY_CONFIG.CODE_RED;

  // Format ETA seconds into M:SS
  const formatEta = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* ─── Turn-by-Turn Navigation Header (Google Maps Style) ─── */}
      <div className="bg-emerald-600 text-white p-3.5 shadow-md flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
            <Navigation className="w-5 h-5 text-white transform -rotate-45" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-100 font-bold flex items-center gap-1.5">
              <span>{t('nextTurn')}</span>
            </div>
            <div className="text-sm font-extrabold tracking-tight truncate max-w-[260px] sm:max-w-md">
              Dr. Babasaheb Ambedkar Rd ➔ KEM Hospital
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs font-bold bg-emerald-700/80 px-2 py-0.5 rounded border border-emerald-500/50">
            {formatEta(state.etaSeconds)}
          </div>
          <div className="text-[10px] text-emerald-100 mt-0.5 font-medium">
            {(state.distanceRemainingMeters / 1000).toFixed(1)} km
          </div>
        </div>
      </div>

      {/* ─── Interactive Mumbai Map (Cockpit View) ─── */}
      <div className="relative w-full h-[320px] sm:h-[380px] shrink-0">
        <DemoMumbaiMap
          vehicleLocation={state.vehicleLocation}
          vehicleHeading={state.vehicleHeading}
          routeCoordinates={currentRoute.pathCoordinates}
          signals={state.signals}
          hospitalLocation={[19.0028, 72.8423]}
          pickupLocation={[19.0178, 72.8478]}
          activeRouteName={currentRoute.name}
          preemptedSignalId={state.activePreemptedSignalId}
          severity={state.severity}
          height="100%"
        />

        {/* Floating Speed HUD on map */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-lg font-black text-white">{state.speedKmh}</span>
            <span className="text-[10px] text-slate-400 ml-1 font-semibold">KM/H</span>
          </div>
        </div>

        {/* Siren Alert Indicator */}
        {state.sirenOn && (
          <div className="absolute bottom-3 right-3 z-[1000] bg-red-600/90 backdrop-blur-md border border-red-400 px-2.5 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 text-white animate-pulse">
            <Volume2 className="w-4 h-4" />
            <span className="text-[10px] font-black tracking-wider">SIREN ACTIVE</span>
          </div>
        )}
      </div>

      {/* ─── Cockpit Control Dashboard ─── */}
      <div className="p-3.5 space-y-3 flex-1">
        {/* Advance Signal Preemption Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                {t('preemptionStatus')}
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              {t('preemptedGreen')}
            </span>
          </div>

          <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">{t('upcomingSignal')}</div>
              <div className="text-sm font-bold text-white">
                {activePreemptedSignal ? activePreemptedSignal.name : currentSignal?.name || 'Hindmata Junction'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {activePreemptedSignal?.road || 'Dr. Ambedkar Road'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-emerald-400 flex items-center gap-1 justify-end">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>WAVE LOCKED</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {t('clearedSignals')}: <b className="text-white">{state.clearedSignalCount} / {state.signals.length}</b>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Severity Triage Selector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              {t('severityLevel')}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sevConfig.bgBadge}`}>
              Rank #{sevConfig.priorityRank}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'CODE_RED', label: 'Code Red', desc: 'Critical (Cardiac / Trauma)', color: 'border-red-500 bg-red-500/10 text-red-300' },
              { id: 'CODE_AMBER', label: 'Code Amber', desc: 'Urgent (Fracture / Asthma)', color: 'border-amber-500 bg-amber-500/10 text-amber-300' },
              { id: 'CODE_YELLOW', label: 'Code Yellow', desc: 'Moderate (Transfer)', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300' },
            ].map((sev) => (
              <button
                key={sev.id}
                onClick={() => actions.setSeverity(sev.id)}
                className={`p-2 rounded-lg text-left border transition-all ${
                  state.severity === sev.id
                    ? `${sev.color} ring-1 ring-white/20 font-bold shadow-md`
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{sev.label}</div>
                <div className="text-[9px] opacity-80 truncate">{sev.desc}</div>
              </button>
            ))}
          </div>

          <div className="mt-2.5 text-[11px] text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
            ℹ️ <span className="text-slate-300 font-semibold">{sevConfig.name}:</span> Preemption zone is <b>{sevConfig.preemptionRadiusMeters}m</b> with <b>{sevConfig.greenDurationSeconds}s</b> green corridor window.
          </div>
        </div>

        {/* Live Cockpit Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {/* Siren Toggle */}
          <button
            onClick={actions.toggleSiren}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              state.sirenOn
                ? 'bg-red-600 hover:bg-red-500 text-white border-red-500 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {state.sirenOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{state.sirenOn ? t('sirenActive') : t('sirenOff')}</span>
          </button>

          {/* Use Device GPS */}
          <button
            onClick={actions.toggleDeviceGps}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              state.isUsingDeviceGps
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{state.isUsingDeviceGps ? 'Phone GPS Connected' : t('useDeviceGps')}</span>
          </button>
        </div>

        {/* Mission Completion / Reset */}
        <div className="pt-1">
          {state.missionActive ? (
            <button
              onClick={actions.completeMission}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-900/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('completeMission')} (Arrived at KEM)</span>
            </button>
          ) : (
            <button
              onClick={actions.startNewMission}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start New Emergency Run (Dadar ➔ KEM)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
