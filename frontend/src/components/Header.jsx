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
          <div style={{ padding: '6px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <Atom className="brand-icon" />
          </div>
          <div>
            <div className="brand-title">QDS Threat Detector</div>
            <div className="brand-subtitle">Quantum Digital Signature Security</div>
          </div>
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
    </header>
  );
}
