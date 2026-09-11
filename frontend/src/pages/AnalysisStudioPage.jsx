import React, { useState } from 'react';
import { PatientSelector } from '../components/PatientSelector';
import { ClinicalObservationsForm } from '../components/ClinicalObservationsForm';
import { MedicationBuilder } from '../components/MedicationBuilder';
import { InteractionRadar } from '../components/InteractionRadar';
import { MLPredictionCard } from '../components/MLPredictionCard';
import { KnowledgeGraphViewer } from '../components/KnowledgeGraphViewer';
import { FHIRResourceInspector } from '../components/FHIRResourceInspector';
import { DigitalTwinCard } from '../components/DigitalTwinCard';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import { apiService } from '../services/api';
import { Play, Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export const AnalysisStudioPage = ({
  patients,
  catalog,
  activeTwin,
  onUpdateActiveTwin
}) => {
  const [selectedCode, setSelectedCode] = useState(activeTwin?.patient_code || 'P001');
  const [patientData, setPatientData] = useState({
    patient_id: activeTwin?.patient_code || 'P001',
    name: activeTwin?.name || 'Eleanor Vance',
    age: activeTwin?.age || 68,
    gender: activeTwin?.gender || 'Female',
    primary_condition: activeTwin?.primary_condition || 'Atrial Fibrillation',
    observations: activeTwin?.observations || {
      systolic_bp: 138,
      diastolic_bp: 85,
      heart_rate: 78,
      blood_glucose: 105,
      creatinine: 1.4,
      alt_liver: 28
    },
    medications: activeTwin?.medications || [
      { drug_name: 'Warfarin', dosage: '5mg', frequency: 'Once daily', route: 'Oral' },
      { drug_name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', route: 'Oral' }
    ],
    target_drug: 'Warfarin'
  });

  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle Preset Patient Selection
  const handleSelectPatient = (p) => {
    setSelectedCode(p.patient_code);
    const target = p.medications[0]?.drug_name || 'Standard Agent';
    setPatientData({
      patient_id: p.patient_code,
      name: p.name,
      age: p.age,
      gender: p.gender,
      primary_condition: p.primary_condition,
      observations: p.observations || {
        systolic_bp: 120,
        diastolic_bp: 80,
        heart_rate: 72,
        blood_glucose: 100,
        creatinine: 1.0,
        alt_liver: 25
      },
      medications: p.medications || [],
      target_drug: target
    });
    setSimulationResult(null);
    setError(null);
  };

  // Handle Custom Twin Creation
  const handleSelectCustom = () => {
    setSelectedCode('CUSTOM');
    setPatientData({
      patient_id: 'TWIN-CUSTOM',
      name: 'Custom Digital Twin',
      age: 50,
      gender: 'Male',
      primary_condition: 'Hypertension',
      observations: {
        systolic_bp: 135,
        diastolic_bp: 85,
        heart_rate: 75,
        blood_glucose: 110,
        creatinine: 1.1,
        alt_liver: 28
      },
      medications: [
        { drug_name: 'Lisinopril', dosage: '20mg', frequency: 'Once daily', route: 'Oral' }
      ],
      target_drug: 'Lisinopril'
    });
    setSimulationResult(null);
    setError(null);
  };

  // Run End-to-End Simulation
  const handleRunSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        patient_id: patientData.patient_id,
        name: patientData.name,
        age: parseInt(patientData.age),
        gender: patientData.gender,
        primary_condition: patientData.primary_condition,
        observations: patientData.observations,
        medications: patientData.medications,
        target_drug: patientData.target_drug || patientData.medications[0]?.drug_name || 'Standard Agent'
      };

      // If it's a real patient (not custom), update their digital twin state in the DB first
      if (patientData.patient_id !== 'TWIN-CUSTOM') {
        try {
          await apiService.updatePatientObservations(patientData.patient_id, patientData.observations);
        } catch (e) {
          console.warn("Could not update patient state in DB:", e);
        }
      }

      const res = await apiService.analyzeDigitalTwin(payload);
      setSimulationResult(res.data);
    } catch (err) {
      console.error('Simulation error:', err);
      setError(err.response?.data?.detail || err.message || 'Simulation execution failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Studio Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
          Digital Twin <span style={{ color: '#00f2fe' }}>Simulation Studio</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
          Configure demographic parameters, physiological vital signs, and dynamic multi-drug regimens to execute personalized response simulations.
        </p>
      </div>

      <MedicalDisclaimer variant="small" />

      {/* Patient Cohort Selector */}
      <div style={{ marginTop: '1.25rem' }}>
        <PatientSelector
          patients={patients}
          selectedCode={selectedCode}
          onSelectPatient={handleSelectPatient}
          onSelectCustom={handleSelectCustom}
        />
      </div>

      {/* Two Column Workspace: Controls on Left, Simulation Results on Right */}
      <div className="grid-2" style={{ alignItems: 'start', gap: '1.75rem', marginTop: '1rem' }}>
        {/* Left Column: Digital Twin Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Patient Demographics Card */}
          <div className="glass-card">
            <h4 style={{ fontSize: '1.05rem', color: '#00f2fe', marginBottom: '1rem' }}>
              Digital Twin Demographics & Diagnosis
            </h4>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={patientData.name}
                  onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Patient Code / ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={patientData.patient_id}
                  onChange={(e) => setPatientData({ ...patientData, patient_id: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Age (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  value={patientData.age}
                  onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={patientData.gender}
                  onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Primary Medical Condition</label>
              <input
                type="text"
                className="form-input"
                value={patientData.primary_condition}
                onChange={(e) => setPatientData({ ...patientData, primary_condition: e.target.value })}
              />
            </div>
          </div>

          {/* Clinical Observations Card */}
          <div className="glass-card">
            <ClinicalObservationsForm
              observations={patientData.observations}
              onChange={(obs) => setPatientData({ ...patientData, observations: obs })}
            />
          </div>

          {/* Medication Regimen Card */}
          <div className="glass-card">
            <MedicationBuilder
              medications={patientData.medications}
              catalog={catalog}
              targetDrug={patientData.target_drug}
              onMedicationsChange={(meds) => setPatientData({ ...patientData, medications: meds })}
              onTargetDrugChange={(target) => setPatientData({ ...patientData, target_drug: target })}
            />
          </div>

          {/* Prominent Action Button */}
          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', padding: '1.1rem', fontSize: '1.1rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={22} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Simulating Digital Twin via SOA Services...</span>
              </>
            ) : (
              <>
                <Play size={22} fill="#050d1a" />
                <span>⚡ Run Digital Twin Simulation</span>
              </>
            )}
          </button>

          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid #f43f5e',
              borderRadius: '10px',
              padding: '1rem',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <AlertCircle size={20} color="#f43f5e" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Live Simulation Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!simulationResult && !loading && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Sparkles size={32} color="#00f2fe" />
              </div>
              <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                Simulation Engine Standby
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                Select a synthetic patient digital twin or customize the physiological vitals and medication regimen on the left, then click <strong>"Run Digital Twin Simulation"</strong>.
              </p>
              <button
                onClick={handleRunSimulation}
                className="btn btn-secondary"
              >
                <span>Run Demo Simulation (Eleanor Vance)</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Loader2 size={40} color="#00f2fe" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1.25rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                Executing Multi-Service Pipeline...
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                <span>• Assembling Patient Digital Twin state...</span>
                <span>• Generating HL7 FHIR R4 Bundle...</span>
                <span>• Evaluating order-independent drug conflict rules...</span>
                <span>• Querying Neo4j Knowledge Graph...</span>
                <span>• Executing TensorFlow Neural Network Inference...</span>
              </div>
            </div>
          )}

          {simulationResult && (
            <>
              {/* 1. Digital Twin Summary Card */}
              <DigitalTwinCard
                twin={simulationResult.digital_twin}
                overallRisk={simulationResult.overall_simulation_risk}
                summaryText={simulationResult.executive_summary}
              />

              {/* 2. Drug-Drug Interaction Radar */}
              <InteractionRadar
                interactions={simulationResult.medication_interactions}
              />

              {/* 3. ML Response Prediction Card */}
              <MLPredictionCard
                prediction={simulationResult.response_prediction}
              />

              {/* 4. Knowledge Graph Topology Viewer */}
              <KnowledgeGraphViewer
                graphData={simulationResult.knowledge_graph_insights?.graph}
              />

              {/* 5. HL7 FHIR Resource Inspector */}
              <FHIRResourceInspector
                fhirResources={simulationResult.fhir_resources}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
