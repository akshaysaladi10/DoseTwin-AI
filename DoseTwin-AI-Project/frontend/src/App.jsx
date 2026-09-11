import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisStudioPage } from './pages/AnalysisStudioPage';
import { MedicationsPage } from './pages/MedicationsPage';
import { InteractionsPage } from './pages/InteractionsPage';
import { GraphExplorerPage } from './pages/GraphExplorerPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { TechStackPage } from './pages/TechStackPage';
import { apiService } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [patients, setPatients] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [rules, setRules] = useState([]);
  const [activeTwin, setActiveTwin] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    const initApp = async () => {
      try {
        const healthRes = await apiService.checkHealth();
        if (healthRes.data?.status === 'healthy') {
          setBackendStatus('online');
        } else {
          setBackendStatus('warning');
        }
      } catch (err) {
        console.warn('Backend offline or starting up:', err.message);
        setBackendStatus('offline');
      }

      // Fetch patients
      try {
        const pRes = await apiService.getPatients();
        setPatients(pRes.data || []);
        if (pRes.data && pRes.data.length > 0) {
          setActiveTwin(pRes.data[0]);
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
      }

      // Fetch medication catalog
      try {
        const mRes = await apiService.getMedicationCatalog();
        setCatalog(mRes.data || []);
      } catch (err) {
        console.error('Error fetching catalog:', err);
      }

      // Fetch interaction rules
      try {
        const rRes = await apiService.getInteractionRules();
        setRules(rRes.data || []);
      } catch (err) {
        console.error('Error fetching interaction rules:', err);
      }
    };

    initApp();
  }, []);

  const handleSimulatePatient = (patient) => {
    setActiveTwin(patient);
    setActiveTab('studio');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-content">
        <Header backendStatus={backendStatus} />

        <main className="page-wrapper">
          {activeTab === 'dashboard' && (
            <DashboardPage
              patients={patients}
              catalog={catalog}
              rules={rules}
              onSimulatePatient={handleSimulatePatient}
              onNavigateToStudio={() => setActiveTab('studio')}
            />
          )}

          {activeTab === 'studio' && (
            <AnalysisStudioPage
              patients={patients}
              catalog={catalog}
              activeTwin={activeTwin}
              onUpdateActiveTwin={setActiveTwin}
            />
          )}

          {activeTab === 'medications' && (
            <MedicationsPage catalog={catalog} />
          )}

          {activeTab === 'interactions' && (
            <InteractionsPage rules={rules} />
          )}

          {activeTab === 'graph' && (
            <GraphExplorerPage />
          )}

          {activeTab === 'architecture' && (
            <ArchitecturePage />
          )}

          {activeTab === 'techstack' && (
            <TechStackPage />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
