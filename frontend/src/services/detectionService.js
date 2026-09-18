/**
 * Detection Service Layer
 * 
 * Provides an abstraction between the React UI components and the data source.
 * In Demo Mode (current state), it serves illustrative data from sampleScenarios.js
 * with realistic async latency.
 * 
 * In Milestones 5 & 6, this service will connect to the Django REST endpoints:
 * - GET  /api/scenarios/
 * - POST /api/simulate/
 * - POST /api/verify/
 * - GET  /api/history/
 */

import { SAMPLE_SCENARIOS, INITIAL_EXPERIMENT_HISTORY } from '../data/sampleScenarios';

// In-memory history state for the demo session
let localHistory = [...INITIAL_EXPERIMENT_HISTORY];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const detectionService = {
  /**
   * Fetch available demonstration scenarios
   */
  async getScenarios() {
    // Simulated network delay
    await new Promise((r) => setTimeout(r, 150));
    return [...SAMPLE_SCENARIOS];
  },

  /**
   * Run a demonstration simulation session
   * @param {string} scenarioId - 'legitimate' | 'forgery' | 'replay' | 'interference'
   * @param {object} configOverride - Optional custom parameters (shots, noise, threshold)
   */
  async runDemonstration(scenarioId, configOverride = {}) {
    // Simulate computational latency of quantum state prep & measurement
    await new Promise((r) => setTimeout(r, 600));

    const scenario = SAMPLE_SCENARIOS.find((s) => s.id === scenarioId) || SAMPLE_SCENARIOS[0];

    // Compute dynamic variations if parameters were customized
    const shots = configOverride.shots || scenario.defaultConfig.shots;
    const channelNoise = configOverride.channelNoise ?? scenario.defaultConfig.channelNoise;
    const thresholdTau = configOverride.decisionThreshold ?? scenario.defaultConfig.decisionThreshold;

    // Build the result object
    const result = {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      badge: scenario.badge,
      badgeType: scenario.badgeType,
      config: {
        shots,
        channelNoise,
        decisionThreshold: thresholdTau,
        nonce: configOverride.nonce || scenario.defaultConfig.nonce
      },
      evidence: {
        ...scenario.sampleEvidence,
        shotsSimulated: shots,
        thresholdTau: thresholdTau,
        // Scale distribution proportionally to shot count
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

    // Append to local demo history
    const historyEntry = {
      id: `EXP-${1000 + localHistory.length + 1}`,
      scenarioId: result.scenarioId,
      timestamp: result.timestamp,
      scenarioName: result.scenarioName,
      shots: result.config.shots,
      qber: result.evidence.observedQBER,
      fidelity: result.evidence.teleportationFidelity,
      status: result.decision.status,
      verdict: result.decision.threatDetected ? (result.decision.status === 'REJECTED_FORGERY' ? 'Rejected' : 'Aborted') : 'Verified'
    };
    localHistory = [historyEntry, ...localHistory];

    return result;
  },

  /**
   * Get experiment history records
   */
  async getHistory() {
    await new Promise((r) => setTimeout(r, 100));
    return [...localHistory];
  },

  /**
   * Clear in-memory history (useful for testing empty states)
   */
  async clearHistory() {
    localHistory = [];
    return true;
  },

  /**
   * Reset in-memory history to initial seed
   */
  async resetHistory() {
    localHistory = [...INITIAL_EXPERIMENT_HISTORY];
    return [...localHistory];
  },

  /**
   * Probe Django backend availability (draft placeholder)
   */
  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/`, { method: 'GET', signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        return { connected: true, data: await res.json() };
      }
    } catch {
      // Expected in demo mode when Django is not running
    }
    return { connected: false, message: 'Django backend not reachable. Running in standalone demo mode.' };
  }
};
