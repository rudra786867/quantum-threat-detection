import React, { useState } from 'react';

export default function ProtocolLimitations() {
  const [activeSection, setActiveSection] = useState('sec-01');

  const sections = [
    { id: 'sec-01', num: '01', title: 'Implemented Capabilities' },
    { id: 'sec-02', num: '02', title: 'Illustrative Data Modeling' },
    { id: 'sec-03', num: '03', title: 'Proposed Architecture' },
    { id: 'sec-04', num: '04', title: 'Current Limitations & Caveats' },
    { id: 'sec-05', num: '05', title: 'Next Research Milestones' },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="page-transition" style={{ maxWidth: '1320px', margin: '0 auto' }}>
      {/* Editorial Header */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem', marginBottom: '2.5rem' }}>
        <span className="eyebrow">Technical Specification & Research Memo</span>
        <h1 className="page-title">
          Teleportation-Based QDS: Threat Detection Protocol & Limitations
        </h1>
        <p className="page-subtitle">
          Formal engineering documentation defining the physics basis, observable evidence metrics,
          architectural boundaries, and known limitations of this research prototype for Smart India Hackathon 2026.
        </p>
      </div>

      {/* Two-Column Document Layout: Left Sticky TOC (210px) + Right Article (760–880px) */}
      <div className="protocol-doc-grid">
        {/* Left Sticky Table of Contents */}
        <nav className="protocol-sticky-toc" aria-label="Document Navigation">
          <div className="protocol-toc-heading">Contents</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`protocol-toc-item ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => scrollToSection(s.id)}
              >
                <span className="font-mono" style={{ fontSize: '0.72rem', opacity: 0.8 }}>{s.num}</span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Right Article Body */}
        <article style={{ maxWidth: '860px' }}>
          {/* Section 01: Implemented Capabilities */}
          <section id="sec-01" className="memo-article-section">
            <div className="memo-section-rule">
              <span className="memo-num-badge">01</span>
              <h2 className="memo-headline">Implemented Now (Working Frontend Capabilities)</h2>
            </div>
            <p className="memo-paragraph">
              The following capabilities are actively executing in the verified React codebase:
            </p>
            <ul className="memo-fact-list">
              <li><strong>Scientific Research Console:</strong> Full pair-programming workbench with left navigation rail, top context telemetry, and dual-theme support with visual parity.</li>
              <li><strong>Interactive Parameter Lab:</strong> Sliders and selectors for measurement shots, depolarizing channel noise (η), and cutoff threshold (τ).</li>
              <li><strong>Instrument Quick Presets:</strong> Mandated benchmark configurations for Clean Channel (1% noise, 8% τ), Degraded Channel (12% noise, 8% τ), and Attack Scenario (2% noise, 8% τ).</li>
              <li><strong>Independent Result Snapshots:</strong> Each execution captures an isolated record of configuration, evidence, and timestamps without draft-form bleed.</li>
              <li><strong>Threshold Margin Instrument:</strong> Mathematically defensive calculation (τ − QBER) with exact percentage point deltas, directionality, and custom SVG measurement scale.</li>
              <li><strong>Client-Side JSON History Export:</strong> Downloadable JSON audit trail of all recorded session snapshots.</li>
              <li><strong>Field-Level Provenance:</strong> Explicit metadata tagging for every displayed metric (Sample vs Frontend Computed vs User Configuration).</li>
            </ul>
          </section>

          {/* Section 02: Illustrative Data Modeling */}
          <section id="sec-02" className="memo-article-section">
            <div className="memo-section-rule">
              <span className="memo-num-badge">02</span>
              <h2 className="memo-headline">Illustrative / Educational (Demonstration Modeling)</h2>
            </div>
            <p className="memo-paragraph">
              To demonstrate verification workflows prior to live backend integration, the following components utilize documented illustrative data:
            </p>
            <ul className="memo-fact-list">
              <li><strong>Predefined Illustrative QDS Scenarios:</strong> Four scenarios (Legitimate Verification, Forgery Attempt, Replay Attempt, Channel Interference) illustrating distinct physical states.</li>
              <li><strong>Static QBER Samples:</strong> Predefined error rates reflecting expected disturbance (1.6% for legitimate, 28.2% for intercept-resend attack, 14.8% for environmental decoherence).</li>
              <li><strong>Fixed State Fidelity Values:</strong> Pre-calibrated reference fidelities (e.g. F = 0.984 for clean, F = 0.718 for forgery).</li>
              <li><strong>Static Nonce Status:</strong> Demonstrates protocol freshness flagging (fresh vs replayed duplicate).</li>
              <li><strong>Transformed Bell-State Measurement Projections:</strong> Static projective distribution scaled arithmetically in the frontend to match the user's selected shot count.</li>
            </ul>
          </section>

          {/* Section 03: Proposed Architecture */}
          <section id="sec-03" className="memo-article-section">
            <div className="memo-section-rule">
              <span className="memo-num-badge">03</span>
              <h2 className="memo-headline">Proposed Architecture (Documented Roadmap)</h2>
            </div>
            <p className="memo-paragraph">
              The following capabilities are specified in repository architecture documentation and roadmaps:
            </p>
            <ul className="memo-fact-list">
              <li><strong>REST API Contract (/api/verify/):</strong> Draft specification in <code>docs/API_CONTRACT_DRAFT.md</code> for sending channel noise, shots, threshold, and nonces to the Django backend.</li>
              <li><strong>State-Vector Simulation Engine:</strong> Proposed linear algebra simulation modeling quantum state preparation, Bell-state projections, and depolarizing noise channels on classical CPU.</li>
              <li><strong>Persistent Nonce Database:</strong> Proposed server-side store in Django models to track consumed nonces and detect classical replay attempts across sessions.</li>
              <li><strong>Backend-Persisted Audit History:</strong> Documented <code>/api/history/</code> endpoint to store and retrieve historical verification records from a database.</li>
              <li><strong>Milestone Roadmap:</strong> Documented phased development plan from starter UI (Milestone 0) through API integration (Milestones 5 & 6).</li>
            </ul>
          </section>

          {/* Section 04: Current Limitations & Caveats */}
          <section id="sec-04" className="memo-article-section">
            <div className="memo-section-rule" style={{ borderBottomColor: 'var(--warning)' }}>
              <span className="memo-num-badge" style={{ color: 'var(--warning)' }}>04</span>
              <h2 className="memo-headline" style={{ color: 'var(--warning)' }}>Current Limitations & Real-World Caveats</h2>
            </div>
            <p className="memo-paragraph">
              In accordance with academic rigor, we explicitly declare the limitations of the current implementation:
            </p>
            <ul className="memo-fact-list">
              <li><strong>No Quantum Hardware Execution:</strong> The system runs on ordinary classical hardware. The current backend contains a basic binary sampler, not a physical quantum processor or the proposed state-vector simulator.</li>
              <li><strong>Noise Edits Do Not Recompute QBER:</strong> Changing channel noise updates the configuration only; it does not recalculate the illustrative QBER in this demo mode.</li>
              <li><strong>QBER Cannot Uniquely Identify Attack Mechanisms:</strong> High QBER indicates measurement disturbance, but cannot mathematically distinguish between malicious eavesdropping and severe environmental fiber attenuation. The protocol triggers a defensive channel abort in both cases.</li>
              <li><strong>No Persistent Nonce Database:</strong> Nonces are not yet validated against a persistent database; replay detection is currently illustrated via predefined scenario data.</li>
              <li><strong>No Live Verification Endpoint:</strong> The Django backend does not yet implement <code>/api/verify/</code> (assigned to Milestone 5).</li>
              <li><strong>In-Memory History Resets on Reload:</strong> History is maintained in browser memory for the session only, with no persistent browser or database storage.</li>
              <li><strong>No Statistical Confidence Calculation:</strong> The current prototype does not calculate confidence intervals, uncertainty estimates, or statistical significance bounds (e.g. Chernoff or Hoeffding bounds) for the displayed illustrative measurements.</li>
              <li><strong>Classical Endpoint Side-Channels:</strong> Side-channel leakage on classical endpoints (e.g. memory inspection on the signer's server before state preparation) is completely outside the scope of quantum physical threat detection.</li>
            </ul>
          </section>

          {/* Section 05: Next Research Milestones */}
          <section id="sec-05" className="memo-article-section">
            <div className="memo-section-rule">
              <span className="memo-num-badge">05</span>
              <h2 className="memo-headline">Next Research Milestones (Repository Roadmap)</h2>
            </div>
            <p className="memo-paragraph">
              As documented in <code>README.md</code> and team workstream planning, the next engineering milestones are:
            </p>
            <ul className="memo-fact-list">
              <li><strong>Milestone 5: Expose Experiment Through Django REST APIs</strong> — Implement the <code>POST /api/verify/</code> and <code>GET /api/history/</code> endpoints in Django with request validation, state-vector simulation engine execution, and database persistence.</li>
              <li><strong>Milestone 6: Connect React Frontend to Live Django Backend</strong> — Update <code>detectionService.js</code> to dispatch live verification requests to <code>/api/verify/</code>, replacing illustrative sample responses with backend-simulated measurements.</li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
}
