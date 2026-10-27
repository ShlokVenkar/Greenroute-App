import React from 'react';
import { SimProvider, useSimulation } from './context/SimulationContext';
import MobileFrame from './components/MobileFrame';
import LoginPage from './pages/LoginPage';
import DriverNavPage from './pages/DriverNavPage';
import CitizenSOSPage from './pages/CitizenSOSPage';
import AdminTrafficPage from './pages/AdminTrafficPage';
import HardwareBridgePage from './pages/HardwareBridgePage';

function AppContent() {
  const { state } = useSimulation();

  // If not logged in, show role login portal
  if (!state.currentUser) {
    return (
      <MobileFrame>
        <LoginPage />
      </MobileFrame>
    );
  }

  // Role-based views
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
