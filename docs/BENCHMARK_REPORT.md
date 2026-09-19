# Quantum-Inspired Threat Detection: Benchmark Report

**Generated:** 2026-09-19 15:16:40

## 1. Simulation Parameters
- **Random Seed:** `42` (for reproducibility)
- **Trials per Scenario:** `100`
- **Threshold (τ):** `0.080` (8.0%)
- **Methodology:** Physical QBER limit checks and cryptographic nonce freshness (NO machine learning).

## 2. Metric Definitions
- **True Positive Rate (TPR):** The percentage of actual attacks correctly flagged as threats. Calculated for Scenarios B and C.
- **False Positive Rate (FPR):** The percentage of perfectly legitimate traffic incorrectly flagged as an attack. Calculated for Scenario A.
- **False Alarm / Noise Rejection Rate:** The percentage of trials rejected due to environmental noise exceeding thresholds rather than a malicious attacker. Evaluated in Scenario D (High Decoherence).

## 3. Benchmark Results

| Scenario | Mean QBER | QBER SD | Latency (ms) | TPR | FPR | FA / Rejection |
|----------|-----------|---------|--------------|-----|-----|----------------|
| A (Legitimate) | 0.0207 | 0.0047 | 5.09 | N/A | 0.0% | N/A |
| B (Forgery - Intercept/Resend) | 0.2519 | 0.0221 | 5.00 | 100.0% | N/A | N/A |
| C (Replay Attack) | 0.0197 | 0.0046 | 4.98 | 100.0% | N/A | N/A |
| D (Channel Decoherence) | 0.1487 | 0.0156 | 4.88 | N/A | N/A | 100.0% |

## 4. Scientific Limitations & Disclaimer
> **Note on Information-Theoretic Security:** This benchmark simulates a finite number of trials on classical hardware. While the results demonstrate the correctness of the physical threshold and freshness validation logic, they **do not** constitute a proof of zero information-theoretic forgery probability. True unconditional security requires mathematical proofs applicable to infinite key limits and full quantum hardware implementations.
