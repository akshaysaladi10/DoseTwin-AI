import React, { useState } from 'react';
import { AlertOctagon, GitFork, Filter, ShieldAlert } from 'lucide-react';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';

export const InteractionsPage = ({ rules }) => {
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredRules = rules.filter((r) => {
    if (severityFilter === 'ALL') return true;
    return r.severity.toUpperCase() === severityFilter;
  });

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'High':
        return 'badge-rose';
      case 'Moderate':
        return 'badge-amber';
      case 'Low':
        return 'badge-cyan';
      default:
        return 'badge-emerald';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
          Drug-Drug Interaction <span style={{ color: '#f43f5e' }}>Knowledge Rules</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
          Configured synthetic pharmacological conflict rules evaluated bidirectionally across active digital twin prescriptions.
        </p>
      </div>

      <MedicalDisclaimer variant="small" />

      {/* Severity Filter Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        margin: '1.25rem 0',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Filter size={14} /> Filter Severity:
        </span>
        {['ALL', 'HIGH', 'MODERATE', 'LOW'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`btn btn-sm ${severityFilter === sev ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem' }}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Rules Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredRules.map((rule, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '1.25rem',
              borderLeft: rule.severity === 'High' ? '4px solid #f43f5e' : rule.severity === 'Moderate' ? '4px solid #f59e0b' : '4px solid #00f2fe'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '700' }}>
                <span style={{ background: '#1e1b4b', border: '1px solid #6366f1', padding: '0.25rem 0.7rem', borderRadius: '6px', fontSize: '0.95rem', color: '#ffffff' }}>
                  {rule.drug_a}
                </span>
                <span style={{ color: '#f43f5e', fontWeight: '800' }}>↔</span>
                <span style={{ background: '#1e1b4b', border: '1px solid #6366f1', padding: '0.25rem 0.7rem', borderRadius: '6px', fontSize: '0.95rem', color: '#ffffff' }}>
                  {rule.drug_b}
                </span>
              </div>
              <span className={`badge ${getSeverityBadge(rule.severity)}`}>
                Severity: {rule.severity}
              </span>
            </div>

            {rule.mechanism && (
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                <strong style={{ color: '#38bdf8' }}>Mechanism: </strong>
                {rule.mechanism}
              </div>
            )}

            <div style={{ fontSize: '0.84rem', color: '#fca5a5', marginBottom: '0.5rem', lineHeight: '1.4' }}>
              <strong style={{ color: '#f43f5e' }}>Clinical Risk: </strong>
              {rule.description}
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#fde68a',
              borderLeft: '3px solid #f59e0b'
            }}>
              <strong>Clinical Action / Recommendation: </strong>
              {rule.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
