import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Navigation,
  ShieldAlert,
  Activity,
  Globe,
  Radio,
  Lock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Hospital,
  HeartPulse,
} from 'lucide-react';

export default function LoginPage() {
  const { state, actions, t } = useSimulation();
  const [selectedRole, setSelectedRole] = useState('driver');
  const [customBadge, setCustomBadge] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);

  const handleQuickLogin = (role) => {
    let userDetails = {};
    if (role === 'driver') {
      userDetails = {
        name: 'Ramesh Shinde (Pilot)',
        badge: 'AMB-MH01-EQ-4421',
        unit: 'Cardiac ICU Ambulance #4',
        hospital: 'KEM Hospital Trauma Care',
      };
    } else if (role === 'citizen') {
      userDetails = {
        name: 'Aarav Mehta (Citizen)',
        badge: 'Citizen-Dadar-West',
        location: 'Dadar TT Circle, Mumbai',
      };
    } else if (role === 'admin') {
      userDetails = {
        name: 'Insp. Sanjay Deshmukh',
        badge: 'MTP-WORLI-TMC-07',
        station: 'Mumbai Traffic Police HQ, Worli',
      };
    }

    actions.login(role, userDetails);
    actions.logEvent('auth', `User logged in as ${userDetails.name} (${role.toUpperCase()}).`);
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    handleQuickLogin(selectedRole);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* ─── Top Brand Header ─── */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center relative shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
              GreenRoute OS
            </span>
          </div>

          {/* Language Switcher on Login Screen */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => actions.setLanguage('en')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                state.language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => actions.setLanguage('hi')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                state.language === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => actions.setLanguage('mr')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                state.language === 'mr' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

        {/* Logo Badge */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-950/60 mb-2 border border-emerald-400/30">
          <Radio className="w-7 h-7 animate-pulse" />
        </div>

        <h1 className="text-xl font-black text-white tracking-tight">GreenRoute</h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto mt-0.5">
          {t('appTagline')}
        </p>
        <div className="mt-2 text-[10px] text-slate-400 font-mono">
          Mumbai Metropolitan Area • Capstone Project A_6
        </div>
      </div>

      {/* ─── Role Login Portal ─── */}
      <div className="p-4 sm:p-6 space-y-4 flex-1">
        <div>
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center mb-1">
            Select Your Role Portal
          </h2>
          <p className="text-[11px] text-slate-400 text-center mb-4">
            Each role has dedicated views, actions, and security access
          </p>
        </div>

        {/* 1. Emergency Driver Role Card */}
        <div
          onClick={() => handleQuickLogin('driver')}
          className="group relative p-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 to-slate-900/80 hover:border-emerald-400 hover:bg-emerald-950/60 transition-all cursor-pointer shadow-lg active:scale-98"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Navigation className="w-6 h-6 transform -rotate-45" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                  Emergency Vehicle Driver
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AMB MH-01
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                Turn-by-turn Mumbai GPS navigation, automatic ahead-of-time green signal clearance, and patient triage severity controls.
              </p>
              <div className="mt-2.5 flex items-center text-[11px] font-bold text-emerald-400 gap-1">
                <span>Launch Driver Navigation Cockpit</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Citizen SOS Role Card */}
        <div
          onClick={() => handleQuickLogin('citizen')}
          className="group relative p-4 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/40 to-slate-900/80 hover:border-red-400 hover:bg-red-950/60 transition-all cursor-pointer shadow-lg active:scale-98"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white group-hover:text-red-300 transition-colors">
                  Mumbai Citizen / Public
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  108 SOS
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                Instant one-touch emergency ambulance dispatch in Mumbai, live ETA GPS tracker, and life-saving first aid steps.
              </p>
              <div className="mt-2.5 flex items-center text-[11px] font-bold text-red-400 gap-1">
                <span>Open Citizen Emergency SOS Portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Traffic Police Admin Role Card */}
        <div
          onClick={() => handleQuickLogin('admin')}
          className="group relative p-4 rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-950/40 to-slate-900/80 hover:border-blue-400 hover:bg-blue-950/60 transition-all cursor-pointer shadow-lg active:scale-98"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white group-hover:text-blue-300 transition-colors">
                  Mumbai Traffic Police Admin
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  TMC HQ
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                Central Traffic Management Center (TMC), city-wide signal controller override, and physical ESP32/Arduino prototype bridge.
              </p>
              <div className="mt-2.5 flex items-center text-[11px] font-bold text-blue-400 gap-1">
                <span>Access Traffic Control Room</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Security / Capstone footer note */}
        <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Role-Based Access Control (RBAC) Enabled • No API Keys Required</span>
        </div>
      </div>
    </div>
  );
}
