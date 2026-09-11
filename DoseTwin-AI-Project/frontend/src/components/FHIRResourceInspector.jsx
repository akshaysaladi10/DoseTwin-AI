import React, { useState } from 'react';
import { FileJson, Copy, Check, Info } from 'lucide-react';

export const FHIRResourceInspector = ({ fhirResources }) => {
  const [activeTab, setActiveTab] = useState('bundle');
  const [copied, setCopied] = useState(false);

  if (!fhirResources) return null;

  const tabs = [
    { id: 'bundle', label: 'FHIR Bundle' },
    { id: 'patient', label: 'Patient' },
    { id: 'condition', label: 'Condition' },
    { id: 'meds', label: 'MedicationRequest' },
    { id: 'obs', label: 'Observation' },
  ];

  const getActiveContent = () => {
    switch (activeTab) {
      case 'patient':
        return fhirResources.summary?.patient || fhirResources.entry?.find(e => e.resource?.resourceType === 'Patient')?.resource || {};
      case 'condition':
        return fhirResources.summary?.condition || fhirResources.entry?.find(e => e.resource?.resourceType === 'Condition')?.resource || {};
      case 'meds':
        return fhirResources.summary?.medication_requests || fhirResources.entry?.filter(e => e.resource?.resourceType === 'MedicationRequest').map(e => e.resource) || [];
      case 'obs':
        return fhirResources.summary?.observations || fhirResources.entry?.filter(e => e.resource?.resourceType === 'Observation').map(e => e.resource) || [];
      case 'bundle':
      default:
        return fhirResources;
    }
  };

  const handleCopy = () => {
    const text = JSON.stringify(getActiveContent(), null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
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
            <FileJson size={20} color="#00f2fe" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
              HL7 FHIR Resource Inspector
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Standardized healthcare interoperability representations (HL7 FHIR R4)
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.78rem' }}
        >
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid transparent',
              color: activeTab === tab.id ? '#00f2fe' : '#94a3b8',
              borderRadius: '8px',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* JSON Viewer */}
      <pre className="code-container">
        <code>{JSON.stringify(getActiveContent(), null, 2)}</code>
      </pre>
    </div>
  );
};
