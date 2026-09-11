from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from app.schemas.dto import (
    DigitalTwinAnalyzeRequest, DigitalTwinAnalyzeResponse,
    DigitalTwinSummary, PredictionRequest, ObservationData, MedicationItem
)
from app.services.patient_service import patient_service
from app.services.interaction_service import interaction_service
from app.fhir.converter import build_fhir_bundle
from app.knowledge_graph.graph_service import kg_service
from app.ml.predict import predict_drug_response

class OrchestratorService:
    def analyze_digital_twin(
        self,
        db: Session,
        req: DigitalTwinAnalyzeRequest
    ) -> DigitalTwinAnalyzeResponse:
        """
        Orchestrates the multi-service digital twin simulation pipeline:
        1. Patient Profile Assembly
        2. FHIR R4 Standardization
        3. Multi-Drug Interaction Check
        4. Knowledge Graph Subgraph Construction
        5. ML Personalized Drug Response Inference
        6. Composite Risk Index Synthesis
        """
        # STEP 1 & 2: Assemble digital twin patient state
        patient_code = req.patient_id or "TWIN-SIM-01"
        name = req.name
        age = req.age
        gender = req.gender
        condition = req.primary_condition
        observations = req.observations
        medications = req.medications

        # If patient_id matches an existing DB patient and request is otherwise default, enrich from DB
        if req.patient_id:
            existing = patient_service.get_patient_by_id_or_code(db, req.patient_id)
            if existing and not req.medications and not req.primary_condition:
                patient_code = existing.patient_code
                name = existing.name
                age = existing.age
                gender = existing.gender
                condition = existing.primary_condition
                if existing.observations:
                    observations = existing.observations
                if existing.medications:
                    medications = existing.medications

        # STEP 3: FHIR Conversion
        fhir_bundle = build_fhir_bundle(
            patient_code=patient_code,
            name=name,
            age=age,
            gender=gender,
            primary_condition=condition,
            observations=observations,
            medications=medications
        )

        # STEP 4: Drug Interaction Check
        drug_names = [m.drug_name for m in medications]
        interaction_result = interaction_service.check_drug_interactions(drug_names)

        # STEP 5: Knowledge Graph Enrichment
        kg_insights = kg_service.build_patient_twin_subgraph(
            patient_code=patient_code,
            name=name,
            condition=condition,
            observations=observations,
            medications=medications
        )

        # STEP 6: ML Drug Response Simulation
        # Determine target drug for simulation
        target_drug = req.target_drug
        if not target_drug and medications:
            target_drug = medications[0].drug_name
        elif not target_drug:
            target_drug = "Standard Agent"

        # Find dosage of target drug if present
        target_dosage = "Standard"
        for m in medications:
            if m.drug_name.lower() == target_drug.lower():
                target_dosage = m.dosage
                break

        pred_req = PredictionRequest(
            age=age,
            gender=gender,
            condition=condition,
            drug_name=target_drug,
            dosage=target_dosage,
            systolic_bp=observations.systolic_bp,
            diastolic_bp=observations.diastolic_bp,
            heart_rate=observations.heart_rate,
            blood_glucose=observations.blood_glucose,
            creatinine=observations.creatinine,
            alt_liver=observations.alt_liver
        )
        prediction_result = predict_drug_response(pred_req)

        # STEP 7: Calculate Overall Composite Risk Level
        overall_risk = self._compute_overall_risk(
            ml_risk=prediction_result.risk_level,
            interaction_severity=interaction_result.highest_severity,
            obs=observations
        )

        # STEP 8: Generate Executive Clinical Summary
        summary_text = self._build_executive_summary(
            name=name,
            patient_code=patient_code,
            condition=condition,
            target_drug=target_drug,
            prediction=prediction_result,
            interactions=interaction_result,
            overall_risk=overall_risk,
            obs=observations
        )

        # Digital Twin summary payload
        twin_summary = DigitalTwinSummary(
            patient_code=patient_code,
            name=name,
            age=age,
            gender=gender,
            condition=condition,
            vitals_summary={
                "blood_pressure": f"{int(observations.systolic_bp)}/{int(observations.diastolic_bp)} mmHg",
                "heart_rate": f"{int(observations.heart_rate)} bpm",
                "blood_glucose": f"{int(observations.blood_glucose)} mg/dL",
                "creatinine": f"{observations.creatinine} mg/dL",
                "alt_liver": f"{observations.alt_liver} U/L"
            },
            active_regimen_count=len(medications)
        )

        return DigitalTwinAnalyzeResponse(
            timestamp=datetime.utcnow(),
            digital_twin=twin_summary,
            fhir_resources=fhir_bundle,
            medication_interactions=interaction_result,
            response_prediction=prediction_result,
            knowledge_graph_insights=kg_insights,
            overall_simulation_risk=overall_risk,
            executive_summary=summary_text,
            disclaimer="PROTOTYPE ACADEMIC SIMULATION: Results are generated using synthetic machine learning models and educational knowledge graphs. Not validated for clinical diagnosis or prescription decisions."
        )

    def _compute_overall_risk(self, ml_risk: str, interaction_severity: str, obs: ObservationData) -> str:
        """Synthesizes risk factors from ML, drug interactions, and critical vitals."""
        # Critical severity drug interaction immediately escalates risk
        if interaction_severity == "High":
            return "High"
        
        # High ML risk or severe renal/cardiac impairment
        if ml_risk == "High" or obs.creatinine >= 2.0 or obs.systolic_bp >= 170:
            return "High"

        if interaction_severity == "Moderate" or ml_risk == "Moderate" or obs.creatinine > 1.3:
            return "Moderate"

        return "Low"

    def _build_executive_summary(
        self,
        name: str,
        patient_code: str,
        condition: str,
        target_drug: str,
        prediction,
        interactions,
        overall_risk: str,
        obs: ObservationData
    ) -> str:
        """Builds an understandable clinical synthesis for the academic dashboard."""
        conflict_desc = ""
        if interactions.interaction_detected:
            conflict_desc = f"WARNING: {interactions.total_conflicts} potential drug conflict(s) detected (Highest Severity: {interactions.highest_severity})."
        else:
            conflict_desc = "No adverse drug-drug interactions detected in the active regimen."

        return (
            f"Digital Twin simulation for {name} ({patient_code}), diagnosed with {condition}. "
            f"Target drug '{target_drug}' yielded a simulated response classification of '{prediction.predicted_response}' "
            f"(Confidence: {int(prediction.response_score * 100)}%). "
            f"{conflict_desc} "
            f"Overall Composite Simulation Risk is rated '{overall_risk}'."
        )

orchestrator_service = OrchestratorService()
