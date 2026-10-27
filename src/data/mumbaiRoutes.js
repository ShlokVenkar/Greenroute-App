// Mumbai Emergency Routes, Hospitals, Landmarks, and Signal Junctions

export const MUMBAI_HOSPITALS = [
  {
    id: 'kem',
    name: 'KEM Hospital & Seth GS Medical College',
    area: 'Parel, Mumbai',
    type: 'Government Apex Trauma Center',
    lat: 19.0028,
    lng: 72.8423,
    emergencyPhone: '022-24107000',
    facilities: ['Level-1 Trauma Unit', 'Cardiac ICU', 'Burns Ward'],
  },
  {
    id: 'lilavati',
    name: 'Lilavati Hospital & Research Centre',
    area: 'Bandra West, Mumbai',
    type: 'Multi-Speciality Emergency Care',
    lat: 19.0514,
    lng: 72.8285,
    emergencyPhone: '022-26751000',
    facilities: ['Interventional Cardiology', 'Neurosciences', 'Stroke Center'],
  },
  {
    id: 'tata',
    name: 'Tata Memorial Hospital',
    area: 'Parel, Mumbai',
    type: 'Specialized Oncology & Critical Care',
    lat: 19.0048,
    lng: 72.8429,
    emergencyPhone: '022-24177000',
    facilities: ['Oncology Critical Care', 'Surgical Emergency'],
  },
  {
    id: 'sion',
    name: 'Lokmanya Tilak Municipal General Hospital (Sion)',
    area: 'Sion, Mumbai',
    type: 'Major Trauma Center',
    lat: 19.0392,
    lng: 72.8617,
    emergencyPhone: '022-24076381',
    facilities: ['Trauma Center', 'Neurosurgery', 'Orthopedic Emergencies'],
  },
  {
    id: 'breach_candy',
    name: 'Breach Candy Hospital Trust',
    area: 'Bhulabhai Desai Rd, Mahalakshmi',
    type: 'Super Speciality Hospital',
    lat: 18.9715,
    lng: 72.8066,
    emergencyPhone: '022-23667788',
    facilities: ['Cardiac ICU', 'Hyperbaric Medicine', 'Emergency Wing'],
  },
];

export const MUMBAI_PICKUP_LOCATIONS = [
  { id: 'dadar_west', name: 'Dadar West (near Siddhivinayak Temple)', lat: 19.0169, lng: 72.8304 },
  { id: 'dadar_tt', name: 'Dadar TT Circle, Central Railway', lat: 19.0178, lng: 72.8478 },
  { id: 'lower_parel', name: 'Lower Parel (High Street Phoenix)', lat: 18.9953, lng: 72.8298 },
  { id: 'worli_naka', name: 'Worli Naka, Dr. Annie Besant Rd', lat: 19.0068, lng: 72.8188 },
  { id: 'bkc', name: 'Bandra Kurla Complex (BKC Diamond Bourse)', lat: 19.0657, lng: 72.8685 },
  { id: 'bandra_stn', name: 'Bandra Station West (SV Road)', lat: 19.0544, lng: 72.8402 },
  { id: 'sion_circle', name: 'Sion Circle (Dr. Ambedkar Rd)', lat: 19.0360, lng: 72.8600 },
];

export const MUMBAI_ROUTES = [
  {
    id: 'route_dadar_to_kem',
    name: 'Dadar TT ➔ KEM Hospital (Parel Corridor)',
    pickupId: 'dadar_tt',
    hospitalId: 'kem',
    totalDistanceKm: 2.4,
    estimatedNormalMinutes: 14,
    estimatedGreenRouteMinutes: 4.5,
    pathCoordinates: [
      [19.0178, 72.8478], // Dadar TT Start
      [19.0145, 72.8465], // Tilak Bridge Approach
      [19.0118, 72.8449], // Hindmata Flyover Junction
      [19.0085, 72.8438], // Chitra Cinema Crossing
      [19.0055, 72.8430], // Parel TT Junction
      [19.0028, 72.8423], // KEM Hospital Emergency Bay
    ],
    signals: [
      {
        id: 'SIG_101',
        name: 'Dadar TT Junction',
        lat: 19.0178,
        lng: 72.8478,
        road: 'Dr. Babasaheb Ambedkar Rd',
        distanceM: 0,
        normalCycleSeconds: 90,
        gpioGreenPin: 14,
        gpioYellowPin: 13,
        gpioRedPin: 12,
        currentPhase: 'GREEN',
        preempted: true,
      },
      {
        id: 'SIG_102',
        name: 'Hindmata Junction (Flyover Base)',
        lat: 19.0118,
        lng: 72.8449,
        road: 'Ambedkar Rd & Naigaon Cross Rd',
        distanceM: 650,
        normalCycleSeconds: 120,
        gpioGreenPin: 17,
        gpioYellowPin: 16,
        gpioRedPin: 15,
        currentPhase: 'RED',
        preempted: false,
      },
      {
        id: 'SIG_103',
        name: 'Chitra Junction',
        lat: 19.0085,
        lng: 72.8438,
        road: 'Ambedkar Rd & GD Ambekar Marg',
        distanceM: 1100,
        normalCycleSeconds: 75,
        gpioGreenPin: 21,
        gpioYellowPin: 19,
        gpioRedPin: 18,
        currentPhase: 'RED',
        preempted: false,
      },
      {
        id: 'SIG_104',
        name: 'Parel TT / KEM Gate Junction',
        lat: 19.0055,
        lng: 72.8430,
        road: 'Acharya Donde Marg & KEM Gate',
        distanceM: 1800,
        normalCycleSeconds: 100,
        gpioGreenPin: 27,
        gpioYellowPin: 26,
        gpioRedPin: 25,
        currentPhase: 'RED',
        preempted: false,
      },
    ],
    maneuvers: [
      { step: 1, text: 'Depart Dadar TT heading South onto Dr. Babasaheb Ambedkar Road', distanceM: 500, turn: 'straight' },
      { step: 2, text: 'Keep right on Dr. Ambedkar Road beneath Hindmata Flyover', distanceM: 650, turn: 'straight' },
      { step: 3, text: 'Proceed straight through Chitra Cinema junction — Green Corridor active', distanceM: 700, turn: 'straight' },
      { step: 4, text: 'In 200m, turn right onto Acharya Donde Marg toward KEM Trauma Care', distanceM: 350, turn: 'right' },
      { step: 5, text: 'Arrive at KEM Hospital Emergency & Trauma Casualty Gate', distanceM: 100, turn: 'arrive' },
    ],
  },
  {
    id: 'route_bkc_to_lilavati',
    name: 'BKC ➔ Lilavati Hospital (Bandra Corridor)',
    pickupId: 'bkc',
    hospitalId: 'lilavati',
    totalDistanceKm: 4.8,
    estimatedNormalMinutes: 26,
    estimatedGreenRouteMinutes: 8,
    pathCoordinates: [
      [19.0657, 72.8685], // BKC Start
      [19.0601, 72.8520], // Kalanagar Junction
      [19.0560, 72.8415], // Western Express Highway Flyover exit
      [19.0530, 72.8335], // Bandra Reclamation
      [19.0514, 72.8285], // Lilavati Hospital
    ],
    signals: [
      {
        id: 'SIG_201',
        name: 'Kalanagar Junction',
        lat: 19.0601,
        lng: 72.8520,
        road: 'BKC Connector & WEH',
        distanceM: 950,
        normalCycleSeconds: 140,
        gpioGreenPin: 14,
        gpioYellowPin: 13,
        gpioRedPin: 12,
        currentPhase: 'RED',
        preempted: false,
      },
      {
        id: 'SIG_202',
        name: 'Bandra Lucky Restaurant Junction',
        lat: 19.0560,
        lng: 72.8415,
        road: 'SV Road & Hill Road',
        distanceM: 2100,
        normalCycleSeconds: 110,
        gpioGreenPin: 27,
        gpioYellowPin: 26,
        gpioRedPin: 25,
        currentPhase: 'RED',
        preempted: false,
      },
    ],
    maneuvers: [
      { step: 1, text: 'Head west on BKC Connector towards Kalanagar', distanceM: 950, turn: 'straight' },
      { step: 2, text: 'Turn left onto Western Express Highway / Bandra Reclamation', distanceM: 1200, turn: 'left' },
      { step: 3, text: 'Take right onto KC Marg toward Lilavati Emergency entrance', distanceM: 800, turn: 'right' },
      { step: 4, text: 'Arrive at Lilavati Hospital Cardiac Emergency Bay', distanceM: 50, turn: 'arrive' },
    ],
  },
];

export const SEVERITY_CONFIG = {
  CODE_RED: {
    code: 'CODE_RED',
    name: 'Code Red — Critical (Level 1)',
    preemptionRadiusMeters: 450,
    greenDurationSeconds: 45,
    priorityRank: 1,
    color: '#ef4444',
    bgBadge: 'bg-red-500/20 text-red-400 border-red-500/40',
    description: 'Cardiac arrest, massive hemorrhage, severe trauma, stroke. All intersecting signals held red.',
  },
  CODE_AMBER: {
    code: 'CODE_AMBER',
    name: 'Code Amber — Urgent (Level 2)',
    preemptionRadiusMeters: 300,
    greenDurationSeconds: 30,
    priorityRank: 2,
    color: '#f59e0b',
    bgBadge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    description: 'Acute respiratory distress, severe compound fractures, active labor with complications.',
  },
  CODE_YELLOW: {
    code: 'CODE_YELLOW',
    name: 'Code Yellow — Moderate (Level 3)',
    preemptionRadiusMeters: 180,
    greenDurationSeconds: 20,
    priorityRank: 3,
    color: '#10b981',
    bgBadge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    description: 'Stable medical transport, non-life-threatening transfers. Signal green phase extended smoothly.',
  },
};
