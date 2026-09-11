import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export const MedicalDisclaimer = ({ variant = 'banner' }) => {
  if (variant === 'small') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.78rem',
        color: '#f59e0b',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        padding: '0.5rem 0.85rem',
        borderRadius: '8px'
      }}>
        <AlertTriangle size={14} flexShrink={0} />
        <span>Academic Prototype: Uses synthetic data only. Not for clinical diagnostic or treatment decisions.</span>
      </div>
    );
  }

  return (
    <div className="academic-disclaimer">
      <AlertTriangle size={22} color="#f59e0b" style={{ flexShrink: 0 }} />
      <div>
        <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.15rem' }}>
          Academic Research & Prototype Notice
        </strong>
        <span style={{ color: '#fde68a', fontSize: '0.84rem', lineHeight: '1.4' }}>
          DoseTwin AI is an educational demonstration of Service-Oriented Architecture (SOA) combining Digital Twins, HL7 FHIR concepts, and Machine Learning. All patient records, interaction rules, and response predictions are based on synthetic data and must NOT be used for real medical or clinical decision-making.
        </span>
      </div>
    </div>
  );
};
