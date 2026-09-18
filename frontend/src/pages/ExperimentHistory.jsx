import React, { useState } from 'react';
import { History, RefreshCw, AlertTriangle, ShieldCheck, Activity, ArrowRight } from '../components/Icons';
import ExplanationTooltip from '../components/ExplanationTooltip';

export default function ExperimentHistory({ history, onClearHistory, onResetHistory, onSelectHistoryItem }) {
  const [filter, setFilter] = useState('ALL');

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

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">
              <History className="w-5 h-5 text-cyan-400" />
              Experiment History & Audit Trail
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Chronological log of simulated quantum verification sessions, measurement telemetry, and detector rulings.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
              onClick={exportJSON}
              disabled={history.length === 0}
            >
              Export JSON
            </button>
            {history.length > 0 ? (
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', color: 'var(--danger)' }}
                onClick={onClearHistory}
              >
                Clear History (Test Empty State)
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                onClick={onResetHistory}
              >
                Restore Sample History
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['ALL', 'VERIFIED', 'REJECTED', 'ABORTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--border-highlight)' : 'var(--bg-secondary)',
                color: filter === f ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {f} ({
                f === 'ALL' ? history.length :
                f === 'VERIFIED' ? history.filter(h => h.status === 'VERIFIED_AUTHENTIC').length :
                f === 'REJECTED' ? history.filter(h => h.status === 'REJECTED_FORGERY').length :
                history.filter(h => h.status === 'REJECTED_REPLAY' || h.status === 'CHANNEL_ABORT_NOISE').length
              })
            </button>
          ))}
        </div>

        {/* Empty State vs Table */}
        {filteredHistory.length === 0 ? (
          <div
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px dashed var(--border-color)'
            }}
          >
            <History className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              No Experiment Records Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
              {history.length === 0
                ? "You are viewing the clean empty state. Run a session in the Simulation Lab or click below to restore sample records."
                : "No runs match the selected filter criterion."}
            </p>
            {history.length === 0 && (
              <button className="btn btn-primary" onClick={onResetHistory}>
                Load Illustrative Historical Data
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Timestamp</th>
                  <th>Scenario</th>
                  <th>Shots</th>
                  <th>QBER</th>
                  <th>Fidelity</th>
                  <th>Verdict</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono text-cyan-400" style={{ fontWeight: 600 }}>{item.id}</td>
                    <td className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td style={{ fontWeight: 500 }}>{item.scenarioName}</td>
                    <td className="font-mono">{item.shots}</td>
                    <td className="font-mono" style={{ color: item.qber > 0.08 ? 'var(--danger)' : 'var(--success)' }}>
                      {(item.qber * 100).toFixed(1)}%
                    </td>
                    <td className="font-mono">{item.fidelity.toFixed(3)}</td>
                    <td>
                      <span className={`badge ${
                        item.status === 'VERIFIED_AUTHENTIC'
                          ? 'badge-success'
                          : item.status === 'REJECTED_FORGERY'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}>
                        {item.verdict}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => onSelectHistoryItem(item.scenarioId)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
