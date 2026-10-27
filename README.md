# GreenRoute — Smart Traffic Management & Emergency Vehicle Priority System

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?logo=openstreetmap&logoColor=white)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

> **Engineering Capstone Project**  
> **Team:** A_6  
> **Project Lead:** Shlok Venkar  
> **Mentor:** Prof. Anjali Gharat  
> **City Context:** Mumbai Metropolitan Area  

---

## 🚦 Overview

**GreenRoute** is an intelligent, real-time traffic signal management and emergency vehicle green corridor platform tailored for high-density metropolitan road networks like Mumbai. The system connects emergency vehicle drivers, citizens in distress, and traffic police control rooms to establish dynamic, automated **Green Waves**—clearing traffic signals beforehand based on the emergency vehicle's GPS position, speed, and clinical triage severity without causing gridlock to cross-traffic.

---

## 📱 User Personas & Role-Based Flow

The application follows a **strict 3-step role-based flow**:

```
[ Step 1: Dedicated Login Portal ]
      ├── 🚑 Emergency Vehicle Driver (Pilot Ramesh Shinde • Cardiac ICU #4)
      ├── 🆘 Mumbai Citizen / Public (Citizen SOS • 108 Dispatch)
      └── 👮‍♂️ Mumbai Traffic Police Admin (TMC Worli Control Room)
                    │
                    ▼
[ Step 2: Post-Login Language Selection Screen ]
      ├── 🇬🇧 English
      ├── 🇮🇳 हिंदी (Hindi)
      └── 🚩 मराठी (Marathi)
                    │
                    ▼
[ Step 3: Respective Role View in Selected Language ]
```

### 1. 🚨 Emergency Driver Navigation Cockpit
- **Turn-by-Turn Guidance:** Google Maps-style top green banner with glanceable next maneuver instructions, lane guidance, remaining distance, and ETA.
- **Ahead-of-Time Signal Clearing (Green Wave):** Upcoming signals along the corridor (*Dadar TT, Hindmata, Chitra, Parel TT / KEM Gate*) detect approaching ambulances within the preemption zone and turn GREEN before the vehicle arrives.
- **Dynamic Triage Severity Engine:**
  - **Code Red (Critical):** Cardiac arrest, severe trauma, stroke. 450m preemption window, max green wave duration.
  - **Code Amber (Urgent):** Severe fractures, respiratory distress. 300m window.
  - **Code Yellow (Moderate):** Stable patient transit with smooth green extensions.
- **Cockpit Controls:** Single-tap Siren toggle, Speed HUD, and "Arrived at Hospital" mission complete button.

### 2. 🆘 Mumbai Citizen Emergency SOS
- **Instant Dispatch:** One-touch SOS dispatch for Medical Ambulances 🚑, Fire Engines 🚒, and Police Units 🚓.
- **Clinical Triage Checklist:** Fast symptom check (unconscious, heavy bleeding, chest pain) to auto-calculate severity.
- **Mumbai Location & Hospital Selector:** Dadar, Lower Parel, Worli, BKC, Bandra; linked to KEM Hospital, Lilavati, Tata Memorial, Sion, and Breach Candy.
- **Live Dispatched Tracking:** Real-time OpenStreetMap showing the assigned ambulance navigating toward the citizen with ETA countdown.
- **Emergency First-Aid Guide:** CPR steps, bleeding control, and burns management while waiting for the ambulance.

### 3. 📡 Mumbai Traffic Police Command Center (TMC)
- **Central Control Room:** City-wide overview of monitored junctions and active green corridors.
- **Signal Controllers Grid:** Real-time phase status, preemption wave locks, and manual police overrides.
- **Traffic Impact Mitigation:** Safety transitions (Yellow $\rightarrow$ All-Red $\rightarrow$ Green Corridor) ensuring cross-traffic is safely cleared and compensatory green time is restored.

### 4. ⚡ Physical Hardware Prototype Bridge (IoT / ESP32 / Arduino)
- **Real-Time GPIO Pin Visualizer:** Live LED digital output states matching physical breadboard circuits:
  - **Corridor North/South (Ambulance Route):** Pin 12 (Red), Pin 13 (Yellow), Pin 14 (Green).
  - **Corridor East/West (Cross-Traffic):** Pin 25 (Red), Pin 26 (Yellow), Pin 27 (Green).
- **Web Serial API Connection:** Connect physical ESP32 or Arduino boards directly via USB at **115,200 baud**.
- **Live JSON Telemetry Stream:** Continuous stream of driver GPS coordinates, speed, heading, target signal, and hardware pin states.
- **Included Firmware Code:** Ready-to-upload Arduino/ESP32 C++ firmware snippet.

---

## 🗺️ Mumbai OpenStreetMap Integration

The application utilizes **OpenStreetMap** centered on Mumbai's arterial corridors:
- Real street grid of *Dr. Babasaheb Ambedkar Road, Tilak Bridge, Hindmata Flyover, Acharya Donde Marg, and Senapati Bapat Marg*.
- Moving ambulance marker with heading rotation and emergency strobe wave.
- Signal status halos that glow green upon advance preemption.
- Automatic container resize handling (`map.invalidateSize()`) for smooth mobile responsiveness.

---

## 🌐 Trilingual Support (i18n)

Full native translation across the entire app:
- **English**
- **हिंदी (Hindi)**
- **मराठी (Marathi)**

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Context API state management
- **Tooling:** Vite, Tailwind CSS v3
- **Mapping:** OpenStreetMap, Leaflet
- **Hardware Integration:** Web Serial API, JSON Telemetry Protocol
- **Iconography:** Lucide React

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm`

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/ShlokVenkar/Greenroute-App.git
   cd Greenroute-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Project Team

- **Team ID:** A_6
- **Project Lead:** Shlok Venkar
- **Project Mentor:** Prof. Anjali Gharat

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
