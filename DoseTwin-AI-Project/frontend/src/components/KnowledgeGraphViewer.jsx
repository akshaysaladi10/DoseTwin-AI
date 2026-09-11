import React, { useState } from 'react';
import { Network, ZoomIn, ZoomOut, RefreshCw, Eye } from 'lucide-react';

export const KnowledgeGraphViewer = ({ graphData }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        <Network size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
        <p>No knowledge graph data available for visualization.</p>
      </div>
    );
  }

  const nodes = graphData.nodes;
  const edges = graphData.edges || [];

  // Compute 2D node coordinates in a circular/radial layout around the Patient node
  const width = 640;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  // Separate nodes by type
  const patientNode = nodes.find(n => n.type === 'Patient');
  const otherNodes = nodes.filter(n => n.type !== 'Patient');

  const positions = {};

  if (patientNode) {
    positions[patientNode.id] = { x: centerX, y: centerY };
  }

  const radius = 140;
  const totalOther = otherNodes.length;
  otherNodes.forEach((node, idx) => {
    const angle = (idx / (totalOther || 1)) * 2 * Math.PI - Math.PI / 2;
    positions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const getNodeColor = (type) => {
    switch (type) {
      case 'Patient':
        return '#00f2fe';
      case 'Drug':
        return '#a855f7';
      case 'Condition':
        return '#f59e0b';
      case 'Observation':
        return '#10b981';
      default:
        return '#38bdf8';
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Network size={20} color="#a855f7" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
              Knowledge Graph Topology
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              NetworkX entity relationships ({nodes.length} Nodes, {edges.length} Edges)
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Patient</span>
          <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Drug</span>
          <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Condition</span>
          <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Observation</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{
        background: '#040711',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          style={{ width: '100%', height: '360px', display: 'block' }}
        >
          {/* Background Grid Accent */}
          <defs>
            <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
            </pattern>
            {/* Arrow Marker */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
            <marker
              id="arrow-conflict"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
          </defs>

          <rect width={width} height={height} fill="url(#graph-grid)" />

          {/* Edges */}
          {edges.map((edge, idx) => {
            const src = positions[edge.source];
            const tgt = positions[edge.target];
            if (!src || !tgt) return null;

            const isConflict = edge.relationship === 'INTERACTS_WITH';
            const strokeColor = isConflict ? '#f43f5e' : 'rgba(148, 163, 184, 0.4)';
            const strokeWidth = isConflict ? 2.5 : 1.2;

            return (
              <g key={idx}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isConflict ? '5,5' : 'none'}
                  markerEnd={isConflict ? 'url(#arrow-conflict)' : 'url(#arrow)'}
                />
                {/* Edge Label */}
                <text
                  x={(src.x + tgt.x) / 2}
                  y={(src.y + tgt.y) / 2 - 4}
                  fill={isConflict ? '#fca5a5' : '#64748b'}
                  fontSize="8"
                  fontWeight="600"
                  textAnchor="middle"
                  style={{ userSelect: 'none' }}
                >
                  {edge.relationship}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = positions[node.id];
            if (!pos) return null;

            const color = getNodeColor(node.type);
            const isSelected = selectedNode?.id === node.id;
            const radiusSize = node.type === 'Patient' ? 24 : 16;

            return (
              <g 
                key={node.id} 
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Glow */}
                <circle
                  r={radiusSize + (isSelected ? 6 : 3)}
                  fill={color}
                  opacity={isSelected ? 0.4 : 0.15}
                />
                {/* Main Node Circle */}
                <circle
                  r={radiusSize}
                  fill="#0d1527"
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                />
                {/* Node Label inside or below */}
                <text
                  y={radiusSize + 12}
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                  style={{ userSelect: 'none' }}
                >
                  {node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Box */}
        {selectedNode && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            background: 'rgba(13, 21, 39, 0.95)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '8px',
            padding: '0.6rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem'
          }}>
            <div>
              <strong style={{ color: getNodeColor(selectedNode.type) }}>[{selectedNode.type}] </strong>
              <span style={{ color: '#ffffff' }}>{selectedNode.label}</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
