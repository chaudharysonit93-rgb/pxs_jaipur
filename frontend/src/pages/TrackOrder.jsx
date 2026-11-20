import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, Home } from 'lucide-react';
import { Button } from '../components/common/Button';
import { api } from '../services/api';

export function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = (num) => {
    if (!num.trim()) return;
    setLoading(true);
    setError(null);

    api.trackOrder(num.trim())
      .then((res) => {
        if (res.data) setOrder(res.data);
      })
      .catch((err) => {
        setError(err.message || 'No order found with this order number.');
        setOrder(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const num = searchParams.get('orderNumber');
    if (num) {
      setOrderNumber(num);
      fetchOrder(num);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOrder(orderNumber);
  };

  // Stepper logic
  const steps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed / Verified', icon: CheckCircle2 },
    { key: 'PACKED', label: 'Packed at Studio', icon: Package },
    { key: 'SHIPPED', label: 'Out with Courier', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: Home }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING':
      case 'PENDING_CONFIRMATION':
        return 0;
      case 'CONFIRMED':
      case 'VERIFIED_COD':
        return 1;
      case 'PACKED':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.order_status) : -1;

  return (
    <div className="container py-16 fade-in" style={{ maxWidth: '720px' }}>
      <div className="text-center mb-8">
        <span className="badge-lime mb-2">PXS LIVE TRACKER</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
          TRACK YOUR DISPATCH
        </h1>
        <p className="text-secondary text-sm mt-1">
          Enter your PXS Order Number (found in your confirmation email or order receipt).
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '8px',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        padding: '8px',
        borderRadius: 'var(--radius-xs)',
        marginBottom: 'var(--space-2xl)'
      }}>
        <input
          type="text"
          placeholder="e.g. PXS-202611-1234"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
          style={{ flex: 1, padding: '10px 14px', outline: 'none', color: '#fff', letterSpacing: '0.05em' }}
          required
        />
        <Button type="submit" variant="primary" loading={loading} icon={<Search size={16} />}>
          LOOKUP
        </Button>
      </form>

      {error && (
        <div style={{
          padding: '16px',
          background: 'rgba(255, 77, 77, 0.15)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-xs)',
          color: 'var(--color-danger)',
          fontSize: 'var(--text-sm)',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {order && (
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xs)',
          padding: 'var(--space-xl)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '24px' }}>
            <div>
              <span className="text-xs text-secondary">ORDER</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-accent)' }}>
                {order.order_number}
              </h3>
            </div>
            <span className="badge-lime">{order.order_status}</span>
          </div>

          {/* Stepper */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '32px 0 40px' }}>
            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isDone = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={st.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
                    color: isDone ? '#111' : 'var(--color-text-secondary)',
                    border: `2px solid ${isCurrent ? '#fff' : isDone ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px'
                  }}>
                    <Icon size={18} />
                  </div>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: isDone ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    textTransform: 'uppercase'
                  }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Items Summary */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '0.1em', marginBottom: '12px' }}>
              ITEMS IN THIS SHIPMENT
            </h4>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: '8px' }}>
                <span>{item.product_title} ({item.size}) × {item.quantity}</span>
                <span className="font-bold">₹{item.total_price.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
