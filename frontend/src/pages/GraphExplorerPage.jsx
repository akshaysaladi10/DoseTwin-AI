import React, { useState, useEffect } from 'react';
import { Network, Loader2, RefreshCw } from 'lucide-react';
import { KnowledgeGraphViewer } from '../components/KnowledgeGraphViewer';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import { apiService } from '../services/api';

export const GraphExplorerPage = () => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const res = await apiService.getGlobalKnowledgeGraph();
      setGraphData(res.data);
    } catch (err) {
      console.error('Error fetching global knowledge graph:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
              Knowledge Graph <span style={{ color: '#00f2fe' }}>Explorer</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              NetworkX graph representation linking Drugs, Clinical Conditions, and Pharmacological Interaction Edges.
            </p>
          </div>
          <button
            onClick={fetchGraph}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={14} />
            <span>Reload Graph</span>
          </button>
        </div>
      </div>

      <MedicalDisclaimer variant="small" />

      {loading ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Loader2 size={36} color="#00f2fe" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          <p style={{ color: '#94a3b8' }}>Loading Knowledge Graph topology from backend...</p>
        </div>
      ) : (
        <div style={{ marginTop: '1.25rem' }}>
          <KnowledgeGraphViewer graphData={graphData} />
        </div>
      )}
    </div>
  );
};
