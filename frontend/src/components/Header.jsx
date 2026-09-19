import React from 'react';
import { Atom, BarChart3, Activity, ShieldCheck, History, BookOpen } from './Icons';

export default function Header({ currentPage, setCurrentPage, backendConnected = false }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'simulation', label: 'Simulation Lab', icon: Activity },
    { id: 'results', label: 'Verification Results', icon: ShieldCheck },
    { id: 'history', label: 'Experiment History', icon: History },
    { id: 'protocol', label: 'Protocol & Limitations', icon: BookOpen },
  ];

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand-section">
          <div style={{ padding: '6px', background: 'rgba(255, 30, 86, 0.12)', borderRadius: '8px', border: '1px solid rgba(255, 30, 86, 0.3)', boxShadow: '0 0 12px rgba(255, 30, 86, 0.25)' }}>
            <Atom className="brand-icon" />
          </div>
          <div>
            <div className="brand-title">QDS Threat Detector</div>
            <div className="brand-subtitle" style={{ color: '#ff4d79', letterSpacing: '0.06em' }}>Quantum Digital Signature Security</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Backend Connection Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.725rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            backgroundColor: backendConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.1)',
            border: `1px solid ${backendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.2)'}`
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: backendConnected ? '#10b981' : '#94a3b8',
              display: 'inline-block'
            }} />
            <span style={{ color: backendConnected ? '#34d399' : '#94a3b8', fontWeight: 600 }}>
              {backendConnected ? 'Django: Live' : 'Demo Standalone'}
            </span>
          </div>

          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <button
                      className={`nav-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
