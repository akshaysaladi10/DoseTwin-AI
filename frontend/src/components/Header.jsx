import React from 'react';
import { Activity, ShieldAlert, Cpu, ExternalLink } from 'lucide-react';

export const Header = ({ backendStatus = 'checking' }) => {
  return (
    <header className="header-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
        }}>
          <Activity size={22} color="#050d1a" strokeWidth={2.5} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>
            DoseTwin <span style={{ color: '#00f2fe' }}>AI</span>
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
            SOA Digital Twin Framework • Drug Response & Conflict Prevention
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {/* Backend Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.4rem 0.8rem',
          borderRadius: '9999px',
          fontSize: '0.8rem'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: backendStatus === 'online' ? '#10b981' : backendStatus === 'offline' ? '#ef4444' : '#f59e0b',
            boxShadow: backendStatus === 'online' ? '0 0 8px #10b981' : 'none'
          }}></span>
          <span style={{ color: '#94a3b8' }}>
            SOA Core: <strong style={{ color: backendStatus === 'online' ? '#10b981' : '#f8fafc' }}>
              {backendStatus === 'online' ? 'Connected (Port 8000)' : 'Offline / Standby'}
            </strong>
          </span>
        </div>

        {/* Swagger Docs Link */}
        <a 
          href="http://localhost:8000/docs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <Cpu size={14} />
          <span>FastAPI Swagger</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </header>
  );
};
