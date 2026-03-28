import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { Loader2, Users } from 'lucide-react';

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      const { data } = await userApi.getAll();
      setStaff(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      await userApi.updateRole(id, newRole);
      await fetchStaff();
    } catch (err) {
      alert("Failed to update role. Make sure you are an Admin.");
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Staff Management</h2>
        <p style={{ color: 'var(--text-dim)' }}>Manage employee accounts and system permissions.</p>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" size={32} color="var(--primary)" />
          </div>
        ) : (
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Name</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Email</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Joined</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Role</th>
                  <th style={{ padding: '16px', color: 'var(--text-dim)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <Users size={16} color="var(--primary)" />
                         {member.name}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{member.email}</td>
                    <td style={{ padding: '16px', color: 'var(--text-dim)' }}>
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: member.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: member.role === 'ADMIN' ? '#ef4444' : '#3b82f6',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}>
                        {member.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                       <select 
                         value={member.role}
                         onChange={(e) => handleRoleChange(member.id, e.target.value)}
                         style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                       >
                         <option value="STAFF">STAFF</option>
                         <option value="ADMIN">ADMIN</option>
                       </select>
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

export default StaffPage;
