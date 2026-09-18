from django.db import models


class SessionNonce(models.Model):
    """
    Stores cryptographic session nonces to enforce freshness and prevent classical replay attacks.
    """
    nonce = models.CharField(max_length=128, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    consumed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Nonce({self.nonce}) - Consumed: {self.consumed_at is not None}"


class VerificationAudit(models.Model):
    """
    Immutable audit record of quantum digital signature verification events.
    """
    execution_id = models.CharField(max_length=64, unique=True, db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    scenario_id = models.CharField(max_length=64)
    shots = models.IntegerField(default=256)
    qber = models.FloatField()
    threshold_tau = models.FloatField(default=0.08)
    fidelity = models.FloatField()
    nonce_used = models.CharField(max_length=128)
    status = models.CharField(max_length=32)
    verdict = models.CharField(max_length=64)
    threat_detected = models.BooleanField(default=False)
    threat_category = models.CharField(max_length=64, default="None")
    latency_ms = models.FloatField(default=0.0)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.execution_id} | {self.status} | QBER: {self.qber:.3f}"
