import React from 'react';
import { Sun, Moon } from './Icons';

export default function TopBar({
  currentPage,
  backendConnected = false,
  theme = 'light',
  onToggleTheme
}) {
  const pageLabels = {
    dashboard: 'Overview',
    simulation: 'Simulation Lab',
    results: 'Evidence Report',
    history: 'Experiment Archive',
    protocol: 'Protocol & Limitations'
  };

  return (
    <header className="top-context-bar" aria-label="Workbench Context">
      <div className="context-title">
        <span>QDS Security Lab</span>
        <span className="context-separator">/</span>
        <span className="context-active-page">{pageLabels[currentPage] || 'Overview'}</span>
      </div>

      <div className="telemetry-group" aria-label="System Infrastructure Telemetry">
        <span className="telemetry-chip" title="Data source mode">
          <span className="telemetry-dot" style={{ backgroundColor: 'var(--brand)' }} />
          <span>Data: <strong>Illustrative</strong></span>
        </span>
        <span className="context-separator">·</span>
        <span
          className={`telemetry-chip ${backendConnected ? 'ok' : ''}`}
          title="Django backend reachability"
        >
          <span className="telemetry-dot" />
          <span>Backend: <strong>{backendConnected ? 'Reachable' : 'Offline'}</strong></span>
        </span>
        <span className="context-separator">·</span>
        <span className="telemetry-chip alert" title="Verification API endpoint status">
          <span className="telemetry-dot" />
          <span>Verify API: <strong>Unavailable</strong></span>
        </span>
      </div>

      <div className="top-actions">
        {onToggleTheme && (
          <button
            type="button"
            className="icon-button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Toggle theme (Current: ${theme === 'dark' ? 'Dark' : 'Light'})`}
          >
            {theme === 'dark' ? <Sun className="app-icon" size={16} /> : <Moon className="app-icon" size={16} />}
          </button>
        )}
      </div>
    </header>
  );
}
