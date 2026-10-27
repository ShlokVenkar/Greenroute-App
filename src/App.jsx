import React from 'react';
import { SimProvider, useSimulation } from './context/SimulationContext';
import MobileFrame from './components/MobileFrame';
import LoginPage from './pages/LoginPage';
import LanguageSelectPage from './pages/LanguageSelectPage';
import DriverNavPage from './pages/DriverNavPage';
import CitizenSOSPage from './pages/CitizenSOSPage';
import AdminTrafficPage from './pages/AdminTrafficPage';
import HardwareBridgePage from './pages/HardwareBridgePage';

function AppContent() {
  const { state } = useSimulation();

  // 1. Mandatory Step 1: Login Portal (Driver, Citizen, Admin)
  if (!state.currentUser) {
    return (
      <MobileFrame>
        <LoginPage />
      </MobileFrame>
    );
  }

  // 2. Mandatory Step 2: Language Selection immediately after Login
  if (!state.languageChosen) {
    return (
      <MobileFrame>
        <LanguageSelectPage />
      </MobileFrame>
    );
  }

  // 3. Step 3: Respective Role View with uncluttered interface
  function renderRoleView() {
    const role = state.currentUser.role;
    const tab = state.activeTab;

    if (role === 'driver') {
      return tab === 'hardware' ? <HardwareBridgePage /> : <DriverNavPage />;
    }

    if (role === 'citizen') {
      return <CitizenSOSPage />;
    }

    if (role === 'admin') {
      return tab === 'hardware' ? <HardwareBridgePage /> : <AdminTrafficPage />;
    }

    return <DriverNavPage />;
  }

  return (
    <MobileFrame>
      {renderRoleView()}
    </MobileFrame>
  );
}

export default function App() {
  return (
    <SimProvider>
      <AppContent />
    </SimProvider>
  );
}
