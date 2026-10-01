import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './site.css';

interface SiteLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  canonical?: string;
  noindex?: boolean;
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({
  title,
  description,
  children,
  noindex = false,
}) => {
  // Update document title and meta on mount
  React.useEffect(() => {
    document.title = title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = noindex ? 'noindex, nofollow' : 'index, follow';
  }, [title, description, noindex]);

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── Navigation ── */}
      <nav className="site-nav" aria-label="Primary navigation">
        <div className="site-nav-inner">
          <Link to="/" className="site-logo" aria-label="AapThozhi Home">
            <img src="/logo.svg" alt="AapThozhi logo" />
            <span>AapThozhi</span>
          </Link>

          <div className="site-nav-links" role="menubar">
            <NavLink to="/how-it-works" className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}>
              How It Works
            </NavLink>
            <NavLink to="/languages" className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}>
              Languages
            </NavLink>
            <NavLink to="/schemes" className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}>
              Schemes
            </NavLink>
            <NavLink to="/offline-help" className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}>
              Offline Help
            </NavLink>
            <NavLink to="/faqs" className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}>
              FAQs
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}>
              Contact
            </NavLink>
          </div>

          <Link to="/app" className="site-nav-cta" aria-label="Open AapThozhi voice assistant">
            🎙️ Open App
          </Link>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main id="main-content" className="site-main">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="site-footer" aria-label="Site footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="site-logo" style={{ marginBottom: '0.75rem' }}>
                <img src="/logo.svg" alt="AapThozhi logo" />
                <strong>AapThozhi</strong>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#7882A4', lineHeight: 1.6 }}>
                Your voice. Your language. Your support. A voice-first guide for Indian women.
              </p>
            </div>

            <div>
              <p className="footer-col-title">Voice Tools</p>
              <ul className="footer-links">
                <li><Link to="/app">🎙️ Open App</Link></li>
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><Link to="/languages">Supported Languages</Link></li>
                <li><Link to="/schemes">Scheme Guidance</Link></li>
                <li><Link to="/offline-help">Offline Help Plan</Link></li>
              </ul>
            </div>

            <div>
              <p className="footer-col-title">Support</p>
              <ul className="footer-links">
                <li><Link to="/faqs">FAQs</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/privacy-safety">Privacy & Safety</Link></li>
                <li><a href="tel:181" aria-label="Call women helpline 181">📞 Helpline 181</a></li>
              </ul>
            </div>

            <div>
              <p className="footer-col-title">Legal</p>
              <ul className="footer-links">
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Use</Link></li>
                <li><Link to="/accessibility">Accessibility</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-disclaimer">
              ⚠️ <strong>Official-Source Disclaimer:</strong> AapThozhi provides guidance and links to official government sources. Eligibility, benefits, and approvals are decided solely by the relevant authority. Always verify information at official .gov.in or .nic.in portals.
            </p>
            <p className="footer-copy">© 2025 AapThozhi. MIT License.</p>
          </div>
        </div>
      </footer>

      {/* ── Sticky mobile CTA (shown only on mobile) ── */}
      <div className="sticky-mobile-cta" aria-label="Quick action">
        <Link to="/app" aria-label="Open AapThozhi voice assistant">
          🎙️ Ask AapThozhi
        </Link>
      </div>
    </div>
  );
};
