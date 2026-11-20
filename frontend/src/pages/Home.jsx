import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { ProductCard } from '../components/product/ProductCard';
import { api } from '../services/api';
import './Home.css';

export function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getProducts('?limit=8')
      .then((res) => {
        if (isMounted && res.data) {
          setProducts(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch real products, using empty fallback:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="pxs-home fade-in">
      {/* 1. Hero Section */}
      <section className="pxs-hero">
        <div className="container pxs-hero__container">
          <div className="pxs-hero__content">
            <span className="badge-lime">
              <Sparkles size={14} /> NEW DROP · JAIPUR
            </span>
            <h1 className="pxs-hero__title">
              NOT MADE TO <br />
              <span className="text-lime">BLEND IN.</span>
            </h1>
            <p className="pxs-hero__subtext">
              Exaggerated Cuban collars, raw textured rayon, and structured boxy silhouettes.
              Direct wholesale sourcing from Delhi textile archives, curated for the modern Jaipur street.
            </p>
            <div className="pxs-hero__actions">
              <Link to="/shop">
                <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                  SHOP THE DROP
                </Button>
              </Link>
              <Link to="/shop?category=prints">
                <Button variant="secondary" size="lg">
                  EXPLORE PRINTS
                </Button>
              </Link>
            </div>

            {/* Quick Trust Badges */}
            <div className="pxs-hero__perks">
              <div className="pxs-hero__perk">
                <Truck size={16} className="text-lime" />
                <span>Jaipur 24-48h Delivery</span>
              </div>
              <div className="pxs-hero__perk">
                <ShieldCheck size={16} className="text-lime" />
                <span>Verified Cash on Delivery</span>
              </div>
              <div className="pxs-hero__perk">
                <RefreshCw size={16} className="text-lime" />
                <span>7-Day Easy Exchange</span>
              </div>
            </div>
          </div>

          <div className="pxs-hero__visual">
            <div className="pxs-hero__img-frame">
              <img
                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80"
                alt="PXS Dark Luxury Streetwear Model"
                className="pxs-hero__img"
              />
              <div className="pxs-hero__img-badge">
                <span className="badge-lime">THE RAW HAVANA · ₹799</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Marquee Ticker Strip */}
      <div className="pxs-marquee" aria-hidden="true">
        <div className="animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="pxs-marquee__text">
              PXS · NOT MADE TO BLEND IN · JAIPUR ARCHIVE · DELHI WHOLESALE SOURCING · NO REPRINTS ·
            </span>
          ))}
        </div>
      </div>

      {/* 3. New Arrivals Catalog Grid */}
      <section className="pxs-section container">
        <SectionHeading
          index="[ 01 / DROP ]"
          title="LATEST STREETWEAR SHIRTS"
          subtitle="Strictly limited production runs. Sized from S to XL with zero re-releases."
          linkText="VIEW ALL SHIRTS"
          linkHref="/shop"
        />

        {loading ? (
          <div className="pxs-grid-skeleton">
            {[1, 2, 3, 4].map((n) => (
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
          <div className="text-center py-12">
            <p className="text-secondary">Connecting to catalog database...</p>
          </div>
        )}
      </section>

      {/* 4. Featured Collections (Category Showcase) */}
      <section className="pxs-section container">
        <SectionHeading
          index="[ 02 / CATEGORIES ]"
          title="CURATED SILHOUETTES"
          subtitle="Engineered for heat resistance, effortless drape, and high-impact aesthetics."
        />

        <div className="pxs-categories-grid">
          <Link to="/shop?category=solids" className="pxs-cat-card">
            <img
              src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
              alt="Solids Category"
              className="pxs-cat-card__img"
            />
            <div className="pxs-cat-card__overlay">
              <span className="badge-outline">CATEGORY</span>
              <h3 className="pxs-cat-card__title">CUBAN SOLIDS</h3>
              <p className="pxs-cat-card__sub">Heavyweight cotton twill & slub linens</p>
              <span className="pxs-cat-card__link">EXPLORE ➔</span>
            </div>
          </Link>

          <Link to="/shop?category=prints" className="pxs-cat-card">
            <img
              src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
              alt="Prints Category"
              className="pxs-cat-card__img"
            />
            <div className="pxs-cat-card__overlay">
              <span className="badge-outline">CATEGORY</span>
              <h3 className="pxs-cat-card__title">STREET PRINTS</h3>
              <p className="pxs-cat-card__sub">Geometric vectors & abstract night motifs</p>
              <span className="pxs-cat-card__link">EXPLORE ➔</span>
            </div>
          </Link>

          <Link to="/shop?category=checks-stripes" className="pxs-cat-card">
            <img
              src="https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80"
              alt="Checks and Stripes Category"
              className="pxs-cat-card__img"
            />
            <div className="pxs-cat-card__overlay">
              <span className="badge-outline">CATEGORY</span>
              <h3 className="pxs-cat-card__title">CHECKS & STRIPES</h3>
              <p className="pxs-cat-card__sub">Brutalist vertical lines & waffle knit textures</p>
              <span className="pxs-cat-card__link">EXPLORE ➔</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Brand Manifesto Banner */}
      <section className="pxs-manifesto">
        <div className="container pxs-manifesto__inner">
          <span className="badge-lime">THE PXS ETHOS</span>
          <h2 className="pxs-manifesto__headline">
            DIRECT WHOLESALE SOURCING.<br />
            ZERO MIDDLEMAN MARKUPS.
          </h2>
          <p className="pxs-manifesto__body">
            Mainstream brands mark up ₹350 wholesale shirts to ₹2,500 by slapping a logo on generic fabric.
            At PXS, we cut through the retail illusion: premium heavyweight rayon, custom drop-shoulder cuts,
            and honest Jaipur prices from ₹699 to ₹999.
          </p>
          <div className="pxs-manifesto__location">
            <span className="text-lime">CRAFTED & DELIVERED FROM JAIPUR, RAJASTHAN.</span>
          </div>
        </div>
      </section>

      {/* 6. Instagram Lookbook Grid */}
      <section className="pxs-section container">
        <SectionHeading
          index="[ 03 / COMMUNITY ]"
          title="SEEN ON THE STREETS"
          subtitle="Tag @pxswear.in on Instagram to be featured on our community archive."
        />

        <div className="pxs-lookbook-grid">
          <div className="pxs-lookbook-item">
            <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80" alt="Lookbook 1" />
          </div>
          <div className="pxs-lookbook-item">
            <img src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80" alt="Lookbook 2" />
          </div>
          <div className="pxs-lookbook-item">
            <img src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80" alt="Lookbook 3" />
          </div>
          <div className="pxs-lookbook-item">
            <img src="https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80" alt="Lookbook 4" />
          </div>
        </div>
      </section>
    </div>
  );
}
