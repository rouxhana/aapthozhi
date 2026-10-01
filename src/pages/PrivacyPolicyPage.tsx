import React from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

export const PrivacyPolicyPage: React.FC = () => (
  <SiteLayout
    title="Privacy Policy — AapThozhi Voice Guide for Indian Women"
    description="AapThozhi's Privacy Policy — how we handle voice data, location, analytics, cookies, and your rights as a user."
  >
    <div className="page-container prose" style={{ maxWidth: 760 }}>
      <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div className="section-label">Legal</div>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>Privacy Policy</h1>
        <p style={{ color: '#7882A4', fontSize: '0.875rem' }}>Last updated: 1 October 2025 | Effective immediately</p>
      </div>

      <div className="disclaimer-box" role="note">
        <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>🔒</span>
        <span><strong>Short summary:</strong> We collect only what is necessary, anonymise analytics, do not store voice recordings, and give you full control over your data.</span>
      </div>

      <div className="prose" style={{ marginTop: '1.5rem' }}>
        <h2>1. Who we are</h2>
        <p>AapThozhi is an open-source voice-first welfare guide (MIT License) available at <a href="https://rouxhana.github.io/aapthozhi/" rel="noopener noreferrer">https://rouxhana.github.io/aapthozhi/</a>. References to "we", "our", or "AapThozhi" refer to the project maintainers.</p>

        <h2>2. Data we collect</h2>
        <h3>2a. Voice input</h3>
        <p>Voice is processed via your browser's built-in Web Speech API. AapThozhi does not record, store, or transmit audio. Transcribed text may be passed temporarily to an AI API (Google Gemini) to generate scheme guidance — this text is not retained after your session ends.</p>
        <h3>2b. Location</h3>
        <p>We request location access only when you use the "nearby help centre" feature. Location is used solely to identify nearby offices. It is not stored, shared, or used to decide your language automatically.</p>
        <h3>2c. Analytics</h3>
        <p>We use Google Analytics 4 with anonymised IP addresses, no ad personalisation signals, and no Google Signals. This helps us understand aggregate usage (number of visitors, pages visited). No personally identifiable data is collected.</p>
        <h3>2d. Locally stored data</h3>
        <p>Saved plans and preferences are stored in your browser's localStorage, on your device only. We do not have access to this data. You can delete it at any time in Settings → Reset All Data.</p>

        <h2>3. Cookies</h2>
        <p>AapThozhi uses:</p>
        <ul>
          <li><strong>Essential cookies:</strong> localStorage for saved plans (no server side, no expiry tracking).</li>
          <li><strong>Analytics cookies:</strong> Google Analytics 4 sets anonymised cookies only after you accept the cookie consent banner.</li>
        </ul>
        <p>You can withdraw consent at any time by clearing your browser cookies and not re-accepting the banner.</p>

        <h2>4. Third-party services</h2>
        <ul>
          <li><strong>Google Gemini API</strong> — AI responses. Text queries are processed per <a href="https://ai.google.dev/gemini-api/terms" rel="noopener noreferrer">Google's API Terms</a>.</li>
          <li><strong>Google Analytics 4</strong> — anonymised usage analytics.</li>
          <li><strong>Google Fonts</strong> — loaded on page render; subject to Google's font API privacy policy.</li>
          <li><strong>Browser Web Speech API</strong> — provided by your browser vendor; not controlled by AapThozhi.</li>
        </ul>

        <h2>5. Children's privacy</h2>
        <p>AapThozhi does not knowingly collect data from users under 13. The app is intended for use by parents, guardians, or adult beneficiaries on behalf of children.</p>

        <h2>6. Your rights</h2>
        <ul>
          <li>Right to access: All locally stored data is in your browser. You can inspect it in Developer Tools → Application → localStorage.</li>
          <li>Right to deletion: Use Settings → Reset All Data to clear all locally stored plans and preferences.</li>
          <li>Right to object: You can decline the cookie consent banner; analytics will not activate.</li>
        </ul>

        <h2>7. Contact</h2>
        <p>For privacy questions, please use the <Link to="/contact">Contact form</Link>.</p>

        <h2>8. Changes to this policy</h2>
        <p>We will update this page when the policy changes. The "Last updated" date at the top reflects the most recent version.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(155,93,229,0.15)' }}>
        <Link to="/terms" className="cta-secondary">Terms of Use</Link>
        <Link to="/accessibility" className="cta-secondary">Accessibility</Link>
        <Link to="/contact" className="cta-secondary">Contact Us</Link>
      </div>
    </div>
  </SiteLayout>
);
