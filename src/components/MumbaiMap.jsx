import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Locate, Navigation2, Compass, Layers } from 'lucide-react';

export default function MumbaiMap({
  vehicleLocation = [19.0118, 72.8449],
  vehicleHeading = 180,
  routeCoordinates = [],
  signals = [],
  hospitalLocation,
  pickupLocation,
  activeRouteName = 'Dadar ➔ KEM Hospital',
  preemptedSignalId = null,
  severity = 'CODE_RED',
  height = '100%',
  interactive = true,
  isLiveGps = false,
  gpsAccuracy = 15,
  onRecenter,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const gpsAccuracyCircleRef = useRef(null);
  const polylineRef = useRef(null);
  const signalMarkersRef = useRef([]);
  const hospitalMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const lat = vehicleLocation ? vehicleLocation[0] : 19.0118;
      const lng = vehicleLocation ? vehicleLocation[1] : 72.8449;

      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: true,
        markerZoomAnimation: true,
      });

      // CartoDB OpenStreetMap Voyager layer — ultra-reliable, crisp, and no rate limits
      const osmLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(map);

      // Attribution control bottom-right
      L.control
        .attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>')
        .addTo(map);

      if (interactive) {
        L.control.zoom({ position: 'bottomright' }).addTo(map);
      }

      mapInstanceRef.current = map;

      // Force multiple size invalidations to ensure tiles render immediately
      const timers = [
        setTimeout(() => map.invalidateSize(), 50),
        setTimeout(() => map.invalidateSize(), 200),
        setTimeout(() => map.invalidateSize(), 600),
      ];

      // ResizeObserver to automatically resize when mobile frame or viewport changes
      let resizeObserver = null;
      if (window.ResizeObserver && mapContainerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserver.observe(mapContainerRef.current);
      }

      return () => {
        timers.forEach(clearTimeout);
        if (resizeObserver) resizeObserver.disconnect();
      };
    }
  }, []);

  // Update Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !routeCoordinates || routeCoordinates.length === 0) return;

    if (polylineRef.current) {
      polylineRef.current.remove();
    }

    // Glowing corridor background
    const corridorGlow = L.polyline(routeCoordinates, {
      color: '#10b981',
      weight: 12,
      opacity: 0.4,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // High-contrast primary transit line
    const navLine = L.polyline(routeCoordinates, {
      color: '#059669',
      weight: 5,
      opacity: 0.95,
      dashArray: '8, 6',
      lineCap: 'round',
    }).addTo(map);

    polylineRef.current = L.featureGroup([corridorGlow, navLine]);

    // Hospital Marker
    if (hospitalLocation) {
      if (hospitalMarkerRef.current) hospitalMarkerRef.current.remove();
      const hospitalIcon = L.divIcon({
        className: 'custom-hospital-marker',
        html: `
          <div style="background: #dc2626; color: white; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 12px rgba(220,38,38,0.6);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      hospitalMarkerRef.current = L.marker(hospitalLocation, { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(`<b>Emergency Destination Hospital</b><br/>Casualty Gate Open`);
    }

    // Pickup Marker
    if (pickupLocation) {
      if (pickupMarkerRef.current) pickupMarkerRef.current.remove();
      const pickupIcon = L.divIcon({
        className: 'custom-pickup-marker',
        html: `
          <div style="background: #2563eb; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(37,99,235,0.5);">
            <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      pickupMarkerRef.current = L.marker(pickupLocation, { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`<b>Pickup Location</b>`);
    }
  }, [routeCoordinates, hospitalLocation, pickupLocation]);

  // Update Signals on OpenStreetMap
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    signalMarkersRef.current.forEach((m) => m.remove());
    signalMarkersRef.current = [];

    signals.forEach((sig) => {
      const isPreempted = sig.id === preemptedSignalId || sig.preempted;
      const isGreen = isPreempted || sig.currentPhase === 'GREEN';
      const color = isGreen ? '#10b981' : '#ef4444';
      const glow = isPreempted
        ? '0 0 16px #10b981, 0 0 32px #10b981'
        : '0 2px 6px rgba(0,0,0,0.3)';

      const signalIcon = L.divIcon({
        className: 'custom-signal-marker',
        html: `
          <div style="
            background: #0f172a; 
            border: 2px solid ${isGreen ? '#10b981' : '#ef4444'}; 
            border-radius: 12px; 
            padding: 3px 6px; 
            display: flex; 
            align-items: center; 
            gap: 4px; 
            box-shadow: ${glow}; 
            color: white; 
            font-size: 10px; 
            font-weight: 700;
            white-space: nowrap;
            transform: translate(-50%, -50%);
          ">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${color}; box-shadow: 0 0 8px ${color};"></span>
            <span>${sig.name.split(' ')[0]} ${isGreen ? '🟢' : '🔴'}</span>
          </div>
        `,
        iconSize: [70, 26],
        iconAnchor: [35, 13],
      });

      const marker = L.marker([sig.lat, sig.lng], { icon: signalIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px;">
            <b>${sig.name}</b><br/>
            <span>Road: ${sig.road}</span><br/>
            <span>Status: <b>${isGreen ? 'GREEN WAVE ACTIVE 🟢' : 'RED — APPROACHING'}</b></span>
          </div>
        `);

      signalMarkersRef.current.push(marker);
    });
  }, [signals, preemptedSignalId]);

  // Update Live Vehicle / Mobile GPS Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !vehicleLocation) return;

    // GPS Accuracy Circle if live GPS is enabled
    if (isLiveGps) {
      if (!gpsAccuracyCircleRef.current) {
        gpsAccuracyCircleRef.current = L.circle(vehicleLocation, {
          radius: gpsAccuracy || 20,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.15,
          weight: 1,
        }).addTo(map);
      } else {
        gpsAccuracyCircleRef.current.setLatLng(vehicleLocation);
        gpsAccuracyCircleRef.current.setRadius(gpsAccuracy || 20);
      }
    } else if (gpsAccuracyCircleRef.current) {
      gpsAccuracyCircleRef.current.remove();
      gpsAccuracyCircleRef.current = null;
    }

    if (!vehicleMarkerRef.current) {
      const vehicleIcon = L.divIcon({
        className: 'custom-vehicle-marker',
        html: `
          <div style="position: relative; width: 44px; height: 44px;">
            <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(16, 185, 129, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; inset: 0; background: #0f172a; border: 2.5px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.6);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v9c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <div style="position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; font-size: 8px; font-weight: 800; border-radius: 6px; padding: 1px 4px; box-shadow: 0 0 6px #ef4444;">
              ${isLiveGps ? 'GPS' : 'AMB'}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      vehicleMarkerRef.current = L.marker(vehicleLocation, { icon: vehicleIcon }).addTo(map);
    } else {
      vehicleMarkerRef.current.setLatLng(vehicleLocation);
    }

    // Pan map to follow vehicle smoothly
    map.panTo(vehicleLocation, { animate: true, duration: 0.6 });
  }, [vehicleLocation, vehicleHeading, isLiveGps, gpsAccuracy]);

  // Recenter helper
  const handleRecenter = () => {
    if (mapInstanceRef.current && vehicleLocation) {
      mapInstanceRef.current.setView(vehicleLocation, 16, { animate: true });
      mapInstanceRef.current.invalidateSize();
    }
    onRecenter?.();
  };

  return (
    <div
      className="relative w-full h-full min-h-[260px] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl"
      style={{ height }}
    >
      {/* ─── Leaflet OpenStreetMap Container (Position Absolute Inset-0 to Guarantee Size) ─── */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ─── Top Brand HUD ─── */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 shadow-md">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isLiveGps ? 'bg-blue-400 animate-ping' : 'bg-emerald-400 animate-pulse'
          }`}
        ></span>
        <div>
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
            <span>OpenStreetMap</span>
            <span>•</span>
            <span className={isLiveGps ? 'text-blue-400 font-bold' : 'text-emerald-400'}>
              {isLiveGps ? 'Live Mobile GPS Active' : 'Mumbai Simulation'}
            </span>
          </div>
          <div className="text-xs font-bold text-white truncate max-w-[180px]">{activeRouteName}</div>
        </div>
      </div>

      {/* ─── Preemption Wave Active Badge ─── */}
      {preemptedSignalId && (
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-emerald-600/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-emerald-400 text-white shadow-lg animate-pulse">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
          </svg>
          <span className="text-[10px] font-black tracking-wide">WAVE LOCK ACTIVE</span>
        </div>
      )}

      {/* ─── Recenter on My Location Button ─── */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-3 right-3 z-[1000] w-10 h-10 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 hover:border-emerald-500 text-white flex items-center justify-center shadow-xl active:scale-95 transition-all"
        title="Recenter on My GPS Location"
      >
        <Locate className={`w-5 h-5 ${isLiveGps ? 'text-blue-400' : 'text-emerald-400'}`} />
      </button>
    </div>
  );
}
