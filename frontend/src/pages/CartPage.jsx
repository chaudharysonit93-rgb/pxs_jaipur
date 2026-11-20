import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import './CartPage.css';

export function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    totalAmount,
    freeShippingThreshold
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container py-24 text-center fade-in">
        <ShoppingBag size={56} className="text-secondary mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">YOUR SHOPPING BAG IS EMPTY</h1>
        <p className="text-secondary mb-6">Explore the latest drops before limited sizes sell out.</p>
        <Link to="/shop">
          <Button variant="primary" size="lg">EXPLORE ALL SHIRTS</Button>
        </Link>
      </div>
    );
  }

  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="pxs-cart-page container fade-in">
      <h1 className="pxs-cart-page__title">YOUR SHOPPING BAG</h1>

      {amountNeeded > 0 ? (
        <div className="pxs-cart-page__free-alert">
          <Truck size={18} className="text-lime" />
          <span>Add <strong>₹{amountNeeded}</strong> more to qualify for <strong>FREE JAIPUR DELIVERY</strong></span>
        </div>
      ) : (
        <div className="pxs-cart-page__free-alert is-free">
          <Truck size={18} className="text-lime" />
          <span className="text-lime font-bold">YOU UNLOCKED FREE JAIPUR EXPRESS DELIVERY!</span>
        </div>
      )}

      <div className="pxs-cart-page__grid">
        {/* Items List */}
        <div className="pxs-cart-page__items">
          {items.map((item) => (
            <div key={item.variantId} className="pxs-cart-item">
              <Link to={`/product/${item.slug}`} className="pxs-cart-item__img-wrap">
                <img src={item.image} alt={item.title} className="pxs-cart-item__img" />
              </Link>

              <div className="pxs-cart-item__info">
                <div className="pxs-cart-item__header">
                  <Link to={`/product/${item.slug}`} className="pxs-cart-item__title">
                    {item.title}
                  </Link>
                  <button
                    type="button"
                    className="pxs-cart-item__remove"
                    onClick={() => removeFromCart(item.variantId)}
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <span className="badge-outline">SIZE: {item.size}</span>

                <div className="pxs-cart-item__footer">
                  <div className="pxs-cart-item__qty">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <span className="pxs-cart-item__total">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="pxs-cart-page__summary">
          <div className="pxs-summary-card">
            <h3 className="pxs-summary-title">ORDER SUMMARY</h3>

            <div className="pxs-summary-row">
              <span className="text-secondary">Subtotal</span>
              <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="pxs-summary-row">
              <span className="text-secondary">Estimated Shipping</span>
              <span className="font-bold">
                {shippingFee === 0 ? <span className="text-lime">FREE</span> : `₹${shippingFee}`}
              </span>
            </div>

            <div className="pxs-summary-divider" />

            <div className="pxs-summary-row pxs-summary-total">
              <span>Estimated Total</span>
              <span className="text-lime font-extrabold text-xl">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="pxs-summary-note">
              Prices recalculated by the server upon checkout. We accept Razorpay (UPI, RuPay, Cards) and Cash on Delivery in Jaipur.
            </p>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => navigate('/checkout')}
              icon={<ArrowRight size={18} />}
            >
              PROCEED TO CHECKOUT
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
