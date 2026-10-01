import React from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

export const ThankYouPage: React.FC = () => (
  <SiteLayout
    title="Thank You — Enquiry Received | AapThozhi"
    description="Thank you for contacting AapThozhi. We have received your enquiry and will respond within 2 working days."
    noindex={true}
  >
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1.25rem' }} aria-hidden="true">🎉</div>
      <h1 style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem' }}>
        Thank you!
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#B7BDD3', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.7 }}>
        We have received your enquiry and will respond within <strong style={{ color: '#45C27C' }}>2 working days</strong> in your preferred language.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: 400, margin: '0 auto 2.5rem' }}>
        <div className="alert-box" role="status">
          <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>✅</span>
          <span>Your message has been sent successfully.</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', justifyContent: 'center' }}>
        <Link to="/" className="cta-primary" aria-label="Go to AapThozhi home page">🏠 Go to Home</Link>
        <Link to="/app" className="cta-secondary" aria-label="Try AapThozhi voice demo now">🎙️ Try Voice Demo</Link>
        <Link to="/contact" className="cta-secondary" aria-label="Return to contact page">✉️ Send another message</Link>
      </div>
    </div>
  </SiteLayout>
);
