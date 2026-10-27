import React, { useState } from 'react';
import { SimProvider, useSimulation } from './context/SimulationContext';
import Sidebar from './components/Sidebar';
import OverviewPage from './pages/OverviewPage';
import SimulatorPage from './pages/SimulatorPage';
import RequestsPage from './pages/RequestsPage';
import LogPage from './pages/LogPage';
import ArchitecturePage from './pages/ArchitecturePage';

function AppContent() {
  const [activePage, setActivePage] = useState('overview');
  const { state } = useSimulation();

  function renderPage() {
    switch (activePage) {
      case 'overview':
        return <OverviewPage onNavigate={setActivePage} />;
      case 'simulator':
        return <SimulatorPage />;
      case 'requests':
        return <RequestsPage />;
      case 'log':
        return <LogPage />;
      case 'architecture':
        return <ArchitecturePage />;
      default:
        return <OverviewPage onNavigate={setActivePage} />;
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        simRunning={state.simRunning && !state.simPaused}
      />
      <main className="flex-1 overflow-hidden flex flex-col">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <SimProvider>
      <AppContent />
    </SimProvider>
  );
}
