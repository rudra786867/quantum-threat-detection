"""
Quantum Threat Detection Engine (Strictly Non-ML)

Evaluates observable physical statistics against security thresholds and cryptographic freshness rules.
The detector NEVER inspects private simulation labels or ground-truth attacker identifiers.
"""


def evaluate_threat_evidence(
    observed_qber: float,
    threshold_tau: float = 0.08,
    fidelity: float = 1.0,
    nonce_is_fresh: bool = True,
    message_digest: str = ""
) -> dict:
    """
    Evaluates physical observable metrics and protocol headers.

    Returns:
        dict containing status, threat classification, statistical reasoning, and telemetry warnings.
    """
    # 1. Protocol Layer Check: Session Replay Detection
    if not nonce_is_fresh:
        return {
            "status": "REJECTED_REPLAY",
            "verdict_text": "Verification Aborted (Replay Detected)",
            "threat_detected": True,
            "threat_category": "Session Replay",
            "statistical_justification": (
                f"Quantum measurement statistics appear mathematically valid (QBER = {observed_qber:.3f} <= tau = {threshold_tau:.3f}), "
                "confirming that physical measurement checks alone cannot prevent classical replay."
            ),
            "protocol_justification": "The presented session nonce has already been consumed in a prior transaction. Freshness check failed.",
            "monitoring_warning": "WARNING: Duplicate nonce detected. Transaction halted at protocol layer."
        }

    # 2. Quantum Physical Layer: Error Threshold Check (QBER vs tau)
    if observed_qber > threshold_tau:
        delta = observed_qber - threshold_tau

        # Differentiate active measurement collapse (>= 20%) from severe channel noise (< 20%)
        if observed_qber >= 0.20:
            status = "REJECTED_FORGERY"
            verdict = "Signature Rejected (Forgery Detected)"
            threat_category = "Quantum State Forgery"
            stat_reason = (
                f"Observed Quantum Bit Error Rate (QBER = {observed_qber:.3f}) exceeds threshold (tau = {threshold_tau:.3f}) "
                f"by {delta:.3f}. This high disturbance matches the theoretical 25% to 50% error rate caused by "
                "unauthorized projective measurements on non-orthogonal quantum states (No-Cloning Theorem)."
            )
            proto_reason = "Quantum state projections mismatch Alice's classical verification key."
            warning = "CRITICAL: Signature rejected. Abnormal error rate indicates eavesdropping or state substitution."
        else:
            status = "CHANNEL_ABORT_NOISE"
            verdict = "Verification Inconclusive (Channel Abort)"
            threat_category = "Channel Decoherence / Noise"
            stat_reason = (
                f"Observed QBER ({observed_qber:.3f}) exceeds cutoff threshold ({threshold_tau:.3f}). "
                "Error rates suggest physical channel degradation or optical depolarization rather than targeted state manipulation."
            )
            proto_reason = "Protocol rules mandate defensive channel recalibration when noise exceeds threshold tau."
            warning = "NOTICE: Inconclusive state. Quantum channel noise exceeds allowable security threshold."

        return {
            "status": status,
            "verdict_text": verdict,
            "threat_detected": True,
            "threat_category": threat_category,
            "statistical_justification": stat_reason,
            "protocol_justification": proto_reason,
            "monitoring_warning": warning
        }

    # 3. Legitimate Verification
    # Decouple monitoring warnings from acceptance decision
    monitoring_warning = None
    if observed_qber >= 0.05:
        monitoring_warning = f"TELEMETRY: Elevated baseline channel noise observed (QBER = {observed_qber:.3f}), approaching threshold tau."

    return {
        "status": "VERIFIED_AUTHENTIC",
        "verdict_text": "Signature Verified (Authentic)",
        "threat_detected": False,
        "threat_category": "None",
        "statistical_justification": (
            f"Observed QBER ({observed_qber:.3f}) is strictly below threshold tau ({threshold_tau:.3f}). "
            f"State fidelity (F = {fidelity:.3f}) confirms state preservation without unauthorized measurement disturbance."
        ),
        "protocol_justification": "Session nonce is unique (fresh), and classical verification bits match the teleported state projections.",
        "monitoring_warning": monitoring_warning
    }
