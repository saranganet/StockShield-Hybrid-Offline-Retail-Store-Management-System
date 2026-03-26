import React, { useState, useEffect } from 'react';
import { productApi, salesApi } from '../services/api';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
}

interface CartItem extends Product {
  cartQuantity: number;
}

const SalesPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD'>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.cartQuantity >= product.stockQuantity) {
          alert('Cannot exceed available stock');
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      }
      if (product.stockQuantity < 1) {
        alert('Product out of stock');
        return prev;
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.cartQuantity + delta;
          if (newQuantity < 1) return item;
          if (newQuantity > item.stockQuantity) return item;
          return { ...item, cartQuantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const payload = {
        items: cart.map(item => ({ productId: item.id, quantity: item.cartQuantity })),
        paymentMethod
      };
      await salesApi.create(payload);
      alert('Sale processed successfully!');
      setCart([]);
      fetchProducts(); // Refresh stock
    } catch (error: any) {
      console.error('Checkout failed', error);
      alert(error.response?.data?.error || 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.cartQuantity, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', height: '100%', minHeight: 'calc(100vh - 150px)' }}>
      {/* Products Pane */}
      <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Point of Sale</h2>
        
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 12px 12px 48px',
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--text)', outline: 'none'
            }}
          />
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-dim)' }}>Loading products...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', overflowY: 'auto' }}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => product.stockQuantity > 0 && addToCart(product)}
                style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '16px', cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                  opacity: product.stockQuantity > 0 ? 1 : 0.5,
                  transition: 'all 0.2s ease', position: 'relative'
                }}
              >
                <h4 style={{ fontWeight: 500, marginBottom: '8px' }}>{product.name}</h4>
                <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>₹{Number(product.price).toFixed(2)}</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                  Stock: {product.stockQuantity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Pane */}
      <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <ShoppingCart size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Current Order</h2>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px' }}>
          {cart.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginTop: '40px' }}>Cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 500 }}>{item.name}</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>₹{Number(item.price).toFixed(2)}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '4px' }}><Minus size={16} /></button>
                  <span style={{ width: '20px', textAlign: 'center' }}>{item.cartQuantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '4px' }}><Plus size={16} /></button>
                </div>
                
                <p style={{ fontWeight: 600, width: '80px', textAlign: 'right' }}>₹{(Number(item.price) * item.cartQuantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '4px' }}><Trash2 size={18} /></button>
              </div>
            ))
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
          </div>

          <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255, 84, 33, 0.1)', border: '1px dashed rgba(255, 84, 33, 0.3)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertCircle size={18} color="var(--primary)" />
              <h4 style={{ color: 'var(--primary)', fontWeight: 600 }}>Payment Gateway Coming Soon</h4>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Integration with live providers (Stripe/Razorpay) is scheduled for the next major release. The options below will currently process simulated offline records for testing and presentation purposes.
            </p>
          </div>

          <p style={{ color: 'var(--text-dim)', marginBottom: '8px', fontSize: '0.9rem' }}>Simulate Payment Method</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '24px' }}>
            {[
              { id: 'CASH', icon: Banknote, label: 'Cash' },
              { id: 'CARD', icon: CreditCard, label: 'Card' },
              { id: 'UPI', icon: Smartphone, label: 'UPI' }
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  padding: '12px', borderRadius: '8px', border: '1px solid',
                  borderColor: paymentMethod === method.id ? 'var(--primary)' : 'var(--border)',
                  background: paymentMethod === method.id ? 'var(--primary-dark)' : 'rgba(255,255,255,0.02)',
                  color: paymentMethod === method.id ? '#fff' : 'var(--text)', cursor: 'pointer'
                }}
              >
                <method.icon size={20} />
                <span style={{ fontSize: '0.8rem' }}>{method.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            style={{
              width: '100%', padding: '16px', borderRadius: '8px', border: 'none',
              background: cart.length > 0 && !isProcessing ? 'var(--primary)' : 'var(--border)',
              color: '#fff', fontSize: '1.1rem', fontWeight: 600, cursor: cart.length > 0 && !isProcessing ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s ease'
            }}
          >
            {isProcessing ? 'Processing...' : `Checkout ₹${subtotal.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
