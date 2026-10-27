import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import IntersectionView from '../components/IntersectionView';
import { ActiveRequestPanel, RequestCard } from '../components/RequestComponents';
import { phaseLabel } from '../simulation/signalStateMachine';
import { REQUEST_STATUS } from '../simulation/priorityEngine';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Play,
  ArrowRight,
  Radio,
} from 'lucide-react';

function MetricCard({ label, value, sub, accent = false }) {
  return (
    <div className="card p-4">
      <div className={`text-2xl font-semibold ${accent ? 'text-green-400' : 'text-text-primary'} tabular-nums`}>
        {value}
      </div>
      <div className="text-xs font-medium text-text-secondary mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

function EventItem({ event }) {
  const categoryColors = {
    system: 'bg-text-muted',
    request: 'bg-amber-500',
    auth: 'bg-teal-500',
    priority: 'bg-green-500',
    signal: 'bg-blue-500',
    passage: 'bg-green-400',
    restore: 'bg-teal-400',
  };
  const dot = categoryColors[event.category] || 'bg-text-muted';

  const time = event.timestamp instanceof Date
    ? event.timestamp.toLocaleTimeString('en-IN', { hour12: false })
    : '--:--:--';

  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-border-subtle last:border-0 animate-fade-in">
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dot}`} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-primary leading-relaxed">{event.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-text-muted font-mono">{time}</span>
          {event.requestId && (
            <span className="text-[10px] text-text-muted font-mono">{event.requestId}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage({ onNavigate }) {
  const { state, avgWaitTime, actions } = useSimulation();
  const { simRunning, simPaused, currentPhase, transitioning, requests, activeRequestId, events, priorityPanel } = state;

  const activeReq = requests.find(r => r.id === activeRequestId);
  const totalReqs = requests.length;
  const completedReqs = state.completedRequests;
  const recentEvents = events.slice(0, 8);

  const waitingCount = requests.filter(r => r.status === REQUEST_STATUS.WAITING || r.status === REQUEST_STATUS.ACTIVE).length;

  return (
    <div className="flex-1 overflow-y-auto page-enter">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-border-subtle">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Traffic Command Center</h1>
            <p className="text-sm text-text-secondary mt-1">
              Monitor intersection activity and coordinate emergency vehicle priority.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Sim status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated border border-border-default rounded-lg">
              <div className={`w-1.5 h-1.5 rounded-full ${
                simRunning && !simPaused ? 'bg-green-500' : 'bg-text-muted'
              }`} />
              <span className="text-xs text-text-secondary">
                {simRunning && !simPaused ? 'Simulation Active' : simPaused ? 'Paused' : 'Idle'}
              </span>
              <span className="text-[10px] text-text-muted border-l border-border-default pl-2 font-mono">
                Software Simulation
              </span>
            </div>
            {/* Open simulator */}
            <button
              onClick={() => onNavigate('simulator')}
              className="btn-primary text-xs"
            >
              <Play size={12} />
              Open Simulator
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6 space-y-6">
        {/* Primary row: intersection + right panel */}
        <div className="flex gap-6 items-start">
          {/* Intersection visualization */}
          <div className="card flex-shrink-0">
            <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">Intersection Alpha-1</h2>
                <p className="text-[11px] text-text-muted mt-0.5">{phaseLabel(currentPhase)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Radio size={12} className="text-text-muted" />
                <span className="text-[10px] text-text-muted uppercase tracking-wider">
                  {transitioning ? 'Transitioning' : 'Stable'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <IntersectionView
                phase={currentPhase}
                transitioning={transitioning}
                activeRequestId={activeRequestId}
                requests={requests}
                compact={false}
              />
            </div>

            {/* Start sim CTA when idle */}
            {!simRunning && (
              <div className="px-4 pb-4">
                <button
                  onClick={actions.startSim}
                  className="btn-primary w-full justify-center"
                >
                  <Play size={14} />
                  Start Simulation
                </button>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Emergency Requests"
                value={totalReqs}
                sub={`${state.rejectedRequests} rejected`}
                accent={totalReqs > 0}
              />
              <MetricCard
                label="Active Priority"
                value={activeRequestId ? '1' : '0'}
                sub={activeReq ? activeReq.direction + ' approach' : 'none'}
                accent={!!activeRequestId}
              />
              <MetricCard
                label="Avg Wait Time"
                value={avgWaitTime > 0 ? `${avgWaitTime}s` : '—'}
                sub="simulated"
              />
              <MetricCard
                label="Completed"
                value={completedReqs}
                sub={totalReqs > 0 ? `of ${totalReqs} total` : 'none yet'}
                accent={completedReqs > 0}
              />
            </div>

            {/* Active request panel */}
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Active Priority Request
              </h3>
              <ActiveRequestPanel
                request={activeReq}
                priorityPanel={priorityPanel}
                onComplete={actions.completePassage}
                simRunning={simRunning}
              />
            </div>

            {/* Waiting queue */}
            {waitingCount > 1 && (
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Priority Queue
                </h3>
                <div className="space-y-2">
                  {requests
                    .filter(r => r.status === REQUEST_STATUS.WAITING && r.id !== activeRequestId)
                    .map(r => <RequestCard key={r.id} request={r} />)}
                </div>
              </div>
            )}

            {/* Quick action when idle */}
            {simRunning && !activeRequestId && (
              <button
                onClick={() => onNavigate('simulator')}
                className="w-full card p-3 flex items-center justify-between hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-200 group"
              >
                <div className="text-left">
                  <p className="text-xs font-medium text-text-primary">Test Emergency Request</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Simulate an incoming emergency vehicle</p>
                </div>
                <ArrowRight size={14} className="text-text-muted group-hover:text-green-400 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card">
          <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
            <button
              onClick={() => onNavigate('log')}
              className="text-[11px] text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors"
            >
              View full log <ArrowRight size={10} />
            </button>
          </div>
          <div className="px-4 py-1 divide-y divide-border-subtle">
            {recentEvents.length === 0 ? (
              <div className="py-6 text-center text-xs text-text-muted">No events recorded yet.</div>
            ) : (
              recentEvents.map(ev => <EventItem key={ev.id} event={ev} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
