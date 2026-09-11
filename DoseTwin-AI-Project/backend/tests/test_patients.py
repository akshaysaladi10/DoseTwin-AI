def test_get_all_patients(client):
    response = client.get("/api/v1/patients")
    assert response.status_code == 200
    patients = response.json()
    assert len(patients) >= 5
    codes = [p["patient_code"] for p in patients]
    assert "P001" in codes
    assert "P002" in codes

def test_get_single_patient(client):
    response = client.get("/api/v1/patients/P001")
    assert response.status_code == 200
    data = response.json()
    assert data["patient_code"] == "P001"
    assert data["name"] == "Eleanor Vance"
    assert len(data["medications"]) >= 2
    assert data["observations"]["systolic_bp"] == 138

def test_create_new_patient(client):
    payload = {
        "patient_code": "P999",
        "name": "Test Digital Twin",
        "age": 45,
        "gender": "Male",
        "primary_condition": "Hypertension",
        "observations": {
            "systolic_bp": 135,
            "diastolic_bp": 85,
            "heart_rate": 70,
            "blood_glucose": 95,
            "creatinine": 1.0,
            "alt_liver": 24
        },
        "medications": [
            {
                "drug_name": "Lisinopril",
                "dosage": "10mg",
                "frequency": "Once daily",
                "route": "Oral"
            }
        ]
    }
    response = client.post("/api/v1/patients", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["patient_code"] == "P999"
    assert data["name"] == "Test Digital Twin"
    assert len(data["medications"]) == 1

def test_get_nonexistent_patient(client):
    response = client.get("/api/v1/patients/NONEXISTENT_999")
    assert response.status_code == 404
