import React from 'react';
import { Users, Pill, AlertOctagon, Activity, Sparkles } from 'lucide-react';

export const MetricCards = ({ 
  patientCount = 5, 
  medicationCount = 14, 
  interactionCount = 8, 
  simulationsRun = 12 
}) => {
  const cards = [
    {
      title: 'Digital Twins Registered',
      value: patientCount,
      subtext: 'Synthetic cohorts in database',
      icon: Users,
      color: '#00f2fe',
      bgGlow: 'rgba(0, 242, 254, 0.15)',
      borderColor: 'rgba(0, 242, 254, 0.3)'
    },
    {
      title: 'Active Medication Catalog',
      value: medicationCount,
      subtext: 'Standardized drug entries',
      icon: Pill,
      color: '#a855f7',
      bgGlow: 'rgba(168, 85, 247, 0.15)',
      borderColor: 'rgba(168, 85, 247, 0.3)'
    },
    {
      title: 'Interaction Knowledge Rules',
      value: interactionCount,
      subtext: 'Bidirectional conflict rules',
      icon: AlertOctagon,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.15)',
      borderColor: 'rgba(244, 63, 94, 0.3)'
    },
    {
      title: 'Simulations Executed',
      value: simulationsRun,
      subtext: 'ML response predictions',
      icon: Activity,
      color: '#10b981',
      bgGlow: 'rgba(168, 255, 180, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    }
  ];

  return (
    <div className="grid-4" style={{ marginBottom: '2rem' }}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className="glass-card"
            style={{ 
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `2px solid ${card.color}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>
                  {card.title}
                </span>
                <h3 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.25rem', color: '#ffffff' }}>
                  {card.value}
                </h3>
              </div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: card.bgGlow,
                border: `1px solid ${card.borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} color={card.color} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
