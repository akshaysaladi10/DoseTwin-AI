import React from 'react';
import { Cpu, CheckCircle, AlertTriangle, XCircle, TrendingUp, Info } from 'lucide-react';

export const MLPredictionCard = ({ prediction }) => {
  if (!prediction) return null;

  const responseCat = prediction.predicted_response || 'Moderate';
  const scorePercent = Math.round((prediction.response_score || 0.75) * 100);

  const getResponseStyle = (cat) => {
    switch (cat) {
      case 'Favorable':
        return {
          badge: 'badge-emerald',
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.15)',
          border: '#10b981',
          icon: CheckCircle,
          label: 'Favorable Drug Response'
        };
      case 'Moderate':
        return {
          badge: 'badge-amber',
          color: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.15)',
          border: '#f59e0b',
          icon: AlertTriangle,
          label: 'Moderate / Guarded Response'
        };
      case 'Poor':
      default:
        return {
          badge: 'badge-rose',
          color: '#f43f5e',
          bg: 'rgba(244, 63, 94, 0.15)',
          border: '#f43f5e',
          icon: XCircle,
          label: 'Poor Response / High Risk'
        };
    }
  };

  const style = getResponseStyle(responseCat);
  const Icon = style.icon;

  return (
    <div className="glass-card" style={{ borderTop: `2px solid ${style.color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'rgba(0, 242, 254, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={20} color="#00f2fe" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
              Personalized Drug Response Simulation
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Machine Learning Inference ({prediction.model_version})
            </span>
          </div>
        </div>

        <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
          Target: {prediction.target_drug}
        </span>
      </div>

      {/* Main Score & Response Category Display */}
      <div style={{
        background: 'rgba(13, 21, 39, 0.8)',
        border: `1px solid ${style.border}`,
        borderRadius: '14px',
        padding: '1.25rem',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '1.5rem',
        alignItems: 'center',
        marginBottom: '1.25rem'
      }}>
        {/* Circular Percentage Badge */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          border: `4px solid ${style.color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: style.bg,
          boxShadow: `0 0 20px ${style.bg}`
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>
            {scorePercent}%
          </span>
          <span style={{ fontSize: '0.65rem', color: '#cbd5e1', textTransform: 'uppercase' }}>
            Confidence
          </span>
        </div>

        {/* Classification Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Icon size={20} color={style.color} />
            <h4 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
              {responseCat} Response
            </h4>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
            Simulated digital twin pharmacokinetic and pharmacodynamic response profile for <strong>{prediction.target_drug}</strong> indicates a <strong>{prediction.risk_level}</strong> adverse event likelihood under current physiological vitals.
          </p>
        </div>
      </div>

      {/* Key Contributing Factors */}
      <div>
        <h5 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={16} />
          <span>Key Physiological Contributing Factors</span>
        </h5>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {prediction.contributing_factors?.map((f, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '0.75rem 0.9rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.15rem' }}>
                  {f.factor}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {f.detail}
                </div>
              </div>
              <span className={`badge ${f.impact === 'Positive' ? 'badge-emerald' : f.impact === 'Negative' ? 'badge-rose' : 'badge-cyan'}`} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', flexShrink: 0 }}>
                {f.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
