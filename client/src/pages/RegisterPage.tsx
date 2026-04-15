import React, { useState } from 'react';
import { Shield, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ThreeBackground from '../components/ThreeBackground';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ThreeBackground />
    <div className="auth-container">
      <div className="auth-card glass animate-fade-in">
        <div className="logo-container">
          <div className="logo-icon">
            <Shield size={28} />
          </div>
        </div>
        
        <div className="auth-header">
          <h1>Join StockShield</h1>
          <p>Secure retail management for your business</p>
        </div>

        {error && <div style={{ color: 'var(--error)', marginBottom: '16px', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <span style={{ position: 'absolute', left: '16px', color: 'var(--text-dim)' }}><User size={18} /></span>
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe"
                style={{ paddingLeft: '48px' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span style={{ position: 'absolute', left: '16px', color: 'var(--text-dim)' }}><Mail size={18} /></span>
              <input 
                type="email" 
                className="input-field" 
                placeholder="name@company.com"
                style={{ paddingLeft: '48px' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span style={{ position: 'absolute', left: '16px', color: 'var(--text-dim)' }}><Lock size={18} /></span>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                style={{ paddingLeft: '48px' }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegisterPage;
