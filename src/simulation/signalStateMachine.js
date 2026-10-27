/**
 * GreenRoute Traffic Signal State Machine
 * Implements safe signal transitions with emergency vehicle priority.
 * 
 * Movement compatibility model (standard 4-way intersection):
 * NS_STRAIGHT: North-South through traffic
 * EW_STRAIGHT: East-West through traffic  
 * NS_LEFT: North-South left turns
 * EW_LEFT: East-West left turns
 */

export const SIGNAL_PHASE = {
  NS_GREEN: 'NS_GREEN',     // North-South green
  EW_GREEN: 'EW_GREEN',     // East-West green
  NS_YELLOW: 'NS_YELLOW',   // North-South yellow transition
  EW_YELLOW: 'EW_YELLOW',   // East-West yellow transition
  ALL_RED: 'ALL_RED',       // All-red clearance interval
  EMERGENCY_N: 'EMERGENCY_N',
  EMERGENCY_S: 'EMERGENCY_S',
  EMERGENCY_E: 'EMERGENCY_E',
  EMERGENCY_W: 'EMERGENCY_W',
};

// Which directions get green in each phase
export const PHASE_GREEN_DIRECTIONS = {
  [SIGNAL_PHASE.NS_GREEN]: ['N', 'S'],
  [SIGNAL_PHASE.EW_GREEN]: ['E', 'W'],
  [SIGNAL_PHASE.NS_YELLOW]: [],
  [SIGNAL_PHASE.EW_YELLOW]: [],
  [SIGNAL_PHASE.ALL_RED]: [],
  [SIGNAL_PHASE.EMERGENCY_N]: ['N'],
  [SIGNAL_PHASE.EMERGENCY_S]: ['S'],
  [SIGNAL_PHASE.EMERGENCY_E]: ['E'],
  [SIGNAL_PHASE.EMERGENCY_W]: ['W'],
};

// Red directions in each phase
export const PHASE_RED_DIRECTIONS = {
  [SIGNAL_PHASE.NS_GREEN]: ['E', 'W'],
  [SIGNAL_PHASE.EW_GREEN]: ['N', 'S'],
  [SIGNAL_PHASE.NS_YELLOW]: ['E', 'W'],
  [SIGNAL_PHASE.EW_YELLOW]: ['N', 'S'],
  [SIGNAL_PHASE.ALL_RED]: ['N', 'S', 'E', 'W'],
  [SIGNAL_PHASE.EMERGENCY_N]: ['S', 'E', 'W'],
  [SIGNAL_PHASE.EMERGENCY_S]: ['N', 'E', 'W'],
  [SIGNAL_PHASE.EMERGENCY_E]: ['N', 'S', 'W'],
  [SIGNAL_PHASE.EMERGENCY_W]: ['N', 'S', 'E'],
};

// Amber directions in each phase
export const PHASE_AMBER_DIRECTIONS = {
  [SIGNAL_PHASE.NS_GREEN]: [],
  [SIGNAL_PHASE.EW_GREEN]: [],
  [SIGNAL_PHASE.NS_YELLOW]: ['N', 'S'],
  [SIGNAL_PHASE.EW_YELLOW]: ['E', 'W'],
  [SIGNAL_PHASE.ALL_RED]: [],
  [SIGNAL_PHASE.EMERGENCY_N]: [],
  [SIGNAL_PHASE.EMERGENCY_S]: [],
  [SIGNAL_PHASE.EMERGENCY_E]: [],
  [SIGNAL_PHASE.EMERGENCY_W]: [],
};

export const DIRECTION_TO_EMERGENCY_PHASE = {
  N: SIGNAL_PHASE.EMERGENCY_N,
  S: SIGNAL_PHASE.EMERGENCY_S,
  E: SIGNAL_PHASE.EMERGENCY_E,
  W: SIGNAL_PHASE.EMERGENCY_W,
};

/**
 * Determine which yellow phase precedes a given current phase
 */
export function getYellowPhaseFor(currentPhase) {
  if ([SIGNAL_PHASE.NS_GREEN, SIGNAL_PHASE.EMERGENCY_N, SIGNAL_PHASE.EMERGENCY_S].includes(currentPhase)) {
    return SIGNAL_PHASE.NS_YELLOW;
  }
  if ([SIGNAL_PHASE.EW_GREEN, SIGNAL_PHASE.EMERGENCY_E, SIGNAL_PHASE.EMERGENCY_W].includes(currentPhase)) {
    return SIGNAL_PHASE.EW_YELLOW;
  }
  return null;
}

/**
 * Determine if an emergency direction conflicts with the current signal phase
 * (i.e., requires a signal change)
 */
export function requiresPhaseChange(currentPhase, emergencyDirection) {
  const greenDirs = PHASE_GREEN_DIRECTIONS[currentPhase] || [];
  return !greenDirs.includes(emergencyDirection);
}

/**
 * Get a human-readable description of a signal phase
 */
export function phaseLabel(phase) {
  const labels = {
    [SIGNAL_PHASE.NS_GREEN]: 'North-South Green',
    [SIGNAL_PHASE.EW_GREEN]: 'East-West Green',
    [SIGNAL_PHASE.NS_YELLOW]: 'North-South Clearing (Amber)',
    [SIGNAL_PHASE.EW_YELLOW]: 'East-West Clearing (Amber)',
    [SIGNAL_PHASE.ALL_RED]: 'All-Red Clearance',
    [SIGNAL_PHASE.EMERGENCY_N]: 'Emergency Priority — North',
    [SIGNAL_PHASE.EMERGENCY_S]: 'Emergency Priority — South',
    [SIGNAL_PHASE.EMERGENCY_E]: 'Emergency Priority — East',
    [SIGNAL_PHASE.EMERGENCY_W]: 'Emergency Priority — West',
  };
  return labels[phase] || phase;
}

/**
 * Determines if two emergency directions are compatible
 * (can be served simultaneously - N/S or E/W pairs only)
 */
export function areDirectionsCompatible(dir1, dir2) {
  const nsCompatible = (dir1 === 'N' && dir2 === 'S') || (dir1 === 'S' && dir2 === 'N');
  const ewCompatible = (dir1 === 'E' && dir2 === 'W') || (dir1 === 'W' && dir2 === 'E');
  return nsCompatible || ewCompatible;
}
