from django.contrib import admin
from .models import SessionNonce, VerificationAudit


@admin.register(SessionNonce)
class SessionNonceAdmin(admin.ModelAdmin):
    list_display = ("nonce", "created_at", "consumed_at", "is_consumed")
    search_fields = ("nonce",)
    list_filter = ("consumed_at",)
    readonly_fields = ("created_at",)

    @admin.display(boolean=True, description="Consumed (Used)")
    def is_consumed(self, obj):
        return obj.consumed_at is not None


@admin.register(VerificationAudit)
class VerificationAuditAdmin(admin.ModelAdmin):
    list_display = (
        "execution_id",
        "scenario_id",
        "status",
        "qber_formatted",
        "threshold_tau",
        "fidelity",
        "threat_detected",
        "timestamp",
        "latency_ms"
    )
    list_filter = ("status", "threat_detected", "scenario_id")
    search_fields = ("execution_id", "nonce_used", "scenario_id")
    readonly_fields = (
        "execution_id",
        "timestamp",
        "scenario_id",
        "shots",
        "qber",
        "threshold_tau",
        "fidelity",
        "nonce_used",
        "status",
        "verdict",
        "threat_detected",
        "threat_category",
        "latency_ms"
    )

    @admin.display(description="Observed QBER")
    def qber_formatted(self, obj):
        return f"{obj.qber * 100:.2f}%"
