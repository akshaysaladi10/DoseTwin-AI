import os
from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.patient_service import patient_service
from app.services.interaction_service import interaction_service
from app.ml.predict import get_or_load_model
from app.routes import (
    patient_router,
    medication_router,
    interaction_router,
    prediction_router,
    fhir_router,
    graph_router,
    analyze_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    print("=" * 60)
    print("[+] Initializing DoseTwin AI Backend Services...")
    print(f"[*] Database URL: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")

    # 1. Create database tables
    Base.metadata.create_all(bind=engine)
    print("[*] Database tables verified/created.")

    # 2. Seed initial synthetic data
    db = SessionLocal()
    try:
        patient_service.seed_initial_patients(db)
        interaction_service.seed_interaction_rules(db)
        print("[*] Synthetic patient cohort & interaction knowledge initialized.")
    finally:
        db.close()

    # 3. Initialize Knowledge Graph
    from app.knowledge_graph.graph_service import kg_service
    try:
        kg_service.initialize_base_knowledge()
        print("[*] Knowledge Graph (Neo4j) base knowledge initialized.")
    except Exception as e:
        print(f"[!] Warning connecting to Neo4j at startup: {e}")

    # 3. Ensure ML Model is loaded/trained
    try:
        get_or_load_model()
        print("[*] Machine learning drug response model loaded and ready.")
    except Exception as e:
        print(f"[!] Warning loading ML model at startup: {e}")

    print("[+] DoseTwin AI SOA Core is running successfully.")
    print("=" * 60)
    yield
    # --- Shutdown ---
    print("[-] Shutting down DoseTwin AI services.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="""
# DoseTwin AI: A Digital Twin Framework for Personalized Drug Response Simulation and Medication Conflict Prevention

### Academic SOA Prototype
DoseTwin AI demonstrates a patient-centric digital twin architecture combining:
- **Patient Management Service**: Digital Twin state assembly & vitals/labs tracking
- **Medication Service**: Prescription management and synthetic pharmacological catalog
- **Drug Interaction Service**: Order-independent conflict analysis and severity scoring
- **Knowledge Graph Service**: NetworkX-based relationship mining (Patient-Condition-Drug-Interaction)
- **HL7 FHIR Converter**: Educational FHIR R4-compatible JSON transformations
- **Machine Learning Component**: Scikit-Learn Random Forest drug-response simulation
- **Unified Orchestrator**: Multi-service simulation workflow (`POST /analyze`)

> **Academic Disclaimer**: This prototype utilizes synthetic healthcare data for educational and architectural demonstration. It is not approved for clinical decision making.
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": str(exc),
            "path": request.url.path
        }
    )

# Root & Health Check Endpoints
@app.get("/", tags=["System Status"])
def root():
    return {
        "system": "DoseTwin AI SOA Core",
        "version": settings.PROJECT_VERSION,
        "status": "online",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "swagger_docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "disclaimer": "Academic Prototype - Synthetic Data Only"
    }

@app.get("/health", tags=["System Status"])
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "services": {
            "api_gateway": "operational",
            "patient_service": "operational",
            "medication_service": "operational",
            "interaction_service": "operational",
            "knowledge_graph_service": "operational",
            "fhir_converter": "operational",
            "ml_prediction_service": "operational"
        }
    }

# Mount API V1 routers
api_prefix = settings.API_V1_STR
app.include_router(patient_router, prefix=api_prefix)
app.include_router(medication_router, prefix=api_prefix)
app.include_router(interaction_router, prefix=api_prefix)
app.include_router(prediction_router, prefix=api_prefix)
app.include_router(fhir_router, prefix=api_prefix)
app.include_router(graph_router, prefix=api_prefix)
app.include_router(analyze_router, prefix=api_prefix)

# Also mount direct top-level convenience routes for required endpoints
app.include_router(patient_router)
app.include_router(medication_router)
app.include_router(interaction_router)
app.include_router(prediction_router)
app.include_router(fhir_router)
app.include_router(graph_router)
app.include_router(analyze_router)
