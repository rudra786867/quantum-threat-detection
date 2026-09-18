from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status


class QuantumThreatDetectionAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_home_endpoint(self):
        response = self.client.get("/api/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "online")

    def test_legitimate_verification(self):
        payload = {
            "scenario_id": "legitimate",
            "shots": 256,
            "channel_noise": 0.02,
            "decision_threshold_tau": 0.08,
            "session_nonce": "test-nonce-legit-001"
        }
        response = self.client.post("/api/verify/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["decision"]["status"], "VERIFIED_AUTHENTIC")
        self.assertFalse(response.data["decision"]["threat_detected"])
        self.assertLessEqual(response.data["evidence"]["observed_qber"], 0.08)

    def test_forgery_attack_detection(self):
        payload = {
            "scenario_id": "forgery",
            "shots": 256,
            "channel_noise": 0.02,
            "decision_threshold_tau": 0.08,
            "session_nonce": "test-nonce-forgery-001"
        }
        response = self.client.post("/api/verify/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["decision"]["status"], "REJECTED_FORGERY")
        self.assertTrue(response.data["decision"]["threat_detected"])
        self.assertGreater(response.data["evidence"]["observed_qber"], 0.08)

    def test_replay_attack_detection(self):
        nonce = "test-replay-fixed-nonce-999"
        payload = {
            "scenario_id": "legitimate",
            "shots": 256,
            "session_nonce": nonce
        }
        # First verification succeeds
        res1 = self.client.post("/api/verify/", payload, format="json")
        self.assertEqual(res1.data["decision"]["status"], "VERIFIED_AUTHENTIC")

        # Second verification with identical nonce triggers REJECTED_REPLAY
        res2 = self.client.post("/api/verify/", payload, format="json")
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.data["decision"]["status"], "REJECTED_REPLAY")
        self.assertTrue(res2.data["decision"]["threat_detected"])
        self.assertEqual(res2.data["evidence"]["nonce_status"], "REPLAY_DUPLICATE_DETECTED")

    def test_audit_history_recording(self):
        payload = {
            "scenario_id": "legitimate",
            "shots": 128,
            "session_nonce": "test-nonce-audit-123"
        }
        self.client.post("/api/verify/", payload, format="json")

        response = self.client.get("/api/history/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data["total_records"], 1)
