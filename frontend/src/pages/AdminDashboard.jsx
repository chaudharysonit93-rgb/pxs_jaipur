import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle2,
  Copy,
  MessageCircle,
  RefreshCw,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import './AdminDashboard.css';

export function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'inventory', 'stats'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // Filter States
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, authLoading, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, invRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(`?status=${orderStatusFilter}&search=${encodeURIComponent(searchQuery)}`),
        api.getAdminInventory()
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setInventory(invRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, orderStatusFilter, searchQuery]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleStockUpdate = async (variantId, newStock) => {
    try {
      await api.updateStock(variantId, newStock);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update stock');
    }
  };

  const copyShippingAddress = (order) => {
    const addr = order.shippingAddress;
    const text = `RECIPIENT: ${addr.fullName}\nPHONE: ${addr.phone}\nADDRESS: ${addr.streetAddress}${addr.landmark ? ', ' + addr.landmark : ''}\nCITY: ${addr.city}, ${addr.state} - ${addr.postalCode}\nPAYMENT: ${order.payment_method === 'COD' ? `COD - COLLECT ₹${order.total_amount}` : 'PREPAID - DO NOT COLLECT'}\nITEMS: ${order.items?.map(i => `${i.quantity}x ${i.product_title} (${i.size})`).join(', ')}`;
    
    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openWhatsApp = (order) => {
    const addr = order.shippingAddress;
    const phone = addr.phone.replace(/\D/g, '');
    const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const itemNames = order.items?.map(i => `${i.quantity}x ${i.product_title} (${i.size})`).join(', ');
    
    const message = encodeURIComponent(
      `Hi ${addr.fullName}, this is PXS Jaipur! We received your Cash on Delivery order for ${itemNames}. Please reply "YES" to confirm your address (${addr.streetAddress}, ${addr.city} - ${addr.postalCode}) so we can dispatch your parcel today!`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  if (authLoading || !isAdmin) {
    return <div className="container py-20 text-center">Verifying administrative clearance...</div>;
  }

  return (
    <div className="pxs-admin container fade-in">
      {/* Admin Header */}
      <div className="pxs-admin__header">
        <div>
          <span className="badge-lime">JAIPUR OPERATIONS</span>
          <h1 className="pxs-admin__title">PXS ADMIN DASHBOARD</h1>
          <p className="text-secondary text-xs">Logged in as {user?.email} (Admin)</p>
        </div>

        <div className="pxs-admin__nav-tabs">
          <button
            className={`pxs-admin__tab ${activeTab === 'orders' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            ORDERS ({orders.length})
          </button>
          <button
            className={`pxs-admin__tab ${activeTab === 'inventory' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            INVENTORY ({inventory.length})
          </button>
          <button
            className={`pxs-admin__tab ${activeTab === 'stats' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            METRICS & REVENUE
          </button>
          <button
            className="pxs-admin__tab"
            onClick={loadData}
            title="Refresh live data"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      {stats && (
        <div className="pxs-admin__stat-grid">
          <div className="pxs-admin__stat-card">
            <span className="text-secondary text-xs font-bold">TOTAL REVENUE</span>
            <p className="pxs-admin__stat-value text-lime">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="pxs-admin__stat-card">
            <span className="text-secondary text-xs font-bold">TOTAL ORDERS</span>
            <p className="pxs-admin__stat-value">{stats.totalOrders}</p>
          </div>
          <div className="pxs-admin__stat-card">
            <span className="text-secondary text-xs font-bold">LOW STOCK ALERTS</span>
            <p className="pxs-admin__stat-value text-danger">{stats.lowStockAlerts?.length || 0}</p>
          </div>
        </div>
      )}

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="pxs-admin__section">
          {/* Controls */}
          <div className="pxs-admin__filter-bar">
            <div className="pxs-admin__search-box">
              <Search size={16} className="text-secondary" />
              <input
                type="text"
                placeholder="Search by order #, phone, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="pxs-admin__filter-select"
            >
              <option value="">ALL STATUSES</option>
              <option value="PENDING_CONFIRMATION">COD PENDING CONFIRMATION</option>
              <option value="CONFIRMED">PAID / CONFIRMED</option>
              <option value="PACKED">PACKED AT STUDIO</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {loading ? (
            <p className="text-secondary py-8 text-center">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-secondary">No orders matching this filter.</div>
          ) : (
            <div className="pxs-admin__order-list">
              {orders.map((ord) => (
                <div key={ord.id} className="pxs-admin__order-card">
                  {/* Top Bar */}
                  <div className="pxs-admin__order-top">
                    <div>
                      <span className="text-xs text-secondary font-mono">{ord.order_number}</span>
                      <h4 className="font-bold text-sm">{ord.shippingAddress?.fullName} ({ord.customer_phone})</h4>
                      <p className="text-xs text-secondary">
                        {ord.shippingAddress?.streetAddress}, {ord.shippingAddress?.city} - {ord.shippingAddress?.postalCode}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`badge-${ord.payment_method === 'COD' ? 'outline' : 'lime'}`}>
                        {ord.payment_method}
                      </span>
                      <p className="font-extrabold text-lime mt-1">₹{Number(ord.total_amount).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="pxs-admin__order-items">
                    {ord.items?.map((it) => (
                      <span key={it.id} className="badge-outline">
                        {it.product_title} ({it.size}) × {it.quantity}
                      </span>
                    ))}
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="pxs-admin__order-actions">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-secondary font-bold">STATUS:</span>
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="pxs-admin__status-select"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PENDING_CONFIRMATION">PENDING_CONFIRMATION</option>
                        <option value="VERIFIED_COD">VERIFIED_COD</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED (RESTOCK)</option>
                      </select>
                    </div>

                    <div className="pxs-admin__quick-btns">
                      {ord.payment_method === 'COD' && (
                        <button
                          type="button"
                          className="pxs-admin__btn-whatsapp"
                          onClick={() => openWhatsApp(ord)}
                          title="Open WhatsApp with prefilled confirmation message"
                        >
                          <MessageCircle size={14} /> WHATSAPP
                        </button>
                      )}

                      <button
                        type="button"
                        className="pxs-admin__btn-copy"
                        onClick={() => copyShippingAddress(ord)}
                        title="Copy formatted address for shipping label"
                      >
                        <Copy size={14} />
                        {copiedId === ord.id ? 'COPIED!' : 'COPY ADDR'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY MATRIX */}
      {activeTab === 'inventory' && (
        <div className="pxs-admin__section">
          <div className="pxs-admin__table-wrap">
            <table className="pxs-admin__table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>SKU</th>
                  <th>SIZE</th>
                  <th>CURRENT STOCK</th>
                  <th>PRICE</th>
                  <th>QUICK ADJUST</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.variant_id} className={item.stock <= 2 ? 'is-low-stock' : ''}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={item.primary_image} alt="" style={{ width: '32px', height: '40px', objectFit: 'cover' }} />
                        <span className="font-bold">{item.title}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs">{item.sku}</td>
                    <td><strong>{item.size}</strong></td>
                    <td>
                      <span className={item.stock <= 2 ? 'text-danger font-bold' : 'font-bold'}>
                        {item.stock} units
                      </span>
                    </td>
                    <td>₹{Number(item.base_price).toLocaleString('en-IN')}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="pxs-admin__stock-step-btn"
                          onClick={() => handleStockUpdate(item.variant_id, Math.max(0, item.stock - 1))}
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          className="pxs-admin__stock-step-btn"
                          onClick={() => handleStockUpdate(item.variant_id, item.stock + 1)}
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          className="pxs-admin__stock-step-btn"
                          onClick={() => handleStockUpdate(item.variant_id, item.stock + 5)}
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STATS & ALERTS */}
      {activeTab === 'stats' && stats && (
        <div className="pxs-admin__section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="pxs-admin__box">
              <h3 className="font-display font-bold text-lg mb-4 text-lime">ORDERS BY STATUS</h3>
              {stats.statusBreakdown?.map((st) => (
                <div key={st.order_status} className="flex justify-between py-2 border-b border-border text-sm">
                  <span>{st.order_status}</span>
                  <strong className="text-lime">{st.count}</strong>
                </div>
              ))}
            </div>

            <div className="pxs-admin__box">
              <h3 className="font-display font-bold text-lg mb-4 text-danger">CRITICAL LOW STOCK (≤ 2)</h3>
              {stats.lowStockAlerts?.length === 0 ? (
                <p className="text-secondary text-sm">All sizes are adequately stocked.</p>
              ) : (
                stats.lowStockAlerts?.map((a) => (
                  <div key={a.id} className="flex justify-between py-2 border-b border-border text-sm">
                    <span>{a.title} ({a.size})</span>
                    <strong className="text-danger">{a.stock} remaining</strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
