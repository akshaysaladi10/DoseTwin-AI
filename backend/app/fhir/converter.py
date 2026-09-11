from datetime import datetime, timedelta
from typing import Dict, Any, List
from app.schemas.dto import ObservationData, MedicationItem

def calculate_birth_date(age: int) -> str:
    """Estimates approximate birth year from age."""
    year = datetime.utcnow().year - age
    return f"{year}-01-01"

def to_fhir_patient(patient_code: str, name: str, age: int, gender: str) -> Dict[str, Any]:
    """Generates an HL7 FHIR R4-inspired Patient resource."""
    parts = name.strip().split(" ")
    family = parts[-1] if len(parts) > 1 else parts[0]
    given = parts[:-1] if len(parts) > 1 else [parts[0]]

    return {
        "resourceType": "Patient",
        "id": f"pat-{patient_code.lower()}",
        "identifier": [
            {
                "system": "https://dosetwin.ai/fhir/patient-id",
                "value": patient_code
            }
        ],
        "active": True,
        "name": [
            {
                "use": "official",
                "text": name,
                "family": family,
                "given": given
            }
        ],
        "gender": gender.lower() if gender.lower() in ["male", "female", "other"] else "unknown",
        "birthDate": calculate_birth_date(age),
        "meta": {
            "profile": ["http://hl7.org/fhir/StructureDefinition/Patient"],
            "source": "DoseTwin-AI-DigitalTwinEngine"
        }
    }

def to_fhir_condition(patient_code: str, condition_text: str) -> Dict[str, Any]:
    """Generates an HL7 FHIR R4-inspired Condition resource."""
    return {
        "resourceType": "Condition",
        "id": f"cond-{patient_code.lower()}-primary",
        "clinicalStatus": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                    "code": "active",
                    "display": "Active"
                }
            ]
        },
        "verificationStatus": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                    "code": "confirmed",
                    "display": "Confirmed"
                }
            ]
        },
        "category": [
            {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                        "code": "encounter-diagnosis",
                        "display": "Encounter Diagnosis"
                    }
                ]
            }
        ],
        "code": {
            "text": condition_text,
            "coding": [
                {
                    "system": "http://snomed.info/sct",
                    "display": condition_text
                }
            ]
        },
        "subject": {
            "reference": f"Patient/pat-{patient_code.lower()}",
            "display": f"Patient {patient_code}"
        },
        "recordedDate": datetime.utcnow().strftime("%Y-%m-%d")
    }

def to_fhir_medication_requests(patient_code: str, medications: List[MedicationItem]) -> List[Dict[str, Any]]:
    """Generates HL7 FHIR R4-inspired MedicationRequest resources."""
    resources = []
    for idx, med in enumerate(medications, start=1):
        resources.append({
            "resourceType": "MedicationRequest",
            "id": f"medreq-{patient_code.lower()}-{idx}",
            "status": "active",
            "intent": "order",
            "medicationCodeableConcept": {
                "text": med.drug_name,
                "coding": [
                    {
                        "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                        "display": med.drug_name
                    }
                ]
            },
            "subject": {
                "reference": f"Patient/pat-{patient_code.lower()}"
            },
            "dosageInstruction": [
                {
                    "text": f"{med.drug_name} {med.dosage} via {med.route}, {med.frequency}",
                    "route": {
                        "text": med.route
                    },
                    "doseAndRate": [
                        {
                            "doseQuantity": {
                                "value": med.dosage
                            }
                        }
                    ]
                }
            ]
        })
    return resources

def to_fhir_observations(patient_code: str, obs: ObservationData) -> List[Dict[str, Any]]:
    """Generates HL7 FHIR R4-inspired Observation resources for vitals and lab parameters."""
    obs_defs = [
        {
            "code": "8480-6",
            "display": "Systolic blood pressure",
            "category": "vital-signs",
            "value": obs.systolic_bp,
            "unit": "mmHg",
            "id_suffix": "bp-systolic"
        },
        {
            "code": "8462-4",
            "display": "Diastolic blood pressure",
            "category": "vital-signs",
            "value": obs.diastolic_bp,
            "unit": "mmHg",
            "id_suffix": "bp-diastolic"
        },
        {
            "code": "8867-4",
            "display": "Heart rate",
            "category": "vital-signs",
            "value": obs.heart_rate,
            "unit": "beats/min",
            "id_suffix": "heart-rate"
        },
        {
            "code": "2339-0",
            "display": "Glucose [Mass/volume] in Blood",
            "category": "laboratory",
            "value": obs.blood_glucose,
            "unit": "mg/dL",
            "id_suffix": "blood-glucose"
        },
        {
            "code": "2160-0",
            "display": "Creatinine [Mass/volume] in Serum or Plasma",
            "category": "laboratory",
            "value": obs.creatinine,
            "unit": "mg/dL",
            "id_suffix": "creatinine"
        },
        {
            "code": "1742-6",
            "display": "Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
            "category": "laboratory",
            "value": obs.alt_liver,
            "unit": "U/L",
            "id_suffix": "alt-liver"
        }
    ]

    resources = []
    for item in obs_defs:
        resources.append({
            "resourceType": "Observation",
            "id": f"obs-{patient_code.lower()}-{item['id_suffix']}",
            "status": "final",
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                            "code": item["category"],
                            "display": item["category"].replace("-", " ").title()
                        }
                    ]
                }
            ],
            "code": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": item["code"],
                        "display": item["display"]
                    }
                ],
                "text": item["display"]
            },
            "subject": {
                "reference": f"Patient/pat-{patient_code.lower()}"
            },
            "effectiveDateTime": datetime.utcnow().isoformat(),
            "valueQuantity": {
                "value": item["value"],
                "unit": item["unit"],
                "system": "http://unitsofmeasure.org"
            }
        })
    return resources

def build_fhir_bundle(
    patient_code: str,
    name: str,
    age: int,
    gender: str,
    primary_condition: str,
    observations: ObservationData,
    medications: List[MedicationItem]
) -> Dict[str, Any]:
    """Assembles all FHIR resources for a digital twin into a unified FHIR Collection Bundle."""
    patient_res = to_fhir_patient(patient_code, name, age, gender)
    condition_res = to_fhir_condition(patient_code, primary_condition)
    obs_resources = to_fhir_observations(patient_code, observations)
    med_resources = to_fhir_medication_requests(patient_code, medications)

    all_resources = [patient_res, condition_res] + obs_resources + med_resources

    entries = [
        {
            "fullUrl": f"urn:uuid:{res['resourceType'].lower()}-{res['id']}",
            "resource": res
        }
        for res in all_resources
    ]

    return {
        "resourceType": "Bundle",
        "type": "collection",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "total": len(entries),
        "entry": entries,
        "summary": {
            "patient": patient_res,
            "condition": condition_res,
            "observations": obs_resources,
            "medication_requests": med_resources
        }
    }
