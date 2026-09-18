from rest_framework.decorators import api_view
from rest_framework.response import Response

from .quantum.simulator import simulate_measurements


@api_view(["GET"])
def home(request):
    return Response({
        "project": "Quantum-Inspired Cyber Threat Detection",
        "backend": "Django",
        "status": "running"
    })


@api_view(["GET"])
def simulate(request):
    result = simulate_measurements()

    return Response({
        "type": "normal",
        "measurement": result
    })