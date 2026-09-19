import React from 'react';
import { ShieldCheck, ShieldAlert, Shield, Activity, ArrowRight, BookOpen, AlertTriangle } from '../components/Icons';
import ExplanationTooltip from '../components/ExplanationTooltip';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';

export default function Dashboard({ onLaunchScenario, navigateTo }) {
  return (
    <div className="space-y-6">
      {/* Hero / Scope Banner */}
      <section className="card" style={{ background: 'linear-gradient(135deg, #18050a 0%, #0d0a12 50%, #1a0812 100%)', border: '1px solid rgba(255, 30, 86, 0.25)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 30, 86, 0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-info">Quantum Security Prototype</span>
            <span className="badge badge-success">No AI / Pure Physics</span>
            <span className="badge badge-muted">Beginner Friendly</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Quantum Digital Signature Threat Detection
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '850px', fontSize: '1rem', lineHeight: '1.6' }}>
            Think of a <strong>Quantum Digital Signature</strong> like a <em>high-tech tamper-evident wax seal</em> on a private letter. 
            If a hacker tries to spy on, copy, or fake the quantum signature, the fundamental laws of quantum physics <strong>inevitably break the seal</strong>, exposing the attack with 100% mathematical certainty.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn btn-primary" onClick={() => navigateTo('simulation')}>
              <Activity className="w-4 h-4" />
              Try a Test in Simulation Lab
            </button>
            <button className="btn btn-secondary" onClick={() => navigateTo('protocol')}>
              <BookOpen className="w-4 h-4" />
              Read How It Works
            </button>
          </div>
        </div>
      </section>

      {/* How It Works in 3 Simple Steps */}
      <section className="card" style={{ border: '1px solid rgba(255, 30, 86, 0.25)' }}>
        <div className="card-header" style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem' }}>
          <div>
            <h2 className="card-title" style={{ fontSize: '1.15rem' }}>
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              How It Works (In 3 Simple Steps)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.15rem' }}>
              No physics degree required — here is how the system protects digital transactions:
            </p>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ background: 'rgba(0, 240, 168, 0.15)', color: '#00f0a8', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>1</span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Alice Signs the Document</h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Alice prepares unique quantum particles of light (qubits) that represent her digital signature and sends them across the quantum channel to Bob.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ background: 'rgba(255, 0, 60, 0.18)', color: '#ff3366', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>2</span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Physics Catches Any Spy</h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              If a hacker (Eve) intercepts or measures the particles, the <em>Quantum No-Cloning Law</em> automatically disturbs them, causing a huge spike in errors (~25%).
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ background: 'rgba(255, 30, 86, 0.18)', color: '#ff1e56', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>3</span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Bob Verifies the Security</h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Bob checks the error rate. If errors are under <strong>8.0%</strong>, the signature is genuine! If higher, the system immediately blocks the forgery.
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid-4">
        <div className="metric-box">
          <div className="metric-label">
            <span>Detection Method</span>
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>
            Pure Physics
          </div>
          <div className="metric-sub">
            Zero AI/ML guesswork. Grounded strictly in quantum mechanics.
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">
            <span>Safety Red Line (τ)</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="metric-value">8.0% Error</div>
          <div className="metric-sub">
            The security ceiling: any errors above 8% trigger an immediate attack alarm.
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">
            <span>Signal Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="metric-value">≥ 95.0%</div>
          <div className="metric-sub">
            State fidelity: shows whether the signature arrived intact and undisturbed.
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">
            <span>Simulation Engine</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.25rem', color: 'var(--accent-indigo)' }}>
            Fast CPU Math
          </div>
          <div className="metric-sub">
            Calculates exact quantum state equations locally on your laptop.
          </div>
        </div>
      </section>

      {/* Quick Scenario Launcher */}
      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Activity className="w-5 h-5 text-cyan-400" />
              Demonstration Scenarios
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Select a pre-configured scenario to observe how the detector evaluates physical evidence and protocol checks.
            </p>
          </div>
        </div>

        <div className="grid-2">
          {SAMPLE_SCENARIOS.map((sc) => {
            const isDanger = sc.badgeType === 'danger';
            const isSuccess = sc.badgeType === 'success';
            const isWarning = sc.badgeType === 'warning';

            return (
              <div
                key={sc.id}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{sc.name}</h3>
                    <span className={`badge ${isSuccess ? 'badge-success' : isDanger ? 'badge-danger' : 'badge-warning'}`}>
                      {sc.badge}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {sc.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Attacker: <span style={{ color: 'var(--text-secondary)' }}>{sc.attackerModel.type}</span>
                  </div>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => onLaunchScenario(sc.id)}
                  >
                    Run Demo <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scientific Design Principles */}
      <section className="grid-3">
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck className="w-4 h-4" /> 1. Physics-Based Detection
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            By the <strong>Quantum No-Cloning Theorem</strong>, any unauthorized measurement on non-orthogonal carrier states creates unavoidable wave-function collapse and elevates the Bit Error Rate above τ.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle className="w-4 h-4" /> 2. Hybrid Threat Model
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Quantum physics alone cannot detect a replayed classical transcript. Our detector combines <strong>quantum statistical tests</strong> with <strong>cryptographic nonce freshness</strong> to detect both quantum and network-level threats.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity className="w-4 h-4" /> 3. Scientific Honesty
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            A simulation on ordinary computers models state vectors, not physical photon channels. High error rates trigger <strong>inconclusive aborts</strong> rather than claiming magical attack classification.
          </p>
        </div>
      </section>
    </div>
  );
}
