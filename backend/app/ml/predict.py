import os
from pathlib import Path
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np
import joblib
import tensorflow as tf

from app.config import settings
from app.schemas.dto import PredictionRequest, PredictionResult, ContributingFactor

_loaded_model = None
_loaded_preprocessor = None
_classes = ["Poor", "Moderate", "Favorable"]

def get_or_load_model():
    """Loads cached TensorFlow model and preprocessor or triggers initial training if not present."""
    global _loaded_model, _loaded_preprocessor
    if _loaded_model is not None and _loaded_preprocessor is not None:
        return _loaded_model, _loaded_preprocessor

    model_path = Path(settings.MODEL_PATH).parent / "drug_response_tf.keras"
    preprocessor_path = Path(settings.MODEL_PATH).parent / "tf_preprocessor.joblib"

    if not model_path.exists() or not preprocessor_path.exists():
        from app.ml.train_model import train_drug_response_model
        _loaded_model, _loaded_preprocessor = train_drug_response_model()
    else:
        try:
            _loaded_model = tf.keras.models.load_model(model_path)
            _loaded_preprocessor = joblib.load(preprocessor_path)
        except Exception as e:
            print(f"Error loading model from {model_path}: {e}. Retraining...")
            from app.ml.train_model import train_drug_response_model
            _loaded_model, _loaded_preprocessor = train_drug_response_model()

    return _loaded_model, _loaded_preprocessor

def normalize_dosage_category(dosage_str: str) -> str:
    """Normalizes dosage text (e.g. '1000mg', '5mg', 'Low') into standard category."""
    d = str(dosage_str).lower().strip()
    if any(k in d for k in ["high", "max", "1000mg", "500mg", "80mg", "40mg"]):
        return "High"
    if any(k in d for k in ["low", "mini", "81mg", "25mcg", "2.5mg"]):
        return "Low"
    return "Standard"

def extract_contributing_factors(req: PredictionRequest, predicted_class: str) -> List[ContributingFactor]:
    """Analyzes physiological biomarkers to provide educational explanations of prediction."""
    factors = []

    # Renal Analysis
    if req.creatinine > 1.3:
        factors.append(ContributingFactor(
            factor="Renal Clearance (Elevated Creatinine)",
            impact="Negative",
            detail=f"Serum creatinine of {req.creatinine} mg/dL indicates decreased glomerular filtration, potentially impairing excretion of {req.drug_name}."
        ))
    else:
        factors.append(ContributingFactor(
            factor="Renal Clearance (Normal Creatinine)",
            impact="Positive",
            detail=f"Normal serum creatinine ({req.creatinine} mg/dL) supports adequate renal drug elimination."
        ))

    # Hepatic Analysis
    if req.alt_liver > 40:
        factors.append(ContributingFactor(
            factor="Hepatic Function (Elevated ALT)",
            impact="Negative",
            detail=f"Elevated ALT ({req.alt_liver} U/L) suggests hepatic enzyme stress, which may slow cytochrome P450 drug metabolism."
        ))

    # Cardiovascular & Blood Pressure
    if req.systolic_bp >= 140:
        factors.append(ContributingFactor(
            factor="Cardiovascular Load (Hypertension)",
            impact="Negative",
            detail=f"Elevated systolic BP ({req.systolic_bp} mmHg) adds vascular resistance and physiological stress."
        ))
    elif req.systolic_bp <= 125:
        factors.append(ContributingFactor(
            factor="Cardiovascular Stability",
            impact="Positive",
            detail=f"Controlled blood pressure ({req.systolic_bp}/{req.diastolic_bp} mmHg) provides optimal baseline hemodynamics."
        ))

    # Glycemic Status
    if req.blood_glucose > 140:
        factors.append(ContributingFactor(
            factor="Glycemic Regulation",
            impact="Negative" if req.drug_name != "Metformin" else "Positive",
            detail=f"Blood glucose level at {req.blood_glucose} mg/dL."
        ))

    # Age Factor
    if req.age >= 65:
        factors.append(ContributingFactor(
            factor="Geriatric Pharmacokinetics",
            impact="Negative",
            detail=f"Age ({req.age} yrs) increases susceptibility to altered distribution volume and clearance kinetics."
        ))

    return factors

def predict_drug_response(req: PredictionRequest) -> PredictionResult:
    """Executes drug response inference pipeline for a given patient digital twin and drug."""
    model, preprocessor = get_or_load_model()
    
    dosage_cat = normalize_dosage_category(req.dosage)

    input_df = pd.DataFrame([{
        "age": req.age,
        "gender": req.gender,
        "condition": req.condition,
        "drug": req.drug_name,
        "dosage": dosage_cat,
        "systolic_bp": req.systolic_bp,
        "diastolic_bp": req.diastolic_bp,
        "heart_rate": req.heart_rate,
        "blood_glucose": req.blood_glucose,
        "creatinine": req.creatinine,
        "alt_liver": req.alt_liver
    }])

    # Preprocess input
    X_processed = preprocessor.transform(input_df)

    # Predict using TensorFlow model
    probs = model.predict(X_processed, verbose=0)[0]
    predicted_idx = np.argmax(probs)
    predicted_category = _classes[predicted_idx]
    pred_score = float(probs[predicted_idx])

    # Determine risk level
    if predicted_category == "Favorable":
        risk_level = "Low"
    elif predicted_category == "Moderate":
        risk_level = "Moderate"
    else:
        risk_level = "High"

    factors = extract_contributing_factors(req, predicted_category)

    return PredictionResult(
        target_drug=req.drug_name,
        predicted_response=predicted_category,
        response_score=round(pred_score, 2),
        risk_level=risk_level,
        contributing_factors=factors,
        model_version="TensorFlow-NN-v1.0 (Synthetic Trained)",
        disclaimer="Simulated educational prototype prediction. Requires clinical validation and is not medical advice."
    )
