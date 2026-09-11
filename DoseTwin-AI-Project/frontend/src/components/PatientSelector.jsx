import React from 'react';
import { User, Sparkles, CheckCircle2 } from 'lucide-react';

export const PatientSelector = ({ patients, selectedCode, onSelectPatient, onSelectCustom }) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <label className="form-label" style={{ margin: 0, fontSize: '0.9rem' }}>
          <span>Choose a Patient Digital Twin Profile:</span>
        </label>
        <button
          type="button"
          onClick={onSelectCustom}
          className={`btn btn-sm ${selectedCode === 'CUSTOM' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Sparkles size={14} />
          <span>+ Create Custom Twin</span>
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '0.75rem'
      }}>
        {patients.map((p) => {
          const isSelected = selectedCode === p.patient_code;
          return (
            <div
              key={p.patient_code}
              onClick={() => onSelectPatient(p)}
              style={{
                background: isSelected 
                  ? 'linear-gradient(145deg, rgba(0, 242, 254, 0.15) 0%, rgba(13, 21, 39, 0.9) 100%)' 
                  : 'rgba(13, 21, 39, 0.6)',
                border: isSelected 
                  ? '1px solid #00f2fe' 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className={`badge ${isSelected ? 'badge-cyan' : 'badge-purple'}`}>
                  {p.patient_code}
                </span>
                {isSelected && <CheckCircle2 size={16} color="#00f2fe" />}
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.98rem', color: '#ffffff', marginBottom: '0.2rem' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                {p.age} yrs • {p.gender}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.primary_condition}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
