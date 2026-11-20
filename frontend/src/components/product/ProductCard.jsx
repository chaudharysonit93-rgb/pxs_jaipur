import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

export function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.primary_image || product.images?.[0]?.image_url;
  const isLowStock = product.totalStock > 0 && product.totalStock <= 3;
  const isSoldOut = product.totalStock === 0;

  const handleQuickAdd = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    addToCart(product, size, 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <article className="pxs-card group">
      <Link to={`/product/${product.slug}`} className="pxs-card__link">
        {/* Media Container */}
        <div className="pxs-card__media">
          <img
            src={primaryImage}
            alt={product.title}
            loading="lazy"
            className="pxs-card__img"
          />

          {/* Badges */}
          <div className="pxs-card__badges">
            {isSoldOut ? (
              <span className="badge-outline">SOLD OUT</span>
            ) : isLowStock ? (
              <span className="badge-lime">ONLY {product.totalStock} LEFT</span>
            ) : (
              <span className="badge-outline">{product.category_name || 'STREETWEAR'}</span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            className={`pxs-card__wishlist-btn ${isFavorited ? 'is-active' : ''}`}
            onClick={handleWishlistClick}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart size={18} fill={isFavorited ? '#C7F36B' : 'transparent'} stroke={isFavorited ? '#C7F36B' : '#F3F0E9'} />
          </button>

          {/* Quick Size Selector Bar (Reveals on Hover / Always accessible on mobile) */}
          {!isSoldOut && product.variants?.length > 0 && (
            <div className="pxs-card__quick-sizes" onClick={(e) => e.preventDefault()}>
              <span className="pxs-card__quick-label">QUICK ADD:</span>
              <div className="pxs-card__size-pills">
                {product.variants.map((v) => (
                  <button
                    key={v.id || v.size}
                    type="button"
                    disabled={v.stock <= 0}
                    className={`pxs-card__size-pill ${v.stock <= 0 ? 'is-disabled' : ''}`}
                    onClick={(e) => handleQuickAdd(e, v.size)}
                    aria-label={`Add size ${v.size} to bag`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="pxs-card__info">
          <p className="pxs-card__fabric">{product.fabric}</p>
          <h3 className="pxs-card__title">{product.title}</h3>
          
          <div className="pxs-card__pricing">
            <span className="pxs-card__price">₹{Number(product.base_price).toLocaleString('en-IN')}</span>
            <span className="pxs-card__mrp">₹{Math.round(Number(product.base_price) * 1.85).toLocaleString('en-IN')}</span>
            <span className="pxs-card__fit">{product.fit}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
