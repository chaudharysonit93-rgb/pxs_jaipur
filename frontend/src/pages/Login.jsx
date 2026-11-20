import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
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
          <span className="badge-lime mb-2">PXS ARCHIVE ACCESS</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800 }}>
            LOG IN TO YOUR ACCOUNT
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
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, outline: 'none', color: '#fff' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              PASSWORD
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ flex: 1, outline: 'none', color: '#fff' }}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} icon={<ArrowRight size={18} />}>
            SIGN IN
          </Button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            DON'T HAVE AN ACCOUNT?{' '}
            <Link to="/signup" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
              CREATE ONE HERE
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
