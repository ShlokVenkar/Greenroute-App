import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import MumbaiMap from '../components/MumbaiMap';
import {
  ShieldAlert,
  Radio,
  Sliders,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Activity,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function AdminTrafficPage() {
  const { state, actions, t } = useSimulation();
  const [filterQuery, setFilterQuery] = useState('');

  const signalsList = [
    ...state.signals,
    {
      id: 'SIG_201',
      name: 'Bandra Lucky Junction',
      road: 'SV Road & Hill Rd',
      lat: 19.0560,
      lng: 72.8415,
      currentPhase: 'RED',
      preempted: false,
      gpioGreenPin: 14,
    },
    {
      id: 'SIG_301',
      name: 'Haji Ali Dargah Junction',
      road: 'Lala Lajpat Rai Marg',
      lat: 18.9780,
      lng: 72.8120,
      currentPhase: 'GREEN',
      preempted: false,
      gpioGreenPin: 27,
    },
    {
      id: 'SIG_401',
      name: 'Kurla CST Road Crossing',
      road: 'Santacruz-Chembur Link Rd',
      lat: 19.0680,
      lng: 72.8800,
      currentPhase: 'RED',
      preempted: false,
      gpioGreenPin: 18,
    },
  ];

  const filteredSignals = signalsList.filter(
    (s) =>
      s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.road.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* ─── Header ─── */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">{t('adminTitle')}</h1>
              <p className="text-[11px] text-slate-400">{t('adminSubtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              TMC Online
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('activeCorridors')}</div>
            <div className="text-xl font-black text-emerald-400 mt-1">1 Live</div>
            <div className="text-[10px] text-slate-400 truncate">Vidyalankar ➔ Sion Hospital</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('monitoredJunctions')}</div>
            <div className="text-xl font-black text-white mt-1">6 Active</div>
            <div className="text-[10px] text-emerald-400">100% Signal Sync</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('avgResponseSaved')}</div>
            <div className="text-xl font-black text-blue-400 mt-1">9.5 mins</div>
            <div className="text-[10px] text-slate-400">68% Delay Reduction</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('corridorThroughput')}</div>
            <div className="text-xl font-black text-amber-400 mt-1">99.2%</div>
            <div className="text-[10px] text-slate-400">Zero Halt Guarantee</div>
          </div>
        </div>

        {/* Live Mumbai City Traffic Map */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Central Traffic Map (Active Emergency Wave)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              Wadala East - Sion Corridor
            </span>
          </div>
          <div className="h-[240px] rounded-xl overflow-hidden">
            <MumbaiMap
              vehicleLocation={state.vehicleLocation}
              vehicleHeading={state.vehicleHeading}
              routeCoordinates={state.currentRoute.pathCoordinates}
              signals={state.signals}
              hospitalLocation={[19.0392, 72.8617]}
              pickupLocation={[19.0222, 72.8682]}
              activeRouteName={state.currentRoute.name}
              preemptedSignalId={state.activePreemptedSignalId}
              severity={state.severity}
              height="100%"
            />
          </div>
        </div>

        {/* Signal Controllers Management Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                {t('signalJunctions')}
              </h2>
              <p className="text-[11px] text-slate-400">Direct override and phase controller status</p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search junction / road..."
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-white focus:outline-none focus:border-blue-500 w-full sm:w-48"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredSignals.map((sig) => {
              const isPreempted = sig.id === state.activePreemptedSignalId || sig.preempted;
              return (
                <div
                  key={sig.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isPreempted
                      ? 'border-emerald-500/50 bg-emerald-950/20 shadow-md'
                      : 'border-slate-800/80 bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                        isPreempted
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {sig.id.replace('SIG_', '')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{sig.name}</span>
                        {isPreempted && (
                          <span className="text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black tracking-wide">
                            LOCKED GREEN
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{sig.road}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[10px] text-slate-400 font-mono">
                      GPIO {sig.gpioGreenPin || 14}
                    </span>
                    <button
                      onClick={() => {
                        actions.logEvent('signal', `Manual TMC Override executed for ${sig.name}.`);
                        alert(`Traffic Police Manual Override triggered for ${sig.name}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 transition-colors"
                    >
                      {t('overrideSignal')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Audit Log Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Central Telemetry & Audit Feed
            </span>
            <span className="text-[10px] text-slate-400">{state.events.length} Events Logged</span>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
            {state.events.map((ev) => (
              <div
                key={ev.id}
                className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-2"
              >
                <span className="text-slate-400 text-[10px] shrink-0">
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-slate-300">{ev.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
