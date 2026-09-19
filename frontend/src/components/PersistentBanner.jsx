import React from 'react';

export default function PersistentBanner() {
  return (
    <aside aria-label="Research prototype demo mode notice" className="demo-banner">
      <span className="demo-banner-badge">Research Prototype</span>
      <span>Demo mode — illustrative data, no real quantum verification.</span>
      <span style={{ fontSize: '0.725rem', opacity: 0.85, color: 'var(--text-muted)' }} className="hidden md:inline">
        (Simulated protocol on classical hardware | No AI/ML in detector)
      </span>
    </aside>
  );
}
