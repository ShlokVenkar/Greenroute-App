import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Navigation,
  ShieldAlert,
  Activity,
  LogOut,
} from 'lucide-react';

export default function LanguageSelectPage() {
  const { state, actions } = useSimulation();
  const [selectedLang, setSelectedLang] = useState(state.language || 'en');
  const user = state.currentUser;

  const languages = [
    {
      id: 'en',
      title: 'English',
      native: 'English (India)',
      tag: 'Default',
      sampleText: 'Turn-by-turn GPS & Advance Signal Preemption',
      continueBtn: 'Continue to Application',
      greeting: 'Welcome',
    },
    {
      id: 'hi',
      title: 'हिंदी',
      native: 'Hindi',
      tag: 'लोकप्रिय',
      sampleText: 'टर्न-बाय-टर्न GPS और अग्रिम सिग्नल ग्रीन कॉरिडोर',
      continueBtn: 'आगे बढ़ें (Continue)',
      greeting: 'स्वागत है',
    },
    {
      id: 'mr',
      title: 'मराठी',
      native: 'Marathi (महाराष्ट्र)',
      tag: 'स्थानिक',
      sampleText: 'टर्न-बाय-टर्न GPS व सिग्नल ग्रीन कॉरिडोअर क्लिअरन्स',
      continueBtn: 'पुढे जा (Continue)',
      greeting: 'स्वागत आहे',
    },
  ];

  const currentLangObj = languages.find((l) => l.id === selectedLang) || languages[0];

  const handleProceed = () => {
    actions.confirmLanguage(selectedLang);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* ─── Top Header with User Badge ─── */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
              Step 2 of 2: Language
            </span>
          </div>

          <button
            onClick={actions.logout}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Cancel</span>
          </button>
        </div>

        {/* User Role Badge */}
        {user && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-2">
            <span>{user.role === 'driver' ? '🚑' : user.role === 'citizen' ? '🆘' : '👮'}</span>
            <span className="font-semibold text-white">{user.name}</span>
            <span className="text-[10px] text-emerald-400 font-mono">({user.badge})</span>
          </div>
        )}

        <h1 className="text-lg font-black text-white tracking-tight">
          {currentLangObj.greeting}! Choose Language
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto mt-0.5">
          Select your preferred language for instructions, navigation, and emergency alerts
        </p>
      </div>

      {/* ─── Language Options ─── */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-center">
        {languages.map((lang) => {
          const isSelected = selectedLang === lang.id;
          return (
            <div
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/50 scale-[1.01]'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {lang.id === 'en' ? 'EN' : lang.id === 'hi' ? 'हिं' : 'म'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">{lang.title}</span>
                    <span className="text-[10px] text-slate-400">({lang.native})</span>
                    {lang.tag && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {lang.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                    {lang.sampleText}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-emerald-400 bg-emerald-500' : 'border-slate-700'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </div>
            </div>
          );
        })}

        {/* ─── Big Continue Button ─── */}
        <div className="pt-3">
          <button
            onClick={handleProceed}
            className="w-full py-4 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <span>{currentLangObj.continueBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-[10px] text-slate-400 mt-2">
            You can always change language later from settings.
          </p>
        </div>
      </div>
    </div>
  );
}
