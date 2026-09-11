from app.fhir.converter import (
    to_fhir_patient,
    to_fhir_condition,
    to_fhir_observations,
    to_fhir_medication_requests,
    build_fhir_bundle
)
from app.schemas.dto import ObservationData, MedicationItem

def test_to_fhir_patient():
    res = to_fhir_patient("P001", "Eleanor Vance", 68, "Female")
    assert res["resourceType"] == "Patient"
    assert res["id"] == "pat-p001"
    assert res["gender"] == "female"
    assert res["name"][0]["family"] == "Vance"
    assert res["name"][0]["given"] == ["Eleanor"]

def test_to_fhir_condition():
    res = to_fhir_condition("P001", "Atrial Fibrillation")
    assert res["resourceType"] == "Condition"
    assert res["code"]["text"] == "Atrial Fibrillation"
    assert res["subject"]["reference"] == "Patient/pat-p001"

def test_to_fhir_observations():
    obs = ObservationData(
        systolic_bp=135,
        diastolic_bp=85,
        heart_rate=76,
        blood_glucose=110,
        creatinine=1.2,
        alt_liver=30
    )
    resources = to_fhir_observations("P001", obs)
    assert len(resources) == 6
    types = [r["resourceType"] for r in resources]
    assert all(t == "Observation" for t in types)

def test_fhir_bundle_endpoint(client):
    response = client.get("/api/v1/fhir/Bundle/P001")
    assert response.status_code == 200
    bundle = response.json()
    assert bundle["resourceType"] == "Bundle"
    assert bundle["type"] == "collection"
    assert bundle["total"] >= 5
