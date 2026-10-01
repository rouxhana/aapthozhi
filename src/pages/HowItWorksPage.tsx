import React from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

const detailedSteps = [
  {
    icon: '🗣️', num: 1, title: 'Speak your need in your own language',
    desc: 'Tap the microphone button on AapThozhi. Speak naturally — you can say "I need help for my daughter\'s education" in Tamil, Hindi, Telugu, or any Indian language you are comfortable with. No spelling. No language menu.',
    tip: 'Example (Tamil): "என் மகளுக்கு கல்வி உதவி வேண்டும்"',
  },
  {
    icon: '🔍', num: 2, title: 'AapThozhi detects your language and matches schemes',
    desc: 'Our AI identifies the spoken language and maps your request to relevant government schemes from our verified database — including education scholarships, gas cylinder benefits, maternity grants, pensions, and healthcare cards.',
    tip: 'Language detection happens automatically. You will be asked to confirm only if the AI is not sure.',
  },
  {
    icon: '📋', num: 3, title: 'Receive your personalised guidance card',
    desc: 'AapThozhi speaks the answer back to you and shows a simple card listing: the scheme name, who qualifies, what documents you need, and where to apply.',
    tip: 'The card is designed for zero-literacy users — large icons, colour coding, no complex text.',
  },
  {
    icon: '📍', num: 4, title: 'Choose Online or Offline route',
    desc: 'If you have internet access, AapThozhi links you to the verified official .gov.in portal. If you prefer to visit in person, you get a printable offline plan with the exact location, opening hours, and a script of what to say at the counter.',
    tip: 'Route B (offline) also generates a "What to say" card you can show to the counter official if you prefer not to speak.',
  },
  {
    icon: '✅', num: 5, title: 'Follow up with AapThozhi',
    desc: 'After you apply, AapThozhi helps you track the typical processing time, understand what comes next, and alerts you about any additional documents that may be requested.',
    tip: 'All saved plans are stored locally on your device. Nothing is sent to a server without your consent.',
  },
];

export const HowItWorksPage: React.FC = () => (
  <SiteLayout
    title="How AapThozhi Works — Voice-First Scheme Guide in 5 Steps | AapThozhi"
    description="Learn how AapThozhi helps Indian women access government welfare schemes in 5 simple steps using voice, in their own language — no forms, no reading required."
  >
    <div className="page-container">
      {/* Header */}
      <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div className="section-label">5 Steps</div>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
          How AapThozhi Works
        </h1>
        <p className="section-desc">
          From speaking your need to walking into the right office — AapThozhi guides you at every step, in your own language, with large icons and voice instructions.
        </p>
      </div>

      {/* Steps */}
      <ul className="steps-list" role="list" aria-label="AapThozhi 5-step process">
        {detailedSteps.map((s) => (
          <li key={s.num} className="step-item" style={{ flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="step-num">{s.num}</div>
              <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 800, color: '#fff' }}>
                {s.icon} {s.title}
              </h2>
            </div>
            <p style={{ margin: '0 0 0 3.5rem', fontSize: '0.9rem', color: '#B7BDD3', lineHeight: 1.7 }}>{s.desc}</p>
            <div style={{ marginLeft: '3.5rem', padding: '0.625rem 1rem', borderRadius: '0.625rem', background: 'rgba(155,93,229,0.12)', border: '1px solid rgba(155,93,229,0.3)', fontSize: '0.8125rem', color: '#C9A7FF' }}>
              💡 {s.tip}
            </div>
          </li>
        ))}
      </ul>

      {/* Demo CTA */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link to="/app" className="cta-primary" aria-label="Try AapThozhi voice assistant now">
          🎙️ Try it now
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer-box" style={{ marginTop: '2.5rem' }} role="note">
        <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>⚠️</span>
        <span>AapThozhi provides guidance and links to official sources. Eligibility and approvals are decided by the relevant authority.</span>
      </div>

      {/* Internal nav */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(155,93,229,0.15)' }}>
        <Link to="/languages" className="cta-secondary">🌐 Supported Languages</Link>
        <Link to="/schemes" className="cta-secondary">📋 Scheme Guidance</Link>
        <Link to="/offline-help" className="cta-secondary">📍 Offline Help Plan</Link>
      </div>
    </div>
  </SiteLayout>
);
