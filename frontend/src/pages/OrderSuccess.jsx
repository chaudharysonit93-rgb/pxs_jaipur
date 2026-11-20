import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

export function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="container py-20 fade-in" style={{ maxWidth: '640px' }}>
      <div style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xs)',
        padding: 'var(--space-2xl)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'rgba(199, 243, 107, 0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-lg)'
        }}>
          <CheckCircle2 size={36} className="text-lime" />
        </div>

        <span className="badge-lime mb-2">ORDER CONFIRMED</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: '8px 0 16px' }}>
          THANK YOU FOR YOUR ORDER
        </h1>

        <p className="text-secondary text-sm mb-6">
          Your order has been recorded into the PXS archive. We are preparing your box at our Jaipur studio.
        </p>

        {order && (
          <div style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xs)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-xl)',
            textAlign: 'left',
            fontSize: 'var(--text-xs)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="text-secondary">ORDER NUMBER:</span>
              <strong className="text-lime font-mono">{order.orderNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="text-secondary">PAYMENT METHOD:</span>
              <strong>{order.paymentMethod === 'COD' ? 'CASH ON DELIVERY (JAIPUR)' : 'ONLINE PREPAID'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="text-secondary">STATUS:</span>
              <strong>{order.orderStatus}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">ESTIMATED JAIPUR DISPATCH:</span>
              <strong className="text-lime">Within 24-48 Hours</strong>
            </div>
          </div>
        )}

        {order?.paymentMethod === 'COD' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(199, 243, 107, 0.08)',
            border: '1px solid var(--color-border-accent)',
            padding: '12px',
            borderRadius: 'var(--radius-xs)',
            marginBottom: 'var(--space-xl)',
            textAlign: 'left',
            fontSize: 'var(--text-xs)'
          }}>
            <MessageCircle size={24} className="text-lime flex-shrink-0" />
            <span>
              <strong>COD Verification:</strong> Our team will send a fast WhatsApp message to your phone ({order?.customerPhone || 'provided mobile'}) to confirm delivery address before parcel leaves Jaipur studio.
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={order ? `/track-order?orderNumber=${order.orderNumber}` : '/track-order'}>
            <Button variant="secondary" icon={<PackageCheck size={18} />}>
              TRACK THIS ORDER
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="primary" icon={<ArrowRight size={18} />}>
              CONTINUE SHOPPING
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
