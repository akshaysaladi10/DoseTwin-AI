import json
from pathlib import Path
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.entities import PatientModel, ObservationModel, MedicationModel
from app.schemas.dto import (
    PatientCreate, PatientResponse, PatientDetailResponse, 
    ObservationData, MedicationItem
)
from app.config import settings

class PatientService:
    def get_all_patients(self, db: Session) -> List[PatientDetailResponse]:
        """Retrieves all patients with their nested observations and medications."""
        patients = db.query(PatientModel).all()
        results = []
        for p in patients:
            results.append(self._format_patient_detail(p))
        return results

    def get_patient_by_id_or_code(self, db: Session, identifier: str) -> Optional[PatientDetailResponse]:
        """Finds patient by integer ID or patient_code (e.g. 'P001')."""
        patient = None
        if identifier.isdigit():
            patient = db.query(PatientModel).filter(PatientModel.id == int(identifier)).first()
        if not patient:
            patient = db.query(PatientModel).filter(PatientModel.patient_code.ilike(identifier)).first()
        
        if not patient:
            return None
        return self._format_patient_detail(patient)

    def create_patient(self, db: Session, patient_in: PatientCreate) -> PatientDetailResponse:
        """Creates a new patient, saves baseline observations and medications."""
        # Check duplicate code
        existing = db.query(PatientModel).filter(PatientModel.patient_code == patient_in.patient_code).first()
        if existing:
            raise ValueError(f"Patient with code '{patient_in.patient_code}' already exists.")

        new_patient = PatientModel(
            patient_code=patient_in.patient_code,
            name=patient_in.name,
            age=patient_in.age,
            gender=patient_in.gender,
            primary_condition=patient_in.primary_condition
        )
        db.add(new_patient)
        db.flush()

        # Add observations
        if patient_in.observations:
            obs = ObservationModel(
                patient_id=new_patient.id,
                systolic_bp=patient_in.observations.systolic_bp,
                diastolic_bp=patient_in.observations.diastolic_bp,
                heart_rate=patient_in.observations.heart_rate,
                blood_glucose=patient_in.observations.blood_glucose,
                creatinine=patient_in.observations.creatinine,
                alt_liver=patient_in.observations.alt_liver
            )
            db.add(obs)
        else:
            # Default normal observations
            obs = ObservationModel(patient_id=new_patient.id)
            db.add(obs)

        # Add medications
        for med in patient_in.medications:
            med_row = MedicationModel(
                patient_id=new_patient.id,
                drug_name=med.drug_name,
                dosage=med.dosage,
                frequency=med.frequency,
                route=med.route,
                is_active=True
            )
            db.add(med_row)

        db.commit()
        db.refresh(new_patient)
        return self._format_patient_detail(new_patient)

    def update_patient_observations(self, db: Session, identifier: str, obs_in: ObservationData) -> PatientDetailResponse:
        """Updates a patient's clinical observations (vitals/labs)."""
        patient = None
        if identifier.isdigit():
            patient = db.query(PatientModel).filter(PatientModel.id == int(identifier)).first()
        if not patient:
            patient = db.query(PatientModel).filter(PatientModel.patient_code.ilike(identifier)).first()
            
        if not patient:
            raise ValueError(f"Patient '{identifier}' not found.")
            
        new_obs = ObservationModel(
            patient_id=patient.id,
            systolic_bp=obs_in.systolic_bp,
            diastolic_bp=obs_in.diastolic_bp,
            heart_rate=obs_in.heart_rate,
            blood_glucose=obs_in.blood_glucose,
            creatinine=obs_in.creatinine,
            alt_liver=obs_in.alt_liver
        )
        db.add(new_obs)
        db.commit()
        db.refresh(patient)
        return self._format_patient_detail(patient)

    def seed_initial_patients(self, db: Session):
        """Seeds initial synthetic patients if the table is empty."""
        count = db.query(PatientModel).count()
        if count > 0:
            return

        json_path = Path(settings.PATIENTS_DATA_PATH)
        if not json_path.exists():
            return

        try:
            with open(json_path, "r") as f:
                data = json.load(f)

            for item in data:
                patient = PatientModel(
                    patient_code=item["patient_code"],
                    name=item["name"],
                    age=item["age"],
                    gender=item["gender"],
                    primary_condition=item["primary_condition"]
                )
                db.add(patient)
                db.flush()

                obs_dict = item.get("observations", {})
                obs = ObservationModel(
                    patient_id=patient.id,
                    systolic_bp=obs_dict.get("systolic_bp", 120.0),
                    diastolic_bp=obs_dict.get("diastolic_bp", 80.0),
                    heart_rate=obs_dict.get("heart_rate", 72.0),
                    blood_glucose=obs_dict.get("blood_glucose", 100.0),
                    creatinine=obs_dict.get("creatinine", 1.0),
                    alt_liver=obs_dict.get("alt_liver", 25.0)
                )
                db.add(obs)

                for med_item in item.get("medications", []):
                    med = MedicationModel(
                        patient_id=patient.id,
                        drug_name=med_item["drug_name"],
                        dosage=med_item.get("dosage", "Standard"),
                        frequency=med_item.get("frequency", "Daily"),
                        route=med_item.get("route", "Oral"),
                        is_active=True
                    )
                    db.add(med)

            db.commit()
            print(f"Successfully seeded {len(data)} synthetic patient twins into database.")
        except Exception as e:
            db.rollback()
            print(f"Error seeding synthetic patients: {e}")

    def _format_patient_detail(self, p: PatientModel) -> PatientDetailResponse:
        obs_data = None
        if p.observations and len(p.observations) > 0:
            latest_obs = p.observations[-1]
            obs_data = ObservationData(
                systolic_bp=latest_obs.systolic_bp,
                diastolic_bp=latest_obs.diastolic_bp,
                heart_rate=latest_obs.heart_rate,
                blood_glucose=latest_obs.blood_glucose,
                creatinine=latest_obs.creatinine,
                alt_liver=latest_obs.alt_liver
            )
        else:
            obs_data = ObservationData()

        med_list = [
            MedicationItem(
                drug_name=m.drug_name,
                dosage=m.dosage,
                frequency=m.frequency,
                route=m.route
            )
            for m in p.medications if m.is_active
        ]

        return PatientDetailResponse(
            id=p.id,
            patient_code=p.patient_code,
            name=p.name,
            age=p.age,
            gender=p.gender,
            primary_condition=p.primary_condition,
            created_at=p.created_at,
            observations=obs_data,
            medications=med_list
        )

patient_service = PatientService()
