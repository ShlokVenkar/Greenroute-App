import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Navigation,
  Compass,
  MapPin,
  Building2,
  ShieldAlert,
  Radio,
  Hospital,
} from 'lucide-react';

export default function DemoMumbaiMap({
  vehicleLocation,
  vehicleHeading = 180,
  routeCoordinates = [],
  signals = [],
  hospitalLocation = [19.0028, 72.8423],
  pickupLocation = [19.0178, 72.8478],
  activeRouteName = 'Dadar ➔ KEM Hospital Corridor',
  preemptedSignalId = 'SIG_101',
  severity = 'CODE_RED',
  height = '100%',
  onSignalClick,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedSignal, setSelectedSignal] = useState(null);

  // Normalization: Map latitude/longitude to SVG viewport [100 to 700] x [100 to 500]
  // Mumbai bounding box for this corridor:
  // Lat: 19.0220 (North / Dadar) to 18.9980 (South / Parel-KEM)
  // Lng: 72.8250 (West / Worli) to 72.8600 (East / Wadala)
  const minLat = 18.9980;
  const maxLat = 19.0220;
  const minLng = 72.8250;
  const maxLng = 72.8600;

  const toSvgX = (lng) => {
    const norm = (lng - minLng) / (maxLng - minLng);
    return Math.round(80 + norm * 640);
  };

  const toSvgY = (lat) => {
    // Invert Y because SVG coordinates increase downwards
    const norm = (maxLat - lat) / (maxLat - minLat);
    return Math.round(60 + norm * 480);
  };

  // Convert route coordinates to SVG path string
  const svgPoints = routeCoordinates.map(
    (coord) => `${toSvgX(coord[1])},${toSvgY(coord[0])}`
  );
  const routePathD = svgPoints.length > 0 ? `M ${svgPoints.join(' L ')}` : '';

  // Current Vehicle Position in SVG coordinates
  const currentLat = vehicleLocation ? vehicleLocation[0] : 19.0118;
  const currentLng = vehicleLocation ? vehicleLocation[1] : 72.8449;
  const vehX = toSvgX(currentLng);
  const vehY = toSvgY(currentLat);

  // Hospital & Pickup SVG coords
  const hospX = toSvgX(hospitalLocation[1]);
  const hospY = toSvgY(hospitalLocation[0]);
  const pickX = toSvgX(pickupLocation[1]);
  const pickY = toSvgY(pickupLocation[0]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-xl select-none"
      style={{ height }}
    >
      {/* ─── Top Corridor Status Overlay ─── */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <div>
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
            Mumbai Vector Transit Map (Offline Demo)
          </div>
          <div className="text-xs font-bold text-white">{activeRouteName}</div>
        </div>
      </div>

      {/* Preemption Wave Indicator */}
      {preemptedSignalId && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-emerald-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/80 text-emerald-300 shadow-xl animate-pulse">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span className="text-[10px] font-black tracking-wider">GREEN WAVE ACTIVE</span>
        </div>
      )}

      {/* ─── Map Zoom / Re-center Controls ─── */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-xl">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 1.75))}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-[10px] transition-colors"
          title="Reset Zoom"
        >
          1x
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ─── Main Vector Map Canvas (Self-Contained Mumbai Geometry) ─── */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: `${vehX}px ${vehY}px`,
        }}
      >
        <defs>
          {/* Arabian Sea Gradient */}
          <radialGradient id="seaGrad" cx="15%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#082f49" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Mumbai Landmass Gradient */}
          <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Glowing Green Corridor Filter */}
          <filter id="corridorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Signal Halo Filter */}
          <filter id="signalGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Arabian Sea Coastline Background */}
        <rect width="800" height="600" fill="url(#seaGrad)" />

        {/* 2. Mumbai Island Landmass (South & Central Mumbai Silhouette) */}
        <path
          d="
            M 140,20
            C 180,60 210,120 220,180
            C 230,240 210,300 180,360
            C 160,400 130,440 150,520
            C 170,580 320,600 520,600
            C 720,600 780,500 780,300
            C 780,100 700,20 480,20
            Z
          "
          fill="url(#landGrad)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Mahim Bay / Worli Sea Face Water Ingress */}
        <path
          d="
            M 140,20
            C 170,80 200,160 170,240
            C 150,290 120,320 80,330
            C 50,340 0,330 0,330
            L 0,20 Z
          "
          fill="#082f49"
          opacity="0.9"
        />
        <text x="50" y="200" fill="#38bdf8" fontSize="11" fontWeight="700" opacity="0.6">
          ARABIAN SEA
        </text>
        <text x="110" y="380" fill="#38bdf8" fontSize="9" fontWeight="600" opacity="0.5">
          Worli Sea Face
        </text>

        {/* 3. Secondary City Roads Grid (Mumbai Streets) */}
        <g stroke="#334155" strokeWidth="2.5" opacity="0.45" strokeLinecap="round">
          {/* Western Railway Tracks */}
          <line x1="330" y1="40" x2="310" y2="580" stroke="#475569" strokeDasharray="4,4" strokeWidth="2" />
          <line x1="334" y1="40" x2="314" y2="580" stroke="#475569" strokeDasharray="4,4" strokeWidth="2" />

          {/* Central Railway Tracks */}
          <line x1="510" y1="40" x2="480" y2="580" stroke="#475569" strokeDasharray="4,4" strokeWidth="2" />

          {/* Senapati Bapat Marg */}
          <line x1="280" y1="60" x2="260" y2="560" />
          {/* Tilak Bridge */}
          <line x1="260" y1="120" x2="540" y2="120" strokeWidth="3" />
          {/* Naigaon Cross Road */}
          <line x1="340" y1="210" x2="620" y2="210" />
          {/* Acharya Donde Marg (Parel) */}
          <line x1="290" y1="420" x2="600" y2="420" strokeWidth="3" />
          {/* GD Ambekar Marg */}
          <line x1="420" y1="310" x2="680" y2="350" />
        </g>

        {/* Street Labels */}
        <text x="440" y="105" fill="#94a3b8" fontSize="9" fontWeight="600">Tilak Bridge</text>
        <text x="210" y="320" fill="#64748b" fontSize="8" fontWeight="600" transform="rotate(-75, 210, 320)">Senapati Bapat Marg</text>
        <text x="475" y="440" fill="#94a3b8" fontSize="9" fontWeight="600">Acharya Donde Marg ➔</text>

        {/* 4. Primary Arterial Highway: Dr. Babasaheb Ambedkar Road */}
        <path
          d="M 520,40 L 490,120 L 460,220 L 435,320 L 415,420 L 400,560"
          stroke="#1e293b"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 520,40 L 490,120 L 460,220 L 435,320 L 415,420 L 400,560"
          stroke="#475569"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Road center dash */}
        <path
          d="M 520,40 L 490,120 L 460,220 L 435,320 L 415,420 L 400,560"
          stroke="#e2e8f0"
          strokeWidth="1.5"
          strokeDasharray="8,8"
          opacity="0.7"
        />
        <text x="515" y="240" fill="#cbd5e1" fontSize="10" fontWeight="700" transform="rotate(76, 515, 240)">
          DR. BABASAHEB AMBEDKAR ROAD
        </text>

        {/* 5. Glowing Green Corridor Route Layer */}
        {routePathD && (
          <>
            {/* Outer Green Glow Wave */}
            <path
              d={routePathD}
              stroke="#10b981"
              strokeWidth="18"
              fill="none"
              opacity="0.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#corridorGlow)"
            />
            {/* Inner Emerald Fast Line with animated dash */}
            <path
              d={routePathD}
              stroke="#059669"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={routePathD}
              stroke="#34d399"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="10, 8"
              className="animate-pulse"
            />
          </>
        )}

        {/* 6. Key Mumbai Landmarks (Buildings & Icons) */}
        {/* Dadar Railway Station */}
        <g transform="translate(350, 110)">
          <rect width="24" height="18" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <text x="12" y="13" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="800">CST</text>
          <text x="12" y="28" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="600">Dadar Stn</text>
        </g>

        {/* Siddhivinayak Temple */}
        <g transform="translate(190, 160)">
          <circle cx="12" cy="12" r="10" fill="#f97316" opacity="0.2" />
          <circle cx="12" cy="12" r="6" fill="#ea580c" />
          <text x="12" y="28" textAnchor="middle" fill="#fdba74" fontSize="8" fontWeight="600">Siddhivinayak</text>
        </g>

        {/* Tata Memorial Hospital */}
        <g transform="translate(435, 460)">
          <rect width="22" height="16" rx="3" fill="#1e293b" stroke="#f43f5e" strokeWidth="1" />
          <text x="11" y="12" textAnchor="middle" fill="#f43f5e" fontSize="8" fontWeight="800">TMH</text>
          <text x="11" y="26" textAnchor="middle" fill="#f43f5e" fontSize="7" fontWeight="600">Tata Memorial</text>
        </g>

        {/* 7. Traffic Signal Junctions along the corridor */}
        {signals.map((sig) => {
          const sx = toSvgX(sig.lng);
          const sy = toSvgY(sig.lat);
          const isPreempted = sig.id === preemptedSignalId || sig.preempted;
          const isGreen = isPreempted || sig.currentPhase === 'GREEN';
          const lightColor = isGreen ? '#10b981' : '#ef4444';

          return (
            <g
              key={sig.id}
              transform={`translate(${sx}, ${sy})`}
              className="cursor-pointer transition-all hover:scale-110"
              onClick={() => {
                setSelectedSignal(sig);
                onSignalClick?.(sig);
              }}
            >
              {/* Pulsing Preemption Halo */}
              {isPreempted && (
                <circle cx="0" cy="0" r="22" fill="#10b981" opacity="0.25" className="animate-ping" />
              )}

              {/* Signal Pole Base */}
              <circle cx="0" cy="0" r="14" fill="#020617" stroke="#475569" strokeWidth="1.5" />
              {/* Status LED */}
              <circle
                cx="0"
                cy="0"
                r="7"
                fill={lightColor}
                filter="url(#signalGlow)"
              />

              {/* Junction Label Box */}
              <g transform="translate(18, -10)">
                <rect
                  x="0"
                  y="0"
                  width="110"
                  height="22"
                  rx="6"
                  fill="#0f172a"
                  stroke={isGreen ? '#10b981' : '#ef4444'}
                  strokeWidth="1.2"
                />
                <circle cx="8" cy="11" r="3" fill={lightColor} />
                <text x="16" y="14" fill="#ffffff" fontSize="9" fontWeight="700">
                  {sig.name.split(' ')[0]} {isGreen ? '🟢' : '🔴'}
                </text>
              </g>
            </g>
          );
        })}

        {/* 8. Pickup Point Marker (Dadar TT) */}
        <g transform={`translate(${pickX}, ${pickY})`}>
          <circle cx="0" cy="0" r="16" fill="#3b82f6" opacity="0.3" className="animate-ping" />
          <circle cx="0" cy="0" r="9" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill="#ffffff" />
          <g transform="translate(14, -8)">
            <rect x="0" y="0" width="84" height="18" rx="4" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
            <text x="6" y="12" fill="#ffffff" fontSize="8" fontWeight="800">PATIENT PICKUP</text>
          </g>
        </g>

        {/* 9. Destination Apex Trauma Center: KEM Hospital */}
        <g transform={`translate(${hospX}, ${hospY})`}>
          <circle cx="0" cy="0" r="22" fill="#ef4444" opacity="0.3" className="animate-pulse" />
          <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" />
          {/* Hospital Cross */}
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

          {/* Hospital Name Banner */}
          <g transform="translate(18, -12)">
            <rect x="0" y="0" width="130" height="26" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
            <text x="8" y="12" fill="#fca5a5" fontSize="8" fontWeight="800">KEM HOSPITAL</text>
            <text x="8" y="21" fill="#ffffff" fontSize="7" fontWeight="600">Emergency Casualty Gate</text>
          </g>
        </g>

        {/* 10. Moving Emergency Ambulance (GPS Heading & Strobe) */}
        <g transform={`translate(${vehX}, ${vehY})`}>
          {/* Outer Radar Ping */}
          <circle cx="0" cy="0" r="28" fill="#10b981" opacity="0.25" className="animate-ping" />

          {/* Ambulance Body Container rotated by heading */}
          <g transform={`rotate(${vehicleHeading})`}>
            {/* Shadow */}
            <ellipse cx="0" cy="2" rx="14" ry="20" fill="#000000" opacity="0.5" />

            {/* Vehicle Base Shell */}
            <rect x="-11" y="-18" width="22" height="36" rx="6" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />

            {/* Windshield */}
            <rect x="-8" y="-14" width="16" height="7" rx="2" fill="#0284c7" />

            {/* Red Siren Strobe Light */}
            <circle cx="0" cy="-3" r="3.5" fill="#ef4444" className="animate-pulse" />

            {/* Red Cross on Roof */}
            <line x1="0" y1="4" x2="0" y2="12" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-4" y1="8" x2="4" y2="8" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* SOS Beacon Badge */}
          <g transform="translate(16, -18)">
            <rect x="0" y="0" width="70" height="18" rx="4" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
            <text x="5" y="12" fill="#6ee7b7" fontSize="8" fontWeight="800">AMB MH-01</text>
          </g>
        </g>
      </svg>

      {/* ─── Selected Signal Bottom Card ─── */}
      {selectedSignal && (
        <div className="absolute bottom-3 left-3 right-16 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl text-xs flex items-center justify-between shadow-2xl">
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{selectedSignal.name}</span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {selectedSignal.gpioGreenPin ? `GPIO Pin ${selectedSignal.gpioGreenPin}` : ''}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">{selectedSignal.road}</div>
          </div>
          <button
            onClick={() => setSelectedSignal(null)}
            className="text-[10px] text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
