import React from 'react';
import { Atom, BarChart3, Activity, ShieldCheck, History, BookOpen, Sun, Moon } from './Icons';

export default function Header({
  currentPage,
  setCurrentPage,
  backendConnected = false,
  theme = 'light',
  onToggleTheme
}) {
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
          <div className="brand-icon-box">
            <Atom size={20} className="app-icon" />
          </div>
          <div className="brand-title-wrap">
            <div className="brand-title">QDS Threat Detector</div>
            <div className="brand-subtitle">Quantum Digital Signature Security Workbench</div>
          </div>
        </div>

        <div className="nav-right">
          {/* Capability Indicators */}
          <div className="header-capabilities" aria-label="System Capabilities">
            <span className="cap-tag" title="Evidence source mode">
              <span className="cap-indicator" style={{ backgroundColor: 'var(--brand)' }} />
              DATA: Illustrative
            </span>
            <span className={`cap-tag ${backendConnected ? 'active' : 'offline'}`} title="Django backend reachability">
              <span className="cap-indicator" />
              BACKEND: {backendConnected ? 'Reachable' : 'Offline'}
            </span>
            <span className="cap-tag draft" title="Verification endpoint status (Milestone 5)">
              <span className="cap-indicator" />
              VERIFY API: Unavailable
            </span>
          </div>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Toggle theme (Current: ${theme === 'dark' ? 'Dark' : 'Light'})`}
            >
              {theme === 'dark' ? (
                <Sun size={16} className="app-icon" />
              ) : (
                <Moon size={16} className="app-icon" />
              )}
            </button>
          )}

          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`nav-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setCurrentPage(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon size={16} className="app-icon" />
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
