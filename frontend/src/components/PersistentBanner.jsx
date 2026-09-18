import React from 'react';
import { Info } from './Icons';

export default function PersistentBanner() {
  return (
    <aside aria-label="Demo mode warning" className="demo-banner">
      <span className="demo-banner-badge">Research Prototype</span>
      <span>Demo mode — illustrative data, no real quantum verification.</span>
      <span className="text-slate-400 text-xs hidden md:inline">
        (Simulated protocol on classical hardware | No AI/ML used)
      </span>
    </aside>
  );
}
