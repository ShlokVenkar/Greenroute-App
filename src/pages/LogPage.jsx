import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { EVENT_CATEGORY } from '../context/SimulationContext';
import {
  ScrollText,
  Filter,
  Trash2,
  Activity,
  Server,
  Shield,
  Zap,
  Radio,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const CATEGORY_CONFIG = {
  [EVENT_CATEGORY.SYSTEM]: { label: 'System', color: 'text-text-muted', dot: 'bg-text-muted', icon: Server },
  [EVENT_CATEGORY.REQUEST]: { label: 'Request', color: 'text-amber-400', dot: 'bg-amber-500', icon: AlertTriangle },
  [EVENT_CATEGORY.AUTH]: { label: 'Auth', color: 'text-teal-400', dot: 'bg-teal-500', icon: Shield },
  [EVENT_CATEGORY.PRIORITY]: { label: 'Priority', color: 'text-green-400', dot: 'bg-green-500', icon: Zap },
  [EVENT_CATEGORY.SIGNAL]: { label: 'Signal', color: 'text-blue-400', dot: 'bg-blue-500', icon: Radio },
  [EVENT_CATEGORY.PASSAGE]: { label: 'Passage', color: 'text-green-400', dot: 'bg-green-400', icon: CheckCircle },
  [EVENT_CATEGORY.RESTORE]: { label: 'Restore', color: 'text-teal-400', dot: 'bg-teal-400', icon: Activity },
};

const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'System', value: EVENT_CATEGORY.SYSTEM },
  { label: 'Request', value: EVENT_CATEGORY.REQUEST },
  { label: 'Auth', value: EVENT_CATEGORY.AUTH },
  { label: 'Priority', value: EVENT_CATEGORY.PRIORITY },
  { label: 'Signal', value: EVENT_CATEGORY.SIGNAL },
  { label: 'Passage', value: EVENT_CATEGORY.PASSAGE },
];

function EventRow({ event }) {
  const config = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG[EVENT_CATEGORY.SYSTEM];
  const Icon = config.icon;

  const time = event.timestamp instanceof Date
    ? event.timestamp.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border-subtle last:border-0 animate-fade-in group hover:bg-bg-elevated/50 px-4 -mx-4 rounded transition-colors duration-150">
      {/* Time */}
      <span className="text-[10px] text-text-muted font-mono flex-shrink-0 mt-0.5 w-16">{time}</span>

      {/* Category indicator */}
      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${config.dot} bg-opacity-15`}>
        <Icon size={11} className={config.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-primary leading-relaxed">{event.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[9px] uppercase tracking-wider font-medium ${config.color}`}>
            {config.label}
          </span>
          {event.requestId && (
            <span className="text-[9px] text-text-muted font-mono">{event.requestId}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LogPage() {
  const { state, actions } = useSimulation();
  const { events } = state;
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? events
    : events.filter(e => e.category === filter);

  return (
    <div className="flex-1 overflow-y-auto page-enter">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border-subtle">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Activity Log</h1>
            <p className="text-sm text-text-secondary mt-1">
              Complete chronological record of simulation events.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-muted">
              <ScrollText size={10} />
              {events.length} events
            </span>
            <button
              onClick={actions.clearEvents}
              className="btn-secondary text-xs"
              disabled={events.length === 0}
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 mt-4 flex-wrap">
          <Filter size={12} className="text-text-muted" />
          <div className="flex gap-1 flex-wrap">
            {FILTER_OPTIONS.map(f => (
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

      {/* Events */}
      <div className="p-6">
        <div className="card px-4 py-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <ScrollText size={24} className="text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-muted">No events match this filter.</p>
            </div>
          ) : (
            filtered.map(ev => <EventRow key={ev.id} event={ev} />)
          )}
        </div>

        <p className="text-[10px] text-text-muted mt-3">
          Records represent simulation events only. Timestamps reflect local simulation time.
        </p>
      </div>
    </div>
  );
}
