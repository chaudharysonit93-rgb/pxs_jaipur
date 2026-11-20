import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, Ruler, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';
import './ProductDetail.css';

export function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.getProductBySlug(slug)
      .then((res) => {
        if (isMounted && res.data) {
          setProduct(res.data);
          // Auto-select first in-stock size
          const firstInStock = res.data.variants?.find(v => v.stock > 0);
          if (firstInStock) {
            setSelectedSize(firstInStock.size);
          }
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Product not found.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <p className="text-secondary">Loading shirt details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-16 text-center">
        <h2>SHIRT NOT FOUND</h2>
        <p className="text-secondary my-4">{error || 'This drop may have been archived.'}</p>
        <Link to="/shop">
          <Button variant="primary">BACK TO CATALOG</Button>
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images.map(img => img.image_url)
    : [product.primary_image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'];

  const currentVariant = product.variants?.find(v => v.size === selectedSize);
  const isSelectedOutOfStock = !currentVariant || currentVariant.stock <= 0;
  const isSelectedLowStock = currentVariant && currentVariant.stock > 0 && currentVariant.stock <= 2;
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize || isSelectedOutOfStock) return;
    addToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="pxs-pdp container fade-in">
      {/* Breadcrumb */}
      <nav className="pxs-pdp__breadcrumb">
        <Link to="/shop" className="pxs-pdp__back-link">
          <ArrowLeft size={16} /> BACK TO DROP
        </Link>
        <span>/</span>
        <span className="text-secondary">{product.category_name}</span>
        <span>/</span>
        <span className="text-primary">{product.title}</span>
      </nav>

      <div className="pxs-pdp__layout">
        {/* Gallery */}
        <div className="pxs-pdp__gallery">
          <div className="pxs-pdp__main-img-wrap">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="pxs-pdp__main-img"
            />
            {isSelectedLowStock && (
              <span className="badge-lime pxs-pdp__stock-badge">
                ONLY {currentVariant.stock} LEFT IN SIZE {selectedSize}!
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="pxs-pdp__thumbs">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`pxs-pdp__thumb-btn ${selectedImage === idx ? 'is-active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Purchase Controls */}
        <div className="pxs-pdp__info">
          <div className="pxs-pdp__category-badge">
            <span className="badge-outline">{product.category_name}</span>
            <span className="badge-outline">DELHI ARCHIVE SOURCING</span>
          </div>

          <h1 className="pxs-pdp__title">{product.title}</h1>

          <div className="pxs-pdp__price-wrap">
            <span className="pxs-pdp__price">₹{Number(product.base_price).toLocaleString('en-IN')}</span>
            <span className="pxs-pdp__mrp">₹{Math.round(Number(product.base_price) * 1.85).toLocaleString('en-IN')}</span>
            <span className="badge-lime">SAVE 45%</span>
          </div>

          <p className="pxs-pdp__desc">{product.description}</p>

          {/* Technical Specs */}
          <div className="pxs-pdp__specs">
            <div className="pxs-pdp__spec-row">
              <span className="text-secondary">FABRIC:</span>
              <span className="text-primary font-bold">{product.fabric}</span>
            </div>
            <div className="pxs-pdp__spec-row">
              <span className="text-secondary">FIT:</span>
              <span className="text-primary font-bold">{product.fit}</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="pxs-pdp__size-section">
            <div className="pxs-pdp__size-header">
              <span className="text-xs font-bold tracking-widest text-secondary">SELECT SIZE</span>
              <button
                type="button"
                className="pxs-pdp__size-guide-btn"
                onClick={() => setIsSizeGuideOpen(true)}
              >
                <Ruler size={14} /> SIZE GUIDE (IN / CM)
              </button>
            </div>

            <div className="pxs-pdp__size-grid">
              {['S', 'M', 'L', 'XL'].map((size) => {
                const variant = product.variants?.find(v => v.size === size);
                const isOutOfStock = !variant || variant.stock <= 0;
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={isOutOfStock}
                    className={`pxs-pdp__size-btn ${isSelected ? 'is-selected' : ''} ${isOutOfStock ? 'is-disabled' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <span>{size}</span>
                    {variant?.stock > 0 && variant.stock <= 2 && (
                      <span className="pxs-pdp__size-warn-dot" title="Low stock" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="pxs-pdp__actions">
            <div className="pxs-pdp__qty-selector">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(currentVariant?.stock || 5, quantity + 1))}
                disabled={quantity >= (currentVariant?.stock || 1)}
              >
                +
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSelectedOutOfStock}
              onClick={handleAddToCart}
              icon={<ShoppingBag size={18} />}
            >
              {isSelectedOutOfStock ? 'SOLD OUT IN THIS SIZE' : 'ADD TO BAG'}
            </Button>

            <button
              type="button"
              className={`pxs-pdp__wishlist-action ${isFavorited ? 'is-active' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle Wishlist"
            >
              <Heart size={20} fill={isFavorited ? '#C7F36B' : 'transparent'} stroke={isFavorited ? '#C7F36B' : '#F3F0E9'} />
            </button>
          </div>

          {addedToast && (
            <div className="pxs-pdp__toast fade-in">
              <Check size={16} className="text-lime" />
              <span>Added to your bag! Sizing reserved for 10 minutes.</span>
            </div>
          )}

          {/* Shipping & Perks Info */}
          <div className="pxs-pdp__perks-list">
            <div className="pxs-pdp__perk-item">
              <Truck size={18} className="text-lime" />
              <div>
                <p className="font-bold">Jaipur Same-Day / 24-48h Express Dispatch</p>
                <p className="text-secondary text-xs">Delivered directly from our Jaipur studio. Free on orders &gt; ₹999.</p>
              </div>
            </div>
            <div className="pxs-pdp__perk-item">
              <ShieldCheck size={18} className="text-lime" />
              <div>
                <p className="font-bold">Cash on Delivery Available (Jaipur PIN Codes)</p>
                <p className="text-secondary text-xs">Verify your parcel at your doorstep.</p>
              </div>
            </div>
            <div className="pxs-pdp__perk-item">
              <RefreshCw size={18} className="text-lime" />
              <div>
                <p className="font-bold">7-Day Hassle-Free Sizing Exchange</p>
                <p className="text-secondary text-xs">Exchange seamlessly if the cut doesn't fit your silhouette.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="pxs-modal-overlay fade-in" onClick={() => setIsSizeGuideOpen(false)}>
          <div className="pxs-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pxs-modal-header">
              <h3>PXS SHIRT SIZE GUIDE</h3>
              <button type="button" onClick={() => setIsSizeGuideOpen(false)}>✕</button>
            </div>
            <div className="pxs-modal-body">
              <p className="text-secondary text-sm mb-4">
                All PXS streetwear shirts feature a relaxed, dropped-shoulder boxy cut.
                If you prefer a tailored/regular fit, we recommend sizing down.
              </p>

              <table className="pxs-size-table">
                <thead>
                  <tr>
                    <th>SIZE</th>
                    <th>CHEST (IN)</th>
                    <th>LENGTH (IN)</th>
                    <th>SHOULDER (IN)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>S</strong></td>
                    <td>42"</td>
                    <td>28"</td>
                    <td>19.5"</td>
                  </tr>
                  <tr>
                    <td><strong>M</strong></td>
                    <td>44"</td>
                    <td>29"</td>
                    <td>20.5"</td>
                  </tr>
                  <tr>
                    <td><strong>L</strong></td>
                    <td>46"</td>
                    <td>30"</td>
                    <td>21.5"</td>
                  </tr>
                  <tr>
                    <td><strong>XL</strong></td>
                    <td>48"</td>
                    <td>31"</td>
                    <td>22.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
