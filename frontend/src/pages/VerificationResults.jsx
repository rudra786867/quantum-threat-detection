import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, ShieldCheck, AlertTriangle } from '../components/Icons';
import ExplanationTooltip from '../components/ExplanationTooltip';

export default function VerificationResults({ result, navigateTo }) {
  // Animation state for the precision evidence scale
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(timer);
  }, [result?.runId]);

  if (!result) {
    return (
      <div className="page-transition" style={{ maxWidth: '820px', margin: '3.5rem auto', textAlign: 'center' }}>
        <span className="eyebrow">Dossier Status</span>
        <h1 className="page-title" style={{ fontSize: '1.65rem', marginBottom: '0.65rem' }}>
          No Verification Report Selected
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
          Execute a demonstration in the Simulation Lab or select an existing record from the Experiment Archive to inspect its security evidence report.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigateTo('simulation')}
        >
          <Activity size={16} className="app-icon" />
          <span>Open Simulation Lab</span>
        </button>
      </div>
    );
  }

  const { evidence = {}, decision = {}, config = {} } = result;

  // Defensive validation of numeric rates
  const isValidRate = (val) => typeof val === 'number' && Number.isFinite(val) && val >= 0 && val <= 1;
  const qber = evidence.observedQBER;
  const tau = result.config?.decisionThreshold ?? evidence.thresholdTau;
  const validComparison = isValidRate(qber) && isValidRate(tau);

  const qberPercent = isValidRate(qber) ? `${(qber * 100).toFixed(2)}%` : 'Unavailable';
  const tauPercent = isValidRate(tau) ? `${(tau * 100).toFixed(2)}%` : 'Unavailable';

  // Calculate Threshold Margin defensively: tau - qber
  let marginText = 'Unavailable';
  let comparisonColor = 'var(--text-body)';
  let marginDiff = null;

  if (validComparison) {
    const rawDiff = (tau - qber) * 100;
    marginDiff = Math.round(rawDiff * 1000) / 1000;
    const absDiff = Math.abs(marginDiff);

    if (absDiff < 0.0001) {
      marginText = 'At threshold';
      comparisonColor = 'var(--warning)';
    } else if (marginDiff > 0) {
      const displayAmount = absDiff < 0.1 ? 'Less than 0.1' : absDiff.toFixed(1);
      marginText = `${displayAmount} pp below`;
      comparisonColor = 'var(--success)';
    } else {
      const displayAmount = absDiff < 0.1 ? 'Less than 0.1' : absDiff.toFixed(1);
      marginText = `${displayAmount} pp above`;
      comparisonColor = 'var(--danger)';
    }
  }

  // Display ceiling for the measurement scale
  const chartMax = validComparison ? Math.max(0.30, qber, tau) : 0.30;
  const qberPos = validComparison ? Math.min(100, Math.max(0, (qber / chartMax) * 100)) : 0;
  const tauPos = validComparison ? Math.min(100, Math.max(0, (tau / chartMax) * 100)) : 0;

  return (
    <div className="page-transition" style={{ maxWidth: '1320px', margin: '0 auto' }}>
      {/* 1. Report Header Banner (2px Brand Rule, NOT a Card) */}
      <header className="report-header-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="eyebrow">Security Evidence Report</span>
            <h1 className="page-title" style={{ fontSize: '2rem' }}>
              Evidence Report — {result.runId || 'EXP-SNAPSHOT'}
            </h1>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Scenario: <strong style={{ color: 'var(--text-strong)' }}>{result.scenarioName}</strong> ·
              Recorded: {result.timestamp ? new Date(result.timestamp).toUTCString() : 'Session Snapshot'} ·
              Mode: Illustrative Demonstration
            </div>
          </div>

          {/* Right: Controlled Recorded Sample Verdict (NOT a flashy card) */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', fontWeight: 700 }}>
              Recorded Sample Verdict
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.2rem', color: decision.status === 'VERIFIED_AUTHENTIC' ? 'var(--success)' : decision.status === 'REJECTED_FORGERY' ? 'var(--danger)' : 'var(--warning)' }}>
              {decision.verdictText}
            </div>
            <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>
              Predefined illustrative scenario value
            </div>
          </div>
        </div>
      </header>

      {/* 2. 12-Column Layout: Left 8 Columns (Report) / Right 4 Columns (Analytical Rail) */}
      <div className="grid-12">
        {/* Left 8 Columns: Core Investigation Evidence */}
        <div className="col-span-8">
          {/* Main Result Moment: Composed Measurement Hero */}
          <div className="evidence-hero-measurement">
            <div className="hero-stat-box">
              <span className="hero-stat-label">Observed QBER</span>
              <div className="hero-stat-num" style={{ color: comparisonColor }}>
                {qberPercent}
              </div>
              <span className="provenance-notation" style={{ marginTop: '0.3rem' }}>Illustrative Sample</span>
            </div>

            <div className="hero-divider-text">against</div>

            <div className="hero-stat-box">
              <span className="hero-stat-label">Security Threshold (τ)</span>
              <div className="hero-stat-num" style={{ color: 'var(--text-strong)' }}>
                {tauPercent}
              </div>
              <span className="provenance-notation" style={{ marginTop: '0.3rem' }}>User Configuration</span>
            </div>

            <div className="hero-divider-text">yields</div>

            <div className="hero-stat-box">
              <span className="hero-stat-label">Threshold Margin</span>
              <div
                className="hero-stat-num"
                data-testid="threshold-margin"
                style={{
                  fontSize: '1.65rem',
                  color: marginDiff > 0 ? 'var(--success)' : marginDiff < 0 ? 'var(--danger)' : 'var(--warning)'
                }}
              >
                {marginText}
              </div>
              <span className="provenance-notation" style={{ marginTop: '0.3rem' }}>Frontend Computed (τ − QBER)</span>
            </div>
          </div>

          {/* Precision SVG Evidence Scale (0.0% to 30%) */}
          <div className="svg-evidence-scale-container" aria-label="Evidence Measurement Scale">
            <div className="scale-top-header">
              <span style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-body)' }}>
                Precision Verification Scale
              </span>
              <span className="font-mono" style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                Domain: 0.0% – {(chartMax * 100).toFixed(0)}%
              </span>
            </div>

            <div className="svg-scale-track">
              <div
                className="svg-scale-bar-fill"
                style={{
                  width: animated ? `${qberPos}%` : '0%',
                  backgroundColor: comparisonColor
                }}
              />
              {validComparison && (
                <div
                  className="svg-scale-threshold-line"
                  style={{ left: `${tauPos}%` }}
                  title={`Cutoff Threshold τ = ${tauPercent}`}
                />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.71rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <span>0.0% (Ideal Channel)</span>
              <span style={{ color: 'var(--warning)', fontWeight: 700 }}>Cutoff τ = {tauPercent}</span>
              <span>{(chartMax * 100).toFixed(0)}%</span>
            </div>

            {/* Compact Interpretation Strip */}
            <div className="interpretation-strip">
              <div>
                <div className="interp-block-title">Observation</div>
                <div className="interp-block-text">{qberPercent} illustrative QBER</div>
              </div>
              <div>
                <div className="interp-block-title">Threshold Comparison</div>
                <div className="interp-block-text" style={{ color: marginDiff > 0 ? 'var(--success)' : marginDiff < 0 ? 'var(--danger)' : 'var(--warning)' }}>
                  {marginText}
                </div>
              </div>
              <div>
                <div className="interp-block-title">Verdict Source</div>
                <div className="interp-block-text">Predefined illustrative scenario</div>
              </div>
            </div>
          </div>

          {/* Observable Evidence Matrix */}
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.65rem' }}>
              <h2 className="section-title" style={{ fontSize: '1.05rem' }}>
                Physical Observables & Protocol Telemetry
              </h2>
              <span className="editorial-badge neutral">Evidence Matrix</span>
            </div>

            <table className="evidence-matrix-table">
              <thead>
                <tr>
                  <th>Observable</th>
                  <th>Value</th>
                  <th>Source</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Quantum Bit Error Rate (QBER)</strong></td>
                  <td className="font-mono" style={{ fontWeight: 700, color: comparisonColor }}>
                    {qberPercent}
                  </td>
                  <td>
                    <span className="provenance-notation">Illustrative Sample</span>
                  </td>
                  <td style={{ fontSize: '0.81rem', color: 'var(--text-body)' }}>
                    {marginDiff > 0
                      ? 'Below cutoff threshold; consistent with low-noise state transmission'
                      : 'Exceeds cutoff threshold; indicates state disturbance or active intercept'}
                  </td>
                </tr>

                <tr>
                  <td><strong>Teleportation State Fidelity (F)</strong></td>
                  <td className="font-mono" style={{ fontWeight: 600 }}>
                    {isValidRate(evidence.teleportationFidelity) ? evidence.teleportationFidelity.toFixed(3) : 'Unavailable'}
                  </td>
                  <td>
                    <span className="provenance-notation">Illustrative Reference</span>
                  </td>
                  <td style={{ fontSize: '0.81rem', color: 'var(--text-body)' }}>
                    Theoretical state overlap reference (Not calculated by current classical simulator)
                  </td>
                </tr>

                <tr>
                  <td><strong>Session Freshness Nonce</strong></td>
                  <td className="font-mono" style={{ fontSize: '0.81rem' }}>
                    {config.nonce || 'N/A'}
                  </td>
                  <td>
                    <span className="provenance-notation">User Input + Scenario Status</span>
                  </td>
                  <td>
                    <span className={`editorial-badge ${evidence.nonceFreshness === 'VALID_UNIQUE' ? 'pass' : 'warn'}`}>
                      {evidence.nonceFreshness === 'VALID_UNIQUE' ? 'Valid Fresh Nonce' : 'Replay Detected'}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td><strong>Measurement Repetitions</strong></td>
                  <td className="font-mono">
                    {evidence.shotsSimulated ?? config.shots ?? 256}
                  </td>
                  <td>
                    <span className="provenance-notation">User Configuration</span>
                  </td>
                  <td style={{ fontSize: '0.81rem', color: 'var(--text-body)' }}>
                    Requested projective measurement count
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bell-State Measurement Projections */}
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.65rem' }}>
              <div>
                <h3 className="section-title" style={{ fontSize: '1.05rem' }}>
                  Bell-State Measurement (BSM) Projective Statistics
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Joint Bell projections resolving signature qubit and pre-shared EPR half.
                </p>
              </div>
              <span className="editorial-badge neutral">Transformed Sample</span>
            </div>

            <table className="evidence-matrix-table">
              <thead>
                <tr>
                  <th>Bell State</th>
                  <th>Observed Counts</th>
                  <th>Observed Probability</th>
                  <th>Ideal Uniform</th>
                  <th>Transformation Method</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(evidence.bsmOutcomeDistribution || {}).map(([state, count]) => {
                  const totalShots = evidence.shotsSimulated || config.shots || 256;
                  const prob = Number.isFinite(count) && totalShots > 0
                    ? `${((count / totalShots) * 100).toFixed(1)}%`
                    : 'Unavailable';
                  return (
                    <tr key={state}>
                      <td className="font-mono" style={{ fontWeight: 700, color: 'var(--brand)' }}>
                        {state}
                      </td>
                      <td className="font-mono">{count}</td>
                      <td className="font-mono">{prob}</td>
                      <td className="font-mono" style={{ color: 'var(--text-muted)' }}>25.0%</td>
                      <td style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Scaled arithmetically from static sample to {totalShots} shots
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Columns: Single Continuous Analytical Rail (NOT Stacked Cards!) */}
        <aside className="col-span-4" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.35rem 1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1.35rem' }} aria-label="Investigation Evidence Rail">
          {/* Section 1: Run Snapshot */}
          <div style={{ paddingBottom: '1.15rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span className="eyebrow" style={{ marginBottom: '0.35rem' }}>Run Snapshot</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Run ID:</span>
                <span className="font-mono" style={{ fontSize: '0.76rem', color: 'var(--text-strong)' }}>{result.runId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Scenario:</span>
                <strong>{result.scenarioName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Channel Noise (η):</span>
                <span className="font-mono">{(config.channelNoise * 100).toFixed(1)}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Threshold (τ):</span>
                <span className="font-mono">{(config.decisionThreshold * 100).toFixed(1)}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shots:</span>
                <span className="font-mono">{config.shots}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Recorded Verdict */}
          <div style={{ paddingBottom: '1.15rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span className="eyebrow" style={{ marginBottom: '0.35rem' }}>Recorded Sample Verdict</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Verdict:</span>
              <span className={`editorial-badge ${decision.status === 'VERIFIED_AUTHENTIC' ? 'pass' : 'fail'}`}>
                {decision.status}
              </span>
            </div>
            <div style={{ fontSize: '0.735rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.45 }}>
              Predefined illustrative scenario value. Evaluated independently of frontend threshold comparison.
            </div>
          </div>

          {/* Section 3: Provenance Ledger Signature Pattern */}
          <div style={{ paddingBottom: '1.15rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span className="eyebrow" style={{ marginBottom: '0.35rem' }}>Provenance Ledger</span>
            <div className="provenance-ledger-table">
              <div className="provenance-ledger-row">
                <span className="provenance-ledger-field">QBER</span>
                <span className="provenance-ledger-tag">SAMPLE</span>
              </div>
              <div className="provenance-ledger-row">
                <span className="provenance-ledger-field">Fidelity</span>
                <span className="provenance-ledger-tag">SAMPLE</span>
              </div>
              <div className="provenance-ledger-row">
                <span className="provenance-ledger-field">Threshold</span>
                <span className="provenance-ledger-tag">CONFIG</span>
              </div>
              <div className="provenance-ledger-row">
                <span className="provenance-ledger-field">Margin</span>
                <span className="provenance-ledger-tag">FRONTEND</span>
              </div>
              <div className="provenance-ledger-row">
                <span className="provenance-ledger-field">Counts</span>
                <span className="provenance-ledger-tag">SAMPLE → SCALED</span>
              </div>
              <div className="provenance-ledger-row">
                <span className="provenance-ledger-field">Verdict</span>
                <span className="provenance-ledger-tag">SAMPLE</span>
              </div>
            </div>
          </div>

          {/* Section 4: Telemetry & Limitations */}
          <div style={{ paddingBottom: '1.15rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span className="eyebrow" style={{ marginBottom: '0.35rem' }}>Channel Telemetry</span>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
              Verification is strictly decoupled from physical channel telemetry.
            </p>
            {decision.monitoringWarning ? (
              <div className="dossier-notice warning" style={{ margin: '0.5rem 0 0 0', fontSize: '0.74rem' }}>
                <strong>Alert:</strong> {decision.monitoringWarning}
              </div>
            ) : (
              <div className="dossier-notice info" style={{ margin: '0.5rem 0 0 0', fontSize: '0.74rem' }}>
                <strong>Channel Health:</strong> Normal. Physical error rate within baseline.
              </div>
            )}
          </div>

          {/* Section 5: Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', height: '42px' }}
              onClick={() => navigateTo('simulation')}
            >
              <Activity size={16} className="app-icon" />
              <span>Configure New Run</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', height: '42px' }}
              onClick={() => navigateTo('history')}
            >
              <span>View Experiment Archive</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
