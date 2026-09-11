from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.dto import PatientCreate, PatientDetailResponse, ObservationData
from app.services.patient_service import patient_service

router = APIRouter(prefix="/patients", tags=["Patients (Digital Twins)"])

@router.get("", response_model=List[PatientDetailResponse], summary="Get all patient digital twins")
def get_all_patients(db: Session = Depends(get_db)):
    return patient_service.get_all_patients(db)

@router.get("/{patient_id}", response_model=PatientDetailResponse, summary="Get single patient digital twin by ID or code")
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = patient_service.get_patient_by_id_or_code(db, patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with identifier '{patient_id}' not found."
        )
    return patient

@router.post("", response_model=PatientDetailResponse, status_code=status.HTTP_201_CREATED, summary="Create a new patient digital twin")
def create_patient(patient_in: PatientCreate, db: Session = Depends(get_db)):
    try:
        return patient_service.create_patient(db, patient_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create patient: {str(e)}")

@router.put("/{patient_id}/observations", response_model=PatientDetailResponse, summary="Update patient vitals and trigger Digital Twin refresh")
def update_patient_observations(patient_id: str, obs_in: ObservationData, db: Session = Depends(get_db)):
    try:
        return patient_service.update_patient_observations(db, patient_id, obs_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to update observations: {str(e)}")
