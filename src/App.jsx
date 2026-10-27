import React from 'react';
import { SimProvider, useSimulation } from './context/SimulationContext';
import MobileFrame from './components/MobileFrame';
import DriverNavPage from './pages/DriverNavPage';
import CitizenSOSPage from './pages/CitizenSOSPage';
import AdminTrafficPage from './pages/AdminTrafficPage';
import HardwareBridgePage from './pages/HardwareBridgePage';

function AppContent() {
  const { state } = useSimulation();

  function renderActiveView() {
    switch (state.activeTab) {
      case 'driver':
        return <DriverNavPage />;
      case 'citizen':
        return <CitizenSOSPage />;
      case 'admin':
        return <AdminTrafficPage />;
      case 'hardware':
        return <HardwareBridgePage />;
      default:
        return <DriverNavPage />;
    }
  }

  return (
    <MobileFrame>
      {renderActiveView()}
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
