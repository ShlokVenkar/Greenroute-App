import React from 'react';
import {
  SIGNAL_PHASE,
  PHASE_GREEN_DIRECTIONS,
  PHASE_RED_DIRECTIONS,
  PHASE_AMBER_DIRECTIONS,
} from '../simulation/signalStateMachine';

// Signal light colors
function getSignalColor(direction, phase) {
  const greens = PHASE_GREEN_DIRECTIONS[phase] || [];
  const ambers = PHASE_AMBER_DIRECTIONS[phase] || [];
  const reds = PHASE_RED_DIRECTIONS[phase] || [];
  if (greens.includes(direction)) return 'green';
  if (ambers.includes(direction)) return 'amber';
  if (reds.includes(direction)) return 'red';
  return 'red';
}

const SIGNAL_COLORS = {
  green: { light: '#10b981', glow: 'rgba(16,185,129,0.4)', off: '#064e3b' },
  amber: { light: '#f59e0b', glow: 'rgba(245,158,11,0.4)', off: '#451a03' },
  red: { light: '#ef4444', glow: 'rgba(239,68,68,0.4)', off: '#450a0a' },
};

function TrafficSignal({ x, y, direction, phase, rotate = 0 }) {
  const color = getSignalColor(direction, phase);
  const colors = SIGNAL_COLORS[color];
  const isTransitioning = [SIGNAL_PHASE.NS_YELLOW, SIGNAL_PHASE.EW_YELLOW].includes(phase);

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate})`}>
      {/* Signal housing */}
      <rect x="-6" y="-18" width="12" height="36" rx="3" fill="#1c2128" stroke="#30363d" strokeWidth="0.5" />
      {/* Red light */}
      <circle cx="0" cy="-11" r="4"
        fill={color === 'red' ? colors.light : SIGNAL_COLORS.red.off}
        filter={color === 'red' ? 'url(#redGlow)' : 'none'}
      />
      {/* Amber light */}
      <circle cx="0" cy="0" r="4"
        fill={color === 'amber' ? colors.light : SIGNAL_COLORS.amber.off}
        filter={color === 'amber' ? 'url(#amberGlow)' : 'none'}
      />
      {/* Green light */}
      <circle cx="0" cy="11" r="4"
        fill={color === 'green' ? colors.light : SIGNAL_COLORS.green.off}
        filter={color === 'green' ? 'url(#greenGlow)' : 'none'}
      />
    </g>
  );
}

function DirectionArrow({ x, y, rotate, color = '#30363d' }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate})`}>
      <path d="M0,-10 L-5,2 L0,-2 L5,2 Z" fill={color} opacity="0.6" />
    </g>
  );
}

function VehicleMarker({ x, y, color = '#10b981', label = '', size = 8 }) {
  return (
    <g>
      <rect
        x={x - size / 2}
        y={y - size / 2 - 2}
        width={size}
        height={size + 4}
        rx="2"
        fill={color}
        opacity="0.9"
      />
      {label && (
        <text x={x} y={y + size / 2 + 9} textAnchor="middle" fill={color} fontSize="7" fontFamily="Inter, sans-serif" fontWeight="600">
          {label}
        </text>
      )}
    </g>
  );
}

export default function IntersectionView({ phase, transitioning, activeRequestId, requests, compact = false }) {
  const activeReq = requests?.find(r => r.id === activeRequestId);
  const emergencyDir = activeReq?.direction;

  const size = compact ? 300 : 420;
  const cx = size / 2;
  const cy = size / 2;
  const roadW = compact ? 38 : 52;
  const halfRoad = roadW / 2;
  const laneW = halfRoad / 2;

  // Determine colors for each direction's approach
  const nColor = getSignalColor('N', phase);
  const sColor = getSignalColor('S', phase);
  const eColor = getSignalColor('E', phase);
  const wColor = getSignalColor('W', phase);

  const isTransitioning = [SIGNAL_PHASE.NS_YELLOW, SIGNAL_PHASE.EW_YELLOW, SIGNAL_PHASE.ALL_RED].includes(phase);

  // Approach road fill colors
  const roadFill = '#161b22';
  const laneMarkColor = '#2d333b';
  const roadEdgeColor = '#21262d';

  // Direction label positions
  const labelOffset = compact ? 20 : 26;

  // Vehicle marker positions on approaches
  const vehicleOffset = compact ? 60 : 85;

  // Waiting vehicles (all non-active requests)
  const waitingRequests = requests?.filter(r =>
    r.status === 'waiting' || r.status === 'active'
  ) || [];

  return (
    <div className={`relative ${compact ? 'w-[300px] h-[300px]' : 'w-[420px] h-[420px]'}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
        aria-label="Intersection visualization"
      >
        <defs>
          <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="amberGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="vehicleGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Dashed center line pattern */}
          <pattern id="centerDash" patternUnits="userSpaceOnUse" width="14" height="14">
            <rect width="14" height="14" fill="none" />
            <rect x="0" y="5" width="8" height="2" rx="1" fill="#484f58" opacity="0.5" />
          </pattern>
        </defs>

        {/* Background grid (subtle) */}
        <rect width={size} height={size} fill="#0d1117" />

        {/* ─── Road surfaces ─────────────────────────────────────── */}
        {/* North approach */}
        <rect x={cx - halfRoad} y={0} width={roadW} height={cy - halfRoad} fill={roadFill} />
        {/* South approach */}
        <rect x={cx - halfRoad} y={cy + halfRoad} width={roadW} height={cy - halfRoad} fill={roadFill} />
        {/* East approach */}
        <rect x={cx + halfRoad} y={cy - halfRoad} width={cx - halfRoad} height={roadW} fill={roadFill} />
        {/* West approach */}
        <rect x={0} y={cy - halfRoad} width={cx - halfRoad} height={roadW} fill={roadFill} />
        {/* Intersection box */}
        <rect x={cx - halfRoad} y={cy - halfRoad} width={roadW} height={roadW} fill={roadFill} />

        {/* ─── Road edges (subtle lines) ─────────────────────────── */}
        {/* North approach edges */}
        <line x1={cx - halfRoad} y1={0} x2={cx - halfRoad} y2={cy - halfRoad} stroke={roadEdgeColor} strokeWidth="1" />
        <line x1={cx + halfRoad} y1={0} x2={cx + halfRoad} y2={cy - halfRoad} stroke={roadEdgeColor} strokeWidth="1" />
        {/* South approach edges */}
        <line x1={cx - halfRoad} y1={cy + halfRoad} x2={cx - halfRoad} y2={size} stroke={roadEdgeColor} strokeWidth="1" />
        <line x1={cx + halfRoad} y1={cy + halfRoad} x2={cx + halfRoad} y2={size} stroke={roadEdgeColor} strokeWidth="1" />
        {/* East approach edges */}
        <line x1={cx + halfRoad} y1={cy - halfRoad} x2={size} y2={cy - halfRoad} stroke={roadEdgeColor} strokeWidth="1" />
        <line x1={cx + halfRoad} y1={cy + halfRoad} x2={size} y2={cy + halfRoad} stroke={roadEdgeColor} strokeWidth="1" />
        {/* West approach edges */}
        <line x1={0} y1={cy - halfRoad} x2={cx - halfRoad} y2={cy - halfRoad} stroke={roadEdgeColor} strokeWidth="1" />
        <line x1={0} y1={cy + halfRoad} x2={cx - halfRoad} y2={cy + halfRoad} stroke={roadEdgeColor} strokeWidth="1" />

        {/* ─── Lane dividers (center lines) ──────────────────────── */}
        {/* N-S center dashes */}
        <line x1={cx} y1={0} x2={cx} y2={cy - halfRoad} stroke="#484f58" strokeWidth="1" strokeDasharray="8,6" opacity="0.4" />
        <line x1={cx} y1={cy + halfRoad} x2={cx} y2={size} stroke="#484f58" strokeWidth="1" strokeDasharray="8,6" opacity="0.4" />
        {/* E-W center dashes */}
        <line x1={0} y1={cy} x2={cx - halfRoad} y2={cy} stroke="#484f58" strokeWidth="1" strokeDasharray="8,6" opacity="0.4" />
        <line x1={cx + halfRoad} y1={cy} x2={size} y2={cy} stroke="#484f58" strokeWidth="1" strokeDasharray="8,6" opacity="0.4" />

        {/* ─── Stop lines ──────────────────────────────────────────── */}
        {/* North (incoming from top — stops before box) */}
        <line
          x1={cx - halfRoad} y1={cy - halfRoad - 1}
          x2={cx + halfRoad} y2={cy - halfRoad - 1}
          stroke={nColor === 'green' ? '#10b981' : nColor === 'amber' ? '#f59e0b' : '#ef4444'}
          strokeWidth="2.5" opacity="0.7"
        />
        {/* South */}
        <line
          x1={cx - halfRoad} y1={cy + halfRoad + 1}
          x2={cx + halfRoad} y2={cy + halfRoad + 1}
          stroke={sColor === 'green' ? '#10b981' : sColor === 'amber' ? '#f59e0b' : '#ef4444'}
          strokeWidth="2.5" opacity="0.7"
        />
        {/* East (incoming from right) */}
        <line
          x1={cx + halfRoad + 1} y1={cy - halfRoad}
          x2={cx + halfRoad + 1} y2={cy + halfRoad}
          stroke={eColor === 'green' ? '#10b981' : eColor === 'amber' ? '#f59e0b' : '#ef4444'}
          strokeWidth="2.5" opacity="0.7"
        />
        {/* West */}
        <line
          x1={cx - halfRoad - 1} y1={cy - halfRoad}
          x2={cx - halfRoad - 1} y2={cy + halfRoad}
          stroke={wColor === 'green' ? '#10b981' : wColor === 'amber' ? '#f59e0b' : '#ef4444'}
          strokeWidth="2.5" opacity="0.7"
        />

        {/* ─── Directional arrows on road surface ──────────────────── */}
        {/* North approach arrow (pointing into intersection = down) */}
        <DirectionArrow x={cx - laneW / 2} y={cy - halfRoad - (compact ? 25 : 35)} rotate={180} color="#484f58" />
        {/* South approach arrow (pointing up into intersection) */}
        <DirectionArrow x={cx + laneW / 2} y={cy + halfRoad + (compact ? 25 : 35)} rotate={0} color="#484f58" />
        {/* East approach arrow (pointing left into intersection) */}
        <DirectionArrow x={cx + halfRoad + (compact ? 25 : 35)} y={cy - laneW / 2} rotate={270} color="#484f58" />
        {/* West approach arrow (pointing right into intersection) */}
        <DirectionArrow x={cx - halfRoad - (compact ? 25 : 35)} y={cy + laneW / 2} rotate={90} color="#484f58" />

        {/* ─── Intersection box center pattern ────────────────────── */}
        <rect x={cx - halfRoad + 2} y={cy - halfRoad + 2} width={roadW - 4} height={roadW - 4}
          fill="none" stroke="#21262d" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />

        {/* ─── Emergency vehicle markers ────────────────────────────── */}
        {/* Active emergency vehicle */}
        {emergencyDir === 'N' && (
          <VehicleMarker
            x={cx - laneW / 2}
            y={cy - halfRoad - vehicleOffset}
            color="#ef4444"
            label="EV"
            size={compact ? 8 : 10}
          />
        )}
        {emergencyDir === 'S' && (
          <VehicleMarker
            x={cx + laneW / 2}
            y={cy + halfRoad + vehicleOffset}
            color="#ef4444"
            label="EV"
            size={compact ? 8 : 10}
          />
        )}
        {emergencyDir === 'E' && (
          <g transform={`translate(${cx + halfRoad + vehicleOffset}, ${cy - laneW / 2})`}>
            <rect x={-7} y={-5} width={14} height={10} rx="2" fill="#ef4444" opacity="0.9" />
            <text x={0} y={9 + (compact ? 6 : 8)} textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="600">EV</text>
          </g>
        )}
        {emergencyDir === 'W' && (
          <g transform={`translate(${cx - halfRoad - vehicleOffset}, ${cy + laneW / 2})`}>
            <rect x={-7} y={-5} width={14} height={10} rx="2" fill="#ef4444" opacity="0.9" />
            <text x={0} y={9 + (compact ? 6 : 8)} textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="600">EV</text>
          </g>
        )}

        {/* Waiting vehicles (secondary requests) */}
        {waitingRequests
          .filter(r => r.direction !== emergencyDir && r.status === 'waiting')
          .map((r, i) => {
            const offset = vehicleOffset + i * (compact ? 15 : 20);
            const vc = '#f59e0b';
            if (r.direction === 'N') return <VehicleMarker key={r.id} x={cx + laneW / 2} y={cy - halfRoad - offset} color={vc} label="EV" size={compact ? 7 : 9} />;
            if (r.direction === 'S') return <VehicleMarker key={r.id} x={cx - laneW / 2} y={cy + halfRoad + offset} color={vc} label="EV" size={compact ? 7 : 9} />;
            if (r.direction === 'E') return (
              <g key={r.id} transform={`translate(${cx + halfRoad + offset}, ${cy + laneW / 2})`}>
                <rect x={-6} y={-4} width={12} height={8} rx="2" fill={vc} opacity="0.8" />
              </g>
            );
            if (r.direction === 'W') return (
              <g key={r.id} transform={`translate(${cx - halfRoad - offset}, ${cy - laneW / 2})`}>
                <rect x={-6} y={-4} width={12} height={8} rx="2" fill={vc} opacity="0.8" />
              </g>
            );
            return null;
          })}

        {/* ─── Traffic signals ──────────────────────────────────────── */}
        {/* North signal (on north-right of intersection) */}
        <TrafficSignal
          x={cx + halfRoad + (compact ? 10 : 13)}
          y={cy - halfRoad - (compact ? 10 : 13)}
          direction="N"
          phase={phase}
        />
        {/* South signal */}
        <TrafficSignal
          x={cx - halfRoad - (compact ? 10 : 13)}
          y={cy + halfRoad + (compact ? 10 : 13)}
          direction="S"
          phase={phase}
        />
        {/* East signal */}
        <TrafficSignal
          x={cx + halfRoad + (compact ? 10 : 13)}
          y={cy + halfRoad + (compact ? 10 : 13)}
          direction="E"
          phase={phase}
        />
        {/* West signal */}
        <TrafficSignal
          x={cx - halfRoad - (compact ? 10 : 13)}
          y={cy - halfRoad - (compact ? 10 : 13)}
          direction="W"
          phase={phase}
        />

        {/* ─── Direction labels ─────────────────────────────────────── */}
        <text x={cx} y={labelOffset} textAnchor="middle" fill="#8b949e" fontSize={compact ? 9 : 11}
          fontFamily="Inter, sans-serif" fontWeight="500">
          NORTH
        </text>
        <text x={cx} y={size - 8} textAnchor="middle" fill="#8b949e" fontSize={compact ? 9 : 11}
          fontFamily="Inter, sans-serif" fontWeight="500">
          SOUTH
        </text>
        <text x={size - 8} y={cy + 4} textAnchor="end" fill="#8b949e" fontSize={compact ? 9 : 11}
          fontFamily="Inter, sans-serif" fontWeight="500">
          EAST
        </text>
        <text x={10} y={cy + 4} textAnchor="start" fill="#8b949e" fontSize={compact ? 9 : 11}
          fontFamily="Inter, sans-serif" fontWeight="500">
          WEST
        </text>

        {/* Emergency direction highlight pulse ring */}
        {emergencyDir && (() => {
          const pulsePos = {
            N: { x: cx - laneW / 2, y: cy - halfRoad - vehicleOffset },
            S: { x: cx + laneW / 2, y: cy + halfRoad + vehicleOffset },
            E: { x: cx + halfRoad + vehicleOffset, y: cy - laneW / 2 },
            W: { x: cx - halfRoad - vehicleOffset, y: cy + laneW / 2 },
          }[emergencyDir];
          return pulsePos ? (
            <circle cx={pulsePos.x} cy={pulsePos.y} r={compact ? 14 : 18}
              fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.4">
              <animate attributeName="r" values={`${compact ? 12 : 16};${compact ? 20 : 26};${compact ? 12 : 16}`} dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
          ) : null;
        })()}

        {/* ALL RED indicator text */}
        {phase === SIGNAL_PHASE.ALL_RED && (
          <text x={cx} y={cy + 4} textAnchor="middle" fill="#ef4444" fontSize={compact ? 8 : 10}
            fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="1" opacity="0.7">
            ALL RED
          </text>
        )}
      </svg>

      {/* Transition indicator badge */}
      {isTransitioning && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated border border-amber-500/30 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 signal-transitioning" />
            <span className="text-[10px] font-medium text-amber-400 uppercase tracking-wider">Transitioning</span>
          </div>
        </div>
      )}
    </div>
  );
}
