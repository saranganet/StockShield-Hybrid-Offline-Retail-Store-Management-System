import React, { useState, useEffect } from 'react';
import { supplierApi } from '../services/api';
import { Plus, Trash2, Loader2, Building2 } from 'lucide-react';

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await supplierApi.getAll();
      setSuppliers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactInfo.trim()) return;
    
    setSubmitting(true);
    try {
      await supplierApi.create({ name, contactInfo });
      setName('');
      setContactInfo('');
      await fetchSuppliers();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await supplierApi.delete(id);
      await fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Suppliers</h2>
          <p style={{ color: 'var(--text-dim)' }}>Manage your vendor relationships and contact info.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px' }}>
        {/* Add Supplier Form */}
        <div className="glass" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600 }}>Add New Supplier</h3>
          <form onSubmit={handleAddSupplier}>
            <div className="input-group">
              <label>Company Name</label>
              <input 
                type="text" 
                placeholder="e.g. Acme Corp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group" style={{ marginTop: '16px' }}>
              <label>Contact Info</label>
              <input 
                type="text" 
                placeholder="Email or Phone"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '24px' }}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add Supplier</>}
            </button>
          </form>
        </div>

        {/* Suppliers List */}
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
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Company</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Contact Info</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((sup) => (
                    <tr key={sup.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <Building2 size={16} color="var(--primary)" />
                           {sup.name}
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{sup.contactInfo}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDelete(sup.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '8px' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {suppliers.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                        No suppliers found. Add your first vendor!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;
