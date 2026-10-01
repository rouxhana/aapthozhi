import React from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

const safetyPillars = [
  { icon: '🏛️', title: 'Official portals only', desc: 'AapThozhi links only to .gov.in or .nic.in websites. Every link is verified before being added to the database.' },
  { icon: '🚫', title: 'Never pay middlemen', desc: 'Government welfare schemes and scholarship applications are free. AapThozhi will never ask you to pay anyone.' },
  { icon: '🎤', title: 'Voice stays on your device', desc: 'Voice is processed locally when possible. We do not retain recordings or sell your voice data.' },
  { icon: '📍', title: 'Location: only with permission', desc: 'Location access is requested only to find nearby help centres. You can skip location and still use AapThozhi.' },
  { icon: '✍️', title: 'Ask before signing', desc: 'If any form looks unfamiliar, show it to a trusted person before signing. AapThozhi provides a "Trusted Helper" feature for this.' },
  { icon: '🔢', title: 'Never share OTPs', desc: 'No government, police, or bank will ever ask for your OTP or UPI PIN by phone. Report such calls to Cybercrime Helpline 1930.' },
  { icon: '🗑️', title: 'Delete your history anytime', desc: 'All saved plans and data are stored locally on your device. Erase them in Settings with a single tap, no account needed.' },
  { icon: '🔒', title: 'Privacy-safe analytics', desc: 'AapThozhi uses anonymised analytics with IP addresses masked and no ad-tracking. See our Privacy Policy for full details.' },
];

export const PrivacySafetyPage: React.FC = () => (
  <SiteLayout
    title="Privacy & Safety — How AapThozhi Protects Indian Women | AapThozhi"
    description="Learn how AapThozhi protects your privacy — voice data, location, official portals only, no middlemen, no OTP requests, and full local data control."
  >
    <div className="page-container">
      <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div className="section-label">🔒 Safety First</div>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
          Privacy & Safety
        </h1>
        <p className="section-desc">
          AapThozhi is built specifically for women with limited digital experience. Every feature is designed to be safe, transparent, and impossible to misuse.
        </p>
      </div>

      {/* Golden rule */}
      <div style={{ padding: '2rem', borderRadius: '1.5rem', background: 'linear-gradient(135deg, rgba(239,106,123,0.15), rgba(239,106,123,0.05))', border: '2px solid rgba(239,106,123,0.45)', textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }} aria-hidden="true">🛡️</div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: '#fff', margin: '0 0 0.625rem' }}>Golden Safety Rule</h2>
        <p style={{ fontSize: '1rem', color: '#F7F5FA', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
          <strong>No bank, government office, or police will ever call you to ask for your OTP, ATM PIN, or UPI PIN.</strong> If someone asks — it is fraud. Report it to <a href="tel:1930" style={{ color: '#EF6A7B', fontWeight: 700 }}>Cybercrime Helpline 1930</a>.
        </p>
      </div>

      {/* Pillars */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>8 Safety Pillars</h2>
      <div className="card-grid">
        {safetyPillars.map(({ icon, title, desc }) => (
          <div key={title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }} aria-hidden="true">{icon}</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>{title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#B7BDD3', margin: 0, lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Emergency helplines */}
      <div style={{ marginTop: '2.5rem', padding: '1.5rem', borderRadius: '1.25rem', background: '#141B3B', border: '2px solid rgba(239,106,123,0.3)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#EF6A7B', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📞 Emergency Helplines</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { num: '181', label: 'Women Helpline (National)' },
            { num: '1091', label: 'Women in Distress' },
            { num: '112', label: 'Police Emergency' },
            { num: '1930', label: 'Cybercrime Helpline' },
            { num: '14567', label: 'Elder Helpline' },
            { num: '1098', label: 'Child Helpline' },
          ].map(h => (
            <a key={h.num} href={`tel:${h.num}`} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(239,106,123,0.1)', border: '1.5px solid rgba(239,106,123,0.3)', textDecoration: 'none' }} aria-label={`Call ${h.label}: ${h.num}`}>
              <span style={{ fontSize: '1.375rem', fontWeight: 900, color: '#EF6A7B' }}>{h.num}</span>
              <span style={{ fontSize: '0.8125rem', color: '#F7F5FA', fontWeight: 600 }}>{h.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(155,93,229,0.15)' }}>
        <Link to="/privacy-policy" className="cta-secondary">📄 Privacy Policy</Link>
        <Link to="/app" className="cta-primary">🎙️ Open AapThozhi</Link>
      </div>
    </div>
  </SiteLayout>
);
