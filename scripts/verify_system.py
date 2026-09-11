import httpx

def main():
    client = httpx.Client(timeout=10.0)

    print("=== 1. Health Check ===")
    res = client.get("http://localhost:8000/health")
    assert res.status_code == 200
    print("Backend Health:", res.json())

    print("\n=== 2. Patients API ===")
    res = client.get("http://localhost:8000/api/v1/patients")
    assert res.status_code == 200
    patients = res.json()
    print(f"Total Patients: {len(patients)}")
    for p in patients:
        med_names = [m["drug_name"] for m in p["medications"]]
        print(f"  - {p['patient_code']}: {p['name']} ({p['primary_condition']}) | Meds: {med_names}")

    print("\n=== 3. Medications Catalog API ===")
    res = client.get("http://localhost:8000/api/v1/medications")
    assert res.status_code == 200
    meds = res.json()
    print(f"Total Catalog Drugs: {len(meds)}")

    print("\n=== 4. Drug-Drug Interaction Check (Conflict: Warfarin + Aspirin) ===")
    res = client.post("http://localhost:8000/api/v1/interactions/check", json={"drugs": ["Warfarin", "Aspirin"]})
    assert res.status_code == 200
    inter = res.json()
    print("Interaction Detected:", inter["interaction_detected"])
    print("Severity:", inter["highest_severity"])
    print("Mechanism:", inter["conflicts"][0]["mechanism"])

    print("\n=== 5. Drug-Drug Interaction Check (Safe: Metformin + Atorvastatin) ===")
    res = client.post("http://localhost:8000/api/v1/interactions/check", json={"drugs": ["Metformin", "Atorvastatin"]})
    assert res.status_code == 200
    inter_safe = res.json()
    print("Interaction Detected:", inter_safe["interaction_detected"])
    print("Severity:", inter_safe["highest_severity"])

    print("\n=== 6. ML Personalized Drug Response Prediction ===")
    res = client.post("http://localhost:8000/api/v1/prediction/predict", json={
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
    })
    assert res.status_code == 200
    pred = res.json()
    print("Target Drug:", pred["target_drug"])
    print("Predicted Response Category:", pred["predicted_response"])
    print("Probability Score:", pred["response_score"])
    print("Risk Level:", pred["risk_level"])
    print("Contributing Factors Count:", len(pred["contributing_factors"]))

    print("\n=== 7. HL7 FHIR Bundle Export ===")
    res = client.get("http://localhost:8000/api/v1/fhir/patient/P001")
    assert res.status_code == 200
    fhir = res.json()
    print("FHIR Resource Type:", fhir["resourceType"])
    print("Total Bundled Resources:", fhir["total"])
    print("Included Types:", [e["resource"]["resourceType"] for e in fhir["entry"]])

    print("\n=== 8. Knowledge Graph API ===")
    res = client.get("http://localhost:8000/api/v1/knowledge-graph/interactions")
    assert res.status_code == 200
    kg = res.json()
    print(f"Knowledge Graph: {kg['total_nodes']} Nodes, {kg['total_edges']} Edges")

    print("\n=== 9. End-to-End Digital Twin Simulation (/analyze) ===")
    res = client.post("http://localhost:8000/api/v1/analyze", json={
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
            {"drug_name": "Warfarin", "dosage": "5mg", "frequency": "Once daily", "route": "Oral"},
            {"drug_name": "Aspirin", "dosage": "81mg", "frequency": "Once daily", "route": "Oral"}
        ],
        "target_drug": "Warfarin"
    })
    assert res.status_code == 200
    sim = res.json()
    print("Executive Summary:", sim["executive_summary"])
    print("Composite Simulation Risk:", sim["overall_simulation_risk"])
    print("FHIR Bundle Present:", bool(sim["fhir_resources"]))
    print("Knowledge Graph Present:", bool(sim["knowledge_graph_insights"]))

    print("\n=== 10. Frontend Status ===")
    res_fe = client.get("http://localhost:5173")
    assert res_fe.status_code == 200
    print("Frontend Delivery: OK (HTTP 200)")

    print("\n>>> ALL 10 SOA SYSTEM VERIFICATION CHECKS PASSED PERFECTLY! <<<")

if __name__ == "__main__":
    main()
