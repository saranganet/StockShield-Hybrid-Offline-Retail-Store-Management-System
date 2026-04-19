import React, { useState, useEffect } from 'react';
import { productApi, categoryApi } from '../services/api';
import { Plus, Trash2, Loader2, Package, AlertCircle } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stockQuantity: '',
    categoryId: ''
  });

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll()
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) return;

    setSubmitting(true);
    try {
      await productApi.create({
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity) || 0
      });
      setFormData({ name: '', price: '', stockQuantity: '', categoryId: '' });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productApi.delete(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (categories.length === 0 && !loading) {
    return (
      <div className="glass animate-fade-in" style={{ padding: '80px', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: 'var(--secondary)', marginBottom: '16px' }} />
        <h3>No Categories Found</h3>
        <p style={{ color: 'var(--text-dim)', marginBottom: '24px' }}>You need to create at least one category before adding products.</p>
        <button onClick={() => window.location.href='/dashboard/categories'} className="btn-primary">
          Go to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Inventory</h2>
          <p style={{ color: 'var(--text-dim)' }}>Manage your store products and stock levels.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '32px' }}>
        {/* Add Product Form */}
        <div className="glass" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600 }}>Add New Product</h3>
          <form onSubmit={handleAddProduct}>
            <div className="input-group">
              <label>Product Name</label>
              <input 
                type="text" 
                placeholder="e.g. iPhone 15 Pro"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label>Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Stock Qty</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Category</label>
              <select 
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="" style={{ background: '#1e1e2d' }}>Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} style={{ background: '#1e1e2d' }}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '16px' }}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add Product</>}
            </button>
          </form>
        </div>

        {/* Products Table */}
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
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Product</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Category</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Price</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Stock</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                            <Package size={18} />
                          </div>
                          <span style={{ fontWeight: 500 }}>{prod.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                          {prod.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>${parseFloat(prod.price).toFixed(2)}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ color: prod.stockQuantity < 10 ? 'var(--error)' : 'var(--success)', fontWeight: 600 }}>
                          {prod.stockQuantity}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDelete(prod.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '8px' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                        No products found. Start by adding one!
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

export default ProductsPage;
