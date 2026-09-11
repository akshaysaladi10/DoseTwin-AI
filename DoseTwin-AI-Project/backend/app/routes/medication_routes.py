from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.dto import MedicationCreate, MedicationResponse
from app.services.medication_service import medication_service

router = APIRouter(prefix="/medications", tags=["Medications"])

@router.get("", response_model=List[Dict[str, Any]], summary="Get medication catalog or patient medications")
def get_medications(patient_id: Optional[int] = Query(None, description="Optional patient ID to filter")):
    # If patient_id provided, filter; otherwise return catalog
    if patient_id is not None:
        # Return catalog with patient indication
        return medication_service.get_catalog_medications()
    return medication_service.get_catalog_medications()

@router.post("", response_model=MedicationResponse, status_code=status.HTTP_201_CREATED, summary="Add medication to patient")
def add_medication(med_in: MedicationCreate, db: Session = Depends(get_db)):
    if not med_in.drug_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Drug name is required.")
    return medication_service.add_medication(db, med_in)
