import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { api } from '../services/api';
import './Shop.css';

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States from URL or defaults
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSize = searchParams.get('size') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const query = new URLSearchParams(searchParams);
    if (!query.has('limit')) query.set('limit', '24');

    api.getProducts(`?${query.toString()}`)
      .then((res) => {
        if (isMounted && res.data) {
          setProducts(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = currentCategory || currentSearch || currentSize || currentInStock || currentMinPrice || currentMaxPrice;

  return (
    <div className="pxs-shop container fade-in">
      {/* Top Header */}
      <div className="pxs-shop__header">
        <div>
          <span className="badge-lime">JAIPUR ARCHIVE</span>
          <h1 className="pxs-shop__title">
            {currentCategory ? currentCategory.toUpperCase().replace('-', ' & ') : 'ALL SHIRTS'}
          </h1>
          <p className="pxs-shop__count">
            {loading ? 'Scanning catalog...' : `Showing ${products.length} limited styles`}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="pxs-shop__controls">
          <button
            type="button"
            className="pxs-shop__mobile-filter-btn"
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Open filter options"
          >
            <SlidersHorizontal size={18} />
            <span>FILTERS</span>
            {hasActiveFilters && <span className="pxs-shop__active-dot" />}
          </button>

          <div className="pxs-shop__sort-wrap">
            <label htmlFor="shop-sort" className="sr-only">Sort by</label>
            <select
              id="shop-sort"
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="pxs-shop__sort-select"
            >
              <option value="newest">LATEST DROP</option>
              <option value="price_asc">PRICE: LOW TO HIGH</option>
              <option value="price_desc">PRICE: HIGH TO LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="pxs-shop__layout">
        {/* Desktop Sidebar Filters */}
        <aside className="pxs-shop__sidebar">
          {/* Category Filter */}
          <div className="pxs-filter-group">
            <h4 className="pxs-filter-group__title">CATEGORY</h4>
            <div className="pxs-filter-group__list">
              <button
                type="button"
                className={`pxs-filter-link ${!currentCategory ? 'is-active' : ''}`}
                onClick={() => updateParam('category', '')}
              >
                All Shirts
              </button>
              <button
                type="button"
                className={`pxs-filter-link ${currentCategory === 'solids' ? 'is-active' : ''}`}
                onClick={() => updateParam('category', 'solids')}
              >
                Cuban Solids
              </button>
              <button
                type="button"
                className={`pxs-filter-link ${currentCategory === 'prints' ? 'is-active' : ''}`}
                onClick={() => updateParam('category', 'prints')}
              >
                Street Prints
              </button>
              <button
                type="button"
                className={`pxs-filter-link ${currentCategory === 'checks-stripes' ? 'is-active' : ''}`}
                onClick={() => updateParam('category', 'checks-stripes')}
              >
                Checks & Stripes
              </button>
            </div>
          </div>

          {/* Size Filter */}
          <div className="pxs-filter-group">
            <h4 className="pxs-filter-group__title">SIZE</h4>
            <div className="pxs-filter-sizes">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`pxs-filter-size-btn ${currentSize === size ? 'is-active' : ''}`}
                  onClick={() => updateParam('size', currentSize === size ? '' : size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pxs-filter-group">
            <h4 className="pxs-filter-group__title">PRICE RANGE</h4>
            <div className="pxs-filter-group__list">
              <button
                type="button"
                className={`pxs-filter-link ${currentMaxPrice === '799' ? 'is-active' : ''}`}
                onClick={() => {
                  updateParam('minPrice', '');
                  updateParam('maxPrice', currentMaxPrice === '799' ? '' : '799');
                }}
              >
                Under ₹799
              </button>
              <button
                type="button"
                className={`pxs-filter-link ${currentMinPrice === '800' && currentMaxPrice === '899' ? 'is-active' : ''}`}
                onClick={() => {
                  if (currentMinPrice === '800') {
                    updateParam('minPrice', '');
                    updateParam('maxPrice', '');
                  } else {
                    updateParam('minPrice', '800');
                    updateParam('maxPrice', '899');
                  }
                }}
              >
                ₹800 – ₹899
              </button>
              <button
                type="button"
                className={`pxs-filter-link ${currentMinPrice === '900' ? 'is-active' : ''}`}
                onClick={() => {
                  updateParam('maxPrice', '');
                  updateParam('minPrice', currentMinPrice === '900' ? '' : '900');
                }}
              >
                ₹900 & Above
              </button>
            </div>
          </div>

          {/* In Stock Only Toggle */}
          <div className="pxs-filter-group">
            <label className="pxs-filter-toggle">
              <input
                type="checkbox"
                checked={currentInStock}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
              />
              <span>In-Stock Only</span>
            </label>
          </div>

          {hasActiveFilters && (
            <button type="button" className="pxs-filter-reset-btn" onClick={clearAllFilters}>
              <RotateCcw size={14} /> RESET ALL FILTERS
            </button>
          )}
        </aside>

        {/* Product Grid Area */}
        <main className="pxs-shop__content">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="pxs-shop__chips">
              {currentSearch && (
                <span className="badge-outline">
                  Search: "{currentSearch}" <X size={12} onClick={() => updateParam('search', '')} />
                </span>
              )}
              {currentCategory && (
                <span className="badge-outline">
                  Category: {currentCategory} <X size={12} onClick={() => updateParam('category', '')} />
                </span>
              )}
              {currentSize && (
                <span className="badge-outline">
                  Size: {currentSize} <X size={12} onClick={() => updateParam('size', '')} />
                </span>
              )}
              {currentInStock && (
                <span className="badge-outline">
                  In-Stock Only <X size={12} onClick={() => updateParam('inStock', '')} />
                </span>
              )}
              <button type="button" className="text-secondary text-xs" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
          )}

          {loading ? (
            <div className="pxs-grid-skeleton">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="pxs-skeleton-card" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="pxs-product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="pxs-shop__empty">
              <h3>NO SHIRTS MATCH THIS FILTER</h3>
              <p className="text-secondary">Try broadening your search or resetting filters to see the drop.</p>
              <Button variant="primary" onClick={clearAllFilters}>
                RESET FILTERS
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Bottom Sheet / Modal */}
      {isMobileFilterOpen && (
        <div className="pxs-mobile-filter-overlay fade-in" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="pxs-mobile-filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="pxs-mobile-filter-header">
              <h3>FILTER SHIRTS</h3>
              <button type="button" onClick={() => setIsMobileFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="pxs-mobile-filter-body">
              {/* Size */}
              <div className="pxs-filter-group">
                <h4 className="pxs-filter-group__title">SIZE</h4>
                <div className="pxs-filter-sizes">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`pxs-filter-size-btn ${currentSize === size ? 'is-active' : ''}`}
                      onClick={() => updateParam('size', currentSize === size ? '' : size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Stock */}
              <div className="pxs-filter-group">
                <label className="pxs-filter-toggle">
                  <input
                    type="checkbox"
                    checked={currentInStock}
                    onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pxs-mobile-filter-footer">
              <Button variant="primary" fullWidth onClick={() => setIsMobileFilterOpen(false)}>
                APPLY FILTERS
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
