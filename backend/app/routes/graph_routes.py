from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.knowledge_graph.graph_service import kg_service
from app.services.patient_service import patient_service

router = APIRouter(prefix="/knowledge-graph", tags=["Knowledge Graph"])

@router.get("/interactions", response_model=Dict[str, Any], summary="Get full drug-condition-interaction knowledge graph")
def get_global_interactions_graph():
    return kg_service.export_graph_for_visualization()

@router.get("/patient/{patient_id}", response_model=Dict[str, Any], summary="Get enriched Knowledge Subgraph for a patient twin")
def get_patient_graph(patient_id: str, db: Session = Depends(get_db)):
    patient = patient_service.get_patient_by_id_or_code(db, patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient '{patient_id}' not found."
        )

    return kg_service.build_patient_twin_subgraph(
        patient_code=patient.patient_code,
        name=patient.name,
        condition=patient.primary_condition,
        observations=patient.observations,
        medications=patient.medications
    )
