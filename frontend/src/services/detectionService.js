/**
 * Detection Service Layer
 * 
 * Provides an abstraction between the React UI components and the data source.
 * In Demo Mode (current state), it serves illustrative data from sampleScenarios.js
 * with realistic async latency.
 * 
 * Capability Status:
 * - Standalone Demo: Active (Illustrative data)
 * - Django REST: Probed via checkBackendHealth()
 * - /api/verify/: Unavailable (Draft API specification only; Milestone 5)
 */

import { SAMPLE_SCENARIOS, INITIAL_EXPERIMENT_HISTORY } from '../data/sampleScenarios';

// Deep-clone helper to guarantee independent result snapshots
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// Seed initial in-memory history
const seedHistory = () =>
  INITIAL_EXPERIMENT_HISTORY.map((item) => {
    const scenario = SAMPLE_SCENARIOS.find((entry) => entry.id === item.scenarioId);
    return {
      ...item,
      thresholdTau: scenario.sampleEvidence.thresholdTau,
      result: clone({
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        badge: scenario.badge,
        badgeType: scenario.badgeType,
        config: {
          ...scenario.defaultConfig,
          thresholdProvenance: 'ILLUSTRATIVE DEFAULT CONFIGURATION',
          noiseProvenance: 'ILLUSTRATIVE DEFAULT CONFIGURATION'
        },
        evidence: {
          ...scenario.sampleEvidence,
          qberProvenance: 'ILLUSTRATIVE STATIC SAMPLE',
          fidelityProvenance: 'ILLUSTRATIVE VALUE (Not calculated)',
          bsmProvenance: 'ILLUSTRATIVE STATIC SAMPLE (Predefined distribution)',
          nonceProvenance: 'ILLUSTRATIVE SAMPLE STATUS'
        },
        decision: {
          ...scenario.sampleDecision,
          verdictProvenance: 'RECORDED SAMPLE VERDICT'
        },
        timestamp: item.timestamp
      })
    };
  });

let localHistory = seedHistory();
let nextExperimentId = 1000 + INITIAL_EXPERIMENT_HISTORY.length + 1;

// Largest-remainder allocation scales illustrative counts equal to the requested shots
const scaleCounts = (distribution, shots) => {
  const entries = Object.entries(distribution);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  if (total === 0) return distribution;
  const scaled = entries.map(([key, count]) => ({
    key,
    exact: (count / total) * shots,
    count: Math.floor((count / total) * shots)
  }));
  let remaining = shots - scaled.reduce((sum, item) => sum + item.count, 0);
  const ordered = [...scaled].sort((a, b) => b.exact - b.count - (a.exact - a.count));
  for (let i = 0; i < remaining; i++) {
    ordered[i].count++;
  }
  return Object.fromEntries(ordered.map(({ key, count }) => [key, count]));
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const detectionService = {
  /**
   * Fetch available demonstration scenarios
   */
  async getScenarios() {
    await new Promise((r) => setTimeout(r, 120));
    return clone(SAMPLE_SCENARIOS);
  },

  /**
   * Run a demonstration simulation session
   * Creates an independent snapshot with explicit field-level provenance.
   * 
   * @param {string} scenarioId - 'legitimate' | 'forgery' | 'replay' | 'interference'
   * @param {object} configOverride - { shots, channelNoise, decisionThreshold, nonce }
   */
  async runDemonstration(scenarioId, configOverride = {}) {
    // Brief UI demonstration delay; no quantum computation occurs here.
    await new Promise((r) => setTimeout(r, 500));

    const scenario = SAMPLE_SCENARIOS.find((s) => s.id === scenarioId) || SAMPLE_SCENARIOS[0];

    // Defensive parameter fallback
    const shots = Number(configOverride.shots) || scenario.defaultConfig.shots;
    const channelNoise = typeof configOverride.channelNoise === 'number'
      ? configOverride.channelNoise
      : scenario.defaultConfig.channelNoise;
    const thresholdTau = typeof configOverride.decisionThreshold === 'number'
      ? configOverride.decisionThreshold
      : scenario.defaultConfig.decisionThreshold;
    const nonce = typeof configOverride.nonce === 'string' && configOverride.nonce.trim()
      ? configOverride.nonce.trim()
      : scenario.defaultConfig.nonce;

    // Build the independent result snapshot
    const result = {
      runId: `EXP-${nextExperimentId++}`,
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      badge: scenario.badge,
      badgeType: scenario.badgeType,
      config: {
        shots,
        channelNoise,
        decisionThreshold: thresholdTau,
        nonce,
        thresholdProvenance: 'USER CONFIGURATION',
        noiseProvenance: 'USER CONFIGURATION',
        shotsProvenance: 'USER CONFIGURATION',
        nonceProvenance: 'USER CONFIGURATION'
      },
      evidence: {
        ...scenario.sampleEvidence,
        shotsSimulated: shots,
        thresholdTau: thresholdTau,
        // Scale distribution proportionally to requested shots
        bsmOutcomeDistribution: scaleCounts(scenario.sampleEvidence.bsmOutcomeDistribution, shots),
        qberProvenance: 'ILLUSTRATIVE STATIC SAMPLE',
        fidelityProvenance: 'ILLUSTRATIVE VALUE (Not calculated)',
        bsmProvenance: 'ILLUSTRATIVE STATIC SAMPLE (Frontend scaled to selected shots)',
        nonceFreshnessProvenance: 'ILLUSTRATIVE SAMPLE STATUS'
      },
      decision: {
        ...scenario.sampleDecision,
        verdictProvenance: 'RECORDED SAMPLE VERDICT'
      },
      timestamp: new Date().toISOString()
    };

    // Append independent snapshot to in-memory history
    const historyEntry = {
      id: result.runId,
      result: clone(result),
      thresholdTau: result.evidence.thresholdTau,
      scenarioId: result.scenarioId,
      timestamp: result.timestamp,
      scenarioName: result.scenarioName,
      shots: result.config.shots,
      qber: result.evidence.observedQBER,
      fidelity: result.evidence.teleportationFidelity,
      status: result.decision.status,
      verdict: result.decision.status === 'VERIFIED_AUTHENTIC'
        ? 'Verified'
        : result.decision.status === 'REJECTED_FORGERY'
        ? 'Rejected'
        : 'Aborted'
    };

    localHistory = [historyEntry, ...localHistory];

    return clone(result);
  },

  /**
   * Get experiment history records (in-memory session snapshots)
   */
  async getHistory() {
    await new Promise((r) => setTimeout(r, 80));
    return clone(localHistory);
  },

  /**
   * Clear in-memory history
   */
  async clearHistory() {
    localHistory = [];
    return true;
  },

  /**
   * Reset in-memory history to initial seed
   */
  async resetHistory() {
    localHistory = seedHistory();
    return clone(localHistory);
  },

  /**
   * Probe Django backend reachability
   * Note: A reachable backend does NOT mean the verification API exists.
   */
  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        signal: AbortSignal.timeout(1200)
      });
      if (res.ok) {
        return { connected: true, data: await res.json() };
      }
    } catch {
      // Expected in demo mode when Django server is not running
    }
    return {
      connected: false,
      message: 'Django backend not reachable. Running in standalone demonstration mode.'
    };
  }
};
