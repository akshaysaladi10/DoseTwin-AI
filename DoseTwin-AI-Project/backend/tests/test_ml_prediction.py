def test_ml_prediction_endpoint(client):
    payload = {
        "age": 68,
        "gender": "Female",
        "condition": "Atrial Fibrillation",
        "drug_name": "Warfarin",
        "dosage": "5mg",
        "systolic_bp": 138,
        "diastolic_bp": 85,
        "heart_rate": 78,
        "blood_glucose": 105,
        "creatinine": 1.4,
        "alt_liver": 28
    }
    response = client.post("/api/v1/prediction/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["target_drug"] == "Warfarin"
    assert data["predicted_response"] in ["Favorable", "Moderate", "Poor"]
    assert 0.0 <= data["response_score"] <= 1.0
    assert data["risk_level"] in ["Low", "Moderate", "High"]
    assert len(data["contributing_factors"]) > 0
    assert "Academic" in data["disclaimer"] or "Simulated" in data["disclaimer"]
