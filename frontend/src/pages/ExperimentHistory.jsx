import React, { useState } from 'react';
import { History, ArrowRight, ShieldCheck, XCircle } from '../components/Icons';

export default function ExperimentHistory({ history, onClearHistory, onResetHistory, onSelectHistoryItem }) {
  const [filter, setFilter] = useState('ALL');
  const [selectedDrawerItem, setSelectedDrawerItem] = useState(null);

  const filteredHistory = history.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'VERIFIED') return item.status === 'VERIFIED_AUTHENTIC';
    if (filter === 'REJECTED') return item.status === 'REJECTED_FORGERY';
    if (filter === 'ABORTED') return item.status === 'REJECTED_REPLAY' || item.status === 'CHANNEL_ABORT_NOISE';
    return true;
  });

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "qds_experiment_history.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRowClick = (item) => {
    setSelectedDrawerItem(item);
  };

  return (
    <div className="page-transition" style={{ maxWidth: '1320px', margin: '0 auto' }}>
      {/* Editorial Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
        <div>
          <span className="eyebrow">Forensic Record Browser</span>
          <h1 className="page-title">Experiment Archive & Audit Trail</h1>
          <p className="page-subtitle">
            Captured run snapshots recorded during this active browser session ({history.length} total records).
            <em> In-memory session history — resets on page reload.</em>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={exportJSON}
            disabled={history.length === 0}
          >
            Export JSON Archive
          </button>
          {history.length > 0 ? (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ color: 'var(--danger)', border: '1px solid var(--border)' }}
              onClick={onClearHistory}
            >
              Clear Session
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onResetHistory}
            >
              Restore Baseline Records
            </button>
          )}
        </div>
      </div>

      {/* Filter Row */}
      <div className="archive-filter-strip">
        {['ALL', 'VERIFIED', 'REJECTED', 'ABORTED'].map((f) => {
          const count = f === 'ALL'
            ? history.length
            : f === 'VERIFIED'
            ? history.filter((h) => h.status === 'VERIFIED_AUTHENTIC').length
            : f === 'REJECTED'
            ? history.filter((h) => h.status === 'REJECTED_FORGERY').length
            : history.filter((h) => h.status === 'REJECTED_REPLAY' || h.status === 'CHANNEL_ABORT_NOISE').length;

          return (
            <button
              key={f}
              type="button"
              className={`archive-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      {/* Full-Width Interactive Data Table */}
      {filteredHistory.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
          <History size={32} className="app-icon w-8 h-8" style={{ margin: '0 auto 0.75rem auto', color: 'var(--text-muted)' }} />
          <h2 className="section-title" style={{ justifyContent: 'center', marginBottom: '0.35rem' }}>
            Session Archive is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '440px', margin: '0 auto 1.25rem auto' }}>
            {history.length === 0
              ? 'No experiment records exist in this session. Execute a simulation in the lab or restore baseline records.'
              : 'No records match the active filter criteria.'}
          </p>
          {history.length === 0 && (
            <button type="button" className="btn btn-primary" onClick={onResetHistory}>
              Restore Baseline Records
            </button>
          )}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="archive-data-table">
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Timestamp</th>
                <th>Scenario</th>
                <th>Shots</th>
                <th>Observed QBER</th>
                <th>Threshold (τ)</th>
                <th>Margin</th>
                <th>Sample Verdict</th>
                <th>Mode</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => {
                const tau = item.thresholdTau ?? 0.08;
                const isOver = item.qber > tau;
                const rawDiff = (tau - item.qber) * 100;
                const marginDiff = Math.round(rawDiff * 10) / 10;
                const marginLabel = Math.abs(marginDiff) < 0.05
                  ? 'At threshold'
                  : marginDiff > 0
                  ? `-${marginDiff.toFixed(1)} pp`
                  : `+${Math.abs(marginDiff).toFixed(1)} pp`;

                return (
                  <tr
                    key={item.id}
                    className="clickable-row"
                    onClick={() => handleRowClick(item)}
                    title="Click to view run details"
                  >
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--brand)' }}>
                      {item.id}
                    </td>
                    <td className="font-mono" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-strong)' }}>{item.scenarioName}</strong>
                    </td>
                    <td className="font-mono">{item.shots}</td>
                    <td className="font-mono" style={{ fontWeight: 700, color: isOver ? 'var(--danger)' : 'var(--success)' }}>
                      {(item.qber * 100).toFixed(1)}%
                    </td>
                    <td className="font-mono" style={{ color: 'var(--text-muted)' }}>
                      {(tau * 100).toFixed(1)}%
                    </td>
                    <td className="font-mono" style={{ fontSize: '0.78rem', color: isOver ? 'var(--danger)' : 'var(--success)' }}>
                      {marginLabel}
                    </td>
                    <td>
                      <span
                        className={`editorial-badge ${
                          item.status === 'VERIFIED_AUTHENTIC'
                            ? 'pass'
                            : item.status === 'REJECTED_FORGERY'
                            ? 'fail'
                            : 'warn'
                        }`}
                      >
                        {item.verdict}
                      </span>
                    </td>
                    <td>
                      <span className="provenance-notation">Sample</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ height: '30px', padding: '0 0.65rem', fontSize: '0.76rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHistoryItem(item);
                        }}
                      >
                        <span>Inspect</span>
                        <ArrowRight size={14} className="app-icon" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Forensic Detail Drawer (Opens on Row Click) */}
      {selectedDrawerItem && (
        <div className="archive-drawer-backdrop" onClick={() => setSelectedDrawerItem(null)}>
          <div className="archive-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="eyebrow" style={{ marginBottom: '0.15rem' }}>Forensic Snapshot</span>
                <h3 className="section-title" style={{ fontSize: '1.15rem' }}>{selectedDrawerItem.id}</h3>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setSelectedDrawerItem(null)}
                aria-label="Close detail drawer"
              >
                <XCircle size={16} className="app-icon" />
              </button>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>Scenario</span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-strong)', marginTop: '0.2rem' }}>
                  {selectedDrawerItem.scenarioName}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Recorded at {new Date(selectedDrawerItem.timestamp).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Observed QBER</div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: selectedDrawerItem.qber > (selectedDrawerItem.thresholdTau ?? 0.08) ? 'var(--danger)' : 'var(--success)', marginTop: '0.2rem' }}>
                    {(selectedDrawerItem.qber * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cutoff Threshold (τ)</div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-strong)', marginTop: '0.2rem' }}>
                    {((selectedDrawerItem.thresholdTau ?? 0.08) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>Sample Verdict</span>
                <div style={{ marginTop: '0.35rem' }}>
                  <span className={`editorial-badge ${selectedDrawerItem.status === 'VERIFIED_AUTHENTIC' ? 'pass' : 'fail'}`}>
                    {selectedDrawerItem.verdict}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Predefined illustrative scenario verdict.
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>Run Parameters</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.825rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shots Simulated:</span>
                    <span className="font-mono">{selectedDrawerItem.shots}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Data Mode:</span>
                    <span className="provenance-notation">Illustrative Sample</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', height: '42px' }}
                onClick={() => {
                  onSelectHistoryItem(selectedDrawerItem);
                  setSelectedDrawerItem(null);
                }}
              >
                <span>Open Full Evidence Report</span>
                <ArrowRight size={16} className="app-icon" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
