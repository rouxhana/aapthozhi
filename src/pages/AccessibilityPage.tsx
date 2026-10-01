import React from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

const commitments = [
  { icon: '🔤', title: 'Plain language', desc: 'All on-screen text is written at a 5th-grade reading level in English. Regional language content uses colloquial spoken-word style.' },
  { icon: '🎙️', title: 'Voice-first interface', desc: 'Every key action can be completed by voice alone, without reading or typing. Every button has both an icon and a text label.' },
  { icon: '🌈', title: 'High contrast colours', desc: 'AapThozhi uses a dark background (#0B1026) with high-contrast text and coloured icon containers that meet WCAG AA contrast requirements.' },
  { icon: '⌨️', title: 'Keyboard navigation', desc: 'All interactive elements are reachable by Tab key. Focus indicators are visible. Modal dialogs trap focus correctly.' },
  { icon: '📲', title: 'Screen reader support', desc: 'All icons have aria-label or title attributes. Dynamic content uses role="alert" and aria-live for announcements. Headings follow a logical h1→h2→h3 hierarchy.' },
  { icon: '📱', title: 'Mobile-first responsive', desc: 'Designed for entry-level Android smartphones. Touch targets are minimum 44×44px. Text scales with browser zoom up to 200%.' },
  { icon: '🌐', title: '13 Indian languages', desc: 'Language and region should not be a barrier. AapThozhi supports 13 Indian languages with native-script fonts loaded via Google Fonts.' },
  { icon: '🔇', title: 'No autoplay audio', desc: 'Audio greetings are opt-in (tap to hear). No sound plays without user interaction on pages where it might be intrusive.' },
];

export const AccessibilityPage: React.FC = () => (
  <SiteLayout
    title="Accessibility Statement — AapThozhi Voice-First Guide for Indian Women"
    description="AapThozhi accessibility commitments: WCAG AA compliance, voice-first interface, screen reader support, keyboard navigation, high contrast, and 13 Indian language support."
  >
    <div className="page-container prose" style={{ maxWidth: 760 }}>
      <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div className="section-label">Accessibility</div>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
          Accessibility Statement
        </h1>
        <p className="section-desc">
          AapThozhi is designed from the ground up for users with limited literacy, limited digital experience, or physical accessibility needs. This page describes our commitments and known limitations.
        </p>
      </div>

      <div className="alert-box" role="note">
        <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>♿</span>
        <span><strong>Our goal:</strong> A woman who has never used a smartphone before should be able to access government welfare information using AapThozhi without any assistance.</span>
      </div>

      {/* Commitments */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '2rem 0 1rem' }}>Our Accessibility Commitments</h2>
      <div className="card-grid">
        {commitments.map(({ icon, title, desc }) => (
          <div key={title} className="card">
            <span style={{ fontSize: '2rem' }} aria-hidden="true">{icon}</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0 0.375rem' }}>{title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#B7BDD3', margin: 0, lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Conformance */}
      <div className="prose" style={{ marginTop: '2.5rem' }}>
        <h2>Conformance status</h2>
        <p>AapThozhi aims to conform to <a href="https://www.w3.org/TR/WCAG21/" rel="noopener noreferrer">WCAG 2.1 Level AA</a>. We are actively working towards full conformance. Known limitations are listed below.</p>

        <h2>Known limitations</h2>
        <ul>
          <li>Voice recognition accuracy varies by device microphone quality and background noise.</li>
          <li>Some PDF documents linked from official government portals may not be screen-reader accessible — this is outside our control.</li>
          <li>Live scheme data fetched from external sources may include text not translated into all 13 languages.</li>
        </ul>

        <h2>Feedback</h2>
        <p>If you experience any accessibility barrier on AapThozhi, please <Link to="/contact">contact us</Link>. We aim to respond and address reported barriers within 5 working days.</p>

        <h2>Technical approach</h2>
        <ul>
          <li>Built with React 19, semantic HTML5, and Tailwind CSS utility classes.</li>
          <li>Uses native browser Web Speech API for voice input — no third-party microphone library.</li>
          <li>Text-to-speech uses the browser's built-in SpeechSynthesis API — no audio server required.</li>
          <li>Tested on Chrome, Firefox, Edge, and Samsung Internet on Android.</li>
        </ul>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(155,93,229,0.15)' }}>
        <Link to="/contact" className="cta-secondary">Report an accessibility issue</Link>
        <Link to="/privacy-policy" className="cta-secondary">Privacy Policy</Link>
      </div>
    </div>
  </SiteLayout>
);
