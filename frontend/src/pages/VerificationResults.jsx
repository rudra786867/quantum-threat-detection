import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowLeftRight, CheckCircle, XCircle } from '../components/Icons';
import ExplanationTooltip from '../components/ExplanationTooltip';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';

export default function VerificationResults({ result, navigateTo }) {
  // If no run has occurred yet, fallback to the default legitimate scenario
  const currentResult = result || {
    scenarioId: SAMPLE_SCENARIOS[0].id,
    scenarioName: SAMPLE_SCENARIOS[0].name,
    badge: SAMPLE_SCENARIOS[0].badge,
    badgeType: SAMPLE_SCENARIOS[0].badgeType,
    config: SAMPLE_SCENARIOS[0].defaultConfig,
    evidence: SAMPLE_SCENARIOS[0].sampleEvidence,
    decision: SAMPLE_SCENARIOS[0].sampleDecision,
    timestamp: 'Initial Sample'
  };

  const { evidence, decision, config } = currentResult;
  const qberPercent = (evidence.observedQBER * 100).toFixed(2);
  const tauPercent = (evidence.thresholdTau * 100).toFixed(2);
  const isQberExceeded = evidence.observedQBER > evidence.thresholdTau;
  const safetyMargin = (evidence.thresholdTau - evidence.observedQBER) * 100;
  const safetyMarginStr = (safetyMargin >= 0 ? '+' : '') + safetyMargin.toFixed(2) + '%';

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="badge badge-muted" style={{ marginBottom: '0.4rem' }}>
              Scenario: {currentResult.scenarioName}
            </span>
            <h1 className="card-title" style={{ fontSize: '1.4rem' }}>
              Verification Evidence & Decision Analysis
            </h1>
          </div>
          <span className={`badge ${
            decision.status === 'VERIFIED_AUTHENTIC'
              ? 'badge-success'
              : decision.status === 'REJECTED_FORGERY'
              ? 'badge-danger'
              : 'badge-warning'
          }`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
            {decision.verdictText}
          </span>
        </div>

        {/* Core Evidence Grid */}
        <div className="grid-4" style={{ marginTop: '1rem' }}>
          <div className="metric-box">
            <div className="metric-label">
              <ExplanationTooltip term="Observed QBER" explanation="Quantum Bit Error Rate observed in the verification basis." />
            </div>
            <div className="metric-value" style={{ color: isQberExceeded ? 'var(--danger)' : 'var(--success)' }}>
              {qberPercent}%
            </div>
            <div className="metric-sub">
              Margin: <strong style={{ color: safetyMargin >= 0 ? 'var(--success)' : 'var(--danger)' }}>{safetyMarginStr}</strong> ({isQberExceeded ? 'EXCEEDED' : 'SECURE'})
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">
              <ExplanationTooltip term="State Fidelity (F)" explanation="Overlap between the prepared quantum signature state and the state reconstructed after teleportation." />
            </div>
            <div className="metric-value">
              {evidence.teleportationFidelity.toFixed(3)}
            </div>
            <div className="metric-sub">
              Expected legitimate: ≥ 0.950
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">
              <ExplanationTooltip term="Freshness Nonce" explanation="Unique random token sent with the signature request to prevent replay attacks." />
            </div>
            <div className="metric-value" style={{ fontSize: '1rem', color: evidence.nonceFreshness === 'VALID_UNIQUE' ? 'var(--success)' : 'var(--warning)' }}>
              {evidence.nonceFreshness === 'VALID_UNIQUE' ? 'VALID' : 'REPLAY DUPLICATE'}
            </div>
            <div className="metric-sub font-mono text-xs truncate">
              {config.nonce || 'N/A'}
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">
              <ExplanationTooltip term="Measurement Shots" explanation="Total simulated projective measurements collected for this verification run." />
            </div>
            <div className="metric-value">
              {evidence.shotsSimulated}
            </div>
            <div className="metric-sub">
              Finite-sample statistical test
            </div>
          </div>
        </div>

        {/* Visual Threshold Bar */}
        <div style={{ marginTop: '1.25rem', backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Error Rate vs Security Threshold:</span>
              <span className={`badge ${safetyMargin >= 0 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.725rem', padding: '0.15rem 0.5rem' }}>
                Safety Margin (τ - QBER): {safetyMarginStr}
              </span>
            </div>
            <span className="font-mono">
              QBER: <strong>{qberPercent}%</strong> / τ: <strong>{tauPercent}%</strong>
            </span>
          </div>
          <div className="progress-track" style={{ height: '12px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(evidence.observedQBER / 0.35 * 100, 100)}%`,
                backgroundColor: isQberExceeded ? 'var(--danger)' : 'var(--success)'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            <span>0% (Ideal Channel)</span>
            <span style={{ color: 'var(--warning)' }}>τ = {tauPercent}% (Cutoff)</span>
            <span>35% (Max Intercept Disturbance)</span>
          </div>
        </div>
      </div>

      {/* Decision Rationale & Monitoring Warnings */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Detector Statistical Justification
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div>
              <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Physical Evidence Reasoning:</strong>
              <p style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {decision.statisticalJustification}
              </p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Protocol Freshness & Key Check:</strong>
              <p style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {decision.protocolJustification}
              </p>
            </div>
            <div className="callout callout-info" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              <em>{decision.illustrativeDisclaimer}</em>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Decoupled Monitoring Warning
            </h2>
            <span className="badge badge-muted">Separated Stream</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              To maintain scientific integrity, <strong>signature verification decisions</strong> (accept/reject) are strictly decoupled from <strong>monitoring warnings</strong> (telemetry/channel condition).
            </p>
            {decision.monitoringWarning ? (
              <div className="callout callout-warning">
                {decision.monitoringWarning}
              </div>
            ) : (
              <div className="callout callout-info">
                No telemetry alerts. Quantum channel is operating within normal baseline noise bounds.
              </div>
            )}
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Note: An incomplete calculation, degraded channel, or expired nonce will NEVER default to an accepted signature.
            </p>
          </div>
        </div>
      </div>

      {/* Bell-State Measurement Distribution Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Bell-State Measurement (BSM) Projective Statistics
          </h2>
          <span className="badge badge-muted">Simulated Projections</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Bob's joint Bell-state measurement resolves the incoming signature qubit and one half of the pre-shared EPR pair into one of four orthogonal Bell states:
        </p>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bell State</th>
                <th>Observed Counts</th>
                <th>Observed Probability</th>
                <th>Expected Uniform (Ideal)</th>
                <th>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(evidence.bsmOutcomeDistribution).map(([state, count]) => {
                const prob = (count / evidence.shotsSimulated * 100).toFixed(1);
                return (
                  <tr key={state}>
                    <td className="font-mono" style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{state}</td>
                    <td className="font-mono">{count}</td>
                    <td className="font-mono">{prob}%</td>
                    <td className="font-mono">25.0%</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      Orthogonal projection outcome
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison: Legitimate vs Attacked Sessions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <ArrowLeftRight className="w-5 h-5 text-indigo-400" />
            Comparison: Legitimate vs. Attacked Sessions
          </h2>
          <span className="badge badge-info">Design Reference</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          A direct comparison showing how our non-ML detector differentiates between legitimate transmission, state forgery, replay, and channel noise:
        </p>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>QBER</th>
                <th>Fidelity (F)</th>
                <th>Nonce Freshness</th>
                <th>Primary Detection Evidence</th>
                <th>Detector Verdict</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_SCENARIOS.map((sc) => (
                <tr key={sc.id} style={{ backgroundColor: sc.id === currentResult.scenarioId ? 'rgba(255, 30, 86, 0.1)' : 'transparent' }}>
                  <td style={{ fontWeight: 600 }}>{sc.name}</td>
                  <td className="font-mono" style={{ color: sc.sampleEvidence.observedQBER > 0.08 ? 'var(--danger)' : 'var(--success)' }}>
                    {(sc.sampleEvidence.observedQBER * 100).toFixed(1)}%
                  </td>
                  <td className="font-mono">{sc.sampleEvidence.teleportationFidelity.toFixed(3)}</td>
                  <td>
                    <span className={`badge ${sc.sampleEvidence.nonceFreshness === 'VALID_UNIQUE' ? 'badge-success' : 'badge-warning'}`}>
                      {sc.sampleEvidence.nonceFreshness === 'VALID_UNIQUE' ? 'Unique' : 'Replay'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {sc.id === 'legitimate' && 'QBER < τ, high fidelity, fresh nonce'}
                    {sc.id === 'forgery' && 'QBER elevated to 28% due to unauthorized measurement'}
                    {sc.id === 'replay' && 'Quantum statistics normal, but nonce duplicate in database'}
                    {sc.id === 'interference' && 'Uniform depolarizing noise exceeds threshold τ'}
                  </td>
                  <td>
                    <span className={`badge ${
                      sc.sampleDecision.status === 'VERIFIED_AUTHENTIC'
                        ? 'badge-success'
                        : sc.sampleDecision.status === 'REJECTED_FORGERY'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}>
                      {sc.sampleDecision.verdictText}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
