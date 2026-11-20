import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X, Search, ShieldAlert } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="pxs-header">
      <div className="container pxs-header__inner">
        {/* Mobile Hamburger Toggle */}
        <button
          className="pxs-header__mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="pxs-header__logo" aria-label="PXS Home">
          <span className="pxs-header__logo-text">PXS</span>
          <span className="pxs-header__logo-sub">JAIPUR</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="pxs-header__nav" aria-label="Main Navigation">
          <Link to="/shop" className="pxs-header__nav-link">ALL SHIRTS</Link>
          <Link to="/shop?category=solids" className="pxs-header__nav-link">SOLIDS</Link>
          <Link to="/shop?category=prints" className="pxs-header__nav-link">PRINTS</Link>
          <Link to="/shop?category=checks-stripes" className="pxs-header__nav-link">CHECKS & STRIPES</Link>
          <Link to="/about" className="pxs-header__nav-link">ABOUT</Link>
          {isAdmin && (
            <Link to="/admin" className="pxs-header__admin-pill">
              <ShieldAlert size={14} /> ADMIN
            </Link>
          )}
        </nav>

        {/* Right Actions: Search, Wishlist, Account, Bag */}
        <div className="pxs-header__actions">
          {/* Search Toggle */}
          <button
            className="pxs-header__action-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search catalog"
          >
            <Search size={20} />
          </button>

          {/* Wishlist Link */}
          <Link to="/wishlist" className="pxs-header__action-btn" aria-label="View Wishlist">
            <Heart size={20} />
            {wishlistCount > 0 && <span className="pxs-header__badge">{wishlistCount}</span>}
          </Link>

          {/* Account Link */}
          <Link
            to={user ? '/account' : '/login'}
            className="pxs-header__action-btn"
            aria-label={user ? 'Your Account' : 'Log in'}
          >
            <User size={20} />
          </Link>

          {/* Cart Bag Drawer Trigger */}
          <button
            className="pxs-header__action-btn pxs-header__cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Shopping bag containing ${totalItemsCount} items`}
          >
            <ShoppingBag size={20} />
            {totalItemsCount > 0 && <span className="pxs-header__badge">{totalItemsCount}</span>}
          </button>
        </div>
      </div>

      {/* Slide-Down Instant Search Bar */}
      {isSearchOpen && (
        <div className="pxs-header__search-bar fade-in">
          <div className="container">
            <form onSubmit={handleSearchSubmit} className="pxs-header__search-form">
              <Search size={18} className="pxs-header__search-icon" />
              <input
                type="text"
                placeholder="SEARCH CUBAN COLLARS, PRINTS, RAYON SHIRTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="badge-lime">SEARCH</button>
              <button
                type="button"
                className="pxs-header__search-close"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Slide-Out Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="pxs-header__mobile-menu fade-in">
          <nav className="pxs-header__mobile-nav">
            <Link to="/shop" className="pxs-header__mobile-link">ALL SHIRTS</Link>
            <Link to="/shop?category=solids" className="pxs-header__mobile-link">SOLIDS</Link>
            <Link to="/shop?category=prints" className="pxs-header__mobile-link">PRINTS</Link>
            <Link to="/shop?category=checks-stripes" className="pxs-header__mobile-link">CHECKS & STRIPES</Link>
            <Link to="/track-order" className="pxs-header__mobile-link">TRACK ORDER</Link>
            <Link to="/about" className="pxs-header__mobile-link">ABOUT PXS</Link>
            <Link to="/contact" className="pxs-header__mobile-link">CONTACT & JAIPUR STUDIO</Link>
            {isAdmin && (
              <Link to="/admin" className="pxs-header__mobile-link text-lime">
                ★ ADMIN DASHBOARD
              </Link>
            )}
          </nav>
          <div className="pxs-header__mobile-footer">
            <p className="pxs-header__mobile-manifesto">"NOT MADE TO BLEND IN."</p>
            <p className="text-secondary text-xs">CRAFTED & CURATED IN JAIPUR, RJ</p>
          </div>
        </div>
      )}
    </header>
  );
}
