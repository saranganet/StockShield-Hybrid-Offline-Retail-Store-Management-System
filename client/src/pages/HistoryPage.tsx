import React, { useState, useEffect } from 'react';
import { salesApi } from '../services/api';
import { Loader2, Receipt, AlertCircle } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await salesApi.getAll();
        setSales(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Sales History</h2>
        <p style={{ color: 'var(--text-dim)' }}>View past transactions and receipts.</p>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" size={32} color="var(--primary)" />
          </div>
        ) : sales.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-dim)', padding: '40px' }}>
            <AlertCircle size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <p>No past transactions found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Invoice ID</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Date</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Cashier</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Items</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                        <Receipt size={16} color="var(--primary)" />
                        {sale.id.slice(0, 8).toUpperCase()}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-dim)' }}>
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px' }}>{sale.user?.name || 'Unknown'}</td>
                    <td style={{ padding: '16px', color: 'var(--text-dim)' }}>
                      {sale.invoiceItems?.length || 0} product(s)
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#4ade80' }}>
                      ₹{Number(sale.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
