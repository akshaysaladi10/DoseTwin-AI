import React, { useState } from 'react';
import { Pill, Search, ShieldCheck, Tag } from 'lucide-react';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';

export const MedicationsPage = ({ catalog }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCatalog = catalog.filter((med) => {
    const term = searchTerm.toLowerCase();
    return (
      med.drug_name.toLowerCase().includes(term) ||
      med.therapeutic_class.toLowerCase().includes(term) ||
      med.indications.some(ind => ind.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
          Synthetic <span style={{ color: '#a855f7' }}>Medications Catalog</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
          Standardized educational pharmacology catalog used for digital twin simulation, interaction rules, and FHIR resource conversions.
        </p>
      </div>

      <MedicalDisclaimer variant="small" />

      {/* Search Filter */}
      <div style={{
        margin: '1.25rem 0',
        position: 'relative'
      }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search by drug name, therapeutic class, or clinical indication..."
          className="form-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.75rem', width: '100%' }}
        />
      </div>

      {/* Medication Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredCatalog.map((med) => (
          <div key={med.drug_code || med.drug_name} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Pill size={18} color="#a855f7" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
                    {med.drug_name}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {med.drug_code} • {med.route}
                  </span>
                </div>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                {med.standard_dosage}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
              <strong style={{ color: '#38bdf8' }}>Class: </strong>
              {med.therapeutic_class}
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>
                Approved Indications
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {med.indications.map((ind, idx) => (
                  <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.65rem', textTransform: 'none' }}>
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
