import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';

export function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="container py-24 text-center fade-in">
        <Heart size={56} className="text-secondary mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">YOUR WISHLIST IS EMPTY</h1>
        <p className="text-secondary mb-6">Save your favorite silhouettes before limited drops sell out.</p>
        <Link to="/shop">
          <Button variant="primary">EXPLORE SHIRTS</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-16 fade-in">
      <div className="mb-8 border-b border-border pb-4">
        <span className="badge-lime mb-2">SAVED ARCHIVE</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
          YOUR WISHLIST ({wishlist.length})
        </h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px'
      }}>
        {wishlist.map((item) => (
          <div key={item.id} style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xs)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Link to={`/product/${item.slug}`} style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#222' }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Link>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <p className="text-secondary text-xs">{item.fabric}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, margin: '4px 0 8px' }}>
                  {item.title}
                </h3>
                <p className="font-bold text-accent text-lg">₹{item.price.toLocaleString('en-IN')}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <Link to={`/product/${item.slug}`} style={{ flex: 1 }}>
                  <Button variant="primary" size="sm" fullWidth>SELECT SIZE</Button>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleWishlist(item)}
                  style={{
                    padding: '8px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--color-danger)'
                  }}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
