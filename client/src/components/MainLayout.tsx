import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  Hexagon, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  LogOut, 
  Bell,
  Tags,
  Search,
  Building2,
  Truck,
  History,
  Activity,
  Users
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, path: '/dashboard', label: 'Overview' },
    { icon: Tags, path: '/dashboard/categories', label: 'Categories' },
    { icon: Package, path: '/dashboard/products', label: 'Products' },
    { icon: ShoppingCart, path: '/dashboard/sales', label: 'Sales' },
    { icon: History, path: '/dashboard/history', label: 'History' },
    { icon: Building2, path: '/dashboard/suppliers', label: 'Suppliers' },
    { icon: Truck, path: '/dashboard/purchase-orders', label: 'Restock' },
    ...(user.role === 'ADMIN' ? [
       { icon: Users, path: '/dashboard/staff', label: 'Staff' },
       { icon: Activity, path: '/dashboard/audit', label: 'Audit' }
    ] : [])
  ];

  return (
    <div className="dashboard-layout">
      {/* Icon-only Sidebar */}
      <aside className="glass" style={{ borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRadius: 0, padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px', height: '100vh', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ marginBottom: '60px', cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate('/dashboard')}>
           <Hexagon size={36} fill="var(--primary)" stroke="none" />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`));
            return (
              <button 
                key={idx}
                title={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  border: isActive ? '1px solid rgba(255, 84, 33, 0.4)' : '1px solid transparent',
                  background: isActive ? 'rgba(255, 84, 33, 0.15)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  boxShadow: isActive ? 'inset 0 0 12px rgba(255, 84, 33, 0.2)' : 'none'
                }}
              >
                <item.icon size={24} strokeWidth={2.5} />
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
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            border: 'none',
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--error)',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          title="Sign Out"
        >
          <LogOut size={22} strokeWidth={2.5} />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="main-container" style={{ flex: 1, padding: '40px 60px', position: 'relative' }}>
        
        {isOffline && (
          <div style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '12px',
            textAlign: 'center',
            borderRadius: '12px',
            marginBottom: '24px',
            fontWeight: 600,
            boxShadow: '0 4px 12px var(--primary-glow)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            ⚠️ You are currently offline. Actions will be saved and synced automatically when reconnected.
          </div>
        )}

        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
             <h1 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.5px' }}>Inventory</h1>
             
             <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', gap: '8px', color: 'var(--text-dim)', fontSize: '0.9rem', borderRadius: '12px' }}>
                 <span>StockShield Terminals</span>
             </div>

             <div 
               style={{ marginLeft: '16px', background: 'rgba(42, 91, 252, 0.2)', color: 'var(--secondary)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(42, 91, 252, 0.4)', cursor: 'pointer' }}
               onClick={async () => {
                 try {
                   const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/dev/seed`, { method: 'POST' });
                   if (res.ok) alert('Mock Data Generated Successfully! Please refresh the page.');
                 } catch (e) {
                   console.error(e);
                 }
               }}
               title="Click to automatically seed Indian market mock data"
             >
               Demo Mode: Uses Mock Data (₹)
             </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="glass" style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', border: 'none', cursor: 'pointer' }}>
              <Search size={20} />
            </button>
            <button className="glass" style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', border: 'none', cursor: 'pointer' }}>
              <Bell size={20} />
            </button>
            <div className="glass" style={{ padding: '0 20px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--text-main)', border: 'none' }}>
              {user.name || 'User'}
            </div>
          </div>
        </header>

        <main style={{ paddingBottom: '40px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
