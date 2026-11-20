import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import './CartDrawer.css';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalItemsCount,
    subtotal,
    freeShippingThreshold
  } = useCart();
  const navigate = useNavigate();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="pxs-drawer-overlay fade-in" onClick={() => setIsCartOpen(false)}>
      <aside
        className="pxs-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Your Shopping Bag"
      >
        {/* Drawer Header */}
        <div className="pxs-drawer__header">
          <div className="pxs-drawer__header-title">
            <ShoppingBag size={20} className="text-lime" />
            <h3>YOUR BAG ({totalItemsCount})</h3>
          </div>
          <button
            className="pxs-drawer__close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="pxs-drawer__meter">
          {amountNeededForFreeShipping > 0 ? (
            <p className="pxs-drawer__meter-text">
              ADD <strong className="text-lime">₹{amountNeededForFreeShipping}</strong> MORE FOR FREE JAIPUR DELIVERY
            </p>
          ) : (
            <p className="pxs-drawer__meter-text text-lime">
              ★ YOU UNLOCKED FREE JAIPUR EXPRESS DELIVERY!
            </p>
          )}
          <div className="pxs-drawer__meter-bar" role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">
            <div className="pxs-drawer__meter-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="pxs-drawer__items">
          {items.length === 0 ? (
            <div className="pxs-drawer__empty">
              <ShoppingBag size={48} className="text-secondary" />
              <p className="pxs-drawer__empty-title">YOUR BAG IS EMPTY</p>
              <p className="pxs-drawer__empty-sub">Explore our Jaipur drop before limited sizes sell out.</p>
              <Button
                variant="primary"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
              >
                SHOP NEW DROP
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variantId} className="pxs-drawer__item">
                <Link
                  to={`/product/${item.slug}`}
                  onClick={() => setIsCartOpen(false)}
                  className="pxs-drawer__item-img-wrap"
                >
                  <img src={item.image} alt={item.title} className="pxs-drawer__item-img" />
                </Link>

                <div className="pxs-drawer__item-details">
                  <div className="pxs-drawer__item-top">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="pxs-drawer__item-title"
                    >
                      {item.title}
                    </Link>
                    <button
                      className="pxs-drawer__item-del"
                      onClick={() => removeFromCart(item.variantId)}
                      aria-label={`Remove ${item.title} from bag`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <span className="badge-outline">SIZE: {item.size}</span>

                  <div className="pxs-drawer__item-bottom">
                    {/* Quantity Controls */}
                    <div className="pxs-drawer__qty-group">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="pxs-drawer__item-price">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Checkout CTA */}
        {items.length > 0 && (
          <div className="pxs-drawer__footer">
            <div className="pxs-drawer__subtotal-row">
              <span>SUBTOTAL</span>
              <span className="pxs-drawer__subtotal-val">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="pxs-drawer__tax-note">
              Shipping & taxes calculated at checkout. Real prices recalculated on server.
            </p>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              icon={<ArrowRight size={18} />}
            >
              CHECKOUT NOW
            </Button>

            <Link
              to="/cart"
              onClick={() => setIsCartOpen(false)}
              className="pxs-drawer__view-cart-link"
            >
              VIEW FULL BAG
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
