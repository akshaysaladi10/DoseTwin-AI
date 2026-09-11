-- DoseTwin AI: PostgreSQL Initial Database Schema & Synthetic Seed Data

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    patient_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL,
    primary_condition VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS observations (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    systolic_bp FLOAT DEFAULT 120.0,
    diastolic_bp FLOAT DEFAULT 80.0,
    heart_rate FLOAT DEFAULT 72.0,
    blood_glucose FLOAT DEFAULT 100.0,
    creatinine FLOAT DEFAULT 1.0,
    alt_liver FLOAT DEFAULT 25.0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    drug_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    route VARCHAR(50) DEFAULT 'Oral',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interaction_rules (
    id SERIAL PRIMARY KEY,
    drug_a VARCHAR(100) NOT NULL,
    drug_b VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    mechanism TEXT,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL
);

-- 2. Insert Synthetic Patient Cohort
INSERT INTO patients (patient_code, name, age, gender, primary_condition) VALUES
('P001', 'Eleanor Vance', 68, 'Female', 'Atrial Fibrillation'),
('P002', 'Arthur Pendelton', 54, 'Male', 'Type 2 Diabetes Mellitus'),
('P003', 'Clara Oswald', 62, 'Female', 'Hypercholesterolemia & Acute Bronchitis'),
('P004', 'Marcus Brody', 71, 'Male', 'Congestive Heart Failure'),
('P005', 'Sophia Zhang', 42, 'Female', 'Hypothyroidism')
ON CONFLICT (patient_code) DO NOTHING;

-- 3. Insert Baseline Clinical Observations
INSERT INTO observations (patient_id, systolic_bp, diastolic_bp, heart_rate, blood_glucose, creatinine, alt_liver) VALUES
(1, 138, 85, 78, 105, 1.4, 28),
(2, 126, 80, 72, 162, 0.9, 22),
(3, 130, 82, 84, 98, 1.1, 45),
(4, 142, 88, 66, 110, 1.8, 31),
(5, 118, 76, 68, 92, 0.8, 18);

-- 4. Insert Active Medications
INSERT INTO medications (patient_id, drug_name, dosage, frequency, route) VALUES
(1, 'Warfarin', '5mg', 'Once daily', 'Oral'),
(1, 'Aspirin', '81mg', 'Once daily', 'Oral'),
(2, 'Metformin', '1000mg', 'Twice daily', 'Oral'),
(2, 'Atorvastatin', '20mg', 'Once daily at bedtime', 'Oral'),
(3, 'Simvastatin', '40mg', 'Once daily at bedtime', 'Oral'),
(3, 'Clarithromycin', '500mg', 'Twice daily', 'Oral'),
(4, 'Lisinopril', '20mg', 'Once daily', 'Oral'),
(4, 'Spironolactone', '25mg', 'Once daily', 'Oral'),
(5, 'Levothyroxine', '75mcg', 'Once daily in morning', 'Oral'),
(5, 'Vitamin D3', '2000IU', 'Once daily', 'Oral');

-- 5. Insert Synthetic Interaction Rules
INSERT INTO interaction_rules (drug_a, drug_b, severity, mechanism, description, recommendation) VALUES
('Warfarin', 'Aspirin', 'High', 'Pharmacodynamic synergism between anticoagulant and antiplatelet.', 'Marked increase in the risk of major gastrointestinal hemorrhage and intracranial bleeding.', 'Avoid concurrent use unless strictly indicated with vigilant monitoring and GI protection.'),
('Warfarin', 'Ibuprofen', 'High', 'NSAID gastrointestinal mucosal toxicity and platelet inhibition.', 'Substantially multiplies Warfarin-induced bleeding complications.', 'Avoid combination; substitute with acetaminophen for pain under supervision.'),
('Simvastatin', 'Clarithromycin', 'High', 'CYP3A4 inhibition preventing statin clearance.', 'Elevates serum statin concentration up to 10-fold, triggering rhabdomyolysis.', 'Suspend Simvastatin during antibiotic course or switch to non-CYP3A4 statin.'),
('Lisinopril', 'Spironolactone', 'Moderate', 'Additive inhibition of aldosterone and potassium excretion.', 'Significantly elevated risk of hyperkalemia in reduced renal clearance.', 'Monitor serum potassium and renal function within 1-2 weeks.'),
('Ciprofloxacin', 'Theophylline', 'High', 'CYP1A2 inhibition decreasing theophylline elimination.', 'Elevates theophylline to toxic levels causing arrhythmias and seizures.', 'Reduce theophylline dose and perform therapeutic drug monitoring.'),
('Warfarin', 'Amiodarone', 'High', 'Inhibition of CYP2C9 and CYP3A4 clearance of warfarin.', 'Marked prolongation of prothrombin time / INR elevation.', 'Empirically reduce warfarin dose by 33-50% and monitor weekly.'),
('Metformin', 'Ciprofloxacin', 'Low', 'Potential glycemic fluctuations via transport modulation.', 'Fluoroquinolones may cause dysglycemia in diabetic patients.', 'Increase frequency of blood glucose monitoring during antibiotic therapy.');
