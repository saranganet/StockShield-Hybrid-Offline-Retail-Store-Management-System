import React from 'react';
import { Package } from 'lucide-react';

const OverviewPage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Welcome back, {user.name}!</h2>
        <p style={{ color: 'var(--text-dim)' }}>Here's an overview of your store's performance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {/* Stats Cards */}
        {[
          { label: 'Total Sales', value: '$12,450', trend: '+12.5%', color: 'var(--primary)' },
          { label: 'Active Orders', value: '48', trend: '+3 today', color: 'var(--secondary)' },
          { label: 'Low Stock Items', value: '12', trend: '-2 since yesterday', color: 'var(--error)' },
        ].map((stat, i) => (
          <div key={i} className="glass animate-fade-in" style={{ padding: '24px', animationDelay: `${i * 0.1}s` }}>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '8px' }}>{stat.label}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>{stat.value}</h3>
            <span style={{ fontSize: '0.8rem', color: stat.label.includes('Low') ? 'var(--error)' : 'var(--success)' }}>{stat.trend}</span>
          </div>
        ))}
      </div>

      <div className="glass animate-fade-in" style={{ marginTop: '40px', padding: '80px', textAlign: 'center', animationDelay: '0.4s' }}>
        <Package size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px', opacity: 0.5 }} />
        <h3 style={{ color: 'var(--text-dim)' }}>Quick Actions</h3>
        <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '8px auto' }}>Select a category from the sidebar to start managing your products or view detailed sales reports.</p>
      </div>
    </div>
  );
};

export default OverviewPage;
