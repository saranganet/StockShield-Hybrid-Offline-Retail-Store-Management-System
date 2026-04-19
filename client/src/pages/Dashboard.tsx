import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: Package, label: 'Products', active: false },
    { icon: ShoppingCart, label: 'Orders', active: false },
    { icon: Users, label: 'Staff', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="logo-container" style={{ justifyContent: 'flex-start', paddingLeft: '8px' }}>
          <div className="logo-icon" style={{ width: '40px', height: '40px' }}>
            <Shield size={22} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>StockShield</span>
        </div>

        <nav style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => (
            <button 
              key={item.label}
              className={`animate-fade-in`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: item.active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: item.active ? 'var(--primary)' : 'var(--text-dim)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                width: '100%',
                fontWeight: item.active ? 600 : 400,
                textAlign: 'left'
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            background: 'transparent',
            color: 'var(--error)',
            cursor: 'pointer',
            transition: 'var(--transition)',
            fontWeight: 500,
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            width: 'calc(100% - 48px)'
          }}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header animate-fade-in">
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Welcome, {user.name || 'User'}!</h2>
            <p style={{ color: 'var(--text-dim)' }}>Here's what's happening in your store today.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="glass" style={{ padding: '10px', borderRadius: '10px', color: 'var(--text-dim)' }}>
              <Bell size={20} />
            </button>
            <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--primary)' }}>
              {user.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

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

        {/* Placeholder for future features */}
        <div className="glass animate-fade-in" style={{ marginTop: '40px', padding: '80px', textAlign: 'center', animationDelay: '0.4s' }}>
          <Package size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--text-dim)' }}>Ready to manage your inventory?</h3>
          <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '8px auto' }}>The inventory and product management features will be available in the next update.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
