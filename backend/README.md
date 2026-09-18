# Django Backend Architecture & Integration Plan

This directory houses the Django backend for the **Quantum-Inspired Cyber Threat Detection** system.

> **Status Notice (Milestone 0):**  
> The backend currently contains initial Django scaffolding (`detection` app with REST Framework and CORS headers). Advanced quantum simulation endpoints, statistical detector engines, and nonce tracking models are planned for implementation in **Milestones 5 & 6**. Endpoints are not yet integrated into the live verification loop.

---

## 1. Planned Architecture

```
backend/
├── backend/            # Django project settings and root routing
├── detection/          # Primary threat detection application
│   ├── quantum/        # Part 2: Pure quantum state simulation & attack models
│   │   ├── states.py       # State preparation (|0>, |1>, |+>, |->)
│   │   ├── teleport.py     # Bell-state preparation & joint projection
│   │   └── channel.py      # Noise models (depolarizing, intercept-resend)
│   ├── engine/         # Part 1: Rudra's detector orchestration
│   │   ├── detector.py     # Statistical hypothesis testing (QBER vs threshold)
│   │   └── freshness.py    # Nonce uniqueness & replay defense
│   ├── models.py       # VerificationAudit & ExperimentRecord SQLite/PostgreSQL
│   ├── serializers.py  # DRF request/response serialization
│   ├── views.py        # API views for simulation & verification
│   └── urls.py         # Sub-routing for /api/...
├── manage.py
└── requirements.txt
```

---

## 2. Planned API Endpoints (Draft)

- `GET  /api/health/`: Simple service availability check.
- `GET  /api/scenarios/`: Retrieves available attack and benchmark scenarios.
- `POST /api/simulate/`: Runs state-vector teleportation simulation given noise and shot count.
- `POST /api/verify/`: Evaluates measurement statistics and nonce freshness against security threshold $\tau$.
- `GET  /api/history/`: Retrieves past verification audit records.

---

## 3. Local Development Setup (When Ready)

```bash
# Activate virtual environment
source ../venv/bin/activate  # or python3 -m venv venv && source venv/bin/activate

# Install dependencies
pip install django djangorestframework django-cors-headers numpy

# Run migrations
python manage.py migrate

# Start local server
python manage.py runserver 8000
```
