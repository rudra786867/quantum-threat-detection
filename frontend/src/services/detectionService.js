/**
 * Detection Service Layer (Hybrid Live/Demo Mode)
 * 
 * Automatically connects to the Django backend at http://localhost:8000/api when available.
 * If Django is offline (e.g. static Vercel deployment), it falls back seamlessly to standalone demo mode.
 */

import { SAMPLE_SCENARIOS, INITIAL_EXPERIMENT_HISTORY } from '../data/sampleScenarios';

let localHistory = [...INITIAL_EXPERIMENT_HISTORY];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const detectionService = {
  /**
   * Fetch available demonstration scenarios
   */
  async getScenarios() {
    await new Promise((r) => setTimeout(r, 100));
    return [...SAMPLE_SCENARIOS];
  },

  /**
   * Run a simulation session (tries Django API first, falls back to demo mode)
   */
  async runDemonstration(scenarioId, configOverride = {}) {
    const scenario = SAMPLE_SCENARIOS.find((s) => s.id === scenarioId) || SAMPLE_SCENARIOS[0];
    const shots = configOverride.shots || scenario.defaultConfig.shots;
    const channelNoise = configOverride.channelNoise ?? scenario.defaultConfig.channelNoise;
    const thresholdTau = configOverride.decisionThreshold ?? scenario.defaultConfig.decisionThreshold;
    const nonce = configOverride.nonce || scenario.defaultConfig.nonce;

    // 1. Attempt to call live Django Backend
    try {
      const response = await fetch(`${API_BASE_URL}/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: scenarioId,
          shots: shots,
          channel_noise: channelNoise,
          decision_threshold_tau: thresholdTau,
          session_nonce: nonce
        }),
        signal: AbortSignal.timeout(2000)
      });

      if (response.ok) {
        const liveData = await response.json();
        const liveResult = {
          scenarioId: scenario.id,
          scenarioName: scenario.name,
          badge: scenario.badge,
          badgeType: scenario.badgeType,
          config: {
            shots: liveData.evidence.shots_evaluated,
            channelNoise: channelNoise,
            decisionThreshold: liveData.evidence.threshold_tau,
            nonce: nonce
          },
          evidence: {
            shotsSimulated: liveData.evidence.shots_evaluated,
            teleportationFidelity: liveData.evidence.teleportationFidelity ?? liveData.evidence.teleportation_fidelity,
            observedQBER: liveData.evidence.observed_qber,
            thresholdTau: liveData.evidence.threshold_tau,
            bsmOutcomeDistribution: liveData.evidence.bell_state_counts,
            nonceFreshness: liveData.evidence.nonce_status,
            classicalCheckPassed: liveData.decision.status === 'VERIFIED_AUTHENTIC',
            executionTimeMs: 140
          },
          decision: {
            status: liveData.decision.status,
            verdictText: liveData.decision.verdict_text,
            threatDetected: liveData.decision.threat_detected,
            threatCategory: liveData.decision.threat_category,
            statisticalJustification: liveData.decision.statistical_justification,
            protocolJustification: liveData.decision.protocol_justification,
            monitoringWarning: liveData.decision.monitoring_warning,
            illustrativeDisclaimer: 'Live verification result evaluated by local Django backend & SQLite audit log.'
          },
          timestamp: liveData.timestamp
        };

        // Add to history
        localHistory = [{
          id: liveData.execution_id,
          scenarioId: liveResult.scenarioId,
          timestamp: liveResult.timestamp,
          scenarioName: liveResult.scenarioName,
          shots: liveResult.config.shots,
          qber: liveResult.evidence.observedQBER,
          fidelity: liveResult.evidence.teleportationFidelity,
          status: liveResult.decision.status,
          verdict: liveResult.decision.threatDetected ? (liveResult.decision.status === 'REJECTED_FORGERY' ? 'Rejected' : 'Aborted') : 'Verified'
        }, ...localHistory];

        return liveResult;
      }
    } catch {
      // Backend not running or timeout -> proceed with client-side fallback
    }

    // 2. Standalone Fallback Simulation
    await new Promise((r) => setTimeout(r, 400));
    const result = {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      badge: scenario.badge,
      badgeType: scenario.badgeType,
      config: {
        shots,
        channelNoise,
        decisionThreshold: thresholdTau,
        nonce
      },
      evidence: {
        ...scenario.sampleEvidence,
        shotsSimulated: shots,
        thresholdTau: thresholdTau,
        bsmOutcomeDistribution: Object.fromEntries(
          Object.entries(scenario.sampleEvidence.bsmOutcomeDistribution).map(([k, v]) => [
            k,
            Math.round((v / 256) * shots)
          ])
        )
      },
      decision: {
        ...scenario.sampleDecision
      },
      timestamp: new Date().toISOString()
    };

    localHistory = [{
      id: `EXP-${1000 + localHistory.length + 1}`,
      scenarioId: result.scenarioId,
      timestamp: result.timestamp,
      scenarioName: result.scenarioName,
      shots: result.config.shots,
      qber: result.evidence.observedQBER,
      fidelity: result.evidence.teleportationFidelity,
      status: result.decision.status,
      verdict: result.decision.threatDetected ? (result.decision.status === 'REJECTED_FORGERY' ? 'Rejected' : 'Aborted') : 'Verified'
    }, ...localHistory];

    return result;
  },

  async getHistory() {
    try {
      const res = await fetch(`${API_BASE_URL}/history/`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((r) => ({
            id: r.id,
            scenarioId: r.scenario,
            timestamp: r.timestamp,
            scenarioName: r.scenario.charAt(0).toUpperCase() + r.scenario.slice(1) + ' Verification',
            shots: r.shots,
            qber: r.qber,
            fidelity: r.fidelity,
            status: r.status,
            verdict: r.verdict
          }));
        }
      }
    } catch {
      // Fallback to local
    }
    return [...localHistory];
  },

  async clearHistory() {
    try {
      await fetch(`${API_BASE_URL}/history/clear/`, { method: 'POST', signal: AbortSignal.timeout(1000) });
    } catch {
      // Fallback
    }
    localHistory = [];
    return true;
  },

  async resetHistory() {
    localHistory = [...INITIAL_EXPERIMENT_HISTORY];
    return [...localHistory];
  },

  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        const data = await res.json();
        return { connected: true, data };
      }
    } catch {
      // Fallback
    }
    return { connected: false, message: 'Django backend not reachable. Running in standalone demo mode.' };
  }
};
