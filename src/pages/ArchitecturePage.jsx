import React from 'react';
import {
  Radio,
  Cpu,
  Shield,
  Zap,
  Activity,
  RotateCcw,
  CheckCircle,
  Circle,
  ChevronRight,
  Info,
} from 'lucide-react';

const PIPELINE = [
  {
    id: 'vehicle',
    label: 'Emergency Vehicle',
    description: 'An authorized emergency vehicle approaches the intersection. The vehicle carries an identification module (RFID transponder or GPS unit in the planned hardware design).',
    implemented: false,
    hardware: true,
    note: 'Planned: RFID transponder on vehicle, ESP32-based roadside reader, or GPS/GNSS module.',
    icon: Radio,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  {
    id: 'identification',
    label: 'Identification & Request',
    description: 'The vehicle transmits an emergency signal containing its identity and vehicle type. In the current software simulation, this is represented by the request form submitted by the operator.',
    implemented: true,
    hardware: false,
    note: 'Simulated via the request creation interface.',
    icon: Shield,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    id: 'validation',
    label: 'Request Validation',
    description: 'The controller validates the incoming request. It checks the vehicle\'s authorization status. Unauthorized requests are immediately rejected and logged.',
    implemented: true,
    hardware: false,
    note: 'Simulated: authorization result is provided manually for prototype testing.',
    icon: CheckCircle,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    id: 'decision',
    label: 'Priority Decision Engine',
    description: 'The controller evaluates all active and queued requests. It assigns priority based on vehicle type, estimated arrival time, and FIFO ordering. It checks for conflicts with existing or competing requests.',
    implemented: true,
    hardware: false,
    note: 'Vehicle priority: Ambulance > Fire Engine > Police. Tie-break: estimated arrival time.',
    icon: Zap,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    id: 'statemachine',
    label: 'Safe Signal State Machine',
    description: 'The controller executes a safe phase transition sequence: (1) Yellow clearance interval, (2) All-red clearance interval, (3) Emergency priority phase activation. Conflicting green movements are never simultaneously permitted.',
    implemented: true,
    hardware: false,
    note: 'Yellow: 3s · All-Red: 2s · Emergency green phase maintained until passage confirmed.',
    icon: Activity,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    id: 'passage',
    label: 'Emergency Passage Detection',
    description: 'The controller holds the emergency priority phase until vehicle passage is confirmed. In a hardware deployment, this would use loop detectors or sensors. In the simulation, the operator confirms passage manually.',
    implemented: true,
    hardware: false,
    note: 'Planned: inductive loop detector or radar sensor for automatic detection.',
    icon: Radio,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    id: 'restore',
    label: 'Normal Operation Restoration',
    description: 'After vehicle passage, the controller executes an all-red clearance, then resumes the normal signal cycle. If additional requests are queued, the next request is served before restoration.',
    implemented: true,
    hardware: false,
    note: 'Post-passage all-red: 2s · Normal N-S / E-W alternating cycle restored.',
    icon: RotateCcw,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
];

function PipelineNode({ step, isLast }) {
  const Icon = step.icon;

  return (
    <div className="flex gap-4 items-start">
      {/* Left: icon + connector */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${step.bg} ${step.border}`}>
          <Icon size={18} className={step.color} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-border-default mt-2 mb-0" style={{ minHeight: '28px' }} />
        )}
      </div>

      {/* Right: content */}
      <div className={`flex-1 pb-${isLast ? '0' : '6'} min-w-0`}>
        <div className="flex items-center gap-2.5 mb-1.5">
          <h3 className="text-sm font-semibold text-text-primary">{step.label}</h3>
          <div className="flex items-center gap-1.5">
            {step.implemented ? (
              <span className="badge-green text-[9px]">
                <CheckCircle size={8} />
                Implemented
              </span>
            ) : (
              <span className="badge-amber text-[9px]">
                <Circle size={8} />
                Planned
              </span>
            )}
            {step.hardware && (
              <span className="badge-muted text-[9px]">
                <Cpu size={8} />
                Hardware Component
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed mb-2">
          {step.description}
        </p>

        {step.note && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-bg-elevated border border-border-subtle">
            <Info size={11} className="text-text-muted mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-text-muted leading-relaxed">{step.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <div className="flex-1 overflow-y-auto page-enter">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border-subtle">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">System Architecture</h1>
            <p className="text-sm text-text-secondary mt-1">
              Conceptual pipeline for intelligent emergency vehicle priority management.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-green">
              <CheckCircle size={10} />
              5 / 7 Implemented
            </span>
            <span className="badge-amber">
              <Circle size={10} />
              2 Planned
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-6 items-start">
          {/* Pipeline */}
          <div className="flex-1 min-w-0">
            <div className="card p-6">
              <div className="space-y-0">
                {PIPELINE.map((step, i) => (
                  <PipelineNode key={step.id} step={step} isLast={i === PIPELINE.length - 1} />
                ))}
              </div>
            </div>
          </div>

          {/* Side: tech stack + notes */}
          <div className="w-64 flex-shrink-0 space-y-4">
            {/* Software stack */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                Software Stack
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Frontend', value: 'React + Vite' },
                  { label: 'Logic', 'value': 'JavaScript (simulation)' },
                  { label: 'State', value: 'React Context + useReducer' },
                  { label: 'Styling', value: 'Tailwind CSS' },
                  { label: 'Icons', value: 'Lucide React' },
                  { label: 'Backend', value: 'None (client-only)' },
                  { label: 'Data Source', value: 'Local simulation state' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-[10px] text-text-muted">{label}</span>
                    <span className="text-[10px] text-text-secondary text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Planned hardware */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                Planned Hardware (Not Integrated)
              </h3>
              <div className="space-y-2">
                {[
                  'RFID transponder (vehicle)',
                  'RFID reader (roadside)',
                  'ESP32 microcontroller',
                  'GPS/GNSS module',
                  'Traffic signal controller',
                  'Inductive loop detector',
                  'Communication protocol (LoRa/Wi-Fi)',
                ].map(item => (
                  <div key={item} className="flex items-center gap-1.5">
                    <ChevronRight size={10} className="text-text-muted flex-shrink-0" />
                    <span className="text-[10px] text-text-muted">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2.5 bg-bg-elevated rounded-lg">
                <p className="text-[9px] text-text-muted leading-relaxed">
                  Hardware components are documented in the project proposal and not claimed as currently integrated.
                </p>
              </div>
            </div>

            {/* Conflict model */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                Conflict Model
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-text-muted">N + S simultaneously</span>
                  <span className="text-green-400">✓ Compatible</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-text-muted">E + W simultaneously</span>
                  <span className="text-green-400">✓ Compatible</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-text-muted">N + E simultaneously</span>
                  <span className="text-red-400">✗ Conflict</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-text-muted">N + W simultaneously</span>
                  <span className="text-red-400">✗ Conflict</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-text-muted">S + E simultaneously</span>
                  <span className="text-red-400">✗ Conflict</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-text-muted">S + W simultaneously</span>
                  <span className="text-red-400">✗ Conflict</span>
                </div>
              </div>
              <p className="text-[9px] text-text-muted mt-2 leading-relaxed">
                Conflicting requests are served sequentially with full signal transition sequences between each.
              </p>
            </div>

            {/* Project info */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                Project Info
              </h3>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-text-muted">Project Lead</span>
                  <span className="text-text-secondary">Shlok Venkar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Mentor</span>
                  <span className="text-text-secondary">Anjali Gharat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Team</span>
                  <span className="text-text-secondary">A_6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Category</span>
                  <span className="text-text-secondary text-right">ITS · Emergency Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
