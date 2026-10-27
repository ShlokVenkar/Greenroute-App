import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Cpu,
  Wifi,
  WifiOff,
  Radio,
  CheckCircle2,
  Copy,
  Terminal,
  Code,
  Zap,
  Sliders,
  Smartphone,
} from 'lucide-react';

export default function HardwareBridgePage() {
  const { state, actions, t } = useSimulation();
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('json');

  const pins = state.hardware.gpioPins;
  const isConnected = state.hardware.connected;

  // Build current telemetry payload
  const telemetryData = {
    vehicle_id: 'MH-01-EQ-4421',
    gps: {
      latitude: Number(state.vehicleLocation[0].toFixed(5)),
      longitude: Number(state.vehicleLocation[1].toFixed(5)),
      speed_kmh: state.speedKmh,
      heading_deg: state.vehicleHeading,
      is_device_gps: state.isUsingDeviceGps,
    },
    corridor: {
      active_preempted_signal: state.activePreemptedSignalId || 'SIG_101',
      cleared_signals_count: state.clearedSignalCount,
      distance_remaining_m: state.distanceRemainingMeters,
      eta_seconds: state.etaSeconds,
      severity_level: state.severity,
    },
    gpio_outputs: {
      corridor_north_south: {
        pin_12_red: pins.pin12 ? 1 : 0,
        pin_13_yellow: pins.pin13 ? 1 : 0,
        pin_14_green: pins.pin14 ? 1 : 0,
      },
      corridor_east_west: {
        pin_25_red: pins.pin25 ? 1 : 0,
        pin_26_yellow: pins.pin26 ? 1 : 0,
        pin_27_green: pins.pin27 ? 1 : 0,
      },
    },
    timestamp: Date.now(),
  };

  const jsonString = JSON.stringify(telemetryData, null, 2);

  const copyTelemetry = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Connect via Web Serial API if available
  const handleConnectSerial = async () => {
    if ('serial' in navigator) {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        actions.toggleHardwareConnection();
        actions.logEvent('system', 'WebSerial connected to physical ESP32 microcontroller at 115200 baud.');
        alert('Successfully opened WebSerial connection to microcontroller!');
      } catch (err) {
        alert('Serial connection cancelled or failed: ' + err.message);
      }
    } else {
      actions.toggleHardwareConnection();
      actions.logEvent('system', 'Simulated hardware connection toggled.');
    }
  };

  const arduinoSnippet = `// GreenRoute ESP32 Traffic Light Prototype Firmware
#include <ArduinoJson.h>

const int PIN_NORTH_RED = 12;
const int PIN_NORTH_YELLOW = 13;
const int PIN_NORTH_GREEN = 14;

const int PIN_EAST_RED = 25;
const int PIN_EAST_YELLOW = 26;
const int PIN_EAST_GREEN = 27;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_NORTH_RED, OUTPUT);
  pinMode(PIN_NORTH_YELLOW, OUTPUT);
  pinMode(PIN_NORTH_GREEN, OUTPUT);
  pinMode(PIN_EAST_RED, OUTPUT);
  pinMode(PIN_EAST_YELLOW, OUTPUT);
  pinMode(PIN_EAST_GREEN, OUTPUT);
}

void loop() {
  if (Serial.available()) {
    StaticJsonDocument<512> doc;
    deserializeJson(doc, Serial);
    
    // Update GPIO LED states from Driver GPS Preemption command
    int n_green = doc["gpio_outputs"]["corridor_north_south"]["pin_14_green"];
    int n_red   = doc["gpio_outputs"]["corridor_north_south"]["pin_12_red"];
    int e_red   = doc["gpio_outputs"]["corridor_east_west"]["pin_25_red"];
    
    digitalWrite(PIN_NORTH_GREEN, n_green ? HIGH : LOW);
    digitalWrite(PIN_NORTH_RED,   n_red   ? HIGH : LOW);
    digitalWrite(PIN_EAST_RED,     e_red   ? HIGH : LOW);
  }
}`;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* ─── Header ─── */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">{t('hardwareTitle')}</h1>
              <p className="text-[11px] text-slate-400">{t('hardwareSubtitle')}</p>
            </div>
          </div>
          <button
            onClick={handleConnectSerial}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isConnected
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isConnected ? 'ESP32 Linked' : 'Connect USB/ESP32'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Hardware Status Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('connectionStatus')}</div>
            <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              ></span>
              <span>{isConnected ? t('connected') : t('disconnected')}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Port: <b>COM3 (ESP32 Dev Module)</b> • Baud: <b>115,200 bps</b> • Protocol: <b>Serial / JSON</b>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={actions.toggleDeviceGps}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                state.isUsingDeviceGps
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>{state.isUsingDeviceGps ? 'Phone GPS Stream: ON' : 'Use Phone GPS'}</span>
            </button>
          </div>
        </div>

        {/* ─── Physical Traffic Light Prototype GPIO Output Visualizer ─── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                {t('gpioVisualizer')}
              </h2>
              <p className="text-[11px] text-slate-400">Real-time digital output states sent to LEDs</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Corridor Sync Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* North/South Emergency Corridor LEDs */}
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{t('northLeds')}</span>
                <span className="text-[10px] text-emerald-400 font-bold">EMERGENCY CORRIDOR</span>
              </div>

              <div className="flex items-center justify-around py-2">
                {/* Red Pin 12 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      pins.pin12
                        ? 'bg-red-600 border-red-400 shadow-[0_0_20px_#ef4444]'
                        : 'bg-red-950/40 border-red-900/60 opacity-40'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-white">RED</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Pin 12</span>
                </div>

                {/* Yellow Pin 13 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      pins.pin13
                        ? 'bg-amber-500 border-amber-300 shadow-[0_0_20px_#f59e0b]'
                        : 'bg-amber-950/40 border-amber-900/60 opacity-40'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-white">YEL</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Pin 13</span>
                </div>

                {/* Green Pin 14 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      pins.pin14
                        ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_24px_#10b981] animate-pulse'
                        : 'bg-emerald-950/40 border-emerald-900/60 opacity-40'
                    }`}
                  >
                    <span className="text-[9px] font-black text-slate-950">GRN</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Pin 14 (HIGH)</span>
                </div>
              </div>
            </div>

            {/* East/West Cross Traffic LEDs */}
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{t('eastLeds')}</span>
                <span className="text-[10px] text-red-400 font-bold">CROSS TRAFFIC (HELD)</span>
              </div>

              <div className="flex items-center justify-around py-2">
                {/* Red Pin 25 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      pins.pin25
                        ? 'bg-red-600 border-red-400 shadow-[0_0_20px_#ef4444]'
                        : 'bg-red-950/40 border-red-900/60 opacity-40'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-white">RED</span>
                  </div>
                  <span className="text-[10px] text-red-400 font-mono font-bold">Pin 25 (HIGH)</span>
                </div>

                {/* Yellow Pin 26 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      pins.pin26
                        ? 'bg-amber-500 border-amber-300 shadow-[0_0_20px_#f59e0b]'
                        : 'bg-amber-950/40 border-amber-900/60 opacity-40'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-white">YEL</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Pin 26</span>
                </div>

                {/* Green Pin 27 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      pins.pin27
                        ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_24px_#10b981]'
                        : 'bg-emerald-950/40 border-emerald-900/60 opacity-40'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-white">GRN</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Pin 27</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Live Telemetry JSON Stream & Firmware Code Snippet ─── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveCodeTab('json')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  activeCodeTab === 'json'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                Live JSON Stream
              </button>
              <button
                onClick={() => setActiveCodeTab('firmware')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  activeCodeTab === 'firmware'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                ESP32 / Arduino Code
              </button>
            </div>

            <button
              onClick={copyTelemetry}
              className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-[11px] overflow-x-auto max-h-64">
            {activeCodeTab === 'json' ? (
              <pre className="text-emerald-400 whitespace-pre">{jsonString}</pre>
            ) : (
              <pre className="text-blue-300 whitespace-pre">{arduinoSnippet}</pre>
            )}
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
            💡 <b>Hardware Prototype Guide:</b> Connect your ESP32 or Arduino board via USB to this laptop. You can read the JSON stream directly over serial baud 115200 to drive physical red, yellow, and green LEDs on your intersection model.
          </div>
        </div>
      </div>
    </div>
  );
}
