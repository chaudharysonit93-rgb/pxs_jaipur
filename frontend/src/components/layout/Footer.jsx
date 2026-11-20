import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Instagram } from 'lucide-react';
import './Footer.css';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="pxs-footer">
      <div className="container">
        {/* Top Section: Newsletter & Manifesto */}
        <div className="pxs-footer__top">
          <div className="pxs-footer__brand-block">
            <h2 className="pxs-footer__brand-title">PXS</h2>
            <p className="pxs-footer__tagline">"NOT MADE TO BLEND IN."</p>
            <p className="pxs-footer__desc">
              High-fashion dark luxury streetwear. Raw Cuban collars, heavy drape rayon, and boxy silhouettes.
              Direct wholesale sourcing from Delhi textile hubs, delivered across Jaipur and pan-India.
            </p>
            <div className="pxs-footer__social">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="pxs-footer__social-link"
                aria-label="Follow PXS on Instagram"
              >
                <Instagram size={20} />
                <span>@pxswear.in</span>
              </a>
            </div>
          </div>

          <div className="pxs-footer__newsletter">
            <h3 className="pxs-footer__newsletter-title">BE FIRST TO CATCH THE NEXT DROP</h3>
            <p className="pxs-footer__newsletter-desc">
              Zero spam. Only drop dates, early Jaipur studio access, and archive release alerts.
            </p>
            
            {subscribed ? (
              <div className="pxs-footer__subscribed fade-in">
                <CheckCircle2 size={18} className="text-lime" />
                <span>YOU'RE ON THE LIST. KEEP AN EYE ON YOUR INBOX.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="pxs-footer__form">
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" aria-label="Subscribe to drop notifications">
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="pxs-footer__nav-grid">
          <div className="pxs-footer__col">
            <h4 className="pxs-footer__col-title">COLLECTION</h4>
            <ul>
              <li><Link to="/shop">ALL SHIRTS</Link></li>
              <li><Link to="/shop?category=solids">CUBAN SOLIDS</Link></li>
              <li><Link to="/shop?category=prints">STREET PRINTS</Link></li>
              <li><Link to="/shop?category=checks-stripes">CHECKS & STRIPES</Link></li>
              <li><Link to="/shop?inStock=true">READY TO DISPATCH</Link></li>
            </ul>
          </div>

          <div className="pxs-footer__col">
            <h4 className="pxs-footer__col-title">CUSTOMER CARE</h4>
            <ul>
              <li><Link to="/track-order">TRACK YOUR ORDER</Link></li>
              <li><Link to="/shipping-policy">SHIPPING & JAIPUR DISPATCH</Link></li>
              <li><Link to="/returns-policy">7-DAY RETURNS & EXCHANGES</Link></li>
              <li><Link to="/shipping-policy#cod">COD GUIDELINES</Link></li>
            </ul>
          </div>

          <div className="pxs-footer__col">
            <h4 className="pxs-footer__col-title">STUDIO & BRAND</h4>
            <ul>
              <li><Link to="/about">ABOUT PXS</Link></li>
              <li><Link to="/contact">CONTACT & JAIPUR STUDIO</Link></li>
              <li><Link to="/terms">TERMS OF SERVICE</Link></li>
              <li><Link to="/privacy-policy">PRIVACY POLICY</Link></li>
            </ul>
          </div>

          <div className="pxs-footer__col">
            <h4 className="pxs-footer__col-title">JAIPUR STUDIO</h4>
            <p className="pxs-footer__address">
              MALVIYA NAGAR / C-SCHEME<br />
              JAIPUR, RAJASTHAN - 302017<br />
              HELLO@PXSWEAR.COM
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pxs-footer__bottom">
          <p>© {new Date().getFullYear()} PXS FASHION. ALL RIGHTS RESERVED.</p>
          <p className="text-secondary">PROUDLY CRAFTED & SHIPPED FROM JAIPUR, INDIA.</p>
        </div>
      </div>
    </footer>
  );
}
