import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { AlertCircle, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

export function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        throw new Error('Please enter a valid 10-digit Indian mobile number.');
      }
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long with uppercase and numbers.');
      }

      await signup(formData);
      navigate('/account');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-20 fade-in" style={{ maxWidth: '440px' }}>
      <div style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xs)',
        padding: 'var(--space-2xl)'
      }}>
        <div className="text-center mb-6">
          <span className="badge-lime mb-2">JOIN THE DROP</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800 }}>
            CREATE PXS ACCOUNT
          </h1>
        </div>

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            background: 'rgba(255, 77, 77, 0.15)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-xs)',
            color: 'var(--color-danger)',
            fontSize: 'var(--text-xs)',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              EMAIL ADDRESS
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              background: 'var(--color-bg-base)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)'
            }}>
              <Mail size={16} className="text-secondary" />
              <input
                type="email"
                name="email"
                placeholder="you@domain.com"
                value={formData.email}
                onChange={handleChange}
                style={{ flex: 1, outline: 'none', color: '#fff' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              MOBILE NUMBER (10 DIGITS)
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              background: 'var(--color-bg-base)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)'
            }}>
              <Phone size={16} className="text-secondary" />
              <input
                type="tel"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                style={{ flex: 1, outline: 'none', color: '#fff' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              PASSWORD (MIN 8 CHARS, 1 UPPERCASE, 1 NUMBER)
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              background: 'var(--color-bg-base)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)'
            }}>
              <Lock size={16} className="text-secondary" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ flex: 1, outline: 'none', color: '#fff' }}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} icon={<ArrowRight size={18} />}>
            CREATE ACCOUNT
          </Button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            ALREADY REGISTERED?{' '}
            <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
              LOG IN HERE
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
