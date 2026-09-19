import React, { useState, useRef } from 'react';
import { RefreshCw, Activity, ArrowRight } from '../components/Icons';
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

  const submittingRef = useRef(false);
  const [formError, setFormError] = useState('');

  // Draft Form State for Next Run
  const [shots, setShots] = useState(currentScenario.defaultConfig.shots);
  const [noise, setNoise] = useState(currentScenario.defaultConfig.channelNoise);
  const [threshold, setThreshold] = useState(currentScenario.defaultConfig.decisionThreshold);
  const [nonce, setNonce] = useState(currentScenario.defaultConfig.nonce);

  // Mandated Presets
  const presets = [
    { id: 'clean', index: '01', label: 'Clean Channel', scenarioId: 'legitimate', noise: 0.01, threshold: 0.08, shots: 256 },
    { id: 'degraded', index: '02', label: 'Degraded Channel', scenarioId: 'legitimate', noise: 0.12, threshold: 0.08, shots: 256 },
    { id: 'attack', index: '03', label: 'Attack Scenario', scenarioId: 'forgery', noise: 0.02, threshold: 0.08, shots: 256 }
  ];

  const configureScenario = (id, preset = null) => {
    if (isRunning || submittingRef.current) return;
    const scenario = SAMPLE_SCENARIOS.find((item) => item.id === id);
    if (!scenario) return;

    setSelectedScenarioId(id);
    setShots(preset ? preset.shots : scenario.defaultConfig.shots);
    setNoise(preset ? preset.noise : scenario.defaultConfig.channelNoise);
    setThreshold(preset ? preset.threshold : scenario.defaultConfig.decisionThreshold);
    setNonce(scenario.defaultConfig.nonce);
    setFormError('');
  };

  const handleScenarioChange = (e) => {
    configureScenario(e.target.value);
  };

  const activePreset = presets.find(
    (p) =>
      selectedScenarioId === p.scenarioId &&
      Number(shots) === p.shots &&
      Number(noise) === p.noise &&
      Number(threshold) === p.threshold &&
      nonce === SAMPLE_SCENARIOS.find((s) => s.id === p.scenarioId)?.defaultConfig.nonce
  );

  const handleRun = async () => {
    if (isRunning || submittingRef.current) return;

    const numShots = Number(shots);
    const numNoise = Number(noise);
    const numThreshold = Number(threshold);
    const trimmedNonce = typeof nonce === 'string' ? nonce.trim() : '';

    if (![128, 256, 512, 1024].includes(numShots)) {
      setFormError('Invalid shot count. Please select 128, 256, 512, or 1024.');
      return;
    }
    if (!Number.isFinite(numThreshold) || numThreshold < 0.01 || numThreshold > 0.25) {
      setFormError('Decision threshold (τ) must be within [0.01, 0.25].');
      return;
    }
    if (!Number.isFinite(numNoise) || numNoise < 0 || numNoise > 0.30) {
      setFormError('Channel noise (η) must be within [0.00, 0.30].');
      return;
    }
    if (!trimmedNonce) {
      setFormError('Session nonce is required and cannot be empty.');
      return;
    }

    submittingRef.current = true;
    setFormError('');

    try {
      await onRunSimulation(selectedScenarioId, {
        shots: numShots,
        channelNoise: numNoise,
        decisionThreshold: numThreshold,
        nonce: trimmedNonce
      });
    } catch {
      setFormError('Demonstration session failed. Please retry.');
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <div className="page-transition" style={{ maxWidth: '1320px', margin: '0 auto' }}>
      {/* Editorial Header */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem', marginBottom: '2rem' }}>
        <span className="eyebrow">Workstation Control</span>
        <h1 className="page-title">Simulation & Parameter Lab</h1>
        <p className="page-subtitle">
          Configure experimental parameters for teleportation-based QDS verification.
          Select standard benchmark presets or customize channel noise, decision threshold (τ), and measurement repetitions.
        </p>
      </div>

      {/* Dedicated Lab Grid: Left ~70% / Right ~30% */}
      <div className="grid-lab">
        {/* Left Column: Experiment Configuration */}
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRun();
            }}
          >
            {/* 01 Scenario Selection */}
            <div className="lab-section-block">
              <div className="lab-step-indicator">
                <span className="lab-step-num">01</span>
                <span className="lab-step-title">Experiment Scenario (Ground Truth Injection)</span>
              </div>

              <select
                id="scenario-select"
                className="input-select"
                value={selectedScenarioId}
                onChange={handleScenarioChange}
                disabled={isRunning}
              >
                {SAMPLE_SCENARIOS.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name} — {sc.badge}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.45rem', lineHeight: 1.5 }}>
                {currentScenario.description}
              </div>
            </div>

            {/* 02 Instrument Presets */}
            <div className="lab-section-block">
              <div className="lab-step-indicator">
                <span className="lab-step-num">02</span>
                <span className="lab-step-title">Instrument Presets</span>
                <span className="provenance-notation" style={{ marginLeft: 'auto' }}>Standard Benchmarks</span>
              </div>

              <div className="preset-strip">
                {presets.map((p) => {
                  const isSelected = activePreset?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`preset-card-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => configureScenario(p.scenarioId, p)}
                      disabled={isRunning}
                    >
                      <div className="preset-card-title">
                        <span style={{ color: isSelected ? 'var(--brand)' : 'var(--text-muted)', marginRight: '0.35rem' }}>
                          {p.index}
                        </span>
                        {p.label}
                      </div>
                      <div className="preset-card-spec">
                        {(p.noise * 100).toFixed(0)}% η · {(p.threshold * 100).toFixed(0)}% τ · {p.shots}s
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 03 Channel Configuration */}
            <div className="lab-section-block">
              <div className="lab-step-indicator">
                <span className="lab-step-num">03</span>
                <span className="lab-step-title">Channel Configuration (Simulated Medium)</span>
              </div>

              <div className="form-field">
                <div className="form-label">
                  <ExplanationTooltip
                    term="Configured Channel Noise (η)"
                    explanation="Depolarizing channel noise ratio for demonstration configuration. Range: 0.00 to 0.30. In demo mode, updates configuration parameter only; does not recompute illustrative QBER."
                  />
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--brand)' }}>
                    {(noise * 100).toFixed(1)}% η
                  </span>
                </div>

                <div className="custom-slider-wrap">
                  <input
                    id="noise-slider"
                    type="range"
                    min="0"
                    max="0.30"
                    step="0.01"
                    className="custom-slider"
                    value={noise}
                    onChange={(e) => setNoise(parseFloat(e.target.value))}
                    disabled={isRunning}
                  />
                  <div className="slider-scale-ticks">
                    <span>0.0% (Ideal)</span>
                    <span>15.0% (Moderate Noise)</span>
                    <span>30.0% (Extreme Degradation)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 04 Verification Configuration */}
            <div className="lab-section-block">
              <div className="lab-step-indicator">
                <span className="lab-step-num">04</span>
                <span className="lab-step-title">Verification & Decision Parameters</span>
              </div>

              <div className="grid-12" style={{ gap: '1.25rem' }}>
                <div className="col-span-6 form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="shots-select">
                    <ExplanationTooltip
                      term="Projective Shots"
                      explanation="Total projective measurement repetitions requested. Frontend options: 128, 256, 512, 1024."
                    />
                    <span className="provenance-notation">Config</span>
                  </label>
                  <select
                    id="shots-select"
                    className="input-select font-mono"
                    value={shots}
                    onChange={(e) => setShots(Number(e.target.value))}
                    disabled={isRunning}
                  >
                    <option value={128}>128 Shots (Fast Screening)</option>
                    <option value={256}>256 Shots (Default Precision)</option>
                    <option value={512}>512 Shots (High Confidence)</option>
                    <option value={1024}>1024 Shots (Benchmark Standard)</option>
                  </select>
                </div>

                <div className="col-span-6 form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="threshold-input">
                    <ExplanationTooltip
                      term="Security Cutoff Threshold (τ)"
                      explanation="Maximum allowable error rate before rejecting signature. Valid domain: 0.01 to 0.25 (1% to 25%)."
                    />
                    <span className="provenance-notation">Cutoff</span>
                  </label>
                  <input
                    id="threshold-input"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="0.25"
                    className="input-text font-mono"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    disabled={isRunning}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 05 Session Configuration */}
            <div className="lab-section-block">
              <div className="lab-step-indicator">
                <span className="lab-step-num">05</span>
                <span className="lab-step-title">Session Configuration & Freshness</span>
              </div>

              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="nonce-field">
                  <ExplanationTooltip
                    term="Session Nonce Token"
                    explanation="Cryptographic token ensuring transcript freshness to detect classical replay attacks."
                  />
                  <span className="provenance-notation">Freshness Token</span>
                </label>
                <input
                  id="nonce-field"
                  type="text"
                  className="input-text font-mono"
                  style={{ fontSize: '0.82rem' }}
                  value={nonce}
                  onChange={(e) => setNonce(e.target.value)}
                  disabled={isRunning}
                  required
                />
              </div>
            </div>

            {formError && (
              <div className="dossier-notice danger" role="alert" style={{ marginTop: '1rem' }}>
                {formError}
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Execution Console Rail (Compact, Proportional, NO Media Player Button) */}
        <aside className="command-panel" aria-label="Execution Console Rail">
          <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span className="eyebrow" style={{ marginBottom: '0.2rem' }}>Execution Console</span>
            <h2 className="section-title" style={{ fontSize: '1.05rem' }}>Run Configuration</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-muted)' }}>Scenario:</span>
              <strong style={{ color: 'var(--text-strong)', textAlign: 'right' }}>{currentScenario.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shots:</span>
              <span className="font-mono">{shots}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-muted)' }}>Threshold (τ):</span>
              <span className="font-mono">{(threshold * 100).toFixed(1)}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-muted)' }}>Noise (η):</span>
              <span className="font-mono">{(noise * 100).toFixed(1)}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-muted)' }}>Data Mode:</span>
              <span className="provenance-notation">Illustrative</span>
            </div>
          </div>

          {/* Normal CTA Sized Button (Height 46px, NO Play Media-Player Icon!) */}
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', height: '46px', fontSize: '0.88rem' }}
            disabled={isRunning}
            onClick={handleRun}
          >
            {isRunning ? (
              <>
                <RefreshCw className="app-icon animate-spin" size={16} />
                <span>Executing Demonstration...</span>
              </>
            ) : (
              <span>Run Demonstration</span>
            )}
          </button>

          <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
            Changing channel noise updates configuration only. It does not recompute illustrative QBER, measurement evidence, or recorded sample verdict.
          </div>

          {/* Latest Snapshot Section */}
          {lastResult && (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="eyebrow" style={{ marginBottom: 0 }}>Latest Snapshot</span>
                <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {lastResult.runId}
                </span>
              </div>
              <div style={{ fontSize: '0.835rem', fontWeight: 600, color: 'var(--text-strong)' }}>
                {lastResult.scenarioName}
              </div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                QBER: <strong style={{ color: 'var(--text-strong)' }}>{(lastResult.evidence.observedQBER * 100).toFixed(1)}%</strong> · τ: {(lastResult.config.decisionThreshold * 100).toFixed(1)}%
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', height: '38px', fontSize: '0.78rem', marginTop: '0.35rem' }}
                onClick={() => navigateTo('results')}
              >
                <span>Inspect Evidence Report</span>
                <ArrowRight className="app-icon" size={14} />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
