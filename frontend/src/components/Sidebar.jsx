import React from 'react';
import { BarChart3, Activity, ShieldCheck, History, BookOpen } from './Icons';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'simulation', label: 'Simulation Lab', icon: Activity },
    { id: 'results', label: 'Evidence Report', icon: ShieldCheck },
    { id: 'history', label: 'Experiment Archive', icon: History },
    { id: 'protocol', label: 'Protocol & Limitations', icon: BookOpen },
  ];

  return (
    <aside className="workbench-sidebar" aria-label="Workbench Navigation">
      <div className="sidebar-header">
        <div className="sidebar-brand-mark">
          <div className="brand-glyph" aria-hidden="true">Q</div>
          <div>
            <div className="brand-text-title">QDS Security Lab</div>
            <div className="brand-text-sub">Research Workbench</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-link-btn ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="app-icon" size={18} style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontWeight: 600, color: 'var(--text-strong)' }}>SIH 2026 Prototype</div>
        <div style={{ marginTop: '0.2rem' }}>
          v0.1.0 · Classical Simulation<br />
          Non-ML Verification
        </div>
      </div>
    </aside>
  );
}
