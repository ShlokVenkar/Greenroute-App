import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { StatusBadge } from '../components/RequestComponents';
import { REQUEST_STATUS, VEHICLE_LABELS, DIRECTION_LABELS } from '../simulation/priorityEngine';
import {
  AlertTriangle,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Ambulance,
  Flame,
  Shield,
} from 'lucide-react';

const VEHICLE_ICONS = {
  ambulance: Ambulance,
  fire_engine: Flame,
  police: Shield,
};

const DIRECTION_ICONS = {
  N: ArrowUp,
  S: ArrowDown,
  E: ArrowRight,
  W: ArrowLeft,
};

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: REQUEST_STATUS.ACTIVE },
  { label: 'Waiting', value: REQUEST_STATUS.WAITING },
  { label: 'Completed', value: REQUEST_STATUS.COMPLETED },
  { label: 'Rejected', value: REQUEST_STATUS.REJECTED },
];

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour12: false });
}

function formatElapsed(createdAt, completedAt) {
  const end = completedAt || Date.now();
  const s = Math.round((end - createdAt) / 1000);
  return `${s}s`;
}

export default function RequestsPage() {
  const { state } = useSimulation();
  const { requests, activeRequestId } = state;
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? requests
    : requests.filter(r => r.status === filter);

  return (
    <div className="flex-1 overflow-y-auto page-enter">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border-subtle">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Emergency Requests</h1>
            <p className="text-sm text-text-secondary mt-1">
              All emergency vehicle requests processed by the simulation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-muted">
              <AlertTriangle size={10} />
              {requests.length} total
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 mt-4">
          <Filter size={12} className="text-text-muted" />
          <div className="flex gap-1">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                  filter === f.value
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        {filtered.length === 0 ? (
          <div className="card p-12 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">No requests found</p>
              <p className="text-xs text-text-muted mt-1">
                {filter !== 'all'
                  ? 'No requests match this filter.'
                  : 'Use the Intersection Simulator to submit emergency requests.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  {['Request ID', 'Vehicle', 'Direction', 'ETA', 'Authorization', 'Status', 'Priority Decision'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...filtered].reverse().map(req => {
                  const VehicleIcon = VEHICLE_ICONS[req.vehicleType] || AlertTriangle;
                  const DirIcon = DIRECTION_ICONS[req.direction] || ArrowUp;
                  const isActive = req.id === activeRequestId;

                  return (
                    <tr
                      key={req.id}
                      className={`border-b border-border-subtle last:border-0 transition-colors duration-200 ${
                        isActive ? 'bg-green-500/5' : 'hover:bg-bg-elevated'
                      }`}
                    >
                      {/* ID */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                          <span className="font-mono text-xs text-text-primary">{req.id}</span>
                        </div>
                        <div className="text-[10px] text-text-muted font-mono mt-0.5">
                          {formatTime(req.createdAt)}
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <VehicleIcon size={13} className="text-text-secondary" />
                          <span className="text-xs text-text-primary">{VEHICLE_LABELS[req.vehicleType]}</span>
                        </div>
                      </td>

                      {/* Direction */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <DirIcon size={13} className="text-text-secondary" />
                          <span className="text-xs text-text-primary">{DIRECTION_LABELS[req.direction]}</span>
                        </div>
                      </td>

                      {/* ETA */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-text-primary tabular-nums">{req.estimatedArrival}s</span>
                      </td>

                      {/* Auth */}
                      <td className="px-4 py-3">
                        <span className={req.authorized ? 'badge-green' : 'badge-red'}>
                          {req.authorized ? <CheckCircle size={9} /> : <XCircle size={9} />}
                          {req.authorized ? 'Authorized' : 'Unauthorized'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={req.status} />
                      </td>

                      {/* Decision */}
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                          {req.priorityDecision || '—'}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-[10px] text-text-muted mt-3">
          All records reflect simulation events only. No real vehicle or traffic data is displayed.
        </p>
      </div>
    </div>
  );
}
