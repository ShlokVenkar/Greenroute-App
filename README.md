# GreenRoute — Intelligent Traffic Management & Emergency Vehicle Priority System

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

> **Engineering Capstone Project**  
> **Team:** A_6  
> **Project Lead:** Shlok Venkar  
> **Mentor:** Anjali Gharat  
> **Department:** Computer Engineering / Information Technology  

---

## 🚦 Overview

**GreenRoute** is an intelligent, real-time traffic signal management and emergency vehicle priority simulation platform. Designed to bridge the gap between algorithmic traffic coordination and life-saving transit response, GreenRoute eliminates unnecessary intersection delays for emergency services (ambulances, fire engines, police units) while preserving strict pedestrian and vehicular safety protocols.

### Key Capabilities

- **Intelligent 4-Way Traffic Controller:** Real-time state machine coordinating North-South / East-West vehicular and pedestrian signals with deterministic yellow clearance and all-red safety buffers.
- **Dynamic Emergency Preemption Engine:** Multi-tier priority preemption (Ambulance > Fire Engine > Police > Public Transit) with cryptographic auth checks and queue management.
- **Safety-First Phase Transitions:** Non-abrupt preemption guaranteeing yellow warning intervals (3s) and intersection-clearing all-red intervals (2s) before activating an emergency green corridor.
- **Corridor Recovery Protocol:** Seamless restitution to regular cycle timing post-passage with compensatory green time for starved phases.
- **Auditable Event Telemetry:** Live event feed, request logs, and status history with CSV export capabilities.

---

## 🏗️ System Architecture

GreenRoute operates on an event-driven 4-stage pipeline:

```
[ Inbound Emergency Request ]
             │
             ▼
[ Authentication & Verification ] ──(Invalid)──> [ Rejection & Audit Log ]
             │ (Valid)
             ▼
[ Priority Scheduling Engine ] ────> [ Queue Insertion (Sorted by Priority & ETA) ]
             │
             ▼
[ Signal Controller Preemption ]
  ├── 1. Yellow Clearance Phase (3s)
  ├── 2. All-Red Safety Buffer (2s)
  ├── 3. Green Wave Corridor Activated
  └── 4. Normal State Machine Recovery
```

---

## 🖥️ Application Modules

1. **Executive Overview Dashboard:** Live intersection mini-display, active corridor status, queue depth, throughput metrics, and real-time event feed.
2. **Interactive Intersection Simulator:** Interactive canvas view of the 4-way junction, manual emergency injection form, phase timers, and control overrides.
3. **Emergency Dispatch Queue:** Comprehensive request tracking table with status tags (`Pending`, `In Progress`, `Completed`, `Rejected`), ETA counters, and authorization validation.
4. **Audit & Activity Logs:** Categorized chronological ledger of signal switches, preemption events, and safety alerts with filterable search and CSV export.
5. **System Architecture & Specifications:** Interactive visual explanation of the finite state machine, preemption logic, security verification, and hardware integration points.

---

## 🛠️ Technology Stack

- **Framework:** React 19 (Hooks, Context API for centralized simulation state)
- **Tooling & Bundler:** Vite
- **Styling:** Tailwind CSS with custom slate-900 / emerald glassmorphic color palette
- **Iconography:** Lucide React
- **Animations:** Custom CSS pulse, radar sweep, and status badge glows

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/Greenroute-App.git
   cd Greenroute-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
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

This project is open-source under the [MIT License](LICENSE).
