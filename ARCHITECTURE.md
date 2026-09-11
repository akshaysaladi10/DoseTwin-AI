# DoseTwin AI: Service-Oriented Architecture (SOA) Technical Specification

## 1. Architectural Overview

**DoseTwin AI** is an academic Service-Oriented Architecture (SOA) prototype designed to demonstrate a patient-centric digital twin framework for personalized pharmacology simulation and drug conflict prevention.

The system decouples core capabilities into discrete, autonomous services that communicate via standard REST interfaces and JSON payloads, adhering to modern SOA and microservice principles.

```
                                  +---------------------------------------+
                                  |         React + Vite Frontend         |
                                  |    (Cyber-Clinical Glassmorphic UI)   |
                                  +---------------------------------------+
                                                      │
                                             REST APIs (HTTP / JSON)
                                                      ▼
+─────────────────────────────────────────────────────────────────────────────────────────────────────────────+
│                                  FastAPI API Gateway / Core Orchestrator                                    │
│                                           (http://localhost:8000)                                           │
+─────────────────────────────────────────────────────────────────────────────────────────────────────────────+
       │                            │                           │                           │
       ▼                            ▼                           ▼                           ▼
+───────────────+           +───────────────+           +───────────────+           +───────────────+
│    Patient    │           │  Medication   │           │  Interaction  │           │   HL7 FHIR    │
│  Twin Service │           │    Service    │           │    Service    │           │   Converter   │
│ (Demographics │           │ (Prescriptions│           │ (Order-Indep  │           │ (Standard R4  │
│  & Labs/Vitals)           │  & Catalog)   │           │  Rule Engine) │           │  Bundling)    │
+───────────────+           +───────────────+           +───────────────+           +───────────────+
       │                            │                           │                           │
       └────────────────────────────┼───────────────────────────┴───────────────────────────┘
                                    │
                    +───────────────┴───────────────+
                    │                               │
                    ▼                               ▼
       +─────────────────────────+     +─────────────────────────+
       │  Knowledge Graph Engine │     │   ML Prediction Engine  │
       │    (Neo4j Database)     │     │ (TensorFlow Neural Net) │
       +─────────────────────────+     +─────────────────────────+
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
       +─────────────────────────────────────────────────────────+
       │                 Database Storage Layer                  │
       │           PostgreSQL (Prod/Docker) / SQLite             │
       │                   (SQLAlchemy ORM)                      │
       +─────────────────────────────────────────────────────────+
```

---

## 2. Core SOA Principles Implemented

### 2.1 Loose Coupling & Service Autonomy
- **Separation of Concerns**: The **Patient Service** manages patient state independently from the **Interaction Service** or the **ML Engine**. Each service can be tested, scaled, or refactored with zero ripple effects on other modules.
- **Contract-First Communication**: All services exchange structured Pydantic DTOs (Data Transfer Objects) with strict runtime type validation and automatic schema generation.

### 2.2 Healthcare Interoperability via HL7 FHIR
- Rather than using proprietary, vendor-locked schemas, the **FHIR Converter Module** maps digital twin state to standard **HL7 FHIR R4** resources:
  - `Patient`: Demographics, unique identifiers, birth date estimation.
  - `Condition`: Active clinical diagnoses mapped to terminology concepts.
  - `MedicationRequest`: Prescription intent, dosage instructions, and routes.
  - `Observation`: Vital signs (Systolic/Diastolic BP, Heart Rate) and laboratory measurements (Creatinine, Blood Glucose, ALT) with LOINC coding and standardized units.

### 2.3 Knowledge Graph Theory (Neo4j)
- Relational databases struggle with complex, multi-hop pharmacological relationship traversals.
- DoseTwin AI implements a **Neo4j Graph Database** knowledge layer where:
  - **Nodes**: `Patient`, `Condition`, `Drug`, `Observation`.
  - **Edges**: `HAS_CONDITION`, `TAKES`, `HAS_OBSERVATION`, `INTERACTS_WITH`, `USED_FOR`.
- This enables rapid pathfinding between concurrent drugs to identify adverse interaction subgraphs and therapeutic alignments.

### 2.4 Machine Learning Simulation Pipeline
- The **ML Prediction Service** employs an educational `Sequential Neural Network` built with **TensorFlow** trained on a multi-variable synthetic clinical cohort.
- Features include:
  - Demographics: Age, Gender, Primary Condition.
  - Pharmacology: Target Drug, Dosage Category (Low, Standard, High).
  - Physiological Biomarkers: Systolic & Diastolic BP, Heart Rate, Blood Glucose, Serum Creatinine, Liver ALT.
- The pipeline yields:
  - **Predicted Response**: `Favorable`, `Moderate`, `Poor`.
  - **Confidence Score**: Quantitative probability (0.00 to 1.00).
  - **Risk Classification**: `Low`, `Moderate`, `High`.
  - **Explainability**: Top physiological factors (e.g., impaired renal filtration or hepatic stress) impacting pharmacokinetic clearance.

---

## 3. End-to-End `/analyze` Request Flow

When the user clicks **"⚡ Run Digital Twin Simulation"** on the React frontend, the request executes through the following 8-step pipeline:

```
[User Action: "Run Digital Twin Simulation"]
                 │
                 ▼
1. Input Validation: Pydantic validates age (0-125), vitals ranges, and medication array.
                 │
                 ▼
2. Digital Twin Assembly: Service constructs composite patient profile (demographics + vitals + active regimen).
                 │
                 ▼
3. FHIR Transformation: FHIR Engine maps twin into valid HL7 FHIR Collection Bundle.
                 │
                 ▼
4. Multi-Drug Interaction Check: Evaluates all N*(N-1)/2 drug pairs bidirectionally against interaction catalog.
                 │
                 ▼
5. **Knowledge Graph Query**: Neo4j constructs patient-specific subgraph connecting conditions, vitals, and conflict edges.
                 │
                 ▼
6. **ML Response Prediction**: TensorFlow Neural Network predicts target drug response category, probability score, and risk factors.
                 │
                 ▼
7. Composite Risk Synthesis: Synthesizes interaction severity, ML risk tier, and vital anomalies into overall simulation risk.
                 │
                 ▼
8. Response Packaging: Returns unified JSON response to React dashboard with full visual rendering.
```

---

## 4. Academic Disclaimer

DoseTwin AI is an academic prototype designed to illustrate Service-Oriented Architecture, HL7 FHIR interoperability concepts, graph theory, and simulated machine learning in healthcare IT. All patient cohorts, medication rules, and predictions utilize synthetic datasets and are strictly intended for educational and architectural evaluation.
