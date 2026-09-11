import React from 'react';
import { AlertOctagon, CheckCircle, ShieldAlert, GitFork, ArrowRight } from 'lucide-react';

export const InteractionRadar = ({ interactions }) => {
  if (!interactions) return null;

  const hasConflicts = interactions.interaction_detected;
  const highestSev = interactions.highest_severity || 'None';

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'High':
        return { badge: 'badge-rose', label: 'High Conflict Risk' };
      case 'Moderate':
        return { badge: 'badge-amber', label: 'Moderate Interaction' };
      case 'Low':
        return { badge: 'badge-cyan', label: 'Low / Monitor' };
      default:
        return { badge: 'badge-emerald', label: 'Safe / No Conflict' };
    }
  };

  const status = getSeverityBadge(highestSev);

  return (
    <div className={`glass-card ${hasConflicts ? 'pulse-card' : ''}`} style={{
      borderTop: hasConflicts ? '2px solid #f43f5e' : '2px solid #10b981'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: hasConflicts ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {hasConflicts ? (
              <AlertOctagon size={20} color="#f43f5e" />
            ) : (
              <CheckCircle size={20} color="#10b981" />
            )}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
              Drug-Drug Interaction Analysis
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Order-independent local knowledge base evaluation
            </span>
          </div>
        </div>

        <span className={`badge ${status.badge}`} style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
          {status.label}
        </span>
      </div>

      {!hasConflicts ? (
        <div style={{
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#6ee7b7'
        }}>
          <CheckCircle size={22} color="#10b981" flexShrink={0} />
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
              No Medication Conflicts Detected
            </div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>
              Current multi-drug regimen does not trigger any contraindicated pharmacological pairs in the synthetic rules engine.
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#fca5a5', fontWeight: '600' }}>
            ⚠️ {interactions.total_conflicts} Potentially Adverse Interaction Pair(s) Detected:
          </div>

          {interactions.conflicts.map((c, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '12px',
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}
            >
              {/* Conflict Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#ffffff' }}>
                  <span style={{ background: '#1e1b4b', border: '1px solid #6366f1', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.88rem' }}>
                    {c.drug_pair[0]}
                  </span>
                  <span style={{ color: '#f43f5e', fontWeight: '800' }}>+</span>
                  <span style={{ background: '#1e1b4b', border: '1px solid #6366f1', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.88rem' }}>
                    {c.drug_pair[1]}
                  </span>
                </div>
                <span className={`badge ${getSeverityBadge(c.severity).badge}`}>
                  Severity: {c.severity}
                </span>
              </div>

              {/* Mechanism */}
              {c.mechanism && (
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <strong style={{ color: '#38bdf8' }}>Pharmacological Mechanism: </strong>
                  {c.mechanism}
                </div>
              )}

              {/* Description */}
              <div style={{ fontSize: '0.82rem', color: '#fecdd3', lineHeight: '1.4' }}>
                <strong style={{ color: '#f43f5e' }}>Clinical Risk: </strong>
                {c.description}
              </div>

              {/* Recommendation */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#fde68a',
                borderLeft: '3px solid #f59e0b',
                marginTop: '0.25rem'
              }}>
                <strong>Clinical Recommendation: </strong> {c.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
