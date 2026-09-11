def test_detect_known_high_severity_interaction(client):
    # Test Warfarin + Aspirin
    payload = {"drugs": ["Warfarin", "Aspirin"]}
    response = client.post("/api/v1/interactions/check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["interaction_detected"] is True
    assert data["total_conflicts"] >= 1
    assert data["highest_severity"] == "High"
    assert "bleeding" in data["conflicts"][0]["description"].lower()

def test_interaction_order_independence(client):
    # Test reverse order: Aspirin + Warfarin
    payload = {"drugs": ["Aspirin", "Warfarin"]}
    response = client.post("/api/v1/interactions/check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["interaction_detected"] is True
    assert data["highest_severity"] == "High"

def test_no_interaction_case(client):
    payload = {"drugs": ["Metformin", "Vitamin D3"]}
    response = client.post("/api/v1/interactions/check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["interaction_detected"] is False
    assert data["total_conflicts"] == 0
    assert data["highest_severity"] == "None"

def test_multi_drug_cocktail_interactions(client):
    # Regimen with multiple pairs: Simvastatin + Clarithromycin + Aspirin
    payload = {"drugs": ["Simvastatin", "Clarithromycin", "Aspirin"]}
    response = client.post("/api/v1/interactions/check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["interaction_detected"] is True
    assert data["highest_severity"] == "High"

def test_get_interaction_rules_catalog(client):
    response = client.get("/api/v1/interactions/rules")
    assert response.status_code == 200
    rules = response.json()
    assert len(rules) >= 5
