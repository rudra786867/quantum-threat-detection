# Proposed API Contract (Draft Specification)

> **Document Status: DRAFT / SPECIFICATION**  
> *Subject to refinement during Milestones 1 and 5. Not yet connected in Milestone 0.*

This document specifies the REST interface between the React frontend and Django backend.

---

## 1. POST `/api/verify/`

Executes quantum teleportation simulation under specified channel parameters and evaluates threat detection metrics.

### Request Body (`application/json`)

```json
{
  "scenario_id": "forgery",
  "shots": 256,
  "channel_noise": 0.02,
  "decision_threshold_tau": 0.08,
  "session_nonce": "req-98f24a-2026",
  "message_digest": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

#### Field Specifications:
- `scenario_id` (string, required): Scenario identifier (`legitimate`, `forgery`, `replay`, `interference`).
- `shots` (integer, optional, default: 256): Number of projective measurements. Minimum 64, maximum 4096.
- `channel_noise` (float, optional, default: 0.02): Channel depolarizing noise $\eta \in [0.0, 0.4]$.
- `decision_threshold_tau` (float, optional, default: 0.08): Security cutoff threshold $\tau \in [0.01, 0.25]$.
- `session_nonce` (string, required): Unique alphanumeric token ensuring replay protection.
- `message_digest` (string, required): SHA-256 hash of message to be digitally signed.

---

### Response (`200 OK`)

```json
{
  "execution_id": "EXP-20260918-001",
  "timestamp": "2026-09-18T10:15:30Z",
  "evidence": {
    "shots_evaluated": 256,
    "observed_qber": 0.282,
    "threshold_tau": 0.080,
    "teleportation_fidelity": 0.718,
    "bell_state_counts": {
      "phi_plus": 94,
      "phi_minus": 34,
      "psi_plus": 42,
      "psi_minus": 86
    },
    "nonce_status": "VALID_UNIQUE"
  },
  "decision": {
    "status": "REJECTED_FORGERY",
    "threat_detected": true,
    "threat_category": "Quantum State Forgery",
    "statistical_justification": "Observed QBER (0.282) exceeds threshold tau (0.080) by 0.202. Consistent with unauthorized measurement disturbance on conjugate quantum bases.",
    "protocol_justification": "State projections mismatch Alice's classical verification key.",
    "monitoring_warning": "CRITICAL: Signature rejected. High probability of intercept-resend attack."
  }
}
```

---

## 2. GET `/api/history/`

Retrieves audit history of previous verification requests.

### Response (`200 OK`)

```json
{
  "total_records": 12,
  "results": [
    {
      "id": "EXP-1001",
      "timestamp": "2026-09-18T10:14:02Z",
      "scenario": "Legitimate Verification",
      "shots": 256,
      "qber": 0.016,
      "fidelity": 0.984,
      "verdict": "VERIFIED_AUTHENTIC"
    }
  ]
}
```

---

## 3. Error Responses

- `400 Bad Request`: Validation failure (e.g. invalid shot count, missing nonce).
- `422 Unprocessable Entity`: Inconclusive physical telemetry requiring recalibration.
- `500 Internal Error`: Simulation engine mathematical exception.
