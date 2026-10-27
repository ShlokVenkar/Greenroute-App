import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { GreenRouteEmblem } from './Logo';
import {
  Navigation,
  ShieldAlert,
  Activity,
  Cpu,
  Smartphone,
  Maximize2,
  Globe,
  LogOut,
} from 'lucide-react';

export default function MobileFrame({ children }) {
  const { state, actions, t } = useSimulation();

  const user = state.currentUser;

  // Build role-specific navigation items
  let navItems = [];
  if (user?.role === 'driver') {
    navItems = [
      { id: 'main', label: t('driverCockpitTab'), icon: Navigation, activeColor: 'text-emerald-400' },
      { id: 'hardware', label: t('hardwareTab'), icon: Cpu, activeColor: 'text-purple-400' },
    ];
  } else if (user?.role === 'citizen') {
    navItems = [
      { id: 'main', label: t('navCitizen'), icon: ShieldAlert, activeColor: 'text-red-400' },
    ];
  } else if (user?.role === 'admin') {
    navItems = [
      { id: 'main', label: t('navAdmin'), icon: Activity, activeColor: 'text-blue-400' },
      { id: 'hardware', label: t('hardwareTab'), icon: Cpu, activeColor: 'text-purple-400' },
    ];
  }

  const getLocalizedUserName = () => {
    if (!user) return '';
    if (state.language === 'hi') {
      if (user.role === 'driver') return 'रमेश शिंदे (चालक)';
      if (user.role === 'citizen') return 'आरव मेहता (नागरिक)';
      if (user.role === 'admin') return 'इंस्पेक्टर संजय देशमुख';
    } else if (state.language === 'mr') {
      if (user.role === 'driver') return 'रमेश शिंदे (चालक)';
      if (user.role === 'citizen') return 'आरव मेहता (नागरिक)';
      if (user.role === 'admin') return 'पोलीस निरीक्षक संजय देशमुख';
    }
    return user.name;
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-0 md:p-4 select-none">
      {/* ─── Top Control Bar (Language & View Switcher) ─── */}
      <div className="w-full max-w-md md:max-w-4xl mb-2 px-3 py-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <GreenRouteEmblem size={22} glow={false} />
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
        {/* Smartphone Top Notch / Speaker (Clean, no fake time or battery) */}
        {state.isMobileFrame && (
          <div className="relative bg-slate-950 px-6 py-2.5 flex items-center justify-center text-white select-none shrink-0 z-30">
            {/* Sleek Dynamic Island / Speaker Pill */}
            <div className="w-24 h-3.5 bg-black rounded-full border border-slate-800/80 flex items-center justify-center gap-2 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></span>
              <span className="w-1 h-1 rounded-full bg-emerald-500/80"></span>
            </div>
          </div>
        )}

        {/* Logged In User Profile Bar (Only shown after language is selected) */}
        {user && state.languageChosen && (
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
                <div className="text-xs font-bold text-white truncate">{getLocalizedUserName()}</div>
                <div className="text-[9px] text-slate-400 uppercase font-mono">{user.badge}</div>
              </div>
            </div>

            <button
              onClick={actions.logout}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-300 border border-slate-700 text-[10px] font-semibold transition-colors shrink-0"
              title="Logout and switch persona"
            >
              <LogOut className="w-3 h-3" />
              <span>{t('switchRoleBtn')}</span>
            </button>
          </div>
        )}

        {/* ─── Page Viewport Content ─── */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>

        {/* ─── Role-Based Bottom Navigation Bar (Only Shown After Language Confirmation) ─── */}
        {user && state.languageChosen && navItems.length > 0 && (
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
              <span className="text-[10px] mt-1 tracking-tight font-medium">{t('logoutBtn')}</span>
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
