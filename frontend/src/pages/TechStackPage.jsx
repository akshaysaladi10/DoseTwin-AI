import React from 'react';
import { Layers, Database, Code, Cpu } from 'lucide-react';

export const TechStackPage = () => {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
          DoseTwin AI <span style={{ color: '#00f2fe' }}>Technology Stack</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '700px' }}>
          This page outlines the foundational technologies enabling the DoseTwin Digital Twin framework. The final review implementation upgrades from mock prototyping libraries to robust, industry-standard data science and database engines.
        </p>
      </div>

      <div className="grid-2" style={{ gap: '1.5rem' }}>
        
        {/* ML Engine */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(0, 242, 254, 0.1)', borderRadius: '8px' }}>
              <Cpu size={24} color="#00f2fe" />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>TensorFlow Neural Networks</h3>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
            The core drug-response prediction engine has been migrated from Scikit-Learn to a fully connected Keras sequential model running on TensorFlow. This provides scalable, probabilistic non-linear physiological risk modeling.
          </p>
        </div>

        {/* Knowledge Graph */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(0, 242, 254, 0.1)', borderRadius: '8px' }}>
              <Database size={24} color="#00f2fe" />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>Neo4j Graph Database</h3>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
            To securely and persistently traverse patient-disease-drug topological relationships, the in-memory NetworkX library was replaced with a dedicated Neo4j graph database. Cypher queries dynamically assemble the Digital Twin subgraph context.
          </p>
        </div>

        {/* Backend */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(0, 242, 254, 0.1)', borderRadius: '8px' }}>
              <Code size={24} color="#00f2fe" />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>FastAPI & PostgreSQL</h3>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
            The orchestrator API is built on Python's async FastAPI framework for ultra-fast REST endpoints. Long-term digital twin state and synthetic vitals are persisted relationally in a PostgreSQL database via SQLAlchemy ORM.
          </p>
        </div>

        {/* Interoperability */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(0, 242, 254, 0.1)', borderRadius: '8px' }}>
              <Layers size={24} color="#00f2fe" />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>HL7 FHIR Interoperability</h3>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Ensuring future-proof medical record portability, DoseTwin AI includes a robust RESTful API (`/api/v1/fhir/Patient` and `/api/v1/fhir/Bundle`) that dynamically formats patient states into compliant FHIR R4 JSON resources.
          </p>
        </div>

      </div>
    </div>
  );
};
