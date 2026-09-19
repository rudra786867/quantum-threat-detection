/**
 * Sample Scenarios Module (Illustrative Data)
 * 
 * IMPORTANT: All metrics here are deterministic illustrative samples designed
 * for demonstrating the UI and verification logic. They do NOT represent real
 * physical quantum laboratory data or calculated security proofs.
 */

export const SAMPLE_SCENARIOS = [
  {
    id: 'legitimate',
    name: 'Legitimate Verification',
    badge: 'Normal Traffic',
    badgeType: 'success',
    description: 'Alice transmits quantum signature states to Bob over a simulated low-noise optical channel. Bob performs joint Bell-state measurements and compares outcomes with the classical verification key.',
    attackerModel: {
      type: 'None (Passive channel noise only)',
      knowledge: 'None',
      capability: 'None'
    },
    defaultConfig: {
      shots: 256,
      channelNoise: 0.02,
      decisionThreshold: 0.08,
      nonce: 'fresh-session-nonce-8f2a91'
    },
    sampleEvidence: {
      shotsSimulated: 256,
      teleportationFidelity: 0.984,
      observedQBER: 0.016,
      thresholdTau: 0.080,
      bsmOutcomeDistribution: {
        '|Φ+⟩': 66,
        '|Φ-⟩': 62,
        '|Ψ+⟩': 64,
        '|Ψ-⟩': 64
      },
      nonceFreshness: 'VALID_UNIQUE',
      classicalCheckPassed: true,
      executionTimeMs: 142
    },
    sampleDecision: {
      status: 'VERIFIED_AUTHENTIC',
      verdictText: 'Signature Verified (Authentic)',
      threatDetected: false,
      threatCategory: 'None',
      statisticalJustification: 'Observed Quantum Bit Error Rate (QBER = 0.016) is strictly below the error threshold (τ = 0.080). Teleportation fidelity (F = 0.984) confirms state preservation without non-orthogonal intercept-resend disturbance.',
      protocolJustification: 'Session nonce is unique (fresh), and classical verification bits match the teleported state projection.',
      monitoringWarning: null,
      illustrativeDisclaimer: 'Illustrative mock data. In production, QBER and fidelity will be calculated from Django backend quantum simulator measurements.'
    }
  },
  {
    id: 'forgery',
    name: 'Forgery Attempt (Intercept-Resend / False State)',
    badge: 'Attack Detected',
    badgeType: 'danger',
    description: 'An adversary intercepts the quantum carrier states or attempts to forge signature tokens without possessing the entangled key pairs, forcing projective measurements that collapse the non-orthogonal quantum states.',
    attackerModel: {
      type: 'Active Intercept-Resend / State Fabrication',
      knowledge: 'Public protocol parameters, no private pre-shared entangled states',
      capability: 'Measures in arbitrary basis and resends substitute qubits'
    },
    defaultConfig: {
      shots: 256,
      channelNoise: 0.02,
      decisionThreshold: 0.08,
      nonce: 'fresh-session-nonce-4c7b12'
    },
    sampleEvidence: {
      shotsSimulated: 256,
      teleportationFidelity: 0.718,
      observedQBER: 0.282,
      thresholdTau: 0.080,
      bsmOutcomeDistribution: {
        '|Φ+⟩': 94,
        '|Φ-⟩': 34,
        '|Ψ+⟩': 42,
        '|Ψ-⟩': 86
      },
      nonceFreshness: 'VALID_UNIQUE',
      classicalCheckPassed: false,
      executionTimeMs: 156
    },
    sampleDecision: {
      status: 'REJECTED_FORGERY',
      verdictText: 'Signature Rejected (Forgery Detected)',
      threatDetected: true,
      threatCategory: 'Quantum State Forgery',
      statisticalJustification: 'Observed QBER (0.282) exceeds the error threshold (τ = 0.080) by 0.202 (252% above allowable limit). This high error rate matches the theoretical disturbance (25% to 50%) caused by unauthorized measurements on non-orthogonal quantum states.',
      protocolJustification: 'Projective measurements do not correlate with the expected classical verification key.',
      monitoringWarning: 'CRITICAL: Signature rejected. Abnormal error rate indicates eavesdropping or malicious state substitution.',
      illustrativeDisclaimer: 'Illustrative mock data. Demonstrates how wave-function disturbance provides observable evidence without black-box ML.'
    }
  },
  {
    id: 'replay',
    name: 'Replay Attempt (Captured Teleportation Transcript)',
    badge: 'Protocol Violation',
    badgeType: 'warning',
    description: 'An attacker captures a previously successful classical measurement transcript and attempts to reuse it for an unauthorized transaction. While the recorded quantum bits look statistically normal, protocol freshness checks fail.',
    attackerModel: {
      type: 'Passive Eavesdropper & Transcript Replayer',
      knowledge: 'Full classical measurement transcript of a prior valid session',
      capability: 'Can re-transmit classical packets; cannot resurrect destroyed quantum states'
    },
    defaultConfig: {
      shots: 256,
      channelNoise: 0.02,
      decisionThreshold: 0.08,
      nonce: 'replayed-nonce-8f2a91' // Same as legitimate scenario
    },
    sampleEvidence: {
      shotsSimulated: 256,
      teleportationFidelity: 0.981,
      observedQBER: 0.019,
      thresholdTau: 0.080,
      bsmOutcomeDistribution: {
        '|Φ+⟩': 65,
        '|Φ-⟩': 63,
        '|Ψ+⟩': 65,
        '|Ψ-⟩': 63
      },
      nonceFreshness: 'REPLAY_DUPLICATE_DETECTED',
      classicalCheckPassed: false,
      executionTimeMs: 98
    },
    sampleDecision: {
      status: 'REJECTED_REPLAY',
      verdictText: 'Verification Aborted (Replay Detected)',
      threatDetected: true,
      threatCategory: 'Session Replay',
      statisticalJustification: 'Quantum measurement statistics appear mathematically valid (QBER 0.019 < τ 0.080), which demonstrates that quantum statistical checks alone cannot protect against classical replay.',
      protocolJustification: 'The session nonce (replayed-nonce-8f2a91) was already consumed in a prior transaction. Freshness verification failed.',
      monitoringWarning: 'WARNING: Valid quantum statistics presented with expired/duplicate nonce. Transaction halted at protocol layer.',
      illustrativeDisclaimer: 'Illustrative mock data. Highlights why application-layer freshness verification is required alongside quantum measurements.'
    }
  },
  {
    id: 'interference',
    name: 'Quantum-Channel Interference (Noise / Decoherence)',
    badge: 'Channel Degraded',
    badgeType: 'warning',
    description: 'Environmental decoherence, fiber attenuation, or misaligned optical polarization introduces high physical noise into the quantum channel, elevating error rates without active adversarial intent.',
    attackerModel: {
      type: 'Environmental / Channel Degradation',
      knowledge: 'None',
      capability: 'Phase damping, depolarizing noise channel'
    },
    defaultConfig: {
      shots: 256,
      channelNoise: 0.15,
      decisionThreshold: 0.08,
      nonce: 'fresh-session-nonce-e190d3'
    },
    sampleEvidence: {
      shotsSimulated: 256,
      teleportationFidelity: 0.852,
      observedQBER: 0.148,
      thresholdTau: 0.080,
      bsmOutcomeDistribution: {
        '|Φ+⟩': 78,
        '|Φ-⟩': 50,
        '|Ψ+⟩': 74,
        '|Ψ-⟩': 54
      },
      nonceFreshness: 'VALID_UNIQUE',
      classicalCheckPassed: false,
      executionTimeMs: 168
    },
    sampleDecision: {
      status: 'CHANNEL_ABORT_NOISE',
      verdictText: 'Verification Inconclusive (Channel Abort)',
      threatDetected: true,
      threatCategory: 'Channel Decoherence / Noise',
      statisticalJustification: 'Observed QBER (0.148) exceeds the security threshold (τ = 0.080). While error patterns show uniform depolarization rather than targeted state manipulation, the protocol must abort to prevent accepting degraded signatures.',
      protocolJustification: 'Protocol rules mandate channel recalibration when noise exceeds threshold τ.',
      monitoringWarning: 'NOTICE: Inconclusive state. High noise cannot be definitively separated from weak eavesdropping without recalibration.',
      illustrativeDisclaimer: 'Illustrative mock data. Shows how high channel noise causes defensive aborts rather than false security acceptances.'
    }
  }
];

export const INITIAL_EXPERIMENT_HISTORY = [
  {
    id: 'EXP-1001',
    scenarioId: 'legitimate',
    timestamp: '2026-09-18T10:14:02Z',
    scenarioName: 'Legitimate Verification',
    shots: 256,
    qber: 0.016,
    fidelity: 0.984,
    status: 'VERIFIED_AUTHENTIC',
    verdict: 'Verified'
  },
  {
    id: 'EXP-1002',
    scenarioId: 'forgery',
    timestamp: '2026-09-18T10:22:45Z',
    scenarioName: 'Forgery Attempt',
    shots: 256,
    qber: 0.282,
    fidelity: 0.718,
    status: 'REJECTED_FORGERY',
    verdict: 'Rejected'
  },
  {
    id: 'EXP-1003',
    scenarioId: 'replay',
    timestamp: '2026-09-18T10:35:10Z',
    scenarioName: 'Replay Attempt',
    shots: 256,
    qber: 0.019,
    fidelity: 0.981,
    status: 'REJECTED_REPLAY',
    verdict: 'Aborted'
  },
  {
    id: 'EXP-1004',
    scenarioId: 'interference',
    timestamp: '2026-09-18T10:48:33Z',
    scenarioName: 'Quantum-Channel Interference',
    shots: 256,
    qber: 0.148,
    fidelity: 0.852,
    status: 'CHANNEL_ABORT_NOISE',
    verdict: 'Aborted'
  }
];
