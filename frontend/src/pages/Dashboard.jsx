import React, { useState, useEffect } from 'react';
import { ArrowRight, Activity, ShieldCheck, AlertTriangle, BookOpen, History } from '../components/Icons';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';

export default function Dashboard({ onLaunchScenario, navigateTo }) {
  // Load animation state for the Evidence Signal Strip
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-transition" style={{ maxWidth: '1320px', margin: '0 auto' }}>
      {/* 1. 12-Column Editorial Opening (Left 7 Cols / Right 5 Cols) */}
      <section className="grid-12" style={{ alignItems: 'start', marginBottom: '2.5rem' }}>
        {/* Left 7 Columns: Strategic Research Briefing */}
        <div className="col-span-7">
          <span className="eyebrow">Smart India Hackathon 2026 · Research Prototype</span>
          <h1 className="display-title" style={{ maxWidth: '740px', marginBottom: '0.85rem' }}>
            Quantum-Inspired Cyber Threat Detection for Digital Signature Security
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.925rem', lineHeight: '1.65' }}>
            An investigation into physics-grounded threat detection mechanisms for teleportation-based Quantum Digital Signature (QDS) protocols.
            Security derives from the <strong>Quantum No-Cloning Theorem</strong>: unauthorized eavesdropping on non-orthogonal quantum states unavoidably elevates the
            <strong> Quantum Bit Error Rate (QBER)</strong>.
            <em> The detector operates strictly on physical measurement statistics — no artificial intelligence or machine learning is used.</em>
          </p>

          {/* Primary Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigateTo('simulation')}
            >
              <Activity className="app-icon" size={16} />
              <span>Configure Experiment</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigateTo('results')}
            >
              <ShieldCheck className="app-icon" size={16} />
              <span>View Evidence</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigateTo('protocol')}
              style={{ fontSize: '0.825rem' }}
            >
              <span>Read Protocol</span>
              <ArrowRight className="app-icon" size={14} />
            </button>
          </div>

          {/* Hero Focal Visual: Stylized Evidence Signal Strip (with Subtle Load Animation) */}
          <div className="evidence-signal-strip" aria-label="Detection principle reference diagram">
            <div className="signal-strip-top">
              <span className="signal-strip-label">Evidence Signal Model (Illustrative Reference)</span>
              <span className="provenance-notation">Ground Truth Demo</span>
            </div>

            <div className="signal-track-container" title="Observed illustrative QBER vs Decision Threshold τ">
              <div
                className="signal-bar-fill"
                style={{
                  width: animated ? '24%' : '0%'
                }}
              />
              <div
                className="signal-marker-tau"
                style={{ left: '40%' }}
                title="Security Threshold τ = 8.0%"
              />
            </div>

            <div className="signal-strip-readout">
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Observed QBER: </span>
                <strong style={{ color: 'var(--brand)' }}>1.60%</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Cutoff τ: </span>
                <strong style={{ color: 'var(--warning)' }}>8.00%</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Margin: </span>
                <strong style={{ color: 'var(--success)' }}>6.4 pp below</strong>
              </div>
              <span className="editorial-badge pass">Pass (Authentic)</span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Research Status Panel (Structured Memo with Fine Separators) */}
        <aside className="col-span-5 research-status-panel" aria-label="Research Status Specification">
          <div className="status-memo-header">System Specification Brief</div>

          <div className="status-memo-row">
            <span className="status-memo-label">Current Data Mode</span>
            <span className="status-memo-val">Illustrative Samples</span>
          </div>

          <div className="status-memo-row">
            <span className="status-memo-label">Detector Mechanism</span>
            <span className="status-memo-val">Threshold Comparison</span>
          </div>

          <div className="status-memo-row">
            <span className="status-memo-label">Live Verify API</span>
            <span className="status-memo-val" style={{ color: 'var(--danger)' }}>Draft Only (Not Implemented)</span>
          </div>

          <div className="status-memo-row">
            <span className="status-memo-label">Simulator Engine</span>
            <span className="status-memo-val">Classical Python (CPU)</span>
          </div>

          <div className="status-memo-row">
            <span className="status-memo-label">AI / ML Usage</span>
            <span className="status-memo-val">None (Physics Statistics)</span>
          </div>

          <div className="status-memo-row">
            <span className="status-memo-label">Session Storage</span>
            <span className="status-memo-val">Memory-Only (Resets on Reload)</span>
          </div>
        </aside>
      </section>

      {/* 2. Connected Horizontal Process Line (01 CONFIGURE ●── 02 SCENARIO ●──) */}
      <section aria-label="Connected Research Workflow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <span className="eyebrow" style={{ marginBottom: 0 }}>Research Methodology Workflow</span>
          <span className="provenance-notation">5-Stage Verification Lifecycle</span>
        </div>

        <div className="process-line-flow">
          <div className="process-node">
            <div className="node-header">
              <span className="node-dot" />
              <span className="node-num">01</span>
              <span className="node-title">Configure</span>
            </div>
            <p className="node-desc">Set projective shots, depolarizing noise (η), and decision cutoff (τ).</p>
          </div>

          <div className="process-node">
            <div className="node-header">
              <span className="node-dot" style={{ backgroundColor: 'var(--text-muted)' }} />
              <span className="node-num" style={{ color: 'var(--text-muted)' }}>02</span>
              <span className="node-title">Scenario</span>
            </div>
            <p className="node-desc">Select clean channel baseline, active state forgery, or transcript replay.</p>
          </div>

          <div className="process-node">
            <div className="node-header">
              <span className="node-dot" style={{ backgroundColor: 'var(--text-muted)' }} />
              <span className="node-num" style={{ color: 'var(--text-muted)' }}>03</span>
              <span className="node-title">Run</span>
            </div>
            <p className="node-desc">Execute demonstration session and capture isolated snapshot telemetry.</p>
          </div>

          <div className="process-node">
            <div className="node-header">
              <span className="node-dot" style={{ backgroundColor: 'var(--text-muted)' }} />
              <span className="node-num" style={{ color: 'var(--text-muted)' }}>04</span>
              <span className="node-title">Evidence</span>
            </div>
            <p className="node-desc">Analyze observed QBER, Bell-state projections, and nonce freshness.</p>
          </div>

          <div className="process-node">
            <div className="node-header">
              <span className="node-dot" style={{ backgroundColor: 'var(--text-muted)' }} />
              <span className="node-num" style={{ color: 'var(--text-muted)' }}>05</span>
              <span className="node-title">Interpret</span>
            </div>
            <p className="node-desc">Compare QBER against threshold τ to evaluate authenticity or abort.</p>
          </div>
        </div>
      </section>

      {/* 3. Capability Split Section: Product Architecture Summary */}
      <section style={{ margin: '3rem 0 2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          <h2 className="section-title">System Capability & Architectural Boundary</h2>
          <span className="editorial-badge neutral">Milestone 0 Starter Status</span>
        </div>

        <div className="grid-12">
          {/* Left Column: Active Working Capabilities */}
          <div className="col-span-6" style={{ paddingRight: '1rem', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <span className="telemetry-dot" style={{ backgroundColor: 'var(--success)', width: '8px', height: '8px' }} />
              <h3 className="subsection-title">Currently Working (Implemented Now)</h3>
            </div>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.3rem', fontSize: '0.86rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
              <li><strong>Interactive Research Console:</strong> Full parameter workbench with Clean, Degraded, and Attack presets.</li>
              <li><strong>Independent Result Snapshots:</strong> Each run captures an isolated record without draft-form bleed.</li>
              <li><strong>Threshold Margin Mathematics:</strong> Defensive calculation (τ − QBER) with exact percentage point deltas.</li>
              <li><strong>Field-Level Provenance:</strong> Clear demarcation of static samples, frontend calculations, and user configurations.</li>
              <li><strong>Audit History Export:</strong> Downloadable JSON transcript of session records.</li>
            </ul>
          </div>

          {/* Right Column: Roadmap / Proposed Architecture */}
          <div className="col-span-6" style={{ paddingLeft: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <span className="telemetry-dot" style={{ backgroundColor: 'var(--warning)', width: '8px', height: '8px' }} />
              <h3 className="subsection-title">Roadmap / Proposed Architecture</h3>
            </div>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.3rem', fontSize: '0.86rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
              <li><strong>Django REST API (/api/verify/):</strong> Draft REST specification for remote simulation dispatch (Milestone 5).</li>
              <li><strong>State-Vector Simulation Engine:</strong> Linear-algebra quantum state evolution modeling (currently toy binary sampler).</li>
              <li><strong>Persistent Nonce Database:</strong> Server-side database tracking to detect replay attacks across sessions.</li>
              <li><strong>Backend-Persisted Audit Trail:</strong> Database-backed historical audit log (Milestone 5).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Experiment Scenario Catalogue (Rows with Fine Dividers) */}
      <section style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <div>
            <h2 className="section-title">Experiment Scenario Catalogue</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
              Predefined illustrative scenarios modeling distinct physical channel and protocol conditions.
            </p>
          </div>
          <span className="editorial-badge neutral">4 Test Scenarios</span>
        </div>

        <div className="catalogue-table-wrap">
          {SAMPLE_SCENARIOS.map((sc, idx) => (
            <div key={sc.id} className="catalogue-row-item">
              <div className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand)' }}>
                0{idx + 1}
              </div>
              <div>
                <strong style={{ color: 'var(--text-strong)' }}>{sc.name}</strong>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {sc.description}
                </div>
              </div>
              <div>
                <span className="provenance-notation" style={{ fontSize: '0.675rem' }}>QBER:</span>{' '}
                <strong className="font-mono" style={{ color: 'var(--text-strong)' }}>
                  {(sc.sampleEvidence.observedQBER * 100).toFixed(1)}%
                </strong>
              </div>
              <div>
                <span className="provenance-notation" style={{ fontSize: '0.675rem' }}>τ:</span>{' '}
                <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                  {(sc.sampleEvidence.thresholdTau * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span
                  className={`editorial-badge ${
                    sc.sampleDecision.status === 'VERIFIED_AUTHENTIC'
                      ? 'pass'
                      : sc.sampleDecision.status === 'REJECTED_FORGERY'
                      ? 'fail'
                      : 'warn'
                  }`}
                >
                  {sc.sampleDecision.status === 'VERIFIED_AUTHENTIC'
                    ? 'Authentic'
                    : sc.sampleDecision.status === 'REJECTED_FORGERY'
                    ? 'Reject (Attack)'
                    : 'Abort (Noise)'}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.76rem' }}
                  onClick={() => onLaunchScenario(sc.id)}
                >
                  <span>Configure</span>
                  <ArrowRight size={14} className="app-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
