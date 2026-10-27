import React from 'react';

/**
 * GreenRoute Professional App Emblem (SVG)
 * Modern geometric synergy of:
 * 1. The letter 'G'
 * 2. An accelerated green emergency highway corridor / wave
 * 3. An intelligent signal beacon apex
 */
export function GreenRouteEmblem({ size = 36, className = '', glow = true }) {
  const filterId = `gr-glow-${size}`;
  const gradId = `gr-grad-${size}`;
  const roadGradId = `gr-road-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="GreenRoute Logo"
    >
      <defs>
        {/* Main Emerald Gradient */}
        <linearGradient id={gradId} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Highway Perspective Gradient */}
        <linearGradient id={roadGradId} x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="40%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Ambient Glow */}
        {glow && (
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Rounded App Icon Container (App Squircle) */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="#09141f"
        stroke="#1e3a34"
        strokeWidth="1.5"
      />

      {/* Inner Subtle Radial Ambient Backlight */}
      <circle cx="32" cy="30" r="22" fill="#10b981" opacity="0.12" />

      {/* Dynamic Perspective Road / Green Corridor Arc (Forms an aerodynamic 'G') */}
      <path
        d="
          M 46 22
          C 42 15 35 12 28 13
          C 18 15 11 23 11 33
          C 11 44 19 51 30 51
          C 41 51 49 43 51 33
          L 34 33
        "
        stroke={`url(#${roadGradId})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={glow ? `url(#${filterId})` : undefined}
      />

      {/* Inner Highway Dashes (Moving Transit Flow) */}
      <path
        d="M 23 23 C 20 28 20 37 25 41 C 29 44 37 44 42 39"
        stroke="#a7f3d0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
        opacity="0.85"
      />

      {/* Apex Emergency Signal Beacon (Pulsing Diamond / Beacon) */}
      <circle cx="46" cy="22" r="4.5" fill="#34d399" filter={glow ? `url(#${filterId})` : undefined} />
      <circle cx="46" cy="22" r="2" fill="#ffffff" />

      {/* Preemption Wave Ripples emitting from beacon */}
      <path
        d="M 52 17 C 55 20 55 25 52 28"
        stroke="#34d399"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M 57 13 C 62 18 62 27 57 32"
        stroke="#34d399"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

/**
 * Full Brand Wordmark with Tagline
 */
export function GreenRouteWordmark({ className = '', subtitle = true }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <GreenRouteEmblem size={34} glow={true} />
      <div className="flex flex-col leading-none">
        <div className="flex items-center tracking-tight">
          <span className="text-base font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
            Green
          </span>
          <span className="text-base font-black text-white">Route</span>
          <span className="ml-1.5 text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono uppercase tracking-wider">
            OS
          </span>
        </div>
        {subtitle && (
          <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
            Smart Emergency Transit
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Hero App Icon with glossy bevel for Login Portal
 */
export function GreenRouteHeroLogo({ size = 72, className = '' }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer Glow Halo */}
      <div
        className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/30 to-teal-500/20 blur-xl transform scale-110 pointer-events-none"
        aria-hidden="true"
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="heroBg" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0d231e" />
            <stop offset="60%" stopColor="#081518" />
            <stop offset="100%" stopColor="#02080a" />
          </linearGradient>

          <linearGradient id="heroBorder" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="heroWave" x1="16" y1="16" x2="68" y2="68" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <filter id="heroGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base App Squircle */}
        <rect x="2" y="2" width="76" height="76" rx="22" fill="url(#heroBg)" stroke="url(#heroBorder)" strokeWidth="2" />

        {/* Gloss Top Reflection */}
        <path
          d="M 4 24 C 4 12 12 4 24 4 L 56 4 C 68 4 76 12 76 24 C 60 26 20 28 4 24 Z"
          fill="#ffffff"
          opacity="0.04"
        />

        {/* Subtle Radar Grids */}
        <circle cx="40" cy="40" r="28" stroke="#10b981" strokeWidth="0.8" opacity="0.15" strokeDasharray="3 3" />
        <circle cx="40" cy="40" r="18" stroke="#10b981" strokeWidth="0.8" opacity="0.2" />

        {/* Aerodynamic 'G' Emergency Highway Wave */}
        <path
          d="
            M 58 28
            C 53 19 44 15 35 16
            C 22 18 14 28 14 41
            C 14 54 24 64 38 64
            C 52 64 62 54 64 41
            L 42 41
          "
          stroke="url(#heroWave)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#heroGlow)"
        />

        {/* Highway Lane Markings */}
        <path
          d="M 28 30 C 24 35 25 46 31 51 C 37 55 47 55 54 49"
          stroke="#a7f3d0"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="5 5"
          opacity="0.8"
        />

        {/* Green Corridor Wave Apex Beacon */}
        <circle cx="58" cy="28" r="5.5" fill="#34d399" filter="url(#heroGlow)" />
        <circle cx="58" cy="28" r="2.5" fill="#ffffff" />

        {/* Wave Signal Pulse Rays */}
        <path d="M 66 22 C 70 26 70 32 66 36" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
        <path d="M 72 17 C 78 23 78 35 72 41" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      </svg>
    </div>
  );
}

// Backward-compatible default export
export default GreenRouteEmblem;
