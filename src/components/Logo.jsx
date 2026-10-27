import React from 'react';

/**
 * GreenRoute Logo — geometric symbol representing a road/routing concept
 */
export function GreenRouteLogo({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GreenRoute logo"
    >
      {/* Outer ring */}
      <circle cx="16" cy="16" r="15" stroke="#10b981" strokeWidth="1.5" />
      {/* Road horizontal */}
      <rect x="4" y="14.5" width="24" height="3" rx="1.5" fill="#10b981" opacity="0.25" />
      {/* Road vertical */}
      <rect x="14.5" y="4" width="3" height="24" rx="1.5" fill="#10b981" opacity="0.25" />
      {/* Center signal node */}
      <circle cx="16" cy="16" r="4" fill="#10b981" />
      {/* Direction arrows */}
      {/* North */}
      <path d="M16 5 L14 8 L16 7 L18 8 Z" fill="#10b981" />
      {/* South */}
      <path d="M16 27 L14 24 L16 25 L18 24 Z" fill="#10b981" />
      {/* East */}
      <path d="M27 16 L24 14 L25 16 L24 18 Z" fill="#10b981" />
      {/* West */}
      <path d="M5 16 L8 14 L7 16 L8 18 Z" fill="#10b981" />
    </svg>
  );
}

export function GreenRouteWordmark({ className = '' }) {
  return (
    <span className={`font-semibold text-text-primary tracking-tight ${className}`}>
      <span className="text-green-500">Green</span>Route
    </span>
  );
}
