import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';
import './site.css';

/* ════════════════════════════════════
   LANDING PAGE  /
   SEO: "AapThozhi — Your Voice. Your Language. Your Support."
   ════════════════════════════════════ */

const MicPulse: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '2rem auto' }}>
    <div style={{
      position: 'absolute', width: 200, height: 200, borderRadius: '50%',
      border: '2px solid rgba(155,93,229,0.3)', animation: 'ping 1.8s ease-out infinite',
    }} />
    <div style={{
      position: 'absolute', width: 160, height: 160, borderRadius: '50%',
      background: 'rgba(155,93,229,0.12)', animation: 'pulse 2s ease-in-out infinite',
    }} />
    <button
      onClick={onClick}
      aria-label="Speak to AapThozhi — tap to open the voice assistant"
      title="Tap to speak your question"
      style={{
        position: 'relative', width: 120, height: 120, borderRadius: '50%',
        background: 'linear-gradient(135deg, #9B5DE5, #F3A6C8)',
        border: '3px solid rgba(255,255,255,0.15)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#fff',
        boxShadow: '0 12px 40px rgba(155,93,229,0.55)',
        fontSize: '3rem', transition: 'transform 0.22s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      🎙️
    </button>
    <style>{`
      @keyframes ping { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.5);opacity:0} }
      @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
    `}</style>
  </div>
);

const steps = [
  { icon: '🗣️', title: 'Speak in your language', desc: 'Say your need out loud — in Tamil, Hindi, Telugu, Kannada, Marathi, or any Indian language. No spelling, no typing required.' },
  { icon: '🔍', title: 'AapThozhi finds the right scheme', desc: 'Our AI matches your words to relevant government welfare schemes and benefit programmes from a verified database.' },
  { icon: '📍', title: 'Get a step-by-step plan', desc: 'Receive exact guidance: what to carry, where to go, whom to ask for, and even the words to say at the counter.' },
];

const faqs = [
  { q: 'What is AapThozhi?', a: 'AapThozhi is a voice-first multilingual guide that helps women understand relevant support schemes and services in their own language — without needing to read complex forms.' },
  { q: 'Which languages does AapThozhi support?', a: 'AapThozhi is designed to support Tamil, Hindi, Telugu, Kannada, Marathi, Bengali, Gujarati, Malayalam, Punjabi, Odia, Assamese, Urdu, and Hinglish.' },
  { q: 'Does AapThozhi apply for schemes for me?', a: 'AapThozhi helps you understand options, find verified official links, and prepare next steps. Final applications and eligibility decisions remain with the official authority.' },
  { q: 'What if I cannot complete the process online?', a: 'AapThozhi can provide an offline help plan — where to go, documents to carry, whom to ask for, and what to say.' },
  { q: 'Is my voice and location data private?', a: 'AapThozhi requests permission before using voice or location. Location only helps suggest nearby services and is never used to decide your language automatically.' },
];

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <SiteLayout
      title="AapThozhi — Your Voice. Your Language. Your Support. | Voice Guide for Indian Women"
      description="AapThozhi is a voice-first, multilingual guide helping Indian women access government welfare schemes, scholarships, and healthcare in their own spoken language — no forms, no reading required."
    >
      {/* ── HERO ── */}
      <section style={{ padding: '4rem 1.25rem 2rem', textAlign: 'center', background: 'radial-gradient(ellipse at top, rgba(155,93,229,0.12) 0%, transparent 65%)' }} aria-labelledby="hero-title">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="hero-badge" aria-label="Voice-first, icon-first interface">
            🎙️ Voice-first · Icon-first · 14 Indian Languages
          </div>

          <h1 id="hero-title" className="hero-title">
            Your Voice.<br />Your Language.<br />Your Support.
          </h1>

          <p className="hero-sub">
            AapThozhi listens to you in your language and finds the right government scheme, scholarship, or healthcare benefit — then tells you exactly what to do next.
            <br /><strong style={{ color: '#F3A6C8' }}>No forms first. No language menu first.</strong>
          </p>

          {/* PRIMARY CTA above the fold */}
          <Link to="/app" className="cta-primary" id="hero-speak-cta" aria-label="Open AapThozhi and speak your question">
            🎙️ Speak to AapThozhi
          </Link>
          {'  '}
          <Link to="/how-it-works" className="cta-secondary" style={{ marginLeft: '0.75rem' }} aria-label="See how AapThozhi works in three steps">
            ▶ See how it works
          </Link>

          {/* Large pulsing mic demo */}
          <MicPulse onClick={() => window.location.href = '#/app'} />

          <p style={{ fontSize: '0.8125rem', color: '#7882A4', marginTop: '-0.5rem' }}>
            Tap the mic above · Works in Tamil, Hindi, Telugu, Kannada, Marathi & more
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS (3 steps) ── */}
      <section className="site-section" style={{ background: 'rgba(155,93,229,0.04)' }} aria-labelledby="how-title">
        <div className="page-container">
          <div className="section-label">3 Simple Steps</div>
          <h2 id="how-title" className="section-title">How AapThozhi Works</h2>
          <p className="section-desc">No app download. No complicated menu. Just speak — and AapThozhi does the rest.</p>

          <ul className="steps-list" role="list" aria-label="How AapThozhi works in 3 steps">
            {steps.map((s, i) => (
              <li key={i} className="step-item">
                <div className="step-num" aria-hidden="true">{i + 1}</div>
                <div className="step-content">
                  <h3>{s.icon} {s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to="/how-it-works" className="cta-secondary" aria-label="Read the full explanation of how AapThozhi works">Full Explanation →</Link>
          </div>
        </div>
      </section>

      {/* ── LANGUAGE SUPPORT ── */}
      <section className="site-section" aria-labelledby="lang-title">
        <div className="page-container">
          <div className="section-label">Language Detection</div>
          <h2 id="lang-title" className="section-title">Speak in any Indian language</h2>
          <p className="section-desc">
            AapThozhi detects your spoken language automatically — you do not need to choose from a menu. If detection is unclear, it will ask you to confirm.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '1.5rem' }}>
            {['தமிழ் Tamil', 'हिन्दी Hindi', 'తెలుగు Telugu', 'ಕನ್ನಡ Kannada',
              'मराठी Marathi', 'বাংলা Bengali', 'ગુજરાતી Gujarati', 'മലയാളം Malayalam',
              'ਪੰਜਾਬੀ Punjabi', 'ଓଡ଼ିଆ Odia', 'অসমীয়া Assamese', 'اردو Urdu', 'Hinglish'].map(l => (
              <span key={l} className="lang-chip" aria-label={l}>{l}</span>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/languages" className="cta-secondary" aria-label="See the full list of supported Indian languages">All supported languages →</Link>
          </div>
        </div>
      </section>

      {/* ── ROUTES: Online & Offline ── */}
      <section className="site-section" style={{ background: 'rgba(155,93,229,0.04)' }} aria-labelledby="routes-title">
        <div className="page-container">
          <div className="section-label">Two Routes</div>
          <h2 id="routes-title" className="section-title">Online help OR Offline help — your choice</h2>
          <div className="card-grid">
            <div className="card" style={{ borderColor: 'rgba(155,93,229,0.4)' }}>
              <span className="card-icon" aria-hidden="true">📱</span>
              <h3 className="card-title">Online Route</h3>
              <p className="card-desc">AapThozhi links you directly to the verified official government portal with a safety checklist — so you never land on a fraud site.</p>
              <Link to="/schemes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '1rem', color: '#F3A6C8', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }} aria-label="Explore online scheme guidance">
                Explore scheme guidance →
              </Link>
            </div>
            <div className="card" style={{ borderColor: 'rgba(243,166,200,0.4)' }}>
              <span className="card-icon" aria-hidden="true">📍</span>
              <h3 className="card-title">Offline Route</h3>
              <p className="card-desc">Get a printed-style plan: which office to visit, what documents to carry in a folder, who to ask for, and the exact words to say at the counter.</p>
              <Link to="/offline-help" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '1rem', color: '#F3A6C8', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }} aria-label="Explore offline help guide">
                Get offline help plan →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRIVACY SECTION ── */}
      <section className="site-section" aria-labelledby="privacy-title">
        <div className="page-container">
          <div className="section-label">🔒 Privacy First</div>
          <h2 id="privacy-title" className="section-title">How we protect your privacy</h2>
          <div className="card-grid">
            {[
              { icon: '🎤', t: 'Voice stays on your device', d: 'Voice input is processed locally when possible. We do not store recordings.' },
              { icon: '📍', t: 'Location: only if you allow', d: 'Location is only used to suggest nearby help centres — never to decide your language.' },
              { icon: '🛡️', t: 'No middleman payments', d: 'Government schemes are always free. AapThozhi never asks you to pay anyone.' },
              { icon: '🗑️', t: 'Delete anytime', d: 'All saved plans and history can be erased in Settings with a single tap.' },
            ].map(({ icon, t, d }) => (
              <div key={t} className="card">
                <span className="card-icon" aria-hidden="true">{icon}</span>
                <h3 className="card-title">{t}</h3>
                <p className="card-desc">{d}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/privacy-safety" className="cta-secondary" aria-label="Read the full privacy and safety page">Full privacy & safety page →</Link>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="site-section" style={{ background: 'rgba(155,93,229,0.04)' }} aria-labelledby="for-title">
        <div className="page-container">
          <div className="section-label">For You</div>
          <h2 id="for-title" className="section-title">For users, NGOs, and community partners</h2>
          <div className="card-grid">
            {[
              { icon: '👩', t: 'Individual Women & Girls', d: 'Access welfare schemes, scholarships, maternal care, and pensions — spoken in your language, step by step.' },
              { icon: '🤝', t: 'NGOs & Field Workers', d: 'Use AapThozhi as a demonstration tool during field visits to help beneficiaries understand their entitlements.' },
              { icon: '🏫', t: 'Schools & Anganwadis', d: 'Trained community workers can integrate AapThozhi into awareness workshops and help sessions.' },
            ].map(({ icon, t, d }) => (
              <div key={t} className="card">
                <span className="card-icon" aria-hidden="true">{icon}</span>
                <h3 className="card-title">{t}</h3>
                <p className="card-desc">{d}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/contact" className="cta-primary" aria-label="Contact AapThozhi to partner with us">🤝 Partner With Us</Link>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="site-section" aria-labelledby="faq-title">
        <div className="page-container" style={{ maxWidth: 720 }}>
          <div className="section-label">FAQs</div>
          <h2 id="faq-title" className="section-title">Common Questions</h2>

          <ul className="faq-list" role="list">
            {faqs.map((f, i) => (
              <li key={i} className="faq-item">
                <button
                  id={`faq-q-${i}`}
                  className="faq-question"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>❓ {f.q}</span>
                  <span className={`faq-chevron${openFaq === i ? ' open' : ''}`} aria-hidden="true">▾</span>
                </button>
                {openFaq === i && (
                  <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq-answer">
                    {f.a}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/faqs" className="cta-secondary" aria-label="See all frequently asked questions">All FAQs →</Link>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <section className="page-container" aria-label="Official source disclaimer" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
        <div className="disclaimer-box" role="note">
          <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>⚠️</span>
          <span>
            <strong>AapThozhi provides guidance and links to official government sources only.</strong> Eligibility, approvals, and benefits are decided solely by the relevant authority. Always verify information at official .gov.in or .nic.in portals before acting.
          </span>
        </div>
      </section>
    </SiteLayout>
  );
};
