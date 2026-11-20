import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { MapPin, Mail, MessageCircle, Truck, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';

export function About() {
  return (
    <div className="container py-20 fade-in" style={{ maxWidth: '800px' }}>
      <span className="badge-lime mb-2">PXS MANIFESTO</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '8px 0 24px' }}>
        NOT MADE TO BLEND IN.
      </h1>

      <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '20px', fontSize: 'var(--text-body)' }}>
        <p>
          Founded in <strong>Jaipur, Rajasthan</strong>, PXS is an independent dark-luxury streetwear label born out of frustration with overpriced retail mall brands.
        </p>
        <p>
          We observed that mainstream fast-fashion labels purchase mass-produced shirts from Delhi wholesale hubs for ₹350–₹400, attach a branded label, and sell them for ₹2,500+. The customer pays for marketing budgets and shopping mall rents—not fabric quality.
        </p>
        <p>
          <strong>PXS dismantles that illusion.</strong> We source directly from the master textile weavers in Delhi, focus on heavy-drape textured rayons (180 GSM), custom drop-shoulder boxy cuts, and Cuban open collars, and deliver straight to customers in Jaipur and across India at honest direct-to-consumer prices (₹699 to ₹999).
        </p>
        <div style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)', marginTop: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)', marginBottom: '8px' }}>
            ZERO REPRINTS POLICY
          </h3>
          <p className="text-xs">
            Every shirt drop is produced in strictly limited batches of 15 to 50 pieces per silhouette. Once a drop sells out, the pattern is archived forever. You will never see 10,000 people wearing your shirt.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="container py-20 fade-in" style={{ maxWidth: '720px' }}>
      <span className="badge-lime mb-2">JAIPUR STUDIO</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '8px 0 24px' }}>
        CONNECT WITH US
      </h1>

      <p className="text-secondary text-sm mb-8">
        Have questions about sizing, delivery in Jaipur, or looking for studio styling? Reach out directly to our team.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)' }}>
          <MapPin size={24} className="text-lime mb-3" />
          <h3 className="font-bold text-sm mb-1">STUDIO LOCATION</h3>
          <p className="text-secondary text-xs leading-relaxed">
            PXS Fashion Studio<br />
            Malviya Nagar / C-Scheme<br />
            Jaipur, Rajasthan - 302017
          </p>
        </div>

        <div style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)' }}>
          <Mail size={24} className="text-lime mb-3" />
          <h3 className="font-bold text-sm mb-1">CUSTOMER SUPPORT</h3>
          <p className="text-secondary text-xs leading-relaxed">
            hello@pxswear.com<br />
            Responses within 12-24 hours.<br />
            Mon – Sat: 10:00 AM – 7:00 PM IST
          </p>
        </div>

        <div style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)', gridColumn: '1 / -1' }}>
          <MessageCircle size={24} className="text-lime mb-3" />
          <h3 className="font-bold text-sm mb-1">FAST WHATSAPP ASSISTANCE</h3>
          <p className="text-secondary text-xs leading-relaxed mb-4">
            Need instant sizing confirmation or Jaipur express delivery updates? Message us directly on WhatsApp.
          </p>
          <a href="https://wa.me/919876543210?text=Hi%20PXS%20Jaipur,%20I%20have%20a%20query%20about%20a%20drop." target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">CHAT ON WHATSAPP</Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export function ShippingPolicy() {
  return (
    <div className="container py-20 fade-in" style={{ maxWidth: '800px' }}>
      <span className="badge-lime mb-2">LOGISTICS</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '8px 0 24px' }}>
        SHIPPING & DELIVERY POLICY
      </h1>

      <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '20px', fontSize: 'var(--text-sm)' }}>
        <div>
          <h3 className="text-primary font-bold mb-2">1. JAIPUR LOCAL EXPRESS DELIVERY</h3>
          <p>
            Orders placed within Jaipur PIN codes (302xxx) are dispatched directly from our Malviya Nagar studio within <strong>24 to 48 hours</strong>. Same-day delivery is available for orders placed before 1:00 PM IST.
          </p>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2">2. ALL-INDIA SHIPPING</h3>
          <p>
            For pan-India deliveries outside Jaipur, we partner with premier express couriers (Delhivery, BlueDart, DTDC). Parcels are typically delivered within <strong>3 to 5 business days</strong>.
          </p>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2">3. SHIPPING RATES</h3>
          <p>
            • <strong>FREE SHIPPING:</strong> On all orders above ₹999.<br />
            • <strong>Standard Flat Rate:</strong> ₹70 flat fee for orders under ₹999.
          </p>
        </div>

        <div id="cod">
          <h3 className="text-primary font-bold mb-2">4. CASH ON DELIVERY (COD) RULES</h3>
          <p>
            To prevent fraudulent orders and uncollected shipments, Cash on Delivery is currently exclusive to <strong>Jaipur PIN codes (302xxx)</strong>. All COD orders require a quick 1-minute WhatsApp/Call verification before our studio packs the parcel.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReturnsPolicy() {
  return (
    <div className="container py-20 fade-in" style={{ maxWidth: '800px' }}>
      <span className="badge-lime mb-2">GUARANTEE</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '8px 0 24px' }}>
        7-DAY EXCHANGE & RETURN POLICY
      </h1>

      <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '20px', fontSize: 'var(--text-sm)' }}>
        <p>
          We want you to feel confident in your silhouette. If the size or fit isn't right, you can exchange your shirt within <strong>7 days of delivery</strong>.
        </p>

        <div>
          <h3 className="text-primary font-bold mb-2">ELIGIBILITY FOR EXCHANGE:</h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
            <li>Item must be unworn, unwashed, and in original condition.</li>
            <li>All brand tags, wash care labels, and packaging must remain intact.</li>
            <li>Reverse pickup will be scheduled by our courier partner within Jaipur or pan-India.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2">REFUND TIMELINE:</h3>
          <p>
            For verified prepaid returns, refunds are credited back to the original payment source (UPI / Bank Account) within <strong>5 to 7 business days</strong> following studio inspection.
          </p>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="container py-20 fade-in" style={{ maxWidth: '800px' }}>
      <span className="badge-lime mb-2">COMPLIANCE</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '8px 0 24px' }}>
        PRIVACY POLICY (DRAFT)
      </h1>
      <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: 'var(--text-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p className="text-xs text-lime">
          [ DRAFT NOTICE: Prepared for compliance with the Indian Digital Personal Data Protection Act (DPDPA), 2023. To be reviewed by legal counsel before high-scale marketing. ]
        </p>
        <p>
          PXS Fashion ("we", "our") respects your privacy. We collect customer names, phone numbers, email addresses, and shipping addresses strictly for the legitimate purpose of fulfilling your order, providing tracking notices, and preventing fraudulent transactions.
        </p>
        <p>
          We never sell, rent, or trade your personal data to third-party advertisers. Payment card and UPI details are securely encrypted and handled directly by RBI-licensed payment aggregators (Razorpay); PXS never stores card numbers or UPI PINs.
        </p>
      </div>
    </div>
  );
}

export function Terms() {
  return (
    <div className="container py-20 fade-in" style={{ maxWidth: '800px' }}>
      <span className="badge-lime mb-2">LEGAL</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '8px 0 24px' }}>
        TERMS OF SERVICE (DRAFT)
      </h1>
      <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: 'var(--text-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p className="text-xs text-lime">
          [ DRAFT NOTICE: Prepared in accordance with Consumer Protection (E-Commerce) Rules, 2020. ]
        </p>
        <p>
          By visiting our site or purchasing from PXS, you agree to these Terms. All orders placed on our website are subject to stock availability and payment verification.
        </p>
        <p>
          Prices listed on the website are in Indian Rupees (INR) and are subject to recalculation and verification by our server at the time of checkout. In the event of a pricing or stock discrepancy, we reserve the right to cancel the order and provide a full refund.
        </p>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="container py-32 text-center fade-in">
      <span className="badge-lime mb-2">ERROR 404</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, margin: '16px 0' }}>
        THE STREET ENDS HERE.
      </h1>
      <p className="text-secondary max-w-md mx-auto mb-8 text-sm">
        The silhouette or drop page you're searching for does not exist or has been archived.
      </p>
      <Link to="/shop">
        <Button variant="primary" size="lg">RETURN TO DROP</Button>
      </Link>
    </div>
  );
}
