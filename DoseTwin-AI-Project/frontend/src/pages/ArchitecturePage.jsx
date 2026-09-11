import React from 'react';
import { Layers, Server, Cpu, Network, FileJson, Database, GitMerge, CheckCircle } from 'lucide-react';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';

export const ArchitecturePage = () => {
  const soaPrinciples = [
    {
      title: 'Service Separation & Loose Coupling',
      desc: 'Patient management, medication tracking, interaction checking, and ML drug response prediction operate as distinct autonomous domains behind defined REST contracts.',
      icon: Layers,
      color: '#00f2fe'
    },
    {
      title: 'Healthcare Interoperability (HL7 FHIR)',
      desc: 'Standardizes internal digital twin structures into educational HL7 FHIR R4 resources (Patient, Condition, MedicationRequest, Observation) for seamless clinical exchange.',
      icon: FileJson,
      color: '#10b981'
    },
    {
      title: 'Graph-Driven Relationship Analysis',
      desc: 'NetworkX knowledge graph models complex multi-entity relationships between patients, clinical diagnoses, active therapies, and bidirectional interaction edges.',
      icon: Network,
      color: '#a855f7'
    },
    {
      title: 'Machine Learning Pharmacokinetics',
      desc: 'Scikit-Learn Random Forest model simulates patient-specific physiological factors (creatinine, blood pressure, hepatic enzyme) to generate response probability and risk tiers.',
      icon: Cpu,
      color: '#f59e0b'
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
          SOA Architecture & <span style={{ color: '#00f2fe' }}>System Design</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
          Service-Oriented Architecture (SOA) integrating Digital Twin Modeling, Knowledge Graphs, HL7 FHIR, and Machine Learning.
        </p>
      </div>

      <MedicalDisclaimer />

      {/* Architecture Flow Diagram Box */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitMerge size={20} color="#00f2fe" />
          <span>System Request Flow & Service Orchestration</span>
        </h3>

        <div style={{
          background: '#040711',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem',
          color: '#38bdf8',
          lineHeight: '1.6',
          overflowX: 'auto'
        }}>
{`[ React + Vite Dashboard UI ]
         │
         │  REST API (Axios JSON)
         ▼
[ FastAPI API Gateway / Core Orchestrator (Port 8000) ]
         │
         ├───────────────────┬───────────────────┬───────────────────┐
         │                   │                   │                   │
         ▼                   ▼                   ▼                   ▼
 [ Patient Service ] [ Medication Svc ]  [ Interaction Svc ] [ FHIR Converter ]
         │                   │                   │                   │
         │ (Demographics &   │ (Prescriptions &  │ (Order-Indep      │ (HL7 FHIR R4
         │  Vitals Snapshot) │  Drug Catalog)    │  Rule Evaluator)  │  Bundle Assembly)
         │                   │                   │                   │
         └─────────┬─────────┴─────────┬─────────┴───────────────────┘
                   │                   │
                   ▼                   ▼
      [ Knowledge Graph Service ] [ ML Prediction Service ]
           (NetworkX Graph)         (Scikit-Learn Random Forest)
                   │                   │
                   └─────────┬─────────┘
                             │
                             ▼
               [ PostgreSQL / SQLite DB ]
                    (SQLAlchemy Models)`}
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {soaPrinciples.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: `${p.color}20`,
                  border: `1px solid ${p.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} color={p.color} />
                </div>
                <h4 style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>
                  {p.title}
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Academic Problem Statement & Significance */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.75rem' }}>
          Academic Significance & Research Contribution
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
          Conventional medication analysis tools typically evaluate drug interactions in isolation without taking into account the full biological state of the patient. <strong>DoseTwin AI</strong> demonstrates how combining the digital twin paradigm with FHIR data standards, knowledge graphs, and predictive machine learning models in a Service-Oriented Architecture (SOA) creates a holistic, patient-centric simulation platform.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span className="badge badge-cyan">Service-Oriented Architecture</span>
          <span className="badge badge-emerald">HL7 FHIR R4 Compatible</span>
          <span className="badge badge-purple">NetworkX Graph Theory</span>
          <span className="badge badge-amber">Random Forest Machine Learning</span>
          <span className="badge badge-rose">Synthetic Pharmacology</span>
        </div>
      </div>
    </div>
  );
};
