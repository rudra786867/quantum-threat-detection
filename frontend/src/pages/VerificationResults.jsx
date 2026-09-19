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

  // Plain-English takeaway for normal users
  let plainEnglishHeadline = '';
  let plainEnglishMessage = '';
  let plainEnglishBadgeColor = '';
  let plainEnglishBorderColor = '';

  if (decision.status === 'VERIFIED_AUTHENTIC') {
    plainEnglishHeadline = '✅ Authentic & Safe to Accept';
    plainEnglishMessage = `The quantum signature arrived intact! Physical measurement errors were only ${qberPercent}%, well below our ${tauPercent}% safety red line. The single-use session ID is fresh and valid. Alice's signature is verified genuine.`;
    plainEnglishBadgeColor = 'badge-success';
    plainEnglishBorderColor = 'rgba(0, 240, 168, 0.4)';
  } else if (decision.status === 'REJECTED_FORGERY') {
    plainEnglishHeadline = '🚨 Hacker Caught (Eve Eavesdropping / Forgery)';
    plainEnglishMessage = `An unauthorized third party attempted to measure or fake the quantum signature particles! Because quantum particles cannot be read without disturbing their state (the No-Cloning Law), this tampering spiked the error rate to ${qberPercent}% (way past our ${tauPercent}% limit). The fraudulent signature was rejected.`;
    plainEnglishBadgeColor = 'badge-danger';
    plainEnglishBorderColor = 'rgba(255, 0, 60, 0.5)';
  } else if (decision.status === 'REJECTED_REPLAY') {
    plainEnglishHeadline = '🛑 Replay Attack Blocked (Stolen Token Reused)';
    plainEnglishMessage = `An attacker captured a previously valid transaction and attempted to re-send it. While the recorded quantum signal looked normal, our security database identified that this unique Session Nonce was already used before. The replay attempt was immediately blocked!`;
    plainEnglishBadgeColor = 'badge-warning';
    plainEnglishBorderColor = 'rgba(255, 170, 0, 0.5)';
  } else {
    plainEnglishHeadline = '⚠️ Unsafe Line (Safely Aborted)';
    plainEnglishMessage = `The optical line has high physical static (${qberPercent}% errors). Because severe noise makes it impossible to guarantee that an attacker is not hiding inside the static, the detector safely aborted the transaction to protect your security.`;
    plainEnglishBadgeColor = 'badge-warning';
    plainEnglishBorderColor = 'rgba(255, 170, 0, 0.5)';
  }

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

        {/* Plain-English Executive Summary for Normal Users */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: `1px solid ${plainEnglishBorderColor}`,
          borderRadius: '8px',
          padding: '1.1rem 1.25rem',
          marginTop: '0.5rem',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              {plainEnglishHeadline}
            </h2>
            <span className={`badge ${plainEnglishBadgeColor}`} style={{ fontSize: '0.75rem' }}>
              {decision.status === 'VERIFIED_AUTHENTIC' ? 'STATUS: SAFE' : 'STATUS: THREAT BLOCKED'}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
            {plainEnglishMessage}
          </p>
        </div>

        {/* Core Evidence Grid */}
        <div className="grid-4" style={{ marginTop: '1rem' }}>
          <div className="metric-box">
            <div className="metric-label">
              <ExplanationTooltip term="Error Rate (QBER)" explanation="Quantum Bit Error Rate: the percentage of errors observed in the received particles." />
            </div>
            <div className="metric-value" style={{ color: isQberExceeded ? 'var(--danger)' : 'var(--success)' }}>
              {qberPercent}%
            </div>
            <div className="metric-sub">
              Safety Red Line: <strong>{tauPercent}%</strong> ({isQberExceeded ? 'BREACHED' : 'SAFE'})
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">
              <ExplanationTooltip term="Signal Health (F)" explanation="State Fidelity: how clearly and intact the signature arrived (target is 95%+)." />
            </div>
            <div className="metric-value">
              {evidence.teleportationFidelity.toFixed(3)}
            </div>
            <div className="metric-sub">
              Target healthy: ≥ 0.950
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">
              <ExplanationTooltip term="Session ID (Nonce)" explanation="A one-time cryptographic token ensuring the transaction isn't a replay of an old one." />
            </div>
            <div className="metric-value" style={{ fontSize: '1rem', color: evidence.nonceFreshness === 'VALID_UNIQUE' ? 'var(--success)' : 'var(--warning)' }}>
              {evidence.nonceFreshness === 'VALID_UNIQUE' ? 'VALID & FRESH' : 'REPLAY DUPLICATE'}
            </div>
            <div className="metric-sub font-mono text-xs truncate">
              {config.nonce || 'N/A'}
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">
              <ExplanationTooltip term="Particles Tested" explanation="Total number of simulated light particles measured during this verification." />
            </div>
            <div className="metric-value">
              {evidence.shotsSimulated}
            </div>
            <div className="metric-sub">
              Total particles measured
            </div>
          </div>
        </div>

        {/* Visual Threshold Bar */}
        <div style={{ marginTop: '1.25rem', backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Observed Error vs Red Line:</span>
              <span className={`badge ${safetyMargin >= 0 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.725rem', padding: '0.15rem 0.5rem' }}>
                Safety Margin: {safetyMarginStr} {safetyMargin >= 0 ? '(Within Safe Zone)' : '(Breached into Danger)'}
              </span>
            </div>
            <span className="font-mono">
              Error: <strong>{qberPercent}%</strong> / Limit: <strong>{tauPercent}%</strong>
            </span>
          </div>
          <div className="progress-track" style={{ height: '14px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(evidence.observedQBER / 0.35 * 100, 100)}%`,
                backgroundColor: isQberExceeded ? 'var(--danger)' : 'var(--success)'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            <span style={{ color: '#00f0a8' }}>🟢 Safe Zone (0% to {tauPercent}%)</span>
            <span style={{ color: 'var(--warning)' }}>Red Line = {tauPercent}%</span>
            <span style={{ color: '#ff3366' }}>🔴 Danger Zone ({tauPercent}% to 35%)</span>
          </div>
        </div>
      </div>

      {/* Technical Evidence Divider */}
      <div style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🔬 Deep Scientific Evidence & Audit Logs (For Technical Evaluators)
        </h3>
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
