import time
import uuid
import numpy as np
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import SessionNonce, VerificationAudit
from .engine.detector import evaluate_threat_evidence
from .quantum.simulator import run_qds_simulation


@api_view(["GET"])
def home(request):
    return Response({
        "project": "Quantum-Inspired Cyber Threat Detection",
        "backend": "Django 5 + REST Framework",
        "status": "online",
        "detection_engine": "Statistical / Non-ML (Observable QBER & Nonce Freshness)",
        "endpoints": [
            "GET  /api/",
            "POST /api/verify/",
            "GET  /api/history/",
            "POST /api/history/clear/"
        ]
    })


@api_view(["POST"])
def verify_signature(request):
    """
    Executes quantum teleportation measurement simulation and evaluates threat detection metrics.
    Follows docs/API_CONTRACT_DRAFT.md
    """
    start_time = time.perf_counter()
    data = request.data or {}

    # 1. Parse and validate input parameters
    scenario_id = str(data.get("scenario_id", "legitimate")).lower()
    shots = int(data.get("shots", 256))
    channel_noise = float(data.get("channel_noise", 0.02))
    threshold_tau = float(data.get("decision_threshold_tau", 0.08))
    session_nonce = str(data.get("session_nonce", f"nonce-{uuid.uuid4().hex[:8]}")).strip()
    message_digest = str(data.get("message_digest", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"))

    if shots < 32 or shots > 4096:
        return Response({"error": "Shots must be between 32 and 4096"}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Check and consume Session Nonce (Replay Defense)
    nonce_obj, created = SessionNonce.objects.get_or_create(nonce=session_nonce)
    if not created and nonce_obj.consumed_at is not None:
        nonce_is_fresh = False
    else:
        nonce_is_fresh = True
        nonce_obj.consumed_at = timezone.now()
        nonce_obj.save()

    # 3. Simulate Observable Quantum Teleportation Evidence using Real Quantum Physics Engine
    if scenario_id == "forgery":
        sim_attack = "intercept_resend"
        sim_noise = channel_noise
    elif scenario_id == "interference":
        sim_attack = "none"
        sim_noise = max(channel_noise, 0.15)
    else:
        sim_attack = "none"
        sim_noise = channel_noise

    sim_result = run_qds_simulation(
        shots=shots,
        noise_rate=sim_noise,
        attack_type=sim_attack
    )

    observed_qber = sim_result["observed_qber"]
    fidelity = sim_result["teleportation_fidelity"]
    bell_counts = sim_result["bell_counts"]

    # 4. Invoke the Pure Non-ML Detection Engine
    # NOTICE: The detector receives ONLY observable physical metrics and protocol headers.
    # It NEVER sees scenario_id or internal attacker labels.
    decision = evaluate_threat_evidence(
        observed_qber=observed_qber,
        threshold_tau=threshold_tau,
        fidelity=fidelity,
        nonce_is_fresh=nonce_is_fresh,
        message_digest=message_digest
    )

    latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
    execution_id = f"EXP-{int(time.time())}-{uuid.uuid4().hex[:4].upper()}"

    # 5. Persist Immutable Audit Record in Database
    audit = VerificationAudit.objects.create(
        execution_id=execution_id,
        scenario_id=scenario_id,
        shots=shots,
        qber=observed_qber,
        threshold_tau=threshold_tau,
        fidelity=fidelity,
        nonce_used=session_nonce,
        status=decision["status"],
        verdict=decision["verdict_text"],
        threat_detected=decision["threat_detected"],
        threat_category=decision["threat_category"],
        latency_ms=latency_ms
    )

    # 6. Format Response strictly according to API Contract
    return Response({
        "execution_id": execution_id,
        "timestamp": audit.timestamp.isoformat(),
        "evidence": {
            "shots_evaluated": shots,
            "observed_qber": round(observed_qber, 4),
            "threshold_tau": round(threshold_tau, 4),
            "teleportation_fidelity": round(fidelity, 4),
            "bell_state_counts": bell_counts,
            "nonce_status": "VALID_UNIQUE" if nonce_is_fresh else "REPLAY_DUPLICATE_DETECTED"
        },
        "decision": {
            "status": decision["status"],
            "verdict_text": decision["verdict_text"],
            "threat_detected": decision["threat_detected"],
            "threat_category": decision["threat_category"],
            "statistical_justification": decision["statistical_justification"],
            "protocol_justification": decision["protocol_justification"],
            "monitoring_warning": decision["monitoring_warning"]
        }
    })


@api_view(["GET"])
def audit_history(request):
    """
    Retrieves previous verification audit records.
    """
    records = VerificationAudit.objects.all()[:50]
    results = []
    for r in records:
        results.append({
            "id": r.execution_id,
            "timestamp": r.timestamp.isoformat(),
            "scenario": r.scenario_id,
            "shots": r.shots,
            "qber": round(r.qber, 4),
            "fidelity": round(r.fidelity, 4),
            "status": r.status,
            "verdict": r.verdict,
            "latency_ms": r.latency_ms
        })

    return Response({
        "total_records": len(results),
        "results": results
    })


@api_view(["POST"])
def clear_history(request):
    """
    Clears audit records and session nonces for test repeatability.
    """
    VerificationAudit.objects.all().delete()
    SessionNonce.objects.all().delete()
    return Response({"message": "Audit history and nonce cache reset successfully."})
