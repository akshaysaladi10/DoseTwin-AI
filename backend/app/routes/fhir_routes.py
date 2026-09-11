from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.patient_service import patient_service
from app.fhir.converter import build_fhir_bundle

router = APIRouter(prefix="/fhir", tags=["HL7 FHIR Interoperability"])

@router.get("/Patient/{patient_id}", response_model=Dict[str, Any], summary="Get HL7 FHIR R4 Patient resource")
def get_fhir_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = patient_service.get_patient_by_id_or_code(db, patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Patient '{patient_id}' not found.")
    
    from app.fhir.converter import to_fhir_patient
    return to_fhir_patient(patient.patient_code, patient.name, patient.age, patient.gender)

@router.get("/Bundle/{patient_id}", response_model=Dict[str, Any], summary="Get educational HL7 FHIR R4 Bundle for a patient")
def get_patient_fhir(patient_id: str, db: Session = Depends(get_db)):
    patient = patient_service.get_patient_by_id_or_code(db, patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient '{patient_id}' not found."
        )

    bundle = build_fhir_bundle(
        patient_code=patient.patient_code,
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        primary_condition=patient.primary_condition,
        observations=patient.observations,
        medications=patient.medications
    )
    return bundle
