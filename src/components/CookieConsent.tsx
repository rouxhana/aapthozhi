import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'aapthozhi_cookie_consent';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
    // Activate GA4 if available
    if (typeof (window as any).gtag === 'function' && import.meta.env.VITE_GA4_ID) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie and privacy notice"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        padding: '1rem 1.25rem',
        background: 'rgba(11, 16, 38, 0.98)',
        backdropFilter: 'blur(20px)',
        borderTop: '2px solid rgba(155,93,229,0.4)',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.875rem',
      }}
    >
      <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🍪</span>
      <p style={{ flex: 1, minWidth: 220, fontSize: '0.875rem', color: '#B7BDD3', margin: 0, lineHeight: 1.6 }}>
        AapThozhi uses <strong style={{ color: '#C9A7FF' }}>privacy-safe analytics</strong> (anonymised IPs, no ad tracking) to improve the service. View our{' '}
        <Link to="/privacy-policy" style={{ color: '#F3A6C8', textDecoration: 'underline' }}>Privacy Policy</Link>.
      </p>
      <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
        <button
          onClick={decline}
          aria-label="Decline analytics cookies"
          style={{
            padding: '0.5rem 1rem', borderRadius: '0.75rem', background: 'transparent',
            border: '2px solid rgba(155,93,229,0.4)', color: '#B7BDD3', fontSize: '0.875rem',
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          Decline
        </button>
        <button
          onClick={accept}
          aria-label="Accept analytics cookies"
          style={{
            padding: '0.5rem 1.25rem', borderRadius: '0.75rem',
            background: 'linear-gradient(135deg,#9B5DE5,#F3A6C8)',
            border: 'none', color: '#fff', fontSize: '0.875rem',
            fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          ✓ Accept
        </button>
      </div>
    </div>
  );
};
