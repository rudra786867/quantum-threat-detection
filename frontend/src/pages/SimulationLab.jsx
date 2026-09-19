import React, { useState } from 'react';
import { Play, RefreshCw, Activity, ShieldCheck, AlertTriangle, Info, ArrowRight } from '../components/Icons';
import ExplanationTooltip from '../components/ExplanationTooltip';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';

export default function SimulationLab({
  selectedScenarioId,
  setSelectedScenarioId,
  onRunSimulation,
  isRunning,
  lastResult,
  navigateTo
}) {
  const currentScenario = SAMPLE_SCENARIOS.find((s) => s.id === selectedScenarioId) || SAMPLE_SCENARIOS[0];

  // Configurable parameters
  const [shots, setShots] = useState(currentScenario.defaultConfig.shots);
  const [noise, setNoise] = useState(currentScenario.defaultConfig.channelNoise);
  const [threshold, setThreshold] = useState(currentScenario.defaultConfig.decisionThreshold);
  const [nonce, setNonce] = useState(currentScenario.defaultConfig.nonce);

  // Sync state when scenario changes
  const handleScenarioChange = (e) => {
    const newId = e.target.value;
    setSelectedScenarioId(newId);
    const sc = SAMPLE_SCENARIOS.find((s) => s.id === newId) || SAMPLE_SCENARIOS[0];
    setShots(sc.defaultConfig.shots);
    setNoise(sc.defaultConfig.channelNoise);
    setThreshold(sc.defaultConfig.decisionThreshold);
    setNonce(sc.defaultConfig.nonce);
  };

  const handleRun = () => {
    onRunSimulation(selectedScenarioId, {
      shots: Number(shots),
      channelNoise: Number(noise),
      decisionThreshold: Number(threshold),
      nonce: nonce.trim()
    });
  };

  const applyPreset = (scId, sh, n, t, non) => {
    setSelectedScenarioId(scId);
    setShots(sh);
    setNoise(n);
    setThreshold(t);
    setNonce(non);
  };

  return (
    <div className="space-y-6">
      {/* Workflow Navigation Tracker */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Workflow:</span>
          <span>1. Configure Session</span>
          <span>→</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>2. Choose Scenario</span>
          <span>→</span>
          <span>3. Run Demonstration</span>
          <span>→</span>
          <span>4. Inspect Evidence</span>
          <span>→</span>
          <span>5. Read Decision</span>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Configuration & Attack Mode */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Activity className="w-5 h-5 text-cyan-400" />
              1. Simulation Configuration
            </h2>
            <span className="badge badge-muted">Illustrative Engine</span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleRun(); }}>
            {/* Quick Evaluation Presets */}
            <div style={{ marginBottom: '1.25rem', backgroundColor: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                ⚡ 1-Click Quick Presets (Click any to test):
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => applyPreset('legitimate', 256, 0.01, 0.08, 'fresh-session-nonce-clean')}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '4px', border: '1px solid rgba(0, 240, 168, 0.35)', backgroundColor: 'rgba(0, 240, 168, 0.1)', color: '#00f0a8', cursor: 'pointer', fontWeight: 600, boxShadow: '0 0 6px rgba(0, 240, 168, 0.15)' }}
                  disabled={isRunning}
                >
                  🟢 Safe Message (1% Noise)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('forgery', 256, 0.02, 0.08, 'fresh-session-nonce-attack')}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '4px', border: '1px solid rgba(255, 0, 60, 0.45)', backgroundColor: 'rgba(255, 0, 60, 0.15)', color: '#ff3366', cursor: 'pointer', fontWeight: 600, boxShadow: '0 0 8px rgba(255, 0, 60, 0.25)' }}
                  disabled={isRunning}
                >
                  🔴 Hacker Attack (Eve)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('interference', 256, 0.15, 0.08, 'fresh-session-nonce-noise')}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '4px', border: '1px solid rgba(255, 170, 0, 0.35)', backgroundColor: 'rgba(255, 170, 0, 0.1)', color: '#ffaa00', cursor: 'pointer', fontWeight: 600 }}
                  disabled={isRunning}
                >
                  🟡 Bad Cable (15% Static)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('replay', 256, 0.02, 0.08, 'fresh-session-nonce-8f2a91')}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '4px', border: '1px solid rgba(241, 245, 249, 0.3)', backgroundColor: 'rgba(241, 245, 249, 0.1)', color: '#f1f5f9', cursor: 'pointer', fontWeight: 600, boxShadow: '0 0 6px rgba(241, 245, 249, 0.15)' }}
                  disabled={isRunning}
                >
                  🟣 Replay Old Token
                </button>
              </div>
            </div>

            {/* Beginner-friendly explanation of what will happen */}
            <div style={{ padding: '0.75rem 1rem', borderRadius: '6px', backgroundColor: 'rgba(255, 30, 86, 0.07)', border: '1px solid rgba(255, 30, 86, 0.25)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ff4d79', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                💡 What will happen in this test:
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>
                {currentScenario.description}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Select Scenario:
              </label>
              <select
                className="form-select"
                value={selectedScenarioId}
                onChange={handleScenarioChange}
                disabled={isRunning}
              >
                {SAMPLE_SCENARIOS.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name} ({sc.badge})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">
                  <ExplanationTooltip term="Measurement Shots" explanation="The total number of quantum particles sent to test the channel." />
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>Particles to send (higher = sharper accuracy):</span>
                </label>
                <select
                  className="form-select"
                  value={shots}
                  onChange={(e) => setShots(Number(e.target.value))}
                  disabled={isRunning}
                >
                  <option value={128}>128 Particles (Fast)</option>
                  <option value={256}>256 Particles (Recommended)</option>
                  <option value={512}>512 Particles (High Precision)</option>
                  <option value={1024}>1024 Particles (Rigorous Benchmark)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <ExplanationTooltip term="Security Limit (τ)" explanation="Maximum allowable error rate before the signature is rejected as compromised." />
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>Alarm red line (default: 8.0%):</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="0.25"
                  className="form-input font-mono"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  disabled={isRunning}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <ExplanationTooltip term="Cable Noise (η)" explanation="Simulated optical fiber static or thermal noise." />
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>Fiber static level (clean fiber is 1% to 3%):</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="range"
                  min="0"
                  max="0.30"
                  step="0.01"
                  style={{ flex: 1 }}
                  value={noise}
                  onChange={(e) => setNoise(parseFloat(e.target.value))}
                  disabled={isRunning}
                />
                <span className="font-mono text-sm" style={{ width: '45px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {(noise * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <ExplanationTooltip term="Session Nonce" explanation="A unique one-time token to prevent hackers from re-sending old messages." />
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>Unique session ID (protects against replay attacks):</span>
              </label>
              <input
                type="text"
                className="form-input font-mono text-xs"
                value={nonce}
                onChange={(e) => setNonce(e.target.value)}
                disabled={isRunning}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', height: '44px', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', overflow: 'hidden' }}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <RefreshCw style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }} className="animate-spin" />
                    <span>Simulating Teleportation & Measurement...</span>
                  </>
                ) : (
                  <>
                    <Play style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }} />
                    <span>Run Demonstration Session</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Scenario Context & Live Execution State */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Info className="w-5 h-5 text-cyan-400" />
              Scenario Context: {currentScenario.name}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {currentScenario.description}
            </p>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Attacker Knowledge & Capability
              </h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                <li><strong>Knowledge:</strong> {currentScenario.attackerModel.knowledge}</li>
                <li><strong>Capability:</strong> {currentScenario.attackerModel.capability}</li>
              </ul>
            </div>

            {/* Live Progress or Decision Preview */}
            {isRunning ? (
              <div className="callout callout-info" style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <strong>Simulating Quantum Process:</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Executing Bell state preparation → Channel propagation (noise: {(noise*100).toFixed(1)}%) → Verifier measurement projections...
                </div>
              </div>
            ) : lastResult ? (
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: `1px solid ${
                    lastResult.decision.status === 'VERIFIED_AUTHENTIC'
                      ? 'rgba(16, 185, 129, 0.4)'
                      : lastResult.decision.status === 'REJECTED_FORGERY'
                      ? 'rgba(239, 68, 68, 0.4)'
                      : 'rgba(245, 158, 11, 0.4)'
                  }`,
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>SAMPLE DECISION:</span>
                  <span className={`badge ${
                    lastResult.decision.status === 'VERIFIED_AUTHENTIC'
                      ? 'badge-success'
                      : lastResult.decision.status === 'REJECTED_FORGERY'
                      ? 'badge-danger'
                      : 'badge-warning'
                  }`}>
                    {lastResult.decision.verdictText}
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {lastResult.decision.statisticalJustification}
                </p>
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => navigateTo('results')}>
                    Inspect Full Evidence <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="callout callout-info" style={{ marginTop: '0.5rem' }}>
                Click <strong>"Run Demonstration Session"</strong> above to compute sample projective measurements and test this scenario against the detector.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
