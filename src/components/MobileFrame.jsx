import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Navigation,
  ShieldAlert,
  Activity,
  Cpu,
  Smartphone,
  Maximize2,
  Minimize2,
  Globe,
  Battery,
  Wifi,
  Radio,
  LogOut,
  User,
  HeartPulse,
} from 'lucide-react';

export default function MobileFrame({ children }) {
  const { state, actions, t } = useSimulation();
  const [currentTime, setCurrentTime] = useState('19:42');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const user = state.currentUser;

  // Build role-specific navigation items
  let navItems = [];
  if (user?.role === 'driver') {
    navItems = [
      { id: 'main', label: 'Driver Cockpit', icon: Navigation, activeColor: 'text-emerald-400' },
      { id: 'hardware', label: 'Hardware IoT', icon: Cpu, activeColor: 'text-purple-400' },
    ];
  } else if (user?.role === 'citizen') {
    navItems = [
      { id: 'main', label: 'Citizen SOS', icon: ShieldAlert, activeColor: 'text-red-400' },
    ];
  } else if (user?.role === 'admin') {
    navItems = [
      { id: 'main', label: 'Traffic Control', icon: Activity, activeColor: 'text-blue-400' },
      { id: 'hardware', label: 'Hardware IoT', icon: Cpu, activeColor: 'text-purple-400' },
    ];
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-0 md:p-4 select-none">
      {/* ─── Top Control Bar (Language & View Switcher) ─── */}
      <div className="w-full max-w-md md:max-w-4xl mb-2 px-3 py-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-extrabold text-white tracking-wide">GreenRoute</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-[11px] text-slate-400">Mumbai Smart Traffic</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shadow-inner">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => actions.setLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                state.language === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => actions.setLanguage('hi')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                state.language === 'hi'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => actions.setLanguage('mr')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                state.language === 'mr'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Desktop/Mobile Device Frame Toggle */}
          <button
            onClick={actions.toggleMobileFrame}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-semibold transition-all shadow-sm"
            title="Toggle between phone frame and full screen"
          >
            {state.isMobileFrame ? (
              <>
                <Maximize2 className="w-3 h-3 text-emerald-400" />
                <span>{t('viewDesktop')}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3 text-emerald-400" />
                <span>{t('viewDevice')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── Phone Shell / Responsive Container ─── */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          state.isMobileFrame
            ? 'max-w-[420px] h-[100dvh] md:h-[860px] md:max-h-[92vh] md:rounded-[44px] md:border-[10px] md:border-slate-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden bg-slate-950 ring-1 ring-slate-700/50'
            : 'max-w-6xl h-[100dvh] md:h-[90vh] md:rounded-2xl md:border md:border-slate-800 overflow-hidden bg-slate-950 shadow-2xl'
        }`}
      >
        {/* Smartphone Top Notch & Status Bar (in mobile frame mode) */}
        {state.isMobileFrame && (
          <div className="relative bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-white text-xs select-none shrink-0 z-30">
            <span className="font-bold tracking-tight text-[13px]">{currentTime}</span>

            {/* Dynamic Island / Speaker Pill */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-2 w-28 h-4.5 bg-black rounded-full border border-slate-800 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse"></span>
            </div>

            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <span className="text-[10px] font-bold text-emerald-400">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold">96%</span>
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* Logged In User Profile Bar */}
        {user && (
          <div className="bg-slate-900/90 border-b border-slate-800 px-3.5 py-1.5 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border ${
                  user.role === 'driver'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : user.role === 'citizen'
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}
              >
                {user.role === 'driver' ? '🚑' : user.role === 'citizen' ? '🆘' : '👮'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <div className="text-[9px] text-slate-400 uppercase font-mono">{user.badge}</div>
              </div>
            </div>

            <button
              onClick={actions.logout}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-300 border border-slate-700 text-[10px] font-semibold transition-colors shrink-0"
              title="Logout and switch persona"
            >
              <LogOut className="w-3 h-3" />
              <span>Switch Role</span>
            </button>
          </div>
        )}

        {/* ─── Page Viewport Content ─── */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>

        {/* ─── Role-Based Bottom Navigation Bar (Only Shown When Logged In) ─── */}
        {user && navItems.length > 0 && (
          <div className="bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-1.5 flex items-center justify-around z-30 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => actions.setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all relative ${
                    isActive
                      ? `${item.activeColor} font-bold scale-105`
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {item.id === 'main' && user.role === 'driver' && state.missionActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    )}
                  </div>
                  <span className="text-[10px] mt-1 tracking-tight font-medium">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-current opacity-80"></span>
                  )}
                </button>
              );
            })}

            {/* Quick Switch Role button in bottom bar */}
            <button
              onClick={actions.logout}
              className="flex flex-col items-center justify-center py-1 px-4 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] mt-1 tracking-tight font-medium">Logout</span>
            </button>
          </div>
        )}

        {/* Bottom Home Indicator Bar (iOS style) */}
        {state.isMobileFrame && (
          <div className="w-full flex justify-center py-1 bg-slate-950 shrink-0">
            <div className="w-32 h-1 bg-slate-700/60 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
