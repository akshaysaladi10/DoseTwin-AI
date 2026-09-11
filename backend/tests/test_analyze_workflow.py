def test_analyze_workflow_with_conflict(client):
    # Patient with Warfarin + Aspirin
    payload = {
        "patient_id": "P001",
        "name": "Eleanor Vance",
        "age": 68,
        "gender": "Female",
        "primary_condition": "Atrial Fibrillation",
        "observations": {
            "systolic_bp": 138,
            "diastolic_bp": 85,
            "heart_rate": 78,
            "blood_glucose": 105,
            "creatinine": 1.4,
            "alt_liver": 28
        },
        "medications": [
            {
                "drug_name": "Warfarin",
                "dosage": "5mg",
                "frequency": "Once daily",
                "route": "Oral"
            },
            {
                "drug_name": "Aspirin",
                "dosage": "81mg",
                "frequency": "Once daily",
                "route": "Oral"
            }
        ],
        "target_drug": "Warfarin"
    }
    response = client.post("/api/v1/analyze", json=payload)
    if response.status_code != 200:
        print("ERROR DETAILS:", response.json())
    assert response.status_code == 200
    data = response.json()
    
    # 1. Digital Twin Summary
    assert data["digital_twin"]["patient_code"] == "P001"
    assert data["digital_twin"]["active_regimen_count"] == 2

    # 2. FHIR Resources
    assert data["fhir_resources"]["resourceType"] == "Bundle"

    # 3. Interactions
    assert data["medication_interactions"]["interaction_detected"] is True
    assert data["medication_interactions"]["highest_severity"] == "High"

    # 4. Response Prediction
    assert data["response_prediction"]["target_drug"] == "Warfarin"
    assert data["response_prediction"]["predicted_response"] in ["Favorable", "Moderate", "Poor"]

    # 5. Overall Risk
    assert data["overall_simulation_risk"] in ["Moderate", "High", "Critical"]

    # 6. Disclaimer
    assert "PROTOTYPE ACADEMIC SIMULATION" in data["disclaimer"]

def test_analyze_workflow_safe_regimen(client):
    # Patient with Metformin alone
    payload = {
        "patient_id": "P002",
        "name": "Arthur Pendelton",
        "age": 54,
        "gender": "Male",
        "primary_condition": "Type 2 Diabetes Mellitus",
        "observations": {
            "systolic_bp": 120,
            "diastolic_bp": 80,
            "heart_rate": 72,
            "blood_glucose": 130,
            "creatinine": 0.9,
            "alt_liver": 20
        },
        "medications": [
            {
                "drug_name": "Metformin",
                "dosage": "1000mg",
                "frequency": "Twice daily",
                "route": "Oral"
            }
        ],
        "target_drug": "Metformin"
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["medication_interactions"]["interaction_detected"] is False
