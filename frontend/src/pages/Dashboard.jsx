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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-info">Research Prototype</span>
            <span className="badge badge-muted">Milestone 0: Starter Interface</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Quantum-Inspired Cyber Threat Detection for Digital Signatures
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '850px', fontSize: '0.95rem', lineHeight: '1.6' }}>
            A rigorous prototype investigating threat detection mechanisms for <strong>teleportation-based Quantum Digital Signature (QDS) protocols</strong>. 
            All detection is driven strictly by <strong>projective quantum measurement statistics</strong> and protocol-layer freshness rules — <em>no artificial intelligence or machine learning black boxes are used</em>.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn btn-primary" onClick={() => navigateTo('simulation')}>
              <Activity className="w-4 h-4" />
              Open Simulation Lab
            </button>
            <button className="btn btn-secondary" onClick={() => navigateTo('protocol')}>
              <BookOpen className="w-4 h-4" />
              Read Protocol & Assumptions
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid-4">
        <div className="metric-box">
          <div className="metric-label">
            <span>Detection Engine</span>
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>
            Statistical / Non-ML
          </div>
          <div className="metric-sub">
            Hypothesis testing on <ExplanationTooltip term="QBER" explanation="Quantum Bit Error Rate: the ratio of erroneous bit measurements to total observed shots in the conjugate bases." />
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">
            <span>Security Threshold (τ)</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="metric-value">0.080</div>
          <div className="metric-sub">
            Max acceptable error rate (8.0%) before channel abort or forgery alert
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">
            <span>Target Fidelity (F)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="metric-value">≥ 0.950</div>
          <div className="metric-sub">
            Theoretical state overlap for legitimate <ExplanationTooltip term="Teleportation" explanation="Quantum teleportation transfers unknown quantum states between parties using pre-shared entanglement and classical communication." />
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">
            <span>Simulation Mode</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.25rem', color: 'var(--accent-indigo)' }}>
            Ordinary CPU
          </div>
          <div className="metric-sub">
            State-vector & density matrix math simulated on local hardware
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
