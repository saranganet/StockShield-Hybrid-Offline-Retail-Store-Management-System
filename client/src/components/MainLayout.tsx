import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  LogOut, 
  Bell,
  Tags
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Tags, label: 'Categories', path: '/dashboard/categories' },
    { icon: Package, label: 'Products', path: '/dashboard/products' },
    { icon: ShoppingCart, label: 'Sales', path: '/dashboard/sales' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="logo-container" style={{ justifyContent: 'flex-start', paddingLeft: '8px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <div className="logo-icon" style={{ width: '40px', height: '40px' }}>
            <Shield size={22} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>StockShield</span>
        </div>

        <nav style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.label}
                onClick={() => navigate(item.path)}
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  width: '100%',
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left'
                }}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            );
          })}
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

      {/* Main Content Area */}
      <div className="main-container">
        <header className="header animate-fade-in">
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
              {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
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

        <main className="main-content" style={{ paddingTop: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
