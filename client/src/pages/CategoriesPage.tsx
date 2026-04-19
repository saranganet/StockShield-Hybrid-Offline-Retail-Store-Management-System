import React, { useState, useEffect } from 'react';
import { categoryApi } from '../services/api';
import { Plus, Trash2, Loader2 } from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    setSubmitting(true);
    try {
      await categoryApi.create({ name: newCatName });
      setNewCatName('');
      await fetchCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryApi.delete(id);
      await fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Categories</h2>
          <p style={{ color: 'var(--text-dim)' }}>Manage your product groupings.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
        {/* Add Category Form */}
        <div className="glass" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600 }}>Add New Category</h3>
          <form onSubmit={handleAddCategory}>
            <div className="input-group">
              <label>Category Name</label>
              <input 
                type="text" 
                placeholder="e.g. Beverages"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '16px' }}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add Category</>}
            </button>
          </form>
        </div>

        {/* Categories List */}
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
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>ID</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px', fontWeight: 500 }}>{cat.name}</td>
                      <td style={{ padding: '16px', fontSize: '0.8rem', opacity: 0.5 }}>{cat.id}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '8px' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                        No categories found. Add your first one!
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

export default CategoriesPage;
