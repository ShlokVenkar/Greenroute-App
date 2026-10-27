import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Locate, Navigation2 } from 'lucide-react';

export default function MumbaiMap({
  vehicleLocation = [19.0222, 72.8682], // Default: Vidyalankar Polytechnic, Wadala East
  vehicleHeading = 0,
  routeCoordinates = [],
  signals = [],
  hospitalLocation = [19.0392, 72.8617], // Default: Sion Hospital Trauma Center
  pickupLocation = [19.0222, 72.8682],
  activeRouteName = 'Vidyalankar Polytechnic ➔ Sion Hospital',
  preemptedSignalId = null,
  severity = 'CODE_RED',
  height = '100%',
  interactive = true,
  isLiveGps = false,
  gpsAccuracy = 15,
  onRecenter,
  showTopHud = true,
  showWaveBadge = true,
}) {
  const containerRef = useRef(null);
  const mapInstance = useRef(null);
  const polylineLayer = useRef(null);
  const vehicleMarker = useRef(null);
  const gpsAccuracyCircle = useRef(null);
  const signalMarkers = useRef([]);
  const hospitalMarker = useRef(null);
  const vidyalankarMarker = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous instance if any
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const startLat = vehicleLocation ? vehicleLocation[0] : 19.0222;
    const startLng = vehicleLocation ? vehicleLocation[1] : 72.8682;

    const map = L.map(containerRef.current, {
      center: [startLat, startLng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // Official OpenStreetMap Tile Layer
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Fallback: If OSM tile fails, load CartoDB OpenStreetMap tile
    osm.on('tileerror', (error) => {
      console.warn('OSM tile error, fallback to mirror tile:', error);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);
    });

    // Attribution
    L.control
      .attribution({ position: 'bottomright', prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>')
      .addTo(map);

    if (interactive) {
      L.control.zoom({ position: 'topright' }).addTo(map);
    }

    mapInstance.current = map;

    // Force size invalidation
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 400);

    // ResizeObserver for automatic resize handling (e.g. mobile <-> expanded view toggle)
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update Route Polyline & Endpoints
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (polylineLayer.current) {
      polylineLayer.current.remove();
      polylineLayer.current = null;
    }

    if (routeCoordinates && routeCoordinates.length > 0) {
      // Outer Glowing Corridor
      const glow = L.polyline(routeCoordinates, {
        color: '#10b981',
        weight: 12,
        opacity: 0.45,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Inner High-Visibility Path
      const line = L.polyline(routeCoordinates, {
        color: '#047857',
        weight: 5,
        opacity: 0.95,
        dashArray: '8, 6',
        lineCap: 'round',
      }).addTo(map);

      polylineLayer.current = L.featureGroup([glow, line]);
    }

    // Vidyalankar Polytechnic Campus Origin Marker
    if (pickupLocation) {
      if (vidyalankarMarker.current) vidyalankarMarker.current.remove();
      const campusIcon = L.divIcon({
        className: 'custom-campus-marker',
        html: `
          <div style="background: #0f172a; color: white; border-radius: 12px; padding: 4px 8px; display: flex; align-items: center; gap: 5px; border: 2px solid #10b981; box-shadow: 0 4px 14px rgba(16,185,129,0.5); font-size: 11px; font-weight: 800; white-space: nowrap; transform: translate(-50%, -100%);">
            <span style="font-size: 14px;">🎓</span>
            <span>Vidyalankar Polytechnic</span>
          </div>
        `,
        iconSize: [160, 32],
        iconAnchor: [80, 16],
      });
      vidyalankarMarker.current = L.marker(pickupLocation, { icon: campusIcon })
        .addTo(map)
        .bindPopup(`<b>Vidyalankar Polytechnic</b><br/>Wadala (East), Mumbai<br/><i>Emergency Origin</i>`);
    }

    // Hospital Destination Marker
    if (hospitalLocation) {
      if (hospitalMarker.current) hospitalMarker.current.remove();
      const hospitalIcon = L.divIcon({
        className: 'custom-hospital-marker',
        html: `
          <div style="background: #dc2626; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 16px rgba(220,38,38,0.7); transform: translate(-50%, -50%);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      hospitalMarker.current = L.marker(hospitalLocation, { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(`<b>Hospital Apex Trauma Center</b><br/>Casualty Gate Open`);
    }
  }, [routeCoordinates, hospitalLocation, pickupLocation]);

  // Update Signals on OpenStreetMap
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    signalMarkers.current.forEach((m) => m.remove());
    signalMarkers.current = [];

    signals.forEach((sig) => {
      const isPreempted = sig.id === preemptedSignalId || sig.preempted;
      const isGreen = isPreempted || sig.currentPhase === 'GREEN';
      const color = isGreen ? '#10b981' : '#ef4444';
      const glow = isPreempted ? '0 0 16px #10b981, 0 0 30px #10b981' : '0 2px 8px rgba(0,0,0,0.4)';

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
            <span>Status: <b>${isGreen ? 'GREEN WAVE LOCKED 🟢' : 'Awaiting Approach'}</b></span>
          </div>
        `);

      signalMarkers.current.push(marker);
    });
  }, [signals, preemptedSignalId]);

  // Update Moving Ambulance / Live Mobile GPS Marker
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !vehicleLocation) return;

    // GPS Accuracy Circle
    if (isLiveGps) {
      if (!gpsAccuracyCircle.current) {
        gpsAccuracyCircle.current = L.circle(vehicleLocation, {
          radius: gpsAccuracy || 20,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.15,
          weight: 1,
        }).addTo(map);
      } else {
        gpsAccuracyCircle.current.setLatLng(vehicleLocation);
        gpsAccuracyCircle.current.setRadius(gpsAccuracy || 20);
      }
    } else if (gpsAccuracyCircle.current) {
      gpsAccuracyCircle.current.remove();
      gpsAccuracyCircle.current = null;
    }

    if (!vehicleMarker.current) {
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

      vehicleMarker.current = L.marker(vehicleLocation, { icon: vehicleIcon }).addTo(map);
    } else {
      vehicleMarker.current.setLatLng(vehicleLocation);
    }

    // Pan smoothly following vehicle
    map.panTo(vehicleLocation, { animate: true, duration: 0.6 });
  }, [vehicleLocation, vehicleHeading, isLiveGps, gpsAccuracy]);

  const handleRecenter = () => {
    if (mapInstance.current && vehicleLocation) {
      mapInstance.current.setView(vehicleLocation, 16, { animate: true });
      mapInstance.current.invalidateSize();
    }
    onRecenter?.();
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl"
      style={{ height: height || '100%', minHeight: '300px' }}
    >
      {/* ─── Guaranteed Leaflet OpenStreetMap Container ─── */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', minHeight: '300px' }}
        className="w-full h-full z-0"
      />

      {/* ─── Top Brand HUD (Optional, hidden in driver view for zero clutter) ─── */}
      {showTopHud && (
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
                {isLiveGps ? 'Live Mobile GPS Active' : 'Wadala Corridor'}
              </span>
            </div>
            <div className="text-xs font-bold text-white truncate max-w-[200px]">{activeRouteName}</div>
          </div>
        </div>
      )}

      {/* ─── Preemption Wave Active Badge ─── */}
      {showWaveBadge && preemptedSignalId && (
        <div className="absolute top-3 right-12 z-[1000] flex items-center gap-1.5 bg-emerald-600/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-emerald-400 text-white shadow-lg animate-pulse">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
          </svg>
          <span className="text-[10px] font-black tracking-wide">WAVE LOCK ACTIVE</span>
        </div>
      )}

      {/* ─── Recenter on Location Button ─── */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-3 right-3 z-[1000] w-10 h-10 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 hover:border-emerald-500 text-white flex items-center justify-center shadow-xl active:scale-95 transition-all"
        title="Recenter on Location"
      >
        <Locate className={`w-5 h-5 ${isLiveGps ? 'text-blue-400' : 'text-emerald-400'}`} />
      </button>
    </div>
  );
}
