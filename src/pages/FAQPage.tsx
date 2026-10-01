import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

const ALL_FAQS = [
  { cat: 'About AapThozhi', q: 'What is AapThozhi?', a: 'AapThozhi is a voice-first multilingual guide that helps women understand relevant support schemes and services in their own language — without needing to read complex forms or navigate complicated government websites.' },
  { cat: 'About AapThozhi', q: 'Who is AapThozhi designed for?', a: 'AapThozhi is built for Indian women and girls with limited formal education or low digital literacy — especially in rural and semi-urban areas. It works equally well for women who can read and those who cannot.' },
  { cat: 'Languages', q: 'Which languages does AapThozhi support?', a: 'AapThozhi supports Tamil, Hindi, Telugu, Kannada, Marathi, Bengali, Gujarati, Malayalam, Punjabi, Odia, Assamese, Urdu, and Hinglish — 13 languages in total. More are being added.' },
  { cat: 'Languages', q: 'How does language detection work?', a: 'AapThozhi automatically detects your spoken language. If it is not sure, it will ask you to confirm. It will never decide your language based on your location alone.' },
  { cat: 'Schemes & Applications', q: 'Does AapThozhi apply for schemes for me?', a: 'AapThozhi helps you understand your options, find verified official links, and prepare the next steps. Final applications and eligibility decisions remain with the relevant government authority.' },
  { cat: 'Schemes & Applications', q: 'What schemes does AapThozhi cover?', a: 'AapThozhi covers education scholarships, cooking gas connections, maternity grants, old-age and widow pensions, healthcare cards, sewing machine schemes, savings programmes for daughters, and many more — updated regularly from official sources.' },
  { cat: 'Offline Use', q: 'What if I cannot complete the process online?', a: 'AapThozhi can provide an offline help plan: exactly which office to visit, what documents to carry, whom to ask for, and the words to say at the counter. You can also show the official a "What to say" card if you prefer not to speak.' },
  { cat: 'Offline Use', q: 'Does AapThozhi work without internet?', a: 'Core scheme information and offline plans can be saved locally and accessed without internet. Voice processing requires a connection for best accuracy.' },
  { cat: 'Privacy & Safety', q: 'Is my voice and location data private?', a: 'AapThozhi requests permission before using voice or location. Location only helps suggest nearby services and is never used to decide your language automatically. Voice inputs are not stored or sold.' },
  { cat: 'Privacy & Safety', q: 'How do I know a scheme link is safe?', a: 'AapThozhi only links to official .gov.in or .nic.in websites. Every link is verified. We also show a safety checklist before you open any external portal.' },
  { cat: 'Privacy & Safety', q: 'What if someone asks me to pay to get a scheme benefit?', a: 'All government welfare schemes are free to apply. If anyone asks you to pay — it is a scam. Report it to Cybercrime Helpline 1930 immediately.' },
  { cat: 'Technical', q: 'Do I need to download an app?', a: 'No app download is required. AapThozhi works directly in your browser on any smartphone. Just open the link and tap the microphone button.' },
  { cat: 'Technical', q: 'Does AapThozhi work on low-cost Android phones?', a: 'Yes. AapThozhi is designed to work on entry-level smartphones with basic internet connections. The interface uses minimal data.' },
];

const categories = ['All', ...Array.from(new Set(ALL_FAQS.map(f => f.cat)))];

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState('All');

  const filtered = activeCat === 'All' ? ALL_FAQS : ALL_FAQS.filter(f => f.cat === activeCat);

  return (
    <SiteLayout
      title="Frequently Asked Questions — AapThozhi Voice Guide for Indian Women"
      description="Find answers to common questions about AapThozhi — languages supported, how scheme guidance works, offline help plan, privacy, voice data, and more."
    >
      <div className="page-container" style={{ maxWidth: 760 }}>
        <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
          <div className="section-label">FAQs</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
            Frequently Asked Questions
          </h1>
          <p className="section-desc">Quick answers to the questions we hear most often.</p>
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }} role="group" aria-label="Filter FAQs by category">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => { setActiveCat(c); setOpenIdx(null); }}
              aria-pressed={activeCat === c}
              style={{
                padding: '0.375rem 0.875rem', borderRadius: 9999, fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', border: '2px solid',
                background: activeCat === c ? 'linear-gradient(135deg,#9B5DE5,#8338EC)' : 'transparent',
                borderColor: activeCat === c ? '#F3A6C8' : 'rgba(155,93,229,0.35)',
                color: activeCat === c ? '#fff' : '#C9A7FF',
                transition: 'all 0.18s',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="faq-list" role="list" aria-label="Frequently asked questions">
          {filtered.map((f, i) => (
            <li key={i} className="faq-item">
              <button
                id={`faq-q-${i}`}
                className="faq-question"
                aria-expanded={openIdx === i}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span>❓ {f.q}</span>
                <span className={`faq-chevron${openIdx === i ? ' open' : ''}`} aria-hidden="true">▾</span>
              </button>
              {openIdx === i && (
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq-answer">
                  {f.a}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '1rem', background: 'rgba(155,93,229,0.1)', border: '1.5px solid rgba(155,93,229,0.3)', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.875rem', color: '#C9A7FF', fontWeight: 600 }}>Still have a question?</p>
          <Link to="/contact" className="cta-primary" aria-label="Contact AapThozhi with your question">Contact us →</Link>
        </div>
      </div>
    </SiteLayout>
  );
};
