import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Package, LogOut, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export function Account() {
  const { user, logout, loading: authLoading, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      api.getMyOrders()
        .then(res => setOrders(res.data || []))
        .catch(err => console.warn('Could not load orders:', err))
        .finally(() => setOrdersLoading(false));
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || !user) {
    return <div className="container py-20 text-center">Checking credentials...</div>;
  }

  return (
    <div className="container py-16 fade-in" style={{ maxWidth: '880px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
        <div>
          <span className="badge-lime mb-2">PXS MEMBER</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
            YOUR ACCOUNT
          </h1>
          <p className="text-secondary text-sm">{user.email} · {user.phone}</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="secondary" icon={<ShieldAlert size={16} />}>ADMIN PANEL</Button>
            </Link>
          )}
          <Button variant="ghost" onClick={handleLogout} icon={<LogOut size={16} />}>
            LOGOUT
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        {/* Orders History */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
            ORDER ARCHIVE ({orders.length})
          </h2>

          {ordersLoading ? (
            <p className="text-secondary">Retrieving your shipments...</p>
          ) : orders.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)'
            }}>
              <Package size={40} className="text-secondary mx-auto mb-3" />
              <p className="font-bold mb-1">NO ORDERS YET</p>
              <p className="text-secondary text-xs mb-4">Discover our limited drops before inventory exhausts.</p>
              <Link to="/shop">
                <Button variant="primary">BROWSE CATALOG</Button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((ord) => (
                <div key={ord.id} style={{
                  padding: '20px',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <span className="text-xs text-secondary font-mono">{ord.order_number}</span>
                      <p className="text-xs text-secondary mt-1">Placed on {new Date(ord.created_at).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge-lime">{ord.order_status}</span>
                      <p className="font-bold text-sm mt-1">₹{Number(ord.total_amount).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Line items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ord.items?.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
                        <span>{item.product_title} (Size: {item.size}) × {item.quantity}</span>
                        <span className="text-secondary">₹{Number(item.total_price).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/track-order?orderNumber=${ord.order_number}`}>
                      <Button variant="secondary" size="sm">TRACK SHIPMENT</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
