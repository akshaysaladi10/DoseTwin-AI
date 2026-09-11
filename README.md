# DoseTwin AI: A Digital Twin Framework for Personalized Drug Response Simulation and Medication Conflict Prevention

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1+-646CFF.svg)](https://vitejs.dev/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15+-FF6F00.svg)](https://tensorflow.org/)
[![HL7 FHIR R4](https://img.shields.io/badge/HL7_FHIR-R4_Compatible-E53935.svg)](https://hl7.org/fhir/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)
[![Tests](https://img.shields.io/badge/pytest-20%20passed-success.svg)](https://pytest.org/)

---

## 1. Project Purpose & Executive Summary

**DoseTwin AI** is an academic Service-Oriented Architecture (SOA) project that demonstrates an integrated digital twin framework combining:
1. **Patient Demographics & Clinical Observations**: Blood pressure, heart rate, blood glucose, serum creatinine, and liver enzymes.
2. **Medication Regimen Tracking**: Multi-drug prescription management.
3. **HL7 FHIR R4 Interoperability**: Automatic conversion into standardized FHIR resources (`Patient`, `Condition`, `MedicationRequest`, `Observation`, and `Bundle`).
4. **Drug-Drug Interaction Detection Engine**: Bidirectional, order-independent conflict analysis using local pharmacology knowledge.
5. **Personalized Machine Learning Drug Response Prediction**: TensorFlow Keras Neural Network evaluating patient physiology to estimate response scores and adverse risk tiers.
6. **Neo4j Knowledge Graph Analysis**: Entity relationship mining connecting patients, clinical diagnoses, active therapies, and conflict edges.
7. **Interactive Dashboard**: Modern cyber-clinical glassmorphic interface with live physiological sliders, dynamic prescription builder, and simulation radar.

> [!IMPORTANT]
> **Academic Prototype Notice**: This system is an academic proof-of-concept created with synthetic healthcare data for SOA evaluation. It is NOT approved for real clinical decision-making.

---

## 2. System Architecture

DoseTwin AI follows a clear Service-Oriented Architecture with modular services communicating over REST:

```
                       +------------------------------------------------+
                       |              React + Vite Frontend             |
                       |       (Cyber-Clinical Glassmorphic UI)         |
                       +------------------------------------------------+
                                              │
                                      REST API (Axios JSON)
                                              ▼
                       +------------------------------------------------+
                       |          FastAPI API Gateway / Core            |
                       |           (http://localhost:8000)              |
                       +------------------------------------------------+
                                              │
      +-------------------+-------------------+--------------------+-------------------+
      │                   │                   │                    │                   │
      ▼                   ▼                   ▼                    ▼                   ▼
+─────────────+   +---------------+   +------------------+   +---------------+   +------------------+
│   Patient   │   │  Medication   │   │   Interaction    │   │  FHIR Engine  │   │  Drug Response   │
│   Service   │   │    Service    │   │    & Graph       │   │  (HL7 R4-like)│   │  ML Model Service│
│ (CRUD/Twin) │   │ (Prescription)│   │   (Neo4j KG)     │   │ (Standardize) │   │ (TensorFlow NN)  │
+─────────────+   +---------------+   +------------------+   +---------------+   +------------------+
      │                   │                   │                    │                   │
      +-------------------+-------------------+--------------------+-------------------+
                                              │
                                              ▼
                               +-----------------------------+
                               |     PostgreSQL / SQLite     |
                               |    (SQLAlchemy Models)      |
                               +-----------------------------+
```

---

## 3. Technology Stack

- **Frontend**: React 18, Vite 6, Vanilla CSS (Cyber-Clinical Dark Mode Design System), Axios, Lucide Icons.
- **Backend API**: Python 3.11, FastAPI, Pydantic v2, Uvicorn.
- **Database & ORM**: PostgreSQL 15, SQLAlchemy 2.0 (with standalone SQLite fallback).
- **Data Standardization**: HL7 FHIR R4-compatible JSON converter.
- **Machine Learning**: TensorFlow (Keras Sequential Neural Network), Pandas, NumPy, Joblib.
- **Knowledge Graph**: Neo4j Graph Database (Multi-directional Graph Modeling).
- **Testing**: Pytest, FastAPI TestClient (20 automated unit & integration tests).
- **Containerization**: Docker, Docker Compose.

---

## 4. Project Structure

```
DoseTwin-AI/
├── backend/
│   ├── app/
│   │   ├── fhir/                  # HL7 FHIR R4 converter module
│   │   ├── knowledge_graph/       # NetworkX Knowledge Graph service
│   │   ├── ml/                    # ML synthetic training & inference pipeline
│   │   ├── models/                # SQLAlchemy database entity models
│   │   ├── routes/                # FastAPI REST API endpoints
│   │   ├── schemas/               # Pydantic validation DTOs
│   │   ├── services/              # Autonomous service domain logic
│   │   ├── config.py              # Application settings & environment config
│   │   ├── database.py            # Database session factory & engine
│   │   └── main.py                # FastAPI app entrypoint & lifespan
│   ├── tests/                     # Comprehensive pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI cards, forms, and radars
│   │   ├── pages/                 # Dashboard, Studio, Medications, Interactions, Graph, About
│   │   ├── services/              # Axios REST API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css              # Cyber-clinical glassmorphic CSS design system
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── data/
│   ├── synthetic_patients.json    # Initial synthetic patient cohorts (P001-P005)
│   ├── synthetic_medications.json # Synthetic pharmacology catalog
│   └── interaction_data.json      # Drug-drug interaction rules
├── database/
│   └── init.sql                   # PostgreSQL initial DDL and seed queries
├── models/
│   ├── drug_response_tf.keras     # Serialized TensorFlow neural network model artifact
│   └── model_metadata.json        # Model metrics and training cohort specs
├── docker-compose.yml
├── .env.example
├── .gitignore
├── ARCHITECTURE.md                # In-depth SOA architectural specification
└── README.md
```

---

## 5. How to Run the Project

### Option A: Running Standalone Locally (Recommended for Development)

#### 1. Start the Backend:
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (runs with automatic SQLite fallback & auto-seeding)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **FastAPI Interactive Swagger**: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Start the Frontend:
```bash
# Navigate to frontend directory
cd frontend

# Install Node packages
npm install

# Start Vite development server
npm run dev
```
- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)

---

### Option B: Running with Docker & Docker Compose

```bash
# Build and launch PostgreSQL, FastAPI Backend, and React Frontend containers
docker-compose up --build
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:8000](http://localhost:8000)
- **Swagger**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL**: `localhost:5432` (`dosetwin_db`)

---

## 6. Running Automated Tests

Run the complete test suite verifying health endpoints, patient CRUD, medication management, order-independent interactions, FHIR conversion, ML prediction, and the end-to-end `/analyze` pipeline:

```bash
pytest backend/tests -v
```

---

## 7. Key REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Live health check across all SOA microservices |
| `GET` | `/api/v1/patients` | Retrieve all registered digital twin profiles |
| `GET` | `/api/v1/patients/{id}` | Retrieve specific digital twin by code (e.g. `P001`) |
| `POST` | `/api/v1/patients` | Register a new custom digital twin |
| `GET` | `/api/v1/medications` | Query synthetic pharmacology catalog |
| `POST` | `/api/v1/interactions/check` | Check order-independent drug-drug conflicts |
| `GET` | `/api/v1/interactions/rules` | Fetch all configured interaction rules |
| `POST` | `/api/v1/prediction/predict` | Run Scikit-Learn personalized response prediction |
| `GET` | `/api/v1/fhir/patient/{id}` | Export HL7 FHIR R4 collection bundle |
| `GET` | `/api/v1/knowledge-graph/interactions`| Export global multi-entity relationship graph |
| `POST` | `/api/v1/analyze` | **Unified Digital Twin Simulation Pipeline** |

---

## 8. Academic Demonstration Scenarios

### Scenario 1: High Conflict Alert (Eleanor Vance - P001)
1. Open the **Simulation Studio** tab.
2. Select **Eleanor Vance (P001)** (Atrial Fibrillation, Age 68, SBP 138, Creatinine 1.4).
3. Active Regimen: **Warfarin (5mg)** + **Aspirin (81mg)**.
4. Click **"⚡ Run Digital Twin Simulation"**.
5. **Result**:
   - **Interaction Status**: Potential Interaction Detected (Highest Severity: **High**).
   - **Mechanism**: Pharmacodynamic synergism between anticoagulant and antiplatelet elevating major hemorrhage risk.
   - **ML Response**: Simulated response prediction with renal clearance factor.
   - **FHIR & Graph**: Automatically renders FHIR Bundle and NetworkX conflict edge.

### Scenario 2: Safe Regimen (Arthur Pendelton - P002)
1. Select **Arthur Pendelton (P002)** (Type 2 Diabetes, Age 54, Glucose 162).
2. Active Regimen: **Metformin (1000mg)** + **Atorvastatin (20mg)**.
3. Click **"⚡ Run Digital Twin Simulation"**.
4. **Result**:
   - **Interaction Status**: No Medication Conflicts Detected (Severity: **None**).
   - **ML Response**: Favorable response prediction with low composite risk.

### Scenario 3: CYP3A4 Enzyme Inhibition (Clara Oswald - P003)
1. Select **Clara Oswald (P003)** (Hypercholesterolemia & Bronchitis).
2. Active Regimen: **Simvastatin (40mg)** + **Clarithromycin (500mg)**.
3. Click **"⚡ Run Digital Twin Simulation"**.
4. **Result**:
   - **Interaction Status**: **High** Severity Conflict Alert (CYP3A4 inhibition, 10x statin level elevation, rhabdomyolysis warning).

---

## 9. Academic & Medical Disclaimer

**DoseTwin AI** is an academic educational prototype developed to evaluate Service-Oriented Architecture (SOA), HL7 FHIR data modeling, and machine learning simulation workflows in healthcare informatics. All patient cohorts, pharmacology catalogs, and prediction results are generated using synthetic data. This software is **NOT** a medical device, is **NOT** clinically validated, and must **NOT** be used for clinical diagnostic or treatment decisions.
