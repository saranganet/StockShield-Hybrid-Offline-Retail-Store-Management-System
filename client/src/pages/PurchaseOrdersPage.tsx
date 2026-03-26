import React, { useState, useEffect } from 'react';
import { poApi, supplierApi, productApi } from '../services/api';
import { Plus, CheckCircle, Loader2, PackageOpen } from 'lucide-react';

const PurchaseOrdersPage: React.FC = () => {
  const [pos, setPos] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [poItems, setPoItems] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [posRes, supRes, prodRes] = await Promise.all([
        poApi.getAll(),
        supplierApi.getAll(),
        productApi.getAll()
      ]);
      setPos(posRes.data);
      setSuppliers(supRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0 || unitCost < 0) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const product = products.find((p: any) => p.id === selectedProduct);
    setPoItems(prev => [...prev, {
      productId: selectedProduct,
      productName: product?.name,
      quantity,
      unitCost
    }]);
    
    setSelectedProduct('');
    setQuantity(1);
    setUnitCost(0);
  };

  const handleCreatePO = async () => {
    if (!selectedSupplier || poItems.length === 0) return;
    setSubmitting(true);
    try {
      await poApi.create({
        supplierId: selectedSupplier,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: poItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitCost: item.unitCost
        }))
      });
      setPoItems([]);
      setSelectedSupplier('');
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReceive = async (id: string) => {
    if (!window.confirm('Mark this PO as received? This will update stock inventory.')) return;
    try {
      await poApi.receive(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Purchase Orders</h2>
          <p style={{ color: 'var(--text-dim)' }}>Restock inventory by creating vendor orders.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '32px' }}>
        {/* Create PO Form */}
        <div className="glass" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600 }}>Create New PO</h3>
          
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>Supplier</label>
            <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)} required>
              <option value="">Select a supplier...</option>
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.id}>{sup.name}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleAddItem} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Add Line Item</h4>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
                <option value="">Select product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQuantity})</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div className="input-group">
                <input type="number" placeholder="Qty" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" required />
              </div>
              <div className="input-group">
                <input type="number" placeholder="Cost/Unit" value={unitCost} onChange={e => setUnitCost(Number(e.target.value))} min="0" step="0.01" required />
              </div>
            </div>
            <button type="submit" className="btn-secondary" style={{ width: '100%', padding: '8px' }}>Add to List</button>
          </form>

          {poItems.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Pending Items</h4>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                {poItems.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>{item.productName} <span style={{ color: 'var(--text-dim)' }}>x{item.quantity}</span></span>
                    <span>₹{(item.quantity * item.unitCost).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={handleCreatePO}
                className="btn-primary" 
                style={{ width: '100%' }}
                disabled={submitting || !selectedSupplier}
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Submit Purchase Order</>}
              </button>
            </div>
          )}
        </div>

        {/* POs List */}
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
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>ID / Date</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Supplier</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Total</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)' }}>Status</th>
                    <th style={{ padding: '16px', color: 'var(--text-dim)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pos.map((po) => (
                    <tr key={po.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 500 }}>{po.id.slice(0, 8)}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date(po.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-dim)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <PackageOpen size={16} />
                           {po.supplier.name}
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>₹{Number(po.totalAmount).toFixed(2)}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          backgroundColor: po.status === 'RECEIVED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                          color: po.status === 'RECEIVED' ? '#4ade80' : '#facc15'
                        }}>
                          {po.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        {po.status === 'CREATED' && (
                          <button 
                            onClick={() => handleReceive(po.id)}
                            style={{ background: 'transparent', border: '1px solid var(--primary)', borderRadius: '4px', color: 'var(--primary)', cursor: 'pointer', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}
                          >
                            <CheckCircle size={14} /> Receive
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {pos.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                        No purchase orders found.
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

export default PurchaseOrdersPage;
