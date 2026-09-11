import React from 'react';
import { Heart, Activity, Droplets, FlaskRound as Flask, Zap } from 'lucide-react';

export const ClinicalObservationsForm = ({ observations, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...observations,
      [field]: parseFloat(value) || 0
    });
  };

  const getCreatinineStatus = (val) => {
    if (val > 1.4) return { label: 'High (Impaired Renal Clearance)', badge: 'badge-rose' };
    if (val > 1.2) return { label: 'Borderline Elevated', badge: 'badge-amber' };
    return { label: 'Normal (Adequate Clearance)', badge: 'badge-emerald' };
  };

  const getBPStatus = (sys, dia) => {
    if (sys >= 140 || dia >= 90) return { label: 'Stage 2 Hypertension', badge: 'badge-rose' };
    if (sys >= 130 || dia >= 80) return { label: 'Stage 1 Hypertension', badge: 'badge-amber' };
    if (sys >= 120) return { label: 'Elevated BP', badge: 'badge-amber' };
    return { label: 'Normal Blood Pressure', badge: 'badge-emerald' };
  };

  const getGlucoseStatus = (val) => {
    if (val > 180) return { label: 'Hyperglycemia (High)', badge: 'badge-rose' };
    if (val > 125) return { label: 'Elevated (Diabetic Range)', badge: 'badge-amber' };
    return { label: 'Normal Range', badge: 'badge-emerald' };
  };

  const getALTStatus = (val) => {
    if (val > 45) return { label: 'Elevated (Hepatic Load)', badge: 'badge-rose' };
    if (val > 35) return { label: 'Borderline Hepatic Stress', badge: 'badge-amber' };
    return { label: 'Normal Hepatic Function', badge: 'badge-emerald' };
  };

  const creatStatus = getCreatinineStatus(observations.creatinine);
  const bpStatus = getBPStatus(observations.systolic_bp, observations.diastolic_bp);
  const glucStatus = getGlucoseStatus(observations.blood_glucose);
  const altStatus = getALTStatus(observations.alt_liver);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h4 style={{ fontSize: '1.05rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
        <Activity size={18} />
        <span>Clinical & Laboratory Observations</span>
      </h4>

      {/* Blood Pressure */}
      <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: '600' }}>
            Blood Pressure: {observations.systolic_bp} / {observations.diastolic_bp} mmHg
          </span>
          <span className={`badge ${bpStatus.badge}`}>
            {bpStatus.label}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>
              Systolic (mmHg): {observations.systolic_bp}
            </label>
            <input 
              type="range" 
              min="80" 
              max="200" 
              step="1"
              value={observations.systolic_bp}
              onChange={(e) => handleChange('systolic_bp', e.target.value)}
              style={{ width: '100%', accentColor: '#00f2fe' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>
              Diastolic (mmHg): {observations.diastolic_bp}
            </label>
            <input 
              type="range" 
              min="50" 
              max="120" 
              step="1"
              value={observations.diastolic_bp}
              onChange={(e) => handleChange('diastolic_bp', e.target.value)}
              style={{ width: '100%', accentColor: '#00f2fe' }}
            />
          </div>
        </div>
      </div>

      {/* Heart Rate & Blood Glucose */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Heart Rate */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: '600' }}>
              Heart Rate: {observations.heart_rate} bpm
            </span>
            <Heart size={16} color="#f43f5e" />
          </div>
          <input 
            type="range" 
            min="40" 
            max="160" 
            step="1"
            value={observations.heart_rate}
            onChange={(e) => handleChange('heart_rate', e.target.value)}
            style={{ width: '100%', accentColor: '#f43f5e' }}
          />
        </div>

        {/* Blood Glucose */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: '600' }}>
              Glucose: {observations.blood_glucose} mg/dL
            </span>
            <span className={`badge ${glucStatus.badge}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
              {glucStatus.label}
            </span>
          </div>
          <input 
            type="range" 
            min="60" 
            max="300" 
            step="1"
            value={observations.blood_glucose}
            onChange={(e) => handleChange('blood_glucose', e.target.value)}
            style={{ width: '100%', accentColor: '#38bdf8' }}
          />
        </div>
      </div>

      {/* Creatinine & ALT Liver */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Serum Creatinine */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: '600' }}>
              Creatinine: {observations.creatinine} mg/dL
            </span>
            <span className={`badge ${creatStatus.badge}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
              {creatStatus.label}
            </span>
          </div>
          <input 
            type="range" 
            min="0.4" 
            max="3.5" 
            step="0.1"
            value={observations.creatinine}
            onChange={(e) => handleChange('creatinine', e.target.value)}
            style={{ width: '100%', accentColor: '#a855f7' }}
          />
        </div>

        {/* ALT Liver Enzyme */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: '600' }}>
              ALT (Liver): {observations.alt_liver} U/L
            </span>
            <span className={`badge ${altStatus.badge}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
              {altStatus.label}
            </span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="120" 
            step="1"
            value={observations.alt_liver}
            onChange={(e) => handleChange('alt_liver', e.target.value)}
            style={{ width: '100%', accentColor: '#f59e0b' }}
          />
        </div>
      </div>
    </div>
  );
};
