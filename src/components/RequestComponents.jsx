import React from 'react';
import { REQUEST_STATUS, VEHICLE_LABELS, DIRECTION_LABELS } from '../simulation/priorityEngine';
import { SIGNAL_PHASE, phaseLabel } from '../simulation/signalStateMachine';
import {
  Ambulance,
  Flame,
  Shield,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  AlertTriangle,
  Activity,
  ChevronRight,
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

export function StatusBadge({ status }) {
  const config = {
    [REQUEST_STATUS.PENDING]: { label: 'Pending', className: 'badge-muted', icon: Clock },
    [REQUEST_STATUS.VALIDATING]: { label: 'Validating', className: 'badge-amber', icon: Loader },
    [REQUEST_STATUS.WAITING]: { label: 'Waiting', className: 'badge-amber', icon: Activity },
    [REQUEST_STATUS.ACTIVE]: { label: 'Priority Active', className: 'badge-green', icon: CheckCircle },
    [REQUEST_STATUS.COMPLETED]: { label: 'Completed', className: 'badge-teal', icon: CheckCircle },
    [REQUEST_STATUS.REJECTED]: { label: 'Rejected', className: 'badge-red', icon: XCircle },
  }[status] || { label: status, className: 'badge-muted', icon: Clock };

  const Icon = config.icon;
  return (
    <span className={config.className}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}

export function RequestCard({ request, isActive = false }) {
  const VehicleIcon = VEHICLE_ICONS[request.vehicleType] || AlertTriangle;
  const DirIcon = DIRECTION_ICONS[request.direction] || ChevronRight;

  return (
    <div className={`p-3 rounded-lg border transition-all duration-300 ${
      isActive
        ? 'border-green-500/30 bg-green-500/5'
        : request.status === REQUEST_STATUS.REJECTED
          ? 'border-red-500/20 bg-bg-elevated'
          : 'border-border-subtle bg-bg-elevated'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-md ${
            request.status === REQUEST_STATUS.ACTIVE ? 'bg-green-500/15' :
            request.status === REQUEST_STATUS.REJECTED ? 'bg-red-500/10' :
            'bg-bg-overlay'
          }`}>
            <VehicleIcon size={14} className={
              request.status === REQUEST_STATUS.ACTIVE ? 'text-green-400' :
              request.status === REQUEST_STATUS.REJECTED ? 'text-red-400' :
              'text-text-secondary'
            } />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-primary font-mono">{request.id}</span>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <DirIcon size={10} className="text-text-muted flex-shrink-0" />
              <span className="text-xs text-text-secondary">
                {VEHICLE_LABELS[request.vehicleType]} · {DIRECTION_LABELS[request.direction]}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
            request.authorized
              ? 'text-green-400 bg-green-500/10'
              : 'text-red-400 bg-red-500/10'
          }`}>
            {request.authorized ? 'Authorized' : 'Unauthorized'}
          </span>
          <span className="text-[10px] text-text-muted">ETA {request.estimatedArrival}s</span>
        </div>
      </div>
      {request.priorityDecision && (
        <p className="mt-2 text-[10px] text-text-muted leading-relaxed border-t border-border-subtle pt-2">
          {request.priorityDecision}
        </p>
      )}
    </div>
  );
}

export function ActiveRequestPanel({ request, priorityPanel, onComplete, simRunning }) {
  if (!request && !priorityPanel) {
    return (
      <div className="card p-5 flex flex-col items-center justify-center text-center gap-3 min-h-[180px]">
        <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center">
          <Activity size={18} className="text-text-muted" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">No Active Priority</p>
          <p className="text-xs text-text-muted mt-1">
            {simRunning
              ? 'Submit an emergency request to activate priority mode.'
              : 'Start the simulation and submit an emergency request.'}
          </p>
        </div>
      </div>
    );
  }

  const VehicleIcon = request ? (VEHICLE_ICONS[request.vehicleType] || AlertTriangle) : Activity;
  const phase = priorityPanel?.phase;
  const statusText = priorityPanel?.status;
  const nextAction = priorityPanel?.nextAction;

  return (
    <div className="card border-green-500/20 bg-green-500/[0.03] p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Priority Active</span>
        </div>
        {request && (
          <span className="text-[10px] text-text-muted font-mono">{request.id}</span>
        )}
      </div>

      {/* Vehicle info */}
      {request && (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <VehicleIcon size={16} className="text-green-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">
              {VEHICLE_LABELS[request.vehicleType]}
            </div>
            <div className="text-xs text-text-secondary">
              Approaching from {DIRECTION_LABELS[request.direction]} · ETA {request.estimatedArrival}s
            </div>
          </div>
        </div>
      )}

      {/* Phase info */}
      {phase && (
        <div className="flex items-start gap-2 p-2.5 bg-bg-elevated rounded-lg">
          <div className="w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 bg-amber-500" />
          <div>
            <div className="text-[10px] font-medium text-text-muted uppercase tracking-wide mb-0.5">Signal Phase</div>
            <div className="text-xs text-text-primary">{phaseLabel(phase)}</div>
          </div>
        </div>
      )}

      {/* Next action */}
      {nextAction && (
        <div className="flex items-start gap-2">
          <ChevronRight size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-text-secondary">{nextAction}</p>
        </div>
      )}

      {/* Complete passage button */}
      {request?.status === REQUEST_STATUS.ACTIVE && (
        <button
          onClick={onComplete}
          className="btn-primary w-full justify-center text-xs py-2"
        >
          <CheckCircle size={13} />
          Complete Emergency Passage
        </button>
      )}
    </div>
  );
}
