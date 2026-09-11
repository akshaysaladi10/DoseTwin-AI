import json
from pathlib import Path
from typing import List, Dict, Any
from sqlalchemy.orm import Session

from app.models.entities import MedicationModel
from app.schemas.dto import MedicationCreate, MedicationResponse, MedicationItem
from app.config import settings

class MedicationService:
    def get_patient_medications(self, db: Session, patient_id: int) -> List[MedicationResponse]:
        """Returns active medications prescribed to a specific patient."""
        meds = db.query(MedicationModel).filter(
            MedicationModel.patient_id == patient_id,
            MedicationModel.is_active == True
        ).all()
        return meds

    def add_medication(self, db: Session, med_in: MedicationCreate) -> MedicationResponse:
        """Adds a medication entry to a patient's active regimen."""
        med = MedicationModel(
            patient_id=med_in.patient_id,
            drug_name=med_in.drug_name.strip(),
            dosage=med_in.dosage.strip(),
            frequency=med_in.frequency.strip(),
            route=med_in.route.strip(),
            is_active=True
        )
        db.add(med)
        db.commit()
        db.refresh(med)
        return med

    def get_catalog_medications(self) -> List[Dict[str, Any]]:
        """Returns the synthetic medication knowledge catalog."""
        catalog_path = Path(settings.MEDICATIONS_DATA_PATH)
        if catalog_path.exists():
            try:
                with open(catalog_path, "r") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error reading medication catalog: {e}")
        return []

medication_service = MedicationService()
