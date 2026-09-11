def test_get_medication_catalog(client):
    response = client.get("/api/v1/medications")
    assert response.status_code == 200
    meds = response.json()
    assert len(meds) >= 8
    drug_names = [m["drug_name"] for m in meds]
    assert "Warfarin" in drug_names
    assert "Metformin" in drug_names
    assert "Aspirin" in drug_names

def test_add_medication_to_patient(client):
    payload = {
        "patient_id": 1,
        "drug_name": "Vitamin D3",
        "dosage": "1000IU",
        "frequency": "Once daily",
        "route": "Oral"
    }
    response = client.post("/api/v1/medications", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["drug_name"] == "Vitamin D3"
