import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { MUMBAI_HOSPITALS, MUMBAI_PICKUP_LOCATIONS } from '../data/mumbaiRoutes';
import MumbaiMap from '../components/MumbaiMap';
import {
  PhoneCall,
  ShieldAlert,
  MapPin,
  HeartPulse,
  Flame,
  Shield,
  Clock,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function CitizenSOSPage() {
  const { state, actions, t } = useSimulation();

  const [emergencyType, setEmergencyType] = useState('ambulance');
  const [severity, setSeverity] = useState('CODE_RED');
  const [pickupLocation, setPickupLocation] = useState('Vidyalankar Polytechnic Campus, Wadala (East)');
  const [hospitalId, setHospitalId] = useState('sion');
  const [patientNotes, setPatientNotes] = useState('');

  const sos = state.citizenSos;
  const isDispatched = sos.requested;

  const handleSubmit = (e) => {
    e.preventDefault();
    actions.submitCitizenSos({
      emergencyType,
      severity,
      pickupLocation,
      hospitalId,
    });
    actions.logEvent(
      'request',
      `Citizen SOS submitted from ${pickupLocation}: ${emergencyType.toUpperCase()} requested with ${severity}. Assigned to Ambulance MH-01-EQ-4421.`
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* ─── Top Header ─── */}
      <div className="p-4 bg-gradient-to-r from-red-900/40 via-slate-900 to-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">{t('citizenTitle')}</h1>
              <p className="text-[11px] text-slate-400">{t('citizenSubtitle')}</p>
            </div>
          </div>
          <a
            href="tel:108"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>108 SOS</span>
          </a>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* ─── Dispatched State: Live Tracker ─── */}
        {isDispatched ? (
          <div className="space-y-4">
            {/* Live Status Card */}
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    {t('dispatchSuccess')}
                  </span>
                </div>
                <span className="text-xs font-bold text-white bg-emerald-800/80 px-2.5 py-0.5 rounded-full border border-emerald-600">
                  {t('ambulanceEta')}
                </span>
              </div>

              {/* Vehicle & Driver details */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/80 rounded-xl p-3 border border-emerald-900/60 text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Assigned Unit</div>
                  <div className="font-bold text-white">{sos.dispatchedVehicleId}</div>
                  <div className="text-emerald-400 text-[10px]">Advanced Cardiac ICU</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Primary Driver</div>
                  <div className="font-bold text-white">{sos.driverName}</div>
                  <div className="text-slate-400 text-[10px]">Base: Sion Apex Trauma Bay</div>
                </div>
              </div>

              {/* Green Corridor Guarantee Notice */}
              <div className="mt-3 flex items-start gap-2 bg-emerald-900/30 p-2.5 rounded-xl border border-emerald-500/30 text-emerald-200 text-xs">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <b>Smart Green Corridor Active:</b> GreenRoute is clearing all traffic signals between Vidyalankar Polytechnic and Sion Hospital beforehand. The ambulance will not be stuck in traffic!
                </div>
              </div>

              {/* Call Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => alert(`Connecting call to Ambulance Driver (${sos.driverName})...`)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('callDriver')}</span>
                </button>
                <a
                  href="tel:108"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{t('callHelpline')}</span>
                </a>
              </div>
            </div>

            {/* Live Interactive Map for Citizen */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-3 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {t('trackingAmbulance')} (Wadala - Sion Corridor)
                </span>
                <span className="text-[10px] text-slate-400 font-medium">GPS Updated 2s ago</span>
              </div>
              <div className="h-[220px] rounded-xl overflow-hidden">
                <MumbaiMap
                  vehicleLocation={state.vehicleLocation}
                  vehicleHeading={state.vehicleHeading}
                  routeCoordinates={state.currentRoute.pathCoordinates}
                  signals={state.signals}
                  hospitalLocation={[19.0392, 72.8617]}
                  pickupLocation={[19.0222, 72.8682]}
                  activeRouteName={state.currentRoute.name}
                  preemptedSignalId={state.activePreemptedSignalId}
                  severity={state.severity}
                  height="100%"
                />
              </div>
            </div>

            {/* First-Aid Tips While Waiting */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                <HelpCircle className="w-4 h-4" />
                <span>{t('firstAidTips')}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>{t('cprStep')}</span>
                </li>
                <li className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>{t('bleedingStep')}</span>
                </li>
                <li className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span>{t('burnStep')}</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* ─── Request Form: Citizen Request ─── */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Emergency Vehicle Type Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
                {t('emergencyType')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ambulance', label: 'Ambulance', icon: HeartPulse, color: 'text-red-400 border-red-500/40 bg-red-500/10' },
                  { id: 'fire', label: 'Fire Engine', icon: Flame, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
                  { id: 'police', label: 'Police Squad', icon: Shield, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setEmergencyType(type.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        emergencyType === type.id
                          ? `${type.color} ring-2 ring-white/30 font-bold shadow-md`
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-semibold">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity Assessment */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
                {t('patientCondition')}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'CODE_RED',
                    title: 'Code Red — Critical Condition',
                    desc: t('criticalCondition'),
                    badge: 'bg-red-600 text-white',
                  },
                  {
                    id: 'CODE_AMBER',
                    title: 'Code Amber — Serious Condition',
                    desc: t('seriousCondition'),
                    badge: 'bg-amber-600 text-white',
                  },
                  {
                    id: 'CODE_YELLOW',
                    title: 'Code Yellow — Stable Condition',
                    desc: t('stableCondition'),
                    badge: 'bg-emerald-600 text-white',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSeverity(item.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      severity === item.id
                        ? 'border-red-500 bg-red-950/40 ring-1 ring-red-400/30'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      checked={severity === item.id}
                      onChange={() => setSeverity(item.id)}
                      className="mt-1 accent-red-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pickup Location Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span>{t('pickupLocation')}</span>
                <span className="text-[10px] text-emerald-400 font-semibold cursor-pointer">
                  📍 Auto-Detect GPS
                </span>
              </label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              >
                {MUMBAI_PICKUP_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Hospital */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                {t('preferredHospital')}
              </label>
              <select
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              >
                {MUMBAI_HOSPITALS.map((hosp) => (
                  <option key={hosp.id} value={hosp.id}>
                    {hosp.name} ({hosp.area})
                  </option>
                ))}
              </select>
            </div>

            {/* Big SOS Dispatch Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-red-900/50 flex items-center justify-center gap-2 transition-all transform active:scale-98 animate-pulse"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>{t('requestSosNow')}</span>
              </button>
              <div className="text-center text-[10px] text-slate-400 mt-2">
                Directly connected to Mumbai Emergency Response System (MERS) & Smart Traffic Corridor.
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
