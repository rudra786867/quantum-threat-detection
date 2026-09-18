import React from 'react';
import { BookOpen, ShieldCheck, AlertTriangle, Info, Atom, Lock } from '../components/Icons';
import ExplanationTooltip from '../components/ExplanationTooltip';

export default function ProtocolLimitations() {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>
              Scientific Documentation & Assumptions
            </span>
            <h1 className="card-title" style={{ fontSize: '1.4rem' }}>
              Teleportation-Based QDS Protocol & Model Limitations
            </h1>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          This research prototype investigates threat detection for <strong>teleportation-based Quantum Digital Signature (QDS)</strong> schemes.
          Traditional digital signatures (RSA, ECDSA) rely on computational hardness assumptions (e.g., factoring, discrete logarithms) vulnerable to Shor's algorithm on large-scale quantum computers. QDS protocols, by contrast, derive their security from the fundamental laws of quantum mechanics — specifically the <em>No-Cloning Theorem</em> and <em>uncertainty relations</em>.
        </p>
      </div>

      {/* Protocol Pillars */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Atom className="w-5 h-5 text-cyan-400" />
              1. Participants & Information Exchanged
            </h2>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem', lineHeight: '1.6' }}>
            <p>
              <strong>Participants:</strong>
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem' }}>
              <li><strong>Alice (Signer):</strong> Prepares quantum state tokens representing message bits (e.g., non-orthogonal states selected from |0⟩, |1⟩, |+⟩, |-⟩).</li>
              <li><strong>Bob & Charlie (Verifiers):</strong> Receive signature elements via quantum teleportation channels using pre-shared Bell pairs |Φ+⟩ = (|00⟩ + |11⟩) / √2.</li>
            </ul>
            <p>
              <strong>Information Exchanged:</strong>
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem' }}>
              <li><strong>Quantum Channel:</strong> Carries entangled qubit pairs and teleportation state carriers.</li>
              <li><strong>Classical Authenticated Channel:</strong> Transmits 2 classical bits per teleportation Bell-state measurement (BSM) outcome, plus session nonce and digital hash.</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              2. Why AI / Machine Learning Is NOT Used
            </h2>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem', lineHeight: '1.6' }}>
            <p>
              Our threat detection engine strictly avoids AI/ML models for fundamental cryptographic reasons:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem' }}>
              <li><strong>Explainability:</strong> Cryptographic verification decisions must be mathematically accountable, not the output of latent weights.</li>
              <li><strong>Adversarial Robustness:</strong> ML classifiers are susceptible to adversarial perturbation and distributional drift.</li>
              <li><strong>Physical Grounding:</strong> Threat detection directly evaluates the <em>Quantum Bit Error Rate (QBER)</em> against threshold τ, derived from the theoretical disturbance introduced by non-orthogonal state measurements.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detection Evidence & Threshold Justification */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Info className="w-5 h-5 text-cyan-400" />
            3. Detection Evidence & Statistical Threshold Justification
          </h2>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem', lineHeight: '1.6' }}>
          <p>
            The detector monitors three distinct classes of observable evidence:
          </p>
          <div className="grid-3">
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.3rem' }}>A. Quantum Error Rate (QBER)</h4>
              <p style={{ fontSize: '0.8rem' }}>
                Ratio of mismatched projective outcomes in conjugate bases. Normal low-noise channel: QBER &lt; 2%. An intercept-resend attacker unavoidably induces an expected QBER of 25% to 50%.
              </p>
            </div>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.3rem' }}>B. Teleportation Fidelity (F)</h4>
              <p style={{ fontSize: '0.8rem' }}>
                Overlap between input state and reconstructed state. Classical cloning without entanglement bounds maximum fidelity to F ≤ 2/3 ≈ 0.667. Legitimate teleportation achieves F ≥ 0.95.
              </p>
            </div>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.3rem' }}>C. Session Freshness Nonces</h4>
              <p style={{ fontSize: '0.8rem' }}>
                Monotonically tracked cryptographic nonces. Quantum statistics do not protect against replay of recorded classical data; database freshness checks address this boundary.
              </p>
            </div>
          </div>

          <div className="callout callout-info" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            <strong>Threshold Selection (τ = 0.080):</strong> Calibrated between normal physical channel noise (≤ 0.030) and the minimal theoretical disturbance introduced by non-orthogonal state intercept-resend attacks (≥ 0.250).
          </div>
        </div>
      </div>

      {/* Honest Scientific Limitations & Boundaries */}
      <div className="card" style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ color: 'var(--warning)' }}>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            4. Scientific Limitations & Real-World Caveats
          </h2>
          <span className="badge badge-warning">Essential Context</span>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.85rem', lineHeight: '1.6' }}>
          <p>
            In accordance with academic rigor, we explicitly declare the limitations of this prototype:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.4rem' }}>
            <li>
              <strong>Laptop Simulation vs Real Hardware:</strong> A classical computer simulating linear algebra (matrix multiplications) does <em>not</em> generate physical quantum randomness or physical no-cloning enforcement. It simulates the theoretical predictions of quantum mechanics.
            </li>
            <li>
              <strong>Finite-Sample Confidence:</strong> Observing zero forgeries in 1,000 simulated trials does <em>not</em> prove an information-theoretic security bound of zero. In real protocols, statistical confidence is bounded by Chernoff or Hoeffding inequality bounds.
            </li>
            <li>
              <strong>Inconclusive Channel Aborts:</strong> A high QBER can result either from malicious eavesdropping or environmental fiber vibration. The protocol aborts safely, but cannot claim to uniquely identify attacker intent.
            </li>
            <li>
              <strong>Undetectable Threats Under This Model:</strong> Side-channel leakage on classical endpoints (e.g., memory inspection on Alice's server before state preparation) is completely outside the scope of quantum physical detection.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
