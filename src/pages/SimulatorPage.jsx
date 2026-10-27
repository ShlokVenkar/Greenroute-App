import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import IntersectionView from '../components/IntersectionView';
import { ActiveRequestPanel, RequestCard, StatusBadge } from '../components/RequestComponents';
import { phaseLabel } from '../simulation/signalStateMachine';
import { REQUEST_STATUS, VEHICLE_LABELS, DIRECTION_LABELS } from '../simulation/priorityEngine';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info,
  Send,
  Clock,
  ChevronDown,
} from 'lucide-react';

function PhaseIndicator({ phase }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-bg-elevated rounded-lg border border-border-default">
      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
      <div>
        <div className="text-[10px] text-text-muted uppercase tracking-wide">Current Phase</div>
        <div className="text-xs font-medium text-text-primary mt-0.5">{phaseLabel(phase)}</div>
      </div>
    </div>
  );
}

function SimControl({ simRunning, simPaused, activeRequestId, actions }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!simRunning ? (
        <button onClick={actions.startSim} className="btn-primary text-xs">
          <Play size={13} />
          Start
        </button>
      ) : simPaused ? (
        <button onClick={actions.resumeSim} className="btn-primary text-xs">
          <Play size={13} />
          Resume
        </button>
      ) : (
        <button onClick={actions.pauseSim} className="btn-secondary text-xs">
          <Pause size={13} />
          Pause
        </button>
      )}

      {activeRequestId && (
        <button
          onClick={actions.completePassage}
          disabled={!simRunning}
          className="btn-amber text-xs"
        >
          <CheckCircle size={13} />
          Complete Passage
        </button>
      )}

      <button onClick={actions.resetSim} className="btn-secondary text-xs">
        <RotateCcw size={13} />
        Reset
      </button>
    </div>
  );
}

function RequestForm({ onSubmit, simRunning }) {
  const [form, setForm] = useState({
    vehicleType: 'ambulance',
    direction: 'N',
    estimatedArrival: '15',
    authorized: 'true',
  });
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!simRunning) return;
    setSubmitting(true);
    setLastResult(null);
    onSubmit({
      vehicleType: form.vehicleType,
      direction: form.direction,
      estimatedArrival: Number(form.estimatedArrival),
      authorized: form.authorized === 'true',
    });
    setTimeout(() => {
      setSubmitting(false);
      setLastResult(form.authorized === 'true' ? 'accepted' : 'rejected');
      setTimeout(() => setLastResult(null), 3000);
    }, 900);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Auth note */}
      <div className="flex items-start gap-2 p-3 bg-bg-elevated rounded-lg border border-border-subtle">
        <Info size={12} className="text-text-muted mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-text-muted leading-relaxed">
          The <strong className="text-text-secondary">Authorization</strong> selector simulates the result of an authorization check.
          It does not implement real vehicle authentication — this is a software prototype.
        </p>
      </div>

      {/* Vehicle type */}
      <div>
        <label className="form-label">Vehicle Type</label>
        <div className="relative">
          <select
            name="vehicleType"
            value={form.vehicleType}
            onChange={handleChange}
            className="form-select pr-8"
          >
            <option value="ambulance">Ambulance</option>
            <option value="fire_engine">Fire Engine</option>
            <option value="police">Police Vehicle</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Direction */}
      <div>
        <label className="form-label">Approach Direction</label>
        <div className="grid grid-cols-4 gap-1.5">
          {['N', 'S', 'E', 'W'].map(dir => (
            <button
              key={dir}
              type="button"
              onClick={() => setForm(f => ({ ...f, direction: dir }))}
              className={`py-2 rounded-lg text-xs font-medium border transition-all duration-150 ${
                form.direction === dir
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : 'border-border-default bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text-primary'
              }`}
            >
              {DIRECTION_LABELS[dir]}
            </button>
          ))}
        </div>
      </div>

      {/* ETA */}
      <div>
        <label className="form-label">Estimated Arrival (seconds)</label>
        <div className="grid grid-cols-4 gap-1.5">
          {['5', '10', '15', '30'].map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setForm(f => ({ ...f, estimatedArrival: v }))}
              className={`py-2 rounded-lg text-xs font-medium border transition-all duration-150 ${
                form.estimatedArrival === v
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : 'border-border-default bg-bg-elevated text-text-secondary hover:border-border-strong'
              }`}
            >
              {v}s
            </button>
          ))}
        </div>
        <input
          type="number"
          name="estimatedArrival"
          value={form.estimatedArrival}
          onChange={handleChange}
          min="1"
          max="120"
          className="form-input mt-2 text-xs"
          placeholder="Custom value in seconds"
        />
      </div>

      {/* Authorization */}
      <div>
        <label className="form-label">Authorization Result (Simulated)</label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, authorized: 'true' }))}
            className={`py-2 rounded-lg text-xs font-medium border transition-all duration-150 ${
              form.authorized === 'true'
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-border-default bg-bg-elevated text-text-secondary hover:border-border-strong'
            }`}
          >
            Authorized
          </button>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, authorized: 'false' }))}
            className={`py-2 rounded-lg text-xs font-medium border transition-all duration-150 ${
              form.authorized === 'false'
                ? 'border-red-500 bg-red-500/10 text-red-400'
                : 'border-border-default bg-bg-elevated text-text-secondary hover:border-border-strong'
            }`}
          >
            Unauthorized
          </button>
        </div>
      </div>

      {/* Feedback */}
      {lastResult && (
        <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs animate-fade-in ${
          lastResult === 'accepted'
            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {lastResult === 'accepted'
            ? <><CheckCircle size={12} /> Request accepted — processing priority sequence.</>
            : <><AlertCircle size={12} /> Request rejected — authorization failed.</>
          }
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!simRunning || submitting}
        className="btn-primary w-full justify-center"
      >
        {submitting ? (
          <>
            <Clock size={13} className="animate-spin" />
            Validating...
          </>
        ) : (
          <>
            <Send size={13} />
            Submit Request
          </>
        )}
      </button>

      {!simRunning && (
        <p className="text-[10px] text-text-muted text-center">Start the simulation first.</p>
      )}
    </form>
  );
}

export default function SimulatorPage() {
  const { state, actions } = useSimulation();
  const {
    simRunning, simPaused, currentPhase, transitioning,
    requests, activeRequestId, priorityPanel, events,
  } = state;

  const activeReq = requests.find(r => r.id === activeRequestId);
  const queuedReqs = requests.filter(r =>
    r.status === REQUEST_STATUS.WAITING && r.id !== activeRequestId
  );
  const recentEvents = events.slice(0, 12);

  return (
    <div className="flex-1 overflow-y-auto page-enter">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border-subtle">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Intersection Simulator</h1>
            <p className="text-sm text-text-secondary mt-1">
              Demonstrate emergency vehicle priority signal control with safe transition sequences.
            </p>
          </div>
          <SimControl
            simRunning={simRunning}
            simPaused={simPaused}
            activeRequestId={activeRequestId}
            actions={actions}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex gap-6 items-start">
          {/* Center: intersection */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Intersection */}
            <div className="card">
              <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text-primary">Intersection Alpha-1</h2>
                <PhaseIndicator phase={currentPhase} />
              </div>
              <div className="p-4 flex justify-center">
                <IntersectionView
                  phase={currentPhase}
                  transitioning={transitioning}
                  activeRequestId={activeRequestId}
                  requests={requests}
                  compact={false}
                />
              </div>
            </div>

            {/* Active request panel */}
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Active Priority
              </h3>
              <ActiveRequestPanel
                request={activeReq}
                priorityPanel={priorityPanel}
                onComplete={actions.completePassage}
                simRunning={simRunning}
              />
            </div>

            {/* Priority queue */}
            {queuedReqs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Priority Queue
                  </h3>
                  <span className="badge-amber">{queuedReqs.length} waiting</span>
                </div>
                <div className="space-y-2">
                  {queuedReqs.map((r, i) => (
                    <div key={r.id} className="flex items-center gap-2">
                      <span className="text-[10px] text-text-muted w-4 font-mono">{i + 1}.</span>
                      <div className="flex-1">
                        <RequestCard request={r} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-text-muted mt-2 leading-relaxed">
                  Competing requests are served sequentially. Incompatible green movements will not be activated simultaneously.
                </p>
              </div>
            )}

            {/* Event feed */}
            <div className="card">
              <div className="px-4 py-3 border-b border-border-subtle">
                <h3 className="text-sm font-semibold text-text-primary">Simulation Events</h3>
              </div>
              <div className="px-4 py-2 max-h-48 overflow-y-auto space-y-0">
                {recentEvents.length === 0 ? (
                  <p className="py-4 text-xs text-text-muted text-center">No events yet. Start the simulation.</p>
                ) : (
                  recentEvents.map(ev => {
                    const time = ev.timestamp instanceof Date
                      ? ev.timestamp.toLocaleTimeString('en-IN', { hour12: false })
                      : '--:--:--';
                    return (
                      <div key={ev.id} className="flex items-start gap-2 py-2 border-b border-border-subtle last:border-0 animate-fade-in">
                        <span className="text-[10px] text-text-muted font-mono flex-shrink-0 mt-0.5">{time}</span>
                        <p className="text-[11px] text-text-secondary leading-relaxed">{ev.description}</p>
                        {ev.requestId && (
                          <span className="text-[9px] text-text-muted font-mono flex-shrink-0">{ev.requestId}</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="w-64 flex-shrink-0 space-y-4">
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-4">New Emergency Request</h3>
              <RequestForm onSubmit={actions.submitRequest} simRunning={simRunning && !simPaused} />
            </div>

            {/* Recent requests */}
            {requests.length > 0 && (
              <div className="card">
                <div className="px-4 py-3 border-b border-border-subtle">
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Request History
                  </h3>
                </div>
                <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                  {[...requests].reverse().map(r => (
                    <RequestCard key={r.id} request={r} isActive={r.id === activeRequestId} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
