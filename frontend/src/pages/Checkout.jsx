import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { api } from '../services/api';
import './Checkout.css';

export function Checkout() {
  const { items, subtotal, shippingFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: user?.phone || '',
    streetAddress: '',
    landmark: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    postalCode: '302017'
  });

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // 'RAZORPAY' or 'COD'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (items.length === 0) {
    return (
      <div className="container py-24 text-center">
        <h2>YOUR BAG IS EMPTY</h2>
        <p className="text-secondary my-4">Add limited drops before proceeding to checkout.</p>
        <Link to="/shop">
          <Button variant="primary">GO TO SHOP</Button>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isJaipurPincode = formData.postalCode.trim().startsWith('302');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // Client UX Validation
      if (!formData.fullName.trim()) throw new Error('Please enter your full delivery name.');
      if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) throw new Error('Please enter a valid 10-digit Indian mobile number.');
      if (!/^\d{6}$/.test(formData.postalCode.trim())) throw new Error('Please enter a valid 6-digit Indian PIN code.');
      if (paymentMethod === 'COD' && !isJaipurPincode) {
        throw new Error('Cash on Delivery (COD) is currently exclusive to Jaipur PIN codes (302xxx). Please select Online Payment.');
      }

      // Generate Idempotency Key to prevent double-clicks
      const idempotencyKey = `idem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const orderPayload = {
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          streetAddress: formData.streetAddress,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode
        },
        items: items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        })),
        paymentMethod
      };

      // 1. Create Order on Server (Server recalculates prices and reserves stock)
      const orderRes = await api.createOrder(orderPayload, idempotencyKey);
      const createdOrder = orderRes.data;

      // 2. Handle Payment Method
      if (paymentMethod === 'COD') {
        clearCart();
        navigate('/order-success', { state: { order: createdOrder } });
      } else {
        // Online Payment Flow (Razorpay)
        const razorpayOrderRes = await api.createRazorpayOrder(createdOrder.id);
        const rzpData = razorpayOrderRes.data;

        // Check if Razorpay Checkout SDK is loaded
        if (window.Razorpay && rzpData.keyId && !rzpData.keyId.includes('placeholder')) {
          const options = {
            key: rzpData.keyId,
            amount: rzpData.amount,
            currency: rzpData.currency,
            name: 'PXS Streetwear Jaipur',
            description: `Order #${createdOrder.orderNumber}`,
            order_id: rzpData.razorpayOrderId,
            handler: async (response) => {
              try {
                // Verify signature on server
                await api.verifyRazorpayPayment({
                  orderId: createdOrder.id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                });
                clearCart();
                navigate('/order-success', { state: { order: { ...createdOrder, orderStatus: 'CONFIRMED' } } });
              } catch (verifyErr) {
                setErrorMsg(verifyErr.message || 'Payment signature verification failed.');
              }
            },
            prefill: {
              name: formData.fullName,
              email: formData.email,
              contact: formData.phone
            },
            theme: {
              color: '#C7F36B'
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Local Developer Sandbox Verification Simulator
          // In local dev without live gateway credentials, verify the sandbox order cleanly!
          const simSignature = `sim_sig_${Date.now()}`;
          const simPaymentId = `pay_sim_${Date.now()}`;
          await api.verifyRazorpayPayment({
            orderId: createdOrder.id,
            razorpayOrderId: rzpData.razorpayOrderId,
            razorpayPaymentId: simPaymentId,
            razorpaySignature: simSignature
          });

          clearCart();
          navigate('/order-success', { state: { order: { ...createdOrder, orderStatus: 'CONFIRMED' } } });
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pxs-checkout container fade-in">
      <div className="pxs-checkout__header">
        <Link to="/cart" className="pxs-checkout__back">
          <ArrowLeft size={16} /> RETURN TO BAG
        </Link>
        <h1 className="pxs-checkout__title">CHECKOUT</h1>
      </div>

      {errorMsg && (
        <div className="pxs-checkout__alert fade-in">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="pxs-checkout__layout">
        {/* Left Form: Delivery Address & Payment Mode */}
        <div className="pxs-checkout__main">
          {/* Section 1: Contact Details */}
          <div className="pxs-checkout-box">
            <h3 className="pxs-checkout-box__title">1. CONTACT DETAILS</h3>
            <div className="pxs-form-grid">
              <div className="pxs-form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="pxs-form-field">
                <label>Mobile Number (WhatsApp Enabled)</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={10}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="pxs-checkout-box">
            <h3 className="pxs-checkout-box__title">2. SHIPPING ADDRESS</h3>
            <div className="pxs-form-grid">
              <div className="pxs-form-field full-width">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Recipient Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="pxs-form-field full-width">
                <label>Street Address / Apartment / House No.</label>
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="e.g. 42, Malviya Nagar, Near Gaurav Tower"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="pxs-form-field">
                <label>Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  placeholder="e.g. Near World Trade Park"
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>

              <div className="pxs-form-field">
                <label>PIN Code (6 Digits)</label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="302017"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  maxLength={6}
                  required
                />
              </div>

              <div className="pxs-form-field">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="pxs-form-field">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="pxs-checkout-box">
            <h3 className="pxs-checkout-box__title">3. PAYMENT METHOD</h3>
            <div className="pxs-payment-options">
              {/* Option 1: Razorpay Online */}
              <label className={`pxs-payment-card ${paymentMethod === 'RAZORPAY' ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => setPaymentMethod('RAZORPAY')}
                />
                <div className="pxs-payment-card__content">
                  <div className="pxs-payment-card__header">
                    <CreditCard size={20} className="text-lime" />
                    <span className="font-bold">Online Payment (Razorpay)</span>
                    <span className="badge-lime ml-auto">RECOMMENDED</span>
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    UPI (Google Pay, PhonePe, Paytm), RuPay & Cards, Netbanking. Instant confirmation and fastest dispatch.
                  </p>
                </div>
              </label>

              {/* Option 2: Cash on Delivery */}
              <label className={`pxs-payment-card ${paymentMethod === 'COD' ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <div className="pxs-payment-card__content">
                  <div className="pxs-payment-card__header">
                    <Banknote size={20} className="text-secondary" />
                    <span className="font-bold">Cash on Delivery (Jaipur Only)</span>
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    Pay with cash at your doorstep. We will send a 1-minute WhatsApp address verification before dispatching.
                  </p>
                  {!isJaipurPincode && (
                    <p className="text-xs text-danger mt-1">
                      ⚠️ COD is currently restricted to Jaipur PIN codes (302xxx).
                    </p>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary */}
        <aside className="pxs-checkout__sidebar">
          <div className="pxs-summary-card">
            <h3 className="pxs-summary-title">YOUR ORDER</h3>

            <div className="pxs-checkout__mini-items">
              {items.map((item) => (
                <div key={item.variantId} className="pxs-checkout__mini-item">
                  <img src={item.image} alt={item.title} />
                  <div className="flex-1">
                    <p className="text-xs font-bold">{item.title}</p>
                    <p className="text-xs text-secondary">Size: {item.size} × {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pxs-summary-divider" />

            <div className="pxs-summary-row">
              <span className="text-secondary">Subtotal</span>
              <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="pxs-summary-row">
              <span className="text-secondary">Shipping</span>
              <span className="font-bold">
                {shippingFee === 0 ? <span className="text-lime">FREE</span> : `₹${shippingFee}`}
              </span>
            </div>

            <div className="pxs-summary-divider" />

            <div className="pxs-summary-row pxs-summary-total">
              <span>Total Payable</span>
              <span className="text-lime font-extrabold text-xl">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={paymentMethod === 'COD' && !isJaipurPincode}
            >
              {paymentMethod === 'COD' ? 'CONFIRM COD ORDER' : `PAY ₹${totalAmount.toLocaleString('en-IN')}`}
            </Button>

            <div className="pxs-checkout__secure-note">
              <ShieldCheck size={16} className="text-lime" />
              <span>256-bit Encrypted · Real-Time Stock Lock</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
