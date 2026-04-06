import React, { useState, useEffect } from 'react';
import { salesApi } from '../services/api';

const OverviewPage: React.FC = () => {
  const [stats, setStats] = useState<any>({ totalSales: 0, orders: { pending: 0, completed: 0, total: 1 }, stock: { totalItems: 1, inStock: 0, lowStock: 0, outOfStock: 0, totalVolume: 0 }, recentProducts: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await salesApi.getStats();
        if (data) setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };
    fetchStats();
  }, []);

  const pendingPct = Math.min((stats.orders?.pending / (stats.orders?.total || 1)) * 140, 140) || 10;
  const completedPct = Math.min((stats.orders?.completed / (stats.orders?.total || 1)) * 140, 140) || 10;
  
  const inStockRatio = (stats.stock?.inStock / (stats.stock?.totalItems || 1)) * 100;
  const outOfStockRatio = inStockRatio + ((stats.stock?.outOfStock / (stats.stock?.totalItems || 1)) * 100);

  return (
    <div className="animate-fade-in">
      {/* Top Grid for Orders and Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.2fr)', gap: '24px', marginBottom: '24px' }}>
        
        {/* Orders Card */}
        <div className="glass bg-blue-gradient" style={{ padding: '32px', position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '24px' }}>Orders</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', padding: '0 10px' }}>
             
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.orders?.total || 0}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Total</span>
              <div style={{ width: '48px', height: '140px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px 12px 0 0' }}></div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.orders?.pending || 0}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Created</span>
              <div style={{ width: '48px', height: `${pendingPct}px`, minHeight: '10px', background: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10L10 0\' stroke=\'rgba(255,255,255,0.3)\' stroke-width=\'2\'/%3E%3C/svg%3E")', borderRadius: '12px 12px 0 0', transition: 'height 1s ease' }}></div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.orders?.completed || 0}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Received</span>
              <div style={{ width: '48px', height: `${completedPct}px`, minHeight: '10px', background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.1))', borderRadius: '12px 12px 0 0', transition: 'height 1s ease' }}></div>
            </div>
          </div>
        </div>

        {/* Stock Card */}
        <div className="glass bg-orange-gradient" style={{ padding: '32px', position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '24px' }}>Stock</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', opacity: 0.9 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fff' }}></div> In Stock ({stats.stock?.inStock || 0})</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)' }}></div> Out Of Stock ({stats.stock?.outOfStock || 0})</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)' }}></div> Low Stock ({stats.stock?.lowStock || 0})</li>
             </ul>
             <div style={{ width: '160px', height: '160px', borderRadius: '50%', transition: 'background 1s ease', background: `conic-gradient(#fff 0% ${inStockRatio || 0}%, rgba(0,0,0,0.5) ${inStockRatio || 0}% ${outOfStockRatio || 0}%, rgba(0,0,0,0.2) ${outOfStockRatio || 0}% 100%)`, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FF5421', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{stats.stock?.totalVolume || 0}</span>
                </div>
             </div>
          </div>
        </div>
        
        {/* Sales Overview Card */}
        <div className="glass" style={{ padding: '32px', minHeight: '300px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-main)' }}>Global Revenue</h3>
           </div>
           
           <div style={{ padding: '20px 0' }}>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Sales (Lifetime)</p>
              <h1 style={{ fontSize: '3rem', fontWeight: 700, background: 'linear-gradient(to right, #fff, #8a8a93)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{stats.totalSales.toLocaleString('en-IN')}</h1>
              
              <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                 <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.1rem' }}>+ 12.4% <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.9rem' }}>vs last month</span></p>
              </div>
           </div>
        </div>

      </div>

      {/* Bottom Product List Mimic */}
      <div className="glass" style={{ padding: '32px' }}>
         <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginRight: 'auto' }}>Product List</h3>
            <input type="text" placeholder="Search..." style={{ maxWidth: '300px' }} />
            <select style={{ maxWidth: '140px' }}><option>Category</option></select>
            <select style={{ maxWidth: '140px' }}><option>Supplier</option></select>
         </div>
         
         <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                     <th>Product</th>
                     <th>Supplier</th>
                     <th>Category</th>
                     <th>Cost</th>
                     <th>On hand</th>
                     <th>Demand</th>
                  </tr>
               </thead>
                <tbody>
                  {stats.recentProducts?.length > 0 ? stats.recentProducts.map((prod: any) => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid var(--border)' }}>
                       <td><div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>{prod.name.charAt(0)}</div> <div><p style={{ fontWeight: 600 }}>{prod.name}</p><p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ID: {prod.id.slice(0, 8)}</p></div></div></td>
                       <td style={{ color: 'var(--text-dim)' }}>Local</td>
                       <td style={{ color: 'var(--text-dim)' }}>{prod.category?.name || 'Uncategorized'}</td>
                       <td style={{ fontWeight: 500 }}>₹{Number(prod.price).toFixed(2)}</td>
                       <td style={{ fontWeight: 500 }}>{prod.stockQuantity}</td>
                       <td><span style={{ background: prod.stockQuantity > 10 ? 'rgba(42, 91, 252, 0.15)' : 'rgba(255, 84, 33, 0.15)', color: prod.stockQuantity > 10 ? 'var(--secondary)' : 'var(--primary)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{prod.stockQuantity > 10 ? 'Good' : 'Critical'}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)' }}>No products found</td></tr>
                  )}
                </tbody>
             </table>
         </div>
         
      </div>

    </div>
  );
};

export default OverviewPage;
