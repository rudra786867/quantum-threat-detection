# Quantum-Inspired Cyber Threat Detection for Digital Signature Security

A research prototype exploring explainable, physics-grounded threat detection mechanisms for **teleportation-based Quantum Digital Signature (QDS)** protocols.

---

## 1. Project Philosophy & Scientific Integrity

- **Strictly Non-ML:** Detection mechanisms evaluate observable physical statistics (Quantum Bit Error Rate, state fidelity, Bell-state projection outcomes) and cryptographic freshness (session nonces). No machine learning black boxes are used.
- **Explainable Decisions:** Every rejection or channel abort is mathematically justified by the physical disturbance induced by measurements on non-orthogonal quantum states (Quantum No-Cloning Theorem).
- **Honest Limitations:** Simulated on ordinary classical computers using state-vector linear algebra. Finite trials do not constitute an empirical proof of zero information-theoretic vulnerability.

---

## 2. Project Architecture

```
quantum-threat-detection/
├── .github/
│   └── pull_request_template.md  # Standardized PR checklist
├── backend/                      # Django REST backend (Milestones 5 & 6)
│   ├── detection/                # Threat detection app & quantum simulator
│   ├── backend/                  # Project configuration
│   ├── .env.example              # Backend environment template
│   └── README.md                 # Django architecture roadmap
├── frontend/                     # React + Vite frontend (Milestone 0 Starter)
│   ├── src/
│   │   ├── components/           # UI components (Header, PersistentBanner, etc.)
│   │   ├── pages/                # 5 core views (Dashboard, Lab, Results, History, Protocol)
│   │   ├── services/             # Service layer (detectionService.js)
│   │   └── data/                 # Sample scenarios (sampleScenarios.js)
│   ├── .env.example              # Frontend environment template
│   └── package.json
├── docs/
│   ├── COLLABORATION.md          # Team git workflow & PR guide
│   └── API_CONTRACT_DRAFT.md     # Draft REST API contract
├── .gitignore                    # Comprehensive ignore rules
└── README.md                     # This file
```

---

## 3. Quickstart: Running the Frontend Locally

### Prerequisites
- Node.js (v18+) and npm

### Steps
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start Vite development server
npm run dev
```

Open your browser to [http://localhost:5173](http://localhost:5173).

---

## 4. Workstream Division

| Part | Focus | Lead / Ownership | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Part 1** | Django, Detection & Integration | Rudra | REST APIs, statistical thresholds, nonce database, PR reviews |
| **Part 2** | Quantum Simulation & Attacks | Simulation Lead | State prep, Bell projections, channel noise, intercept-resend attack |
| **Part 3** | Frontend & Evidence Display | Frontend Lead | React UI, parameter controls, evidence charts, Vercel deployment |
| **Part 4** | Evaluation, Deployment & Demo | QA / Evaluation Lead | Test harness, error rate analysis, CI/CD, final demo scripts |

---

## 5. Development Roadmap (Milestones)

- [x] **Milestone 0:** Starter UI, repository structure, and collaboration guide.
- [ ] **Milestone 1:** Confirm official problem requirements & select primary QDS protocol.
- [ ] **Milestone 2:** Run one legitimate protocol simulation on classical hardware.
- [ ] **Milestone 3:** Implement one defined attack (intercept-resend) and an observable detector.
- [ ] **Milestone 4:** Evaluate repeated trials, finite-sample confidence, and channel noise.
- [ ] **Milestone 5:** Expose the experiment through Django REST APIs.
- [ ] **Milestone 6:** Connect React frontend to live Django backend.
- [ ] **Milestone 7:** Implement further attacks (replay, channel spoofing) and comprehensive evaluation.
- [ ] **Milestone 8:** Deploy to Vercel/cloud and prepare defense demonstration.
