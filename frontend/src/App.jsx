import React, { useState, useEffect, useRef } from 'react';
import PersistentBanner from './components/PersistentBanner';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import SimulationLab from './pages/SimulationLab';
import VerificationResults from './pages/VerificationResults';
import ExperimentHistory from './pages/ExperimentHistory';
import ProtocolLimitations from './pages/ProtocolLimitations';
import { detectionService } from './services/detectionService';
import { SAMPLE_SCENARIOS } from './data/sampleScenarios';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedScenarioId, setSelectedScenarioId] = useState(SAMPLE_SCENARIOS[0].id);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(false);
  const [runError, setRunError] = useState('');
  const [backendConnected, setBackendConnected] = useState(false);

  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('qds-console-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('qds-console-theme', theme);
    } catch {
      // Ignore storage errors in restricted iframe environments
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initialize service data on mount
  useEffect(() => {
    async function init() {
      const hist = await detectionService.getHistory();
      setHistory(hist);
      const health = await detectionService.checkBackendHealth();
      setBackendConnected(health.connected);
    }
    init();
  }, []);

  const handleRunSimulation = async (scenarioId, customConfig) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunError('');
    setIsRunning(true);
    try {
      const result = await detectionService.runDemonstration(scenarioId, customConfig);
      setLastResult(result);
      const updatedHistory = await detectionService.getHistory();
      setHistory(updatedHistory);
    } catch (err) {
      console.error('Simulation run failed:', err);
      setLastResult(null);
      setRunError('The demonstration run failed. No new result was accepted. Please try again.');
    } finally {
      runningRef.current = false;
      setIsRunning(false);
    }
  };

  const handleLaunchScenarioFromDashboard = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    setCurrentPage('simulation');
  };

  const handleClearHistory = async () => {
    await detectionService.clearHistory();
    const updated = await detectionService.getHistory();
    setHistory(updated);
  };

  const handleResetHistory = async () => {
    await detectionService.resetHistory();
    const updated = await detectionService.getHistory();
    setHistory(updated);
  };

  const handleSelectHistoryItem = (item) => {
    setLastResult(item.result || null);
    setCurrentPage('results');
  };

  return (
    <div className="app-container">
      {/* 1. Mandatory Persistent Demo Warning Notice */}
      <PersistentBanner />

      {/* 2. Research Workbench Shell: Left Sidebar + Main Body */}
      <div className="workbench-shell">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <div className="workbench-body">
          <TopBar
            currentPage={currentPage}
            backendConnected={backendConnected}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />

          <main className="workbench-content">
            {runError && (
              <div className="dossier-notice danger" role="alert">
                <strong>Execution Error:</strong> {runError}
              </div>
            )}

            {currentPage === 'dashboard' && (
              <Dashboard
                onLaunchScenario={handleLaunchScenarioFromDashboard}
                navigateTo={setCurrentPage}
              />
            )}

            {currentPage === 'simulation' && (
              <SimulationLab
                selectedScenarioId={selectedScenarioId}
                setSelectedScenarioId={setSelectedScenarioId}
                onRunSimulation={handleRunSimulation}
                isRunning={isRunning}
                lastResult={lastResult}
                navigateTo={setCurrentPage}
              />
            )}

            {currentPage === 'results' && (
              <VerificationResults
                result={lastResult}
                navigateTo={setCurrentPage}
              />
            )}

            {currentPage === 'history' && (
              <ExperimentHistory
                history={history}
                onClearHistory={handleClearHistory}
                onResetHistory={handleResetHistory}
                onSelectHistoryItem={handleSelectHistoryItem}
              />
            )}

            {currentPage === 'protocol' && (
              <ProtocolLimitations />
            )}
          </main>

          <footer className="workbench-footer">
            <div>
              <strong>Quantum Digital Signature Threat Detector</strong> — SIH 2026 Student Research Prototype
            </div>
            <div>
              Classical simulation | No AI/ML in detector loop | Independent result snapshots
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
