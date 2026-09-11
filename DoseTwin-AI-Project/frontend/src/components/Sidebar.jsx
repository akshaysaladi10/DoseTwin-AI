import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Pill, 
  GitFork, 
  Network, 
  Layers, 
  BookOpen 
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'studio', label: 'Digital Twin Studio', icon: FlaskConical },
    { id: 'medications', label: 'Medications Catalog', icon: Pill },
    { id: 'interactions', label: 'Drug Interactions', icon: GitFork },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'architecture', label: 'SOA Architecture', icon: Layers },
    { id: 'techstack', label: 'Technology Stack', icon: BookOpen },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(0, 242, 254, 0.4)'
        }}>
          <FlaskConical size={18} color="#050d1a" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700', fontSize: '1.05rem', color: '#ffffff' }}>
            DoseTwin AI
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Digital Twin Core
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem 0.5rem 0.5rem' }}>
          Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Academic Prototype Notice in Sidebar Footer */}
      <div style={{
        padding: '1.25rem 1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: 'rgba(5, 10, 20, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00f2fe' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>Academic Prototype</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.4 }}>
          HL7 FHIR R4-inspired • Neo4j Knowledge Graph • TensorFlow Simulation
        </p>
      </div>
    </aside>
  );
};
