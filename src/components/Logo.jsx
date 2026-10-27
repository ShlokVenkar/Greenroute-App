import React from 'react';
import logoImg from '../assets/logo.png';

/**
 * GreenRoute Official Brand Emblem
 * Uses the official 3D GreenRoute illustrated logo with smooth rounded squircle styling.
 */
export function GreenRouteEmblem({ size = 36, className = '', glow = true }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 inline-flex items-center justify-center ${className}`}
      aria-label="GreenRoute Logo"
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-2xl bg-emerald-500/30 blur-md pointer-events-none transform scale-105"
          aria-hidden="true"
        />
      )}
      <img
        src={logoImg}
        alt="GreenRoute"
        className="w-full h-full object-contain rounded-xl drop-shadow-md relative z-10"
        loading="eager"
      />
    </div>
  );
}

// Alias for backwards compatibility
export const GreenRouteLogo = GreenRouteEmblem;

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
 * Hero App Icon with glossy glow for Login Portal and Landing view
 */
export function GreenRouteHeroLogo({ size = 76, className = '' }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer Emerald Glow Halo */}
      <div
        className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/40 via-teal-500/30 to-green-400/20 blur-xl transform scale-110 pointer-events-none"
        aria-hidden="true"
      />

      {/* Hero Logo with sleek rounded squircle border */}
      <div
        style={{ width: size, height: size }}
        className="relative z-10 rounded-2xl p-0.5 bg-gradient-to-br from-emerald-400/60 via-emerald-600/30 to-slate-900 border border-emerald-500/40 shadow-2xl overflow-hidden"
      >
        <img
          src={logoImg}
          alt="GreenRoute"
          className="w-full h-full object-cover rounded-[14px]"
          loading="eager"
        />
      </div>
    </div>
  );
}

export default GreenRouteEmblem;
