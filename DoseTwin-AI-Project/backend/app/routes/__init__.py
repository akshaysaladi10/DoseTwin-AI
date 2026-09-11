from app.routes.patient_routes import router as patient_router
from app.routes.medication_routes import router as medication_router
from app.routes.interaction_routes import router as interaction_router
from app.routes.prediction_routes import router as prediction_router
from app.routes.fhir_routes import router as fhir_router
from app.routes.graph_routes import router as graph_router
from app.routes.analyze_routes import router as analyze_router

__all__ = [
    "patient_router",
    "medication_router",
    "interaction_router",
    "prediction_router",
    "fhir_router",
    "graph_router",
    "analyze_router"
]
