import React, { useState, useEffect } from 'react';
import PersistentBanner from './components/PersistentBanner';
import Header from './components/Header';
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
  const [backendConnected, setBackendConnected] = useState(false);

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
    setIsRunning(true);
    try {
      const result = await detectionService.runDemonstration(scenarioId, customConfig);
      setLastResult(result);
      const updatedHistory = await detectionService.getHistory();
      setHistory(updatedHistory);
    } catch (err) {
      console.error('Simulation run failed:', err);
    } finally {
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

  const handleSelectHistoryItem = (scenarioId) => {
    const sc = SAMPLE_SCENARIOS.find((s) => s.id === scenarioId) || SAMPLE_SCENARIOS[0];
    setLastResult({
      scenarioId: sc.id,
      scenarioName: sc.name,
      badge: sc.badge,
      badgeType: sc.badgeType,
      config: sc.defaultConfig,
      evidence: sc.sampleEvidence,
      decision: sc.sampleDecision,
      timestamp: new Date().toISOString()
    });
    setCurrentPage('results');
  };

  return (
    <div className="app-container">
      {/* 1. Mandatory Persistent Demo Banner */}
      <PersistentBanner />

      {/* 2. Primary Navigation Bar */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        backendConnected={backendConnected}
      />

      {/* 3. Dynamic Page View */}
      <main className="main-content">
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

      {/* 4. Footer with Academic Note */}
      <footer className="app-footer">
        <div>
          <strong>Quantum-Inspired Cyber Threat Detection for Digital Signatures</strong> — Student Research Project
        </div>
        <div style={{ marginTop: '0.35rem', color: 'var(--text-muted)' }}>
          Classical simulation prototype | No AI/ML in detection loop | Reproducible scientific design
        </div>
      </footer>
    </div>
  );
}
