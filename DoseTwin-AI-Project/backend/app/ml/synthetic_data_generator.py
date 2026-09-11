import numpy as np
import pandas as pd

def generate_synthetic_training_data(n_samples: int = 3000, random_state: int = 42) -> pd.DataFrame:
    """
    Generates a realistic synthetic clinical dataset simulating patient physiological 
    features and their corresponding drug response category (Favorable, Moderate, Poor).
    
    DISCLAIMER: This dataset is purely synthetic and designed for educational/academic 
    system demonstration. It is not derived from real medical records.
    """
    np.random.seed(random_state)

    drugs = [
        "Warfarin", "Aspirin", "Ibuprofen", "Metformin", 
        "Simvastatin", "Clarithromycin", "Lisinopril", 
        "Spironolactone", "Atorvastatin", "Ciprofloxacin", 
        "Theophylline", "Levothyroxine", "Vitamin D3", "Amiodarone"
    ]
    conditions = [
        "Atrial Fibrillation", "Type 2 Diabetes Mellitus", "Hypertension", 
        "Hypercholesterolemia", "Heart Failure", "Bronchitis", 
        "Hypothyroidism", "General"
    ]
    genders = ["Male", "Female"]
    dosages = ["Low", "Standard", "High"]

    # 1. Demographics
    age = np.random.randint(18, 90, size=n_samples)
    gender = np.random.choice(genders, size=n_samples, p=[0.5, 0.5])
    condition = np.random.choice(conditions, size=n_samples)
    drug = np.random.choice(drugs, size=n_samples)
    dosage = np.random.choice(dosages, size=n_samples, p=[0.25, 0.55, 0.20])

    # 2. Vitals & Lab observations with realistic baseline correlations
    # Systolic BP: higher with age & hypertension
    sbp_base = 115 + (age * 0.25) + np.where(condition == "Hypertension", 25, 0)
    systolic_bp = np.clip(np.random.normal(sbp_base, 12), 85, 210)
    
    # Diastolic BP
    diastolic_bp = np.clip(systolic_bp * 0.65 + np.random.normal(0, 6), 50, 120)

    # Heart Rate
    hr_base = 72 + np.where(condition == "Atrial Fibrillation", 15, 0)
    heart_rate = np.clip(np.random.normal(hr_base, 10), 45, 160)

    # Blood Glucose
    bg_base = 95 + np.where(condition == "Type 2 Diabetes Mellitus", 65, 0)
    blood_glucose = np.clip(np.random.normal(bg_base, 25), 60, 380)

    # Serum Creatinine (renal function)
    creat_base = 0.9 + (age * 0.006) + np.where(condition == "Heart Failure", 0.4, 0)
    creatinine = np.clip(np.random.normal(creat_base, 0.25), 0.5, 4.5)

    # ALT Liver Enzyme
    alt_base = 22 + np.random.exponential(8, size=n_samples)
    alt_liver = np.clip(alt_base, 8, 250)

    # 3. Simulate response logic based on physiology & pharmacology
    # Score calculation (higher = more favorable, lower = poor/adverse)
    response_score = 75.0 - (age * 0.15)
    
    # Renal clearance penalties for drugs metabolized/excreted renally
    renal_sensitive_drugs = ["Metformin", "Lisinopril", "Spironolactone", "Ciprofloxacin"]
    is_renal_drug = np.isin(drug, renal_sensitive_drugs)
    response_score -= np.where(is_renal_drug & (creatinine > 1.4), (creatinine - 1.4) * 22, 0)

    # Hepatic clearance penalties
    hepatic_sensitive_drugs = ["Simvastatin", "Atorvastatin", "Warfarin", "Amiodarone"]
    is_hepatic_drug = np.isin(drug, hepatic_sensitive_drugs)
    response_score -= np.where(is_hepatic_drug & (alt_liver > 40), (alt_liver - 40) * 0.35, 0)

    # High dosage in elderly penalty
    response_score -= np.where((age > 65) & (dosage == "High"), 14, 0)

    # Severe hypertension penalty
    response_score -= np.where(systolic_bp > 160, 12, 0)

    # Severe hyperglycemia penalty
    response_score -= np.where((blood_glucose > 200) & (drug != "Metformin"), 10, 0)

    # Drug-specific positive efficacy synergy
    response_score += np.where((drug == "Metformin") & (condition == "Type 2 Diabetes Mellitus") & (creatinine < 1.3), 15, 0)
    response_score += np.where((drug == "Lisinopril") & (condition == "Hypertension"), 14, 0)
    response_score += np.where((drug == "Levothyroxine") & (condition == "Hypothyroidism"), 18, 0)
    response_score += np.where((drug == "Atorvastatin") & (condition == "Hypercholesterolemia"), 16, 0)

    # Add random biological variability
    response_score += np.random.normal(0, 8, size=n_samples)

    # Assign Response Category
    response_category = []
    for s in response_score:
        if s >= 68:
            response_category.append("Favorable")
        elif s >= 45:
            response_category.append("Moderate")
        else:
            response_category.append("Poor")

    df = pd.DataFrame({
        "age": age,
        "gender": gender,
        "condition": condition,
        "drug": drug,
        "dosage": dosage,
        "systolic_bp": np.round(systolic_bp, 1),
        "diastolic_bp": np.round(diastolic_bp, 1),
        "heart_rate": np.round(heart_rate, 1),
        "blood_glucose": np.round(blood_glucose, 1),
        "creatinine": np.round(creatinine, 2),
        "alt_liver": np.round(alt_liver, 1),
        "response_category": response_category
    })

    return df
