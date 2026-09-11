import React from 'react';
import { 
  MetricCards 
} from '../components/MetricCards';
import { 
  MedicalDisclaimer 
} from '../components/MedicalDisclaimer';
import { 
  Users, 
  FlaskConical, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Server
} from 'lucide-react';

export const DashboardPage = ({ 
  patients, 
  catalog, 
  rules, 
  onSimulatePatient, 
  onNavigateToStudio 
}) => {
  return (
    <div>
      {/* Top Welcome Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
              DoseTwin <span style={{ color: '#00f2fe' }}>AI Dashboard</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Service-Oriented Digital Twin Framework for Personalized Drug Response Simulation & Conflict Prevention
            </p>
          </div>
          <button
            onClick={onNavigateToStudio}
            className="btn btn-primary btn-lg"
          >
            <FlaskConical size={20} />
            <span>Open Simulation Studio</span>
          </button>
        </div>
      </div>

      {/* Academic Disclaimer */}
      <MedicalDisclaimer />

      {/* Metric Cards */}
      <MetricCards 
        patientCount={patients.length} 
        medicationCount={catalog.length} 
        interactionCount={rules.length} 
        simulationsRun={24}
      />

      {/* Main Grid: Cohort Directory & Microservice Status */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Synthetic Patient Cohorts */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Users size={20} color="#00f2fe" />
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                Patient Digital Twin Cohort
              </h3>
            </div>
            <span className="badge badge-cyan">
              {patients.length} Profiles Loaded
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {patients.map((p) => {
              const hasHighConflictMed = p.patient_code === 'P001' || p.patient_code === 'P003' || p.patient_code === 'P004';
              return (
                <div
                  key={p.patient_code}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                        {p.patient_code}
                      </span>
                      <strong style={{ color: '#ffffff', fontSize: '0.98rem' }}>
                        {p.name}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {p.age} yrs • {p.gender} • Condition: <span style={{ color: '#38bdf8' }}>{p.primary_condition}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                      Active: {p.medications.map(m => m.drug_name).join(', ') || 'None'}
                    </div>
                  </div>

                  <button
                    onClick={() => onSimulatePatient(p)}
                    className="btn btn-secondary btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <span>Simulate Twin</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Microservice Architecture Health */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Server size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                SOA Architecture Service Status
              </h3>
            </div>
            <span className="badge badge-emerald">
              All Services Operational
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Patient Twin Service', desc: 'Demographics & physiological state assembly', port: '8000', status: 'Online' },
              { name: 'Medication Service', desc: 'Prescription registry & pharmacology catalog', port: '8000', status: 'Online' },
              { name: 'Interaction Service', desc: 'Bidirectional conflict evaluator & rule engine', port: '8000', status: 'Online' },
              { name: 'Knowledge Graph Service', desc: 'NetworkX graph relationship mining', port: '8000', status: 'Online' },
              { name: 'FHIR R4 Converter', desc: 'HL7 JSON interoperability resource builder', port: '8000', status: 'Online' },
              { name: 'ML Drug Response Service', desc: 'Random Forest model simulation pipeline', port: '8000', status: 'Online' },
            ].map((svc, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  padding: '0.8rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff' }}>
                    {svc.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {svc.desc}
                  </div>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                  {svc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
