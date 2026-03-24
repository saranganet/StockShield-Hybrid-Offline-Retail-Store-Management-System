import React, { useState, useEffect } from 'react';
import { auditApi } from '../services/api';
import { Loader2 } from 'lucide-react';

const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await auditApi.getAll();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>System Audit Logs</h2>
        <p style={{ color: 'var(--text-dim)' }}>Track critical security and operational actions across the platform.</p>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" size={32} color="var(--primary)" />
          </div>
        ) : (
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Timestamp</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Action</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>User</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Metadata</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px', color: 'var(--text-dim)' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{log.user?.name || log.userId}</td>
                    <td style={{ padding: '16px', fontFamily: 'monospace', color: 'var(--text-dim)' }}>
                      {JSON.stringify(log.metadata)}
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

export default AuditPage;
