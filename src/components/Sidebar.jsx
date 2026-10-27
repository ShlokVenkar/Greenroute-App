import React from 'react';
import {
  LayoutDashboard,
  TrafficCone,
  AlertTriangle,
  ScrollText,
  Network,
  Activity,
} from 'lucide-react';
import { GreenRouteLogo, GreenRouteWordmark } from './Logo';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'simulator', label: 'Intersection Simulator', icon: TrafficCone },
  { id: 'requests', label: 'Emergency Requests', icon: AlertTriangle },
  { id: 'log', label: 'Activity Log', icon: ScrollText },
  { id: 'architecture', label: 'System Architecture', icon: Network },
];

export default function Sidebar({ activePage, onNavigate, simRunning }) {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-bg-surface border-r border-border-subtle h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5 border-b border-border-subtle">
        <GreenRouteLogo size={26} />
        <GreenRouteWordmark className="text-base" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={isActive ? 'nav-item-active w-full text-left' : 'nav-item w-full text-left'}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={16}
                className={isActive ? 'text-green-500' : 'text-text-muted'}
              />
              <span className="text-[13px]">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom brand + status */}
      <div className="px-4 py-4 border-t border-border-subtle space-y-3">
        {/* Sim mode indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${simRunning ? 'bg-green-500' : 'bg-text-muted'}`} />
          <span className="text-[11px] text-text-muted font-mono uppercase tracking-wider">
            {simRunning ? 'Simulation Active' : 'Simulation Idle'}
          </span>
        </div>

        {/* Brand footer */}
        <div>
          <div className="text-[11px] font-semibold text-text-secondary">GreenRoute</div>
          <div className="text-[10px] text-text-muted">Intelligent Traffic Management</div>
        </div>

        {/* Team info */}
        <div className="text-[10px] text-text-muted leading-relaxed">
          Team A_6 · Capstone 2026
        </div>
      </div>
    </aside>
  );
}
