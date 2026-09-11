import React, { useState } from 'react';
import { Pill, Plus, Trash2, CheckCircle2, Target } from 'lucide-react';

export const MedicationBuilder = ({
  medications,
  catalog,
  targetDrug,
  onMedicationsChange,
  onTargetDrugChange
}) => {
  const [selectedCatalogDrug, setSelectedCatalogDrug] = useState('');
  const [customDrugName, setCustomDrugName] = useState('');
  const [customDosage, setCustomDosage] = useState('Standard');
  const [customFrequency, setCustomFrequency] = useState('Once daily');

  const handleAddCatalogMed = () => {
    if (!selectedCatalogDrug) return;
    const catItem = catalog.find(c => c.drug_name === selectedCatalogDrug);
    const newMed = {
      drug_name: selectedCatalogDrug,
      dosage: catItem?.standard_dosage || 'Standard',
      frequency: 'Once daily',
      route: catItem?.route || 'Oral'
    };

    const updated = [...medications, newMed];
    onMedicationsChange(updated);
    if (!targetDrug) {
      onTargetDrugChange(newMed.drug_name);
    }
    setSelectedCatalogDrug('');
  };

  const handleAddCustomMed = () => {
    if (!customDrugName.trim()) return;
    const newMed = {
      drug_name: customDrugName.trim(),
      dosage: customDosage || 'Standard',
      frequency: customFrequency || 'Once daily',
      route: 'Oral'
    };

    const updated = [...medications, newMed];
    onMedicationsChange(updated);
    if (!targetDrug) {
      onTargetDrugChange(newMed.drug_name);
    }
    setCustomDrugName('');
  };

  const handleRemoveMed = (index) => {
    const updated = medications.filter((_, i) => i !== index);
    onMedicationsChange(updated);
    if (targetDrug === medications[index]?.drug_name) {
      onTargetDrugChange(updated[0]?.drug_name || '');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ fontSize: '1.05rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Pill size={18} />
          <span>Active Medications & Regimen Builder</span>
        </h4>
        <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
          {medications.length} Active {medications.length === 1 ? 'Drug' : 'Drugs'}
        </span>
      </div>

      {/* Add Medication Controls */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          <select
            className="form-select"
            value={selectedCatalogDrug}
            onChange={(e) => setSelectedCatalogDrug(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">-- Add from Synthetic Pharmacology Catalog --</option>
            {catalog.map((c) => (
              <option key={c.drug_code || c.drug_name} value={c.drug_name}>
                {c.drug_name} ({c.standard_dosage}) — {c.therapeutic_class}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleAddCatalogMed}
            disabled={!selectedCatalogDrug}
          >
            <Plus size={14} />
            <span>Add Drug</span>
          </button>
        </div>
      </div>

      {/* Medication List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {medications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            color: '#64748b',
            fontSize: '0.85rem'
          }}>
            No medications currently active in this patient digital twin.
          </div>
        ) : (
          medications.map((med, idx) => {
            const isTarget = targetDrug === med.drug_name;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: isTarget ? 'rgba(0, 242, 254, 0.08)' : 'rgba(13, 21, 39, 0.6)',
                  border: isTarget ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isTarget ? 'rgba(0, 242, 254, 0.2)' : 'rgba(168, 85, 247, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Pill size={16} color={isTarget ? '#00f2fe' : '#a855f7'} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{med.drug_name}</span>
                      {isTarget && (
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          <Target size={10} /> Target Simulation
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {med.dosage} • {med.frequency} • {med.route}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {!isTarget && (
                    <button
                      type="button"
                      onClick={() => onTargetDrugChange(med.drug_name)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      title="Set as target for ML response prediction"
                    >
                      <Target size={12} />
                      <span>Set Target</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMed(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f43f5e',
                      cursor: 'pointer',
                      padding: '0.4rem',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Remove medication"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
