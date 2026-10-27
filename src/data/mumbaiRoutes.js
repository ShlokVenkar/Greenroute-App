// Mumbai Emergency Routes, Hospitals, Landmarks, and Signal Junctions
// Centered around Vidyalankar Polytechnic, Wadala (East) & Apex Mumbai Hospitals
// NOTE: All coordinates follow real paved street driving paths (OSRM / OpenStreetMap road network)

export const MUMBAI_HOSPITALS = [
  {
    id: 'sion',
    name: 'Lokmanya Tilak Municipal General Hospital (Sion)',
    shortName: 'Sion Hospital Apex Trauma',
    area: 'Sion West, Mumbai (Nearest to Vidyalankar)',
    type: 'Major Municipal Level-1 Apex Trauma Center',
    lat: 19.0392,
    lng: 72.8617,
    emergencyPhone: '022-24076381',
    facilities: ['Level-1 Trauma Unit', 'Neurosurgery ICU', 'Pediatric Emergency', '24x7 Blood Bank'],
    etaDefaultMins: 4.8,
  },
  {
    id: 'somaiya',
    name: 'K. J. Somaiya Hospital & Research Centre',
    shortName: 'Somaiya Hospital, Sion',
    area: 'Somaiya Ayurvihar Complex, Sion (East), Mumbai',
    type: 'Multi-Speciality Tertiary Hospital',
    lat: 19.0490,
    lng: 72.8720,
    emergencyPhone: '022-50954700',
    facilities: ['24x7 Emergency Casualty', 'Cardiac ICU', 'Trauma Unit'],
    etaDefaultMins: 5.5,
  },
  {
    id: 'kem',
    name: 'KEM Hospital & Seth GS Medical College',
    shortName: 'KEM Hospital, Parel',
    area: 'Acharya Donde Marg, Parel, Mumbai',
    type: 'Government Apex Trauma Center (Level-1)',
    lat: 19.0028,
    lng: 72.8423,
    emergencyPhone: '022-24107000',
    facilities: ['Level-1 Trauma Unit', 'Cardiac ICU', 'Burns Ward', 'Blood Bank'],
    etaDefaultMins: 7.5,
  },
  {
    id: 'tata',
    name: 'Tata Memorial Hospital',
    shortName: 'Tata Memorial, Parel',
    area: 'Dr. E Borges Road, Parel, Mumbai',
    type: 'Specialized Critical Care & Oncology',
    lat: 19.0048,
    lng: 72.8429,
    emergencyPhone: '022-24177000',
    facilities: ['Oncology Critical Care', 'Surgical Emergency', 'ICU'],
    etaDefaultMins: 7.0,
  },
  {
    id: 'lilavati',
    name: 'Lilavati Hospital & Research Centre',
    shortName: 'Lilavati Hospital, Bandra',
    area: 'A-791, Bandra Reclamation, Bandra West',
    type: 'Multi-Speciality Emergency & Trauma Care',
    lat: 19.0514,
    lng: 72.8285,
    emergencyPhone: '022-26751000',
    facilities: ['Interventional Cardiology', 'Neurosciences', 'Stroke Center'],
    etaDefaultMins: 11,
  },
  {
    id: 'hinduja',
    name: 'P. D. Hinduja National Hospital',
    shortName: 'Hinduja Hospital, Mahim',
    area: 'Veer Savarkar Marg, Mahim West',
    type: 'Tertiary Emergency Care',
    lat: 19.0330,
    lng: 72.8395,
    emergencyPhone: '022-24451515',
    facilities: ['Accident & Emergency', 'Cardiac Center', 'ICU'],
    etaDefaultMins: 8.5,
  },
  {
    id: 'breach_candy',
    name: 'Breach Candy Hospital Trust',
    shortName: 'Breach Candy Hospital',
    area: '60 A, Bhulabhai Desai Marg, Mahalakshmi',
    type: 'Super Speciality Emergency Wing',
    lat: 18.9715,
    lng: 72.8066,
    emergencyPhone: '022-23667788',
    facilities: ['Cardiac ICU', 'Hyperbaric Medicine', '24x7 Casualty'],
    etaDefaultMins: 14,
  },
];

export const MUMBAI_PICKUP_LOCATIONS = [
  {
    id: 'vidyalankar_polytechnic',
    name: 'Vidyalankar Polytechnic Campus, Wadala (East)',
    shortName: 'Vidyalankar Polytechnic',
    lat: 19.022183,
    lng: 72.868362,
    area: 'Vidyalankar College Rd, Sangam Nagar, Wadala East, Mumbai 400037',
  },
  { id: 'dadar_tt', name: 'Dadar TT Circle, Central Railway', lat: 19.0178, lng: 72.8478 },
  { id: 'sion_circle', name: 'Sion Circle (Dr. Ambedkar Rd)', lat: 19.0421, lng: 72.8641 },
  { id: 'dadar_west', name: 'Dadar West (near Siddhivinayak Temple)', lat: 19.0169, lng: 72.8304 },
  { id: 'bkc', name: 'Bandra Kurla Complex (BKC Diamond Bourse)', lat: 19.0657, lng: 72.8685 },
  { id: 'lower_parel', name: 'Lower Parel (High Street Phoenix)', lat: 18.9953, lng: 72.8298 },
  { id: 'worli_naka', name: 'Worli Naka, Dr. Annie Besant Rd', lat: 19.0068, lng: 72.8188 },
];

export const MUMBAI_ROUTES = [
  // ─── Primary Route: Vidyalankar Polytechnic ➔ Sion Hospital (Real Street Geometry) ───
  {
    id: 'route_vidyalankar_to_sion',
    name: 'Vidyalankar Polytechnic ➔ Sion Hospital (Trauma Center)',
    pickupId: 'vidyalankar_polytechnic',
    hospitalId: 'sion',
    totalDistanceKm: 3.7,
    estimatedNormalMinutes: 16,
    estimatedGreenRouteMinutes: 4.8,
    pathCoordinates: [
  [
    19.022183,
    72.868362
  ],
  [
    19.021834,
    72.868322
  ],
  [
    19.021772,
    72.868311
  ],
  [
    19.021713,
    72.868304
  ],
  [
    19.021752,
    72.868073
  ],
  [
    19.021827,
    72.867616
  ],
  [
    19.021835,
    72.867566
  ],
  [
    19.021837,
    72.867553
  ],
  [
    19.021933,
    72.867011
  ],
  [
    19.021941,
    72.866965
  ],
  [
    19.021959,
    72.866814
  ],
  [
    19.021992,
    72.866547
  ],
  [
    19.021993,
    72.866508
  ],
  [
    19.022016,
    72.86628
  ],
  [
    19.022018,
    72.866189
  ],
  [
    19.022073,
    72.866187
  ],
  [
    19.022167,
    72.866157
  ],
  [
    19.022249,
    72.866158
  ],
  [
    19.02233,
    72.866088
  ],
  [
    19.02237,
    72.866065
  ],
  [
    19.022437,
    72.866026
  ],
  [
    19.022507,
    72.866001
  ],
  [
    19.022579,
    72.865993
  ],
  [
    19.022917,
    72.865982
  ],
  [
    19.023046,
    72.865995
  ],
  [
    19.023133,
    72.866004
  ],
  [
    19.02387,
    72.86608
  ],
  [
    19.023924,
    72.866081
  ],
  [
    19.023965,
    72.866085
  ],
  [
    19.024153,
    72.866104
  ],
  [
    19.024229,
    72.86611
  ],
  [
    19.024635,
    72.866145
  ],
  [
    19.025237,
    72.866139
  ],
  [
    19.025311,
    72.866129
  ],
  [
    19.025541,
    72.866117
  ],
  [
    19.025676,
    72.86611
  ],
  [
    19.025799,
    72.86611
  ],
  [
    19.025902,
    72.866062
  ],
  [
    19.026172,
    72.866121
  ],
  [
    19.026229,
    72.866134
  ],
  [
    19.026331,
    72.866161
  ],
  [
    19.026371,
    72.866172
  ],
  [
    19.026498,
    72.866207
  ],
  [
    19.02678,
    72.866332
  ],
  [
    19.027157,
    72.86651
  ],
  [
    19.027182,
    72.866522
  ],
  [
    19.027328,
    72.866564
  ],
  [
    19.027433,
    72.866565
  ],
  [
    19.027591,
    72.866547
  ],
  [
    19.027979,
    72.866451
  ],
  [
    19.028331,
    72.86637
  ],
  [
    19.028352,
    72.866365
  ],
  [
    19.028418,
    72.866357
  ],
  [
    19.02858,
    72.866339
  ],
  [
    19.028746,
    72.866361
  ],
  [
    19.028904,
    72.866409
  ],
  [
    19.029124,
    72.866507
  ],
  [
    19.029549,
    72.86669
  ],
  [
    19.029608,
    72.866704
  ],
  [
    19.03043,
    72.866957
  ],
  [
    19.030547,
    72.866987
  ],
  [
    19.030858,
    72.867068
  ],
  [
    19.030958,
    72.86708
  ],
  [
    19.031234,
    72.867114
  ],
  [
    19.03127,
    72.86711
  ],
  [
    19.031493,
    72.867082
  ],
  [
    19.031601,
    72.867068
  ],
  [
    19.031609,
    72.867066
  ],
  [
    19.031975,
    72.86697
  ],
  [
    19.032676,
    72.866709
  ],
  [
    19.033319,
    72.86647
  ],
  [
    19.033433,
    72.866438
  ],
  [
    19.033474,
    72.866439
  ],
  [
    19.033518,
    72.86644
  ],
  [
    19.033812,
    72.866513
  ],
  [
    19.034117,
    72.866696
  ],
  [
    19.034482,
    72.866883
  ],
  [
    19.034517,
    72.866901
  ],
  [
    19.035387,
    72.867371
  ],
  [
    19.035854,
    72.86766
  ],
  [
    19.036051,
    72.867793
  ],
  [
    19.036527,
    72.868129
  ],
  [
    19.036707,
    72.868315
  ],
  [
    19.036915,
    72.867841
  ],
  [
    19.036932,
    72.867803
  ],
  [
    19.036935,
    72.867793
  ],
  [
    19.036966,
    72.867702
  ],
  [
    19.037175,
    72.867202
  ],
  [
    19.037367,
    72.866755
  ],
  [
    19.037411,
    72.86663
  ],
  [
    19.037432,
    72.866546
  ],
  [
    19.037448,
    72.866411
  ],
  [
    19.037463,
    72.866177
  ],
  [
    19.037427,
    72.865866
  ],
  [
    19.037436,
    72.865708
  ],
  [
    19.037452,
    72.865492
  ],
  [
    19.037447,
    72.865169
  ],
  [
    19.037454,
    72.864673
  ],
  [
    19.037459,
    72.864322
  ],
  [
    19.037421,
    72.864267
  ],
  [
    19.037422,
    72.864184
  ],
  [
    19.037434,
    72.863688
  ],
  [
    19.037493,
    72.863164
  ],
  [
    19.0375,
    72.863104
  ],
  [
    19.037534,
    72.862909
  ],
  [
    19.037548,
    72.862833
  ],
  [
    19.037568,
    72.862701
  ],
  [
    19.037666,
    72.862742
  ],
  [
    19.037951,
    72.862968
  ],
  [
    19.038287,
    72.863282
  ],
  [
    19.038604,
    72.86359
  ],
  [
    19.039027,
    72.863967
  ],
  [
    19.039551,
    72.864432
  ],
  [
    19.039713,
    72.864575
  ],
  [
    19.039733,
    72.864593
  ],
  [
    19.040294,
    72.865091
  ],
  [
    19.040439,
    72.865219
  ],
  [
    19.040873,
    72.865605
  ],
  [
    19.040919,
    72.865686
  ],
  [
    19.041341,
    72.86518
  ],
  [
    19.041398,
    72.865112
  ],
  [
    19.041568,
    72.864909
  ],
  [
    19.0418,
    72.864634
  ],
  [
    19.041971,
    72.864465
  ],
  [
    19.04207,
    72.86434
  ],
  [
    19.042185,
    72.864138
  ],
  [
    19.042123,
    72.864027
  ],
  [
    19.042093,
    72.863902
  ],
  [
    19.042096,
    72.863836
  ],
  [
    19.042099,
    72.863774
  ],
  [
    19.042034,
    72.86369
  ],
  [
    19.041943,
    72.863617
  ],
  [
    19.041684,
    72.863432
  ],
  [
    19.040675,
    72.862713
  ],
  [
    19.040632,
    72.862682
  ],
  [
    19.040465,
    72.862564
  ],
  [
    19.040428,
    72.862537
  ],
  [
    19.040289,
    72.862438
  ],
  [
    19.040263,
    72.862411
  ],
  [
    19.040082,
    72.862223
  ],
  [
    19.040052,
    72.862206
  ],
  [
    19.039633,
    72.86197
  ],
  [
    19.039225,
    72.861741
  ],
  [
    19.03919,
    72.861725
  ]
],
    signals: [
      {
        id: 'SIG_VP01',
        name: 'Vidyalankar Campus Junction',
        lat: 19.024229,
        lng: 72.866110,
        road: 'Vidyalankar College Rd & Antop Hill Link',
        distanceM: 0,
        normalCycleSeconds: 70,
        gpioGreenPin: 14,
        gpioYellowPin: 13,
        gpioRedPin: 12,
        currentPhase: 'GREEN',
        preempted: true,
      },
      {
        id: 'SIG_VP02',
        name: 'Antop Hill Church Junction',
        lat: 19.027182,
        lng: 72.866522,
        road: 'Barkat Ali Dargah Marg',
        distanceM: 520,
        normalCycleSeconds: 90,
        gpioGreenPin: 17,
        gpioYellowPin: 16,
        gpioRedPin: 15,
        currentPhase: 'RED',
        preempted: false,
      },
      {
        id: 'SIG_VP03',
        name: 'GTB Nagar Crossing',
        lat: 19.034517,
        lng: 72.866901,
        road: 'Korba Mithagar & Sion Koliwada Rd',
        distanceM: 1350,
        normalCycleSeconds: 100,
        gpioGreenPin: 21,
        gpioYellowPin: 19,
        gpioRedPin: 18,
        currentPhase: 'RED',
        preempted: false,
      },
      {
        id: 'SIG_VP04',
        name: 'Sion Circle Junction',
        lat: 19.042185,
        lng: 72.864138,
        road: 'Dr. Babasaheb Ambedkar Rd & Sion Flyover',
        distanceM: 2100,
        normalCycleSeconds: 120,
        gpioGreenPin: 27,
        gpioYellowPin: 26,
        gpioRedPin: 25,
        currentPhase: 'RED',
        preempted: false,
      },
    ],
    maneuvers: [
      { step: 1, text: 'Depart Vidyalankar Polytechnic Campus heading North on Vidyalankar College Road', distanceM: 300, turn: 'straight' },
      { step: 2, text: 'Turn right at Antop Hill Church Junction onto M Ambedkar Marg — Green Wave Active', distanceM: 520, turn: 'right' },
      { step: 3, text: 'Proceed along Korba Mithagar Road towards GTB Nagar', distanceM: 800, turn: 'straight' },
      { step: 4, text: 'Follow Road No 29 in Sion East straight towards Sion Circle', distanceM: 750, turn: 'straight' },
      { step: 5, text: 'At Sion Circle rotary, exit onto Laxmibai Kelkar Marg to Sion Hospital', distanceM: 350, turn: 'right' },
      { step: 6, text: 'Arrive at Lokmanya Tilak Sion Hospital Emergency Trauma Casualty Gate', distanceM: 80, turn: 'arrive' },
    ],
  },

  // ─── Route 2: Vidyalankar Polytechnic ➔ Somaiya Hospital (Real Street Geometry) ───
  {
    id: 'route_vidyalankar_to_somaiya',
    name: 'Vidyalankar Polytechnic ➔ Somaiya Hospital (Sion East)',
    pickupId: 'vidyalankar_polytechnic',
    hospitalId: 'somaiya',
    totalDistanceKm: 5.4,
    estimatedNormalMinutes: 20,
    estimatedGreenRouteMinutes: 5.5,
    pathCoordinates: [
  [
    19.022183,
    72.868362
  ],
  [
    19.021834,
    72.868322
  ],
  [
    19.021772,
    72.868311
  ],
  [
    19.021713,
    72.868304
  ],
  [
    19.021752,
    72.868073
  ],
  [
    19.021827,
    72.867616
  ],
  [
    19.021835,
    72.867566
  ],
  [
    19.021837,
    72.867553
  ],
  [
    19.021933,
    72.867011
  ],
  [
    19.021941,
    72.866965
  ],
  [
    19.021959,
    72.866814
  ],
  [
    19.021992,
    72.866547
  ],
  [
    19.021993,
    72.866508
  ],
  [
    19.022016,
    72.86628
  ],
  [
    19.022018,
    72.866189
  ],
  [
    19.022073,
    72.866187
  ],
  [
    19.022167,
    72.866157
  ],
  [
    19.022249,
    72.866158
  ],
  [
    19.02233,
    72.866088
  ],
  [
    19.02237,
    72.866065
  ],
  [
    19.022437,
    72.866026
  ],
  [
    19.022507,
    72.866001
  ],
  [
    19.022579,
    72.865993
  ],
  [
    19.022917,
    72.865982
  ],
  [
    19.023046,
    72.865995
  ],
  [
    19.023133,
    72.866004
  ],
  [
    19.02387,
    72.86608
  ],
  [
    19.023924,
    72.866081
  ],
  [
    19.023965,
    72.866085
  ],
  [
    19.024153,
    72.866104
  ],
  [
    19.024229,
    72.86611
  ],
  [
    19.024635,
    72.866145
  ],
  [
    19.025237,
    72.866139
  ],
  [
    19.025311,
    72.866129
  ],
  [
    19.025541,
    72.866117
  ],
  [
    19.025676,
    72.86611
  ],
  [
    19.025799,
    72.86611
  ],
  [
    19.025902,
    72.866062
  ],
  [
    19.026172,
    72.866121
  ],
  [
    19.026229,
    72.866134
  ],
  [
    19.026331,
    72.866161
  ],
  [
    19.026371,
    72.866172
  ],
  [
    19.026498,
    72.866207
  ],
  [
    19.02678,
    72.866332
  ],
  [
    19.027157,
    72.86651
  ],
  [
    19.027182,
    72.866522
  ],
  [
    19.027328,
    72.866564
  ],
  [
    19.027433,
    72.866565
  ],
  [
    19.027591,
    72.866547
  ],
  [
    19.027979,
    72.866451
  ],
  [
    19.028331,
    72.86637
  ],
  [
    19.028352,
    72.866365
  ],
  [
    19.028418,
    72.866357
  ],
  [
    19.02858,
    72.866339
  ],
  [
    19.028746,
    72.866361
  ],
  [
    19.028904,
    72.866409
  ],
  [
    19.029124,
    72.866507
  ],
  [
    19.029549,
    72.86669
  ],
  [
    19.029608,
    72.866704
  ],
  [
    19.03043,
    72.866957
  ],
  [
    19.030547,
    72.866987
  ],
  [
    19.030858,
    72.867068
  ],
  [
    19.030958,
    72.86708
  ],
  [
    19.031234,
    72.867114
  ],
  [
    19.03127,
    72.86711
  ],
  [
    19.031493,
    72.867082
  ],
  [
    19.031601,
    72.867068
  ],
  [
    19.031609,
    72.867066
  ],
  [
    19.031975,
    72.86697
  ],
  [
    19.032676,
    72.866709
  ],
  [
    19.033319,
    72.86647
  ],
  [
    19.033433,
    72.866438
  ],
  [
    19.033474,
    72.866439
  ],
  [
    19.033518,
    72.86644
  ],
  [
    19.033812,
    72.866513
  ],
  [
    19.034117,
    72.866696
  ],
  [
    19.034482,
    72.866883
  ],
  [
    19.034517,
    72.866901
  ],
  [
    19.035387,
    72.867371
  ],
  [
    19.035854,
    72.86766
  ],
  [
    19.036051,
    72.867793
  ],
  [
    19.036527,
    72.868129
  ],
  [
    19.036707,
    72.868315
  ],
  [
    19.036732,
    72.86901
  ],
  [
    19.036739,
    72.869108
  ],
  [
    19.036742,
    72.869257
  ],
  [
    19.036744,
    72.869447
  ],
  [
    19.036749,
    72.870381
  ],
  [
    19.036755,
    72.871302
  ],
  [
    19.036766,
    72.871974
  ],
  [
    19.036763,
    72.872166
  ],
  [
    19.036763,
    72.872831
  ],
  [
    19.036768,
    72.873195
  ],
  [
    19.036775,
    72.873992
  ],
  [
    19.036923,
    72.87399
  ],
  [
    19.037294,
    72.873986
  ],
  [
    19.037635,
    72.873981
  ],
  [
    19.037895,
    72.873978
  ],
  [
    19.037984,
    72.873977
  ],
  [
    19.038004,
    72.873977
  ],
  [
    19.03839,
    72.873972
  ],
  [
    19.038516,
    72.873971
  ],
  [
    19.038663,
    72.873968
  ],
  [
    19.038719,
    72.873968
  ],
  [
    19.03913,
    72.873964
  ],
  [
    19.039212,
    72.873961
  ],
  [
    19.039515,
    72.873958
  ],
  [
    19.039928,
    72.873953
  ],
  [
    19.040158,
    72.87395
  ],
  [
    19.040765,
    72.873942
  ],
  [
    19.040817,
    72.873944
  ],
  [
    19.040877,
    72.873958
  ],
  [
    19.040922,
    72.873981
  ],
  [
    19.04097,
    72.874023
  ],
  [
    19.041008,
    72.874081
  ],
  [
    19.041236,
    72.874672
  ],
  [
    19.041394,
    72.87511
  ],
  [
    19.041746,
    72.876094
  ],
  [
    19.042502,
    72.878193
  ],
  [
    19.042896,
    72.87926
  ],
  [
    19.043234,
    72.879224
  ],
  [
    19.044064,
    72.87909
  ],
  [
    19.044318,
    72.879063
  ],
  [
    19.044427,
    72.879046
  ],
  [
    19.044532,
    72.879018
  ],
  [
    19.046293,
    72.878371
  ],
  [
    19.046693,
    72.878257
  ],
  [
    19.047137,
    72.878112
  ],
  [
    19.047205,
    72.87809
  ],
  [
    19.047352,
    72.878089
  ],
  [
    19.047435,
    72.878067
  ],
  [
    19.047579,
    72.878022
  ],
  [
    19.047637,
    72.878003
  ],
  [
    19.047649,
    72.878
  ],
  [
    19.047797,
    72.877958
  ],
  [
    19.047944,
    72.877915
  ],
  [
    19.048154,
    72.877855
  ],
  [
    19.048278,
    72.877811
  ],
  [
    19.048344,
    72.877788
  ],
  [
    19.048609,
    72.877684
  ],
  [
    19.04957,
    72.877314
  ],
  [
    19.04971,
    72.877268
  ],
  [
    19.049813,
    72.877246
  ],
  [
    19.049864,
    72.877235
  ],
  [
    19.049936,
    72.877228
  ],
  [
    19.05004,
    72.87722
  ],
  [
    19.05016,
    72.877134
  ],
  [
    19.050371,
    72.877083
  ],
  [
    19.050456,
    72.877074
  ],
  [
    19.050537,
    72.877077
  ],
  [
    19.050624,
    72.87709
  ],
  [
    19.050688,
    72.877113
  ],
  [
    19.050765,
    72.87715
  ],
  [
    19.050931,
    72.877273
  ],
  [
    19.050992,
    72.877339
  ],
  [
    19.05105,
    72.877408
  ],
  [
    19.051115,
    72.87751
  ],
  [
    19.051157,
    72.877562
  ],
  [
    19.051218,
    72.877605
  ],
  [
    19.051328,
    72.877666
  ],
  [
    19.051419,
    72.877656
  ],
  [
    19.051498,
    72.877632
  ],
  [
    19.051631,
    72.877574
  ],
  [
    19.051536,
    72.877313
  ],
  [
    19.050638,
    72.874852
  ],
  [
    19.050426,
    72.874312
  ],
  [
    19.050349,
    72.8741
  ],
  [
    19.050324,
    72.874033
  ],
  [
    19.050117,
    72.873505
  ],
  [
    19.05002,
    72.873545
  ],
  [
    19.05,
    72.873485
  ],
  [
    19.049974,
    72.873416
  ],
  [
    19.049337,
    72.871678
  ],
  [
    19.049264,
    72.87171
  ],
  [
    19.049222,
    72.871729
  ],
  [
    19.048907,
    72.871869
  ],
  [
    19.048964,
    72.872016
  ]
],
    signals: [
      {
        id: 'SIG_VP01',
        name: 'Vidyalankar Campus Junction',
        lat: 19.024229,
        lng: 72.866110,
        road: 'Vidyalankar College Rd & Antop Hill Link',
        distanceM: 0,
        normalCycleSeconds: 70,
        gpioGreenPin: 14,
        gpioYellowPin: 13,
        gpioRedPin: 12,
        currentPhase: 'GREEN',
        preempted: true,
      },
      {
        id: 'SIG_SOM01',
        name: 'Eastern Express Highway Junction',
        lat: 19.036775,
        lng: 72.873992,
        road: 'Eastern Express Highway',
        distanceM: 1800,
        normalCycleSeconds: 90,
        gpioGreenPin: 17,
        gpioYellowPin: 16,
        gpioRedPin: 15,
        currentPhase: 'RED',
        preempted: false,
      },
      {
        id: 'SIG_SOM02',
        name: 'Somaiya Ayurvihar Gate Crossing',
        lat: 19.049570,
        lng: 72.877314,
        road: 'Ayurvihar Complex Marg',
        distanceM: 3400,
        normalCycleSeconds: 80,
        gpioGreenPin: 21,
        gpioYellowPin: 19,
        gpioRedPin: 18,
        currentPhase: 'RED',
        preempted: false,
      },
    ],
    maneuvers: [
      { step: 1, text: 'Depart Vidyalankar Polytechnic onto Vidyalankar College Road', distanceM: 300, turn: 'straight' },
      { step: 2, text: 'Head North towards Eastern Express Highway connector', distanceM: 1500, turn: 'straight' },
      { step: 3, text: 'Merge onto Eastern Express Highway corridor — Green Wave Active', distanceM: 2000, turn: 'right' },
      { step: 4, text: 'Turn left into Somaiya Ayurvihar Complex Gate towards Hospital Casualty', distanceM: 400, turn: 'left' },
      { step: 5, text: 'Arrive at K. J. Somaiya Hospital & Research Centre Emergency Wing', distanceM: 100, turn: 'arrive' },
    ],
  },

  // ─── Route 3: Vidyalankar Polytechnic ➔ KEM Hospital (Parel) (Real Street Geometry) ───
  {
    id: 'route_vidyalankar_to_kem',
    name: 'Vidyalankar Polytechnic ➔ KEM Hospital (Parel)',
    pickupId: 'vidyalankar_polytechnic',
    hospitalId: 'kem',
    totalDistanceKm: 4.5,
    estimatedNormalMinutes: 24,
    estimatedGreenRouteMinutes: 7.2,
    pathCoordinates: [
  [
    19.022183,
    72.868362
  ],
  [
    19.021834,
    72.868322
  ],
  [
    19.021772,
    72.868311
  ],
  [
    19.021713,
    72.868304
  ],
  [
    19.021752,
    72.868073
  ],
  [
    19.021827,
    72.867616
  ],
  [
    19.021835,
    72.867566
  ],
  [
    19.021837,
    72.867553
  ],
  [
    19.021933,
    72.867011
  ],
  [
    19.021941,
    72.866965
  ],
  [
    19.021959,
    72.866814
  ],
  [
    19.021992,
    72.866547
  ],
  [
    19.021993,
    72.866508
  ],
  [
    19.022016,
    72.86628
  ],
  [
    19.021664,
    72.86625
  ],
  [
    19.021482,
    72.866221
  ],
  [
    19.021214,
    72.86615
  ],
  [
    19.020534,
    72.865945
  ],
  [
    19.020435,
    72.865915
  ],
  [
    19.020193,
    72.865845
  ],
  [
    19.01996,
    72.865769
  ],
  [
    19.019622,
    72.86568
  ],
  [
    19.019443,
    72.865643
  ],
  [
    19.019423,
    72.865639
  ],
  [
    19.019284,
    72.865612
  ],
  [
    19.018927,
    72.865585
  ],
  [
    19.018701,
    72.865568
  ],
  [
    19.018386,
    72.865544
  ],
  [
    19.018379,
    72.865532
  ],
  [
    19.018343,
    72.8655
  ],
  [
    19.018291,
    72.865475
  ],
  [
    19.018253,
    72.865459
  ],
  [
    19.017753,
    72.865293
  ],
  [
    19.017357,
    72.865082
  ],
  [
    19.01726,
    72.864928
  ],
  [
    19.017256,
    72.864776
  ],
  [
    19.017293,
    72.864393
  ],
  [
    19.017345,
    72.864295
  ],
  [
    19.017416,
    72.864247
  ],
  [
    19.018282,
    72.863831
  ],
  [
    19.018396,
    72.86374
  ],
  [
    19.018409,
    72.863659
  ],
  [
    19.018412,
    72.863638
  ],
  [
    19.018433,
    72.863539
  ],
  [
    19.018467,
    72.86338
  ],
  [
    19.018548,
    72.862652
  ],
  [
    19.018769,
    72.85974
  ],
  [
    19.018833,
    72.858997
  ],
  [
    19.018898,
    72.858115
  ],
  [
    19.018919,
    72.857796
  ],
  [
    19.018926,
    72.857721
  ],
  [
    19.018944,
    72.857522
  ],
  [
    19.018967,
    72.857407
  ],
  [
    19.019018,
    72.857313
  ],
  [
    19.01935,
    72.856835
  ],
  [
    19.019434,
    72.856599
  ],
  [
    19.019535,
    72.856275
  ],
  [
    19.019436,
    72.856219
  ],
  [
    19.019335,
    72.856168
  ],
  [
    19.01887,
    72.855905
  ],
  [
    19.018849,
    72.855916
  ],
  [
    19.018825,
    72.85592
  ],
  [
    19.018801,
    72.855917
  ],
  [
    19.01876,
    72.855894
  ],
  [
    19.018748,
    72.855869
  ],
  [
    19.018741,
    72.855845
  ],
  [
    19.018604,
    72.855729
  ],
  [
    19.018527,
    72.855639
  ],
  [
    19.018476,
    72.855575
  ],
  [
    19.018288,
    72.855338
  ],
  [
    19.01821,
    72.85524
  ],
  [
    19.018019,
    72.854875
  ],
  [
    19.017736,
    72.854342
  ],
  [
    19.017419,
    72.853778
  ],
  [
    19.017057,
    72.853271
  ],
  [
    19.016995,
    72.853186
  ],
  [
    19.016968,
    72.853153
  ],
  [
    19.016786,
    72.852907
  ],
  [
    19.016648,
    72.852722
  ],
  [
    19.01657,
    72.852633
  ],
  [
    19.016228,
    72.852243
  ],
  [
    19.016152,
    72.852153
  ],
  [
    19.015991,
    72.851975
  ],
  [
    19.015695,
    72.851676
  ],
  [
    19.015499,
    72.851482
  ],
  [
    19.015459,
    72.851439
  ],
  [
    19.01526,
    72.851241
  ],
  [
    19.015142,
    72.851106
  ],
  [
    19.01497,
    72.85094
  ],
  [
    19.014654,
    72.850662
  ],
  [
    19.01443,
    72.850488
  ],
  [
    19.014056,
    72.850253
  ],
  [
    19.013958,
    72.850191
  ],
  [
    19.013665,
    72.849988
  ],
  [
    19.013332,
    72.849778
  ],
  [
    19.013196,
    72.849687
  ],
  [
    19.01315,
    72.849657
  ],
  [
    19.012649,
    72.849339
  ],
  [
    19.012573,
    72.849301
  ],
  [
    19.011906,
    72.848971
  ],
  [
    19.011865,
    72.84895
  ],
  [
    19.01104,
    72.84858
  ],
  [
    19.011015,
    72.848569
  ],
  [
    19.010456,
    72.848339
  ],
  [
    19.010397,
    72.848313
  ],
  [
    19.010208,
    72.848232
  ],
  [
    19.009577,
    72.847967
  ],
  [
    19.009135,
    72.847782
  ],
  [
    19.008842,
    72.84766
  ],
  [
    19.008764,
    72.847628
  ],
  [
    19.008337,
    72.847424
  ],
  [
    19.008142,
    72.847328
  ],
  [
    19.007977,
    72.847285
  ],
  [
    19.007674,
    72.847256
  ],
  [
    19.007258,
    72.84719
  ],
  [
    19.007081,
    72.847145
  ],
  [
    19.006951,
    72.847109
  ],
  [
    19.006834,
    72.847064
  ],
  [
    19.006474,
    72.846852
  ],
  [
    19.006272,
    72.846676
  ],
  [
    19.006208,
    72.846619
  ],
  [
    19.006106,
    72.846531
  ],
  [
    19.005845,
    72.846261
  ],
  [
    19.005782,
    72.846141
  ],
  [
    19.005739,
    72.845996
  ],
  [
    19.00557,
    72.845285
  ],
  [
    19.005551,
    72.845214
  ],
  [
    19.005438,
    72.844796
  ],
  [
    19.005352,
    72.844588
  ],
  [
    19.005218,
    72.844309
  ],
  [
    19.005094,
    72.844141
  ],
  [
    19.005045,
    72.844072
  ],
  [
    19.004931,
    72.843926
  ],
  [
    19.004628,
    72.843502
  ],
  [
    19.004352,
    72.843101
  ],
  [
    19.004101,
    72.842737
  ],
  [
    19.003596,
    72.842037
  ],
  [
    19.003571,
    72.84204
  ],
  [
    19.003242,
    72.842282
  ],
  [
    19.003201,
    72.842331
  ],
  [
    19.00289,
    72.842701
  ],
  [
    19.002775,
    72.842827
  ],
  [
    19.002729,
    72.842772
  ],
  [
    19.002838,
    72.842653
  ],
  [
    19.003095,
    72.842346
  ],
  [
    19.002998,
    72.842257
  ]
],
    signals: [
      {
        id: 'SIG_VK01',
        name: 'Wadala Bridge Junction',
        lat: 19.018548,
        lng: 72.862652,
        road: 'Wadala Flyover & Rafi Ahmed Kidwai Marg',
        distanceM: 750,
        normalCycleSeconds: 90,
        gpioGreenPin: 14,
        gpioYellowPin: 13,
        gpioRedPin: 12,
        currentPhase: 'RED',
        preempted: false,
      },
      {
        id: 'SIG_101',
        name: 'Dadar TT Junction',
        lat: 19.017416,
        lng: 72.854342,
        road: 'Dr. Babasaheb Ambedkar Rd',
        distanceM: 1900,
        normalCycleSeconds: 90,
        gpioGreenPin: 17,
        gpioYellowPin: 16,
        gpioRedPin: 15,
        currentPhase: 'RED',
        preempted: false,
      },
      {
        id: 'SIG_104',
        name: 'Parel TT / KEM Gate',
        lat: 19.005551,
        lng: 72.845214,
        road: 'Acharya Donde Marg',
        distanceM: 3600,
        normalCycleSeconds: 100,
        gpioGreenPin: 27,
        gpioYellowPin: 26,
        gpioRedPin: 25,
        currentPhase: 'RED',
        preempted: false,
      },
    ],
    maneuvers: [
      { step: 1, text: 'Depart Vidyalankar Polytechnic heading South towards Wadala Station', distanceM: 750, turn: 'straight' },
      { step: 2, text: 'Cross Wadala Railway Overbridge onto Dadar Road', distanceM: 1150, turn: 'right' },
      { step: 3, text: 'Merge South onto Dr. Babasaheb Ambedkar Road past Hindmata', distanceM: 1400, turn: 'straight' },
      { step: 4, text: 'Turn right onto Acharya Donde Marg to KEM Trauma Casualty', distanceM: 800, turn: 'right' },
      { step: 5, text: 'Arrive at KEM Hospital & Seth GS Medical College Trauma Center', distanceM: 100, turn: 'arrive' },
    ],
  },
];

export const SEVERITY_CONFIG = {
  CODE_RED: {
    code: 'CODE_RED',
    name: 'High Severity — Critical Emergency',
    shortLabel: 'High (Critical)',
    priorityRank: 1,
    preemptionRadiusMeters: 500,
    greenDurationSeconds: 45,
    color: '#ef4444',
    bgBadge: 'bg-red-500/20 text-red-400 border-red-500/40',
    conditions: [
      'Heart Attack / Cardiac Arrest',
      'Severe Seizures (Status Epilepticus)',
      'Severe Trauma / Heavy Hemorrhage',
      'Brain Stroke / Unconscious Patient',
      'Cardiac Respiratory Failure',
    ],
    description: 'Life-threatening critical emergency. Immediate maximum green wave corridor; all cross-traffic held red.',
  },
  CODE_AMBER: {
    code: 'CODE_AMBER',
    name: 'Medium Severity — Urgent Care',
    shortLabel: 'Medium (Urgent)',
    priorityRank: 2,
    preemptionRadiusMeters: 300,
    greenDurationSeconds: 30,
    color: '#f59e0b',
    bgBadge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    conditions: [
      'Severe Asthma / Acute Breathing Distress',
      'Compound Bone Fractures',
      'Second/Third Degree Burns',
      'Active Labor / Complicated Pregnancy',
      'High-Grade Pediatric Fever with Spasms',
    ],
    description: 'Urgent medical condition. Signals cleared 300m in advance with dynamic green extension.',
  },
  CODE_YELLOW: {
    code: 'CODE_YELLOW',
    name: 'Low Severity — Non-Emergency / Transport',
    shortLabel: 'Low (General)',
    priorityRank: 3,
    preemptionRadiusMeters: 180,
    greenDurationSeconds: 20,
    color: '#10b981',
    bgBadge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    conditions: [
      'General Patient Transport for Check-up',
      'Routine Dialysis Transfer',
      'Stable Inter-Hospital Patient Transfer',
      'Non-Emergency OPD Visit',
      'Post-Operative Routine Discharge',
    ],
    description: 'Non-critical patient transport. Coordinated green phase without disruptive halt of city traffic.',
  },
};
