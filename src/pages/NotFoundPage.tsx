import React from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

export const NotFoundPage: React.FC = () => (
  <SiteLayout
    title="Page Not Found (404) — AapThozhi"
    description="The page you are looking for does not exist. Return to AapThozhi home, try the voice demo, or contact us."
    noindex={true}
  >
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
      {/* Large visual 404 */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
        <div style={{
          fontSize: 'clamp(6rem,20vw,10rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #9B5DE5, #F3A6C8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          letterSpacing: '-0.05em',
        }} aria-hidden="true">404</div>
      </div>

      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }} aria-hidden="true">🗺️</div>

      <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 900, color: '#fff', margin: '0 0 0.875rem' }}>
        Oops! This page got lost.
      </h1>
      <p style={{ fontSize: '1.0625rem', color: '#B7BDD3', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
        The page you are looking for does not exist or may have moved. Let us help you find your way.
      </p>

      {/* 3 big clear buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: 360, margin: '0 auto 3rem' }}>
        <Link
          to="/"
          className="cta-primary"
          style={{ justifyContent: 'center', fontSize: '1.0625rem' }}
          aria-label="Go to AapThozhi home page"
        >
          🏠 Go to Home
        </Link>
        <Link
          to="/app"
          className="cta-primary"
          style={{ justifyContent: 'center', background: 'linear-gradient(135deg,#45C27C,#2DA065)', boxShadow: '0 8px 32px rgba(69,194,124,0.35)' }}
          aria-label="Try the AapThozhi voice demo"
        >
          🎙️ Try Voice Demo
        </Link>
        <Link
          to="/contact"
          className="cta-secondary"
          style={{ justifyContent: 'center' }}
          aria-label="Contact AapThozhi"
        >
          ✉️ Contact Us
        </Link>
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
        {[
          { to: '/how-it-works', label: 'How It Works' },
          { to: '/schemes', label: 'Scheme Guidance' },
          { to: '/offline-help', label: 'Offline Help' },
          { to: '/faqs', label: 'FAQs' },
          { to: '/languages', label: 'Languages' },
        ].map(l => (
          <Link key={l.to} to={l.to} style={{ padding: '0.375rem 0.875rem', borderRadius: 9999, background: 'rgba(155,93,229,0.12)', border: '1.5px solid rgba(155,93,229,0.3)', color: '#C9A7FF', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }} aria-label={l.label}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  </SiteLayout>
);
