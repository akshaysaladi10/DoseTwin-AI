import React from 'react';
import { User, Activity, ShieldCheck, ShieldAlert, Heart, Calendar } from 'lucide-react';

export const DigitalTwinCard = ({ twin, overallRisk, summaryText }) => {
  if (!twin) return null;

  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'High':
      case 'Critical':
        return { badge: 'badge-rose', color: '#f43f5e', label: 'High Risk Alert' };
      case 'Moderate':
        return { badge: 'badge-amber', color: '#f59e0b', label: 'Moderate Risk Tier' };
      case 'Low':
      default:
        return { badge: 'badge-emerald', color: '#10b981', label: 'Low Risk Tier' };
    }
  };

  const riskStyle = getRiskStyle(overallRisk);

  return (
    <div className="glass-card" style={{ borderTop: `2px solid ${riskStyle.color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={22} color="#050d1a" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                {twin.name}
              </h3>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                {twin.patient_code}
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {twin.age} years old • {twin.gender} • Primary: <strong style={{ color: '#38bdf8' }}>{twin.condition}</strong>
            </span>
          </div>
        </div>

        <span className={`badge ${riskStyle.badge}`} style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}>
          Overall Simulation: {overallRisk} Risk
        </span>
      </div>

      {/* Vitals Summary Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        {Object.entries(twin.vitals_summary || {}).map(([key, val]) => (
          <div
            key={key}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '0.75rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'capitalize', marginBottom: '0.2rem' }}>
              {key.replace('_', ' ')}
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      {/* Executive Summary Text */}
      {summaryText && (
        <div style={{
          background: 'rgba(0, 242, 254, 0.05)',
          borderLeft: '3px solid #00f2fe',
          padding: '0.85rem 1rem',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#e2e8f0',
          lineHeight: '1.5'
        }}>
          <strong>Executive Synthesis: </strong>
          {summaryText}
        </div>
      )}
    </div>
  );
};
