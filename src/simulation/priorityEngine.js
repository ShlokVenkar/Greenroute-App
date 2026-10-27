/**
 * GreenRoute Priority Decision Engine
 * Handles multiple emergency requests, conflict resolution, and queue management.
 */

export const VEHICLE_PRIORITY = {
  'ambulance': 3,
  'fire_engine': 2,
  'police': 1,
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  VALIDATING: 'validating',
  WAITING: 'waiting',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

export const VEHICLE_LABELS = {
  ambulance: 'Ambulance',
  fire_engine: 'Fire Engine',
  police: 'Police Vehicle',
};

export const DIRECTION_LABELS = {
  N: 'North',
  S: 'South',
  E: 'East',
  W: 'West',
};

let requestCounter = 0;

export function createRequest({ vehicleType, direction, estimatedArrival, authorized }) {
  requestCounter += 1;
  return {
    id: `REQ-${String(requestCounter).padStart(3, '0')}`,
    vehicleType,
    direction,
    estimatedArrival: Number(estimatedArrival),
    authorized,
    status: REQUEST_STATUS.PENDING,
    priorityScore: authorized ? VEHICLE_PRIORITY[vehicleType] || 1 : 0,
    createdAt: Date.now(),
    priorityDecision: null,
    completedAt: null,
  };
}

export function resetRequestCounter() {
  requestCounter = 0;
}

/**
 * Priority queue selector: given pending/waiting requests, 
 * determine which to serve next.
 * 
 * Rules:
 * 1. Authorized only
 * 2. Higher vehicle priority wins
 * 3. Tie-break: earlier estimated arrival
 * 4. Tie-break: earlier creation time (FIFO)
 */
export function selectNextRequest(requests) {
  const eligible = requests.filter(r =>
    r.authorized && (r.status === REQUEST_STATUS.WAITING || r.status === REQUEST_STATUS.PENDING)
  );
  if (eligible.length === 0) return null;

  return eligible.sort((a, b) => {
    // Higher priority wins
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
    // Earlier arrival wins
    if (a.estimatedArrival !== b.estimatedArrival) return a.estimatedArrival - b.estimatedArrival;
    // Earlier creation wins
    return a.createdAt - b.createdAt;
  })[0];
}

/**
 * Generate a human-readable decision explanation
 */
export function generatePriorityDecision(request, queueLength, competingRequests) {
  const vehicleLabel = VEHICLE_LABELS[request.vehicleType] || request.vehicleType;
  const dirLabel = DIRECTION_LABELS[request.direction] || request.direction;

  if (!request.authorized) {
    return `Request rejected — authorization check failed for ${vehicleLabel} from ${dirLabel}.`;
  }

  const priorityName = request.priorityScore === 3 ? 'highest' : request.priorityScore === 2 ? 'high' : 'standard';

  if (competingRequests && competingRequests.length > 0) {
    const competing = competingRequests
      .map(r => `${VEHICLE_LABELS[r.vehicleType]} from ${DIRECTION_LABELS[r.direction]}`)
      .join(', ');
    return `${vehicleLabel} from ${dirLabel} assigned ${priorityName} priority. Competing: ${competing}. Safe sequential service will be applied.`;
  }

  if (queueLength > 1) {
    return `${vehicleLabel} from ${dirLabel} queued with ${priorityName} priority. Signal phase transition will be coordinated.`;
  }

  return `${vehicleLabel} from ${dirLabel} granted immediate ${priorityName} priority. Initiating safe signal transition sequence.`;
}
