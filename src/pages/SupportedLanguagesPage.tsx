import React from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

const LANGUAGES = [
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🌸', greeting: 'வணக்கம்', states: 'Tamil Nadu, Puducherry' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🌻', greeting: 'नमस्ते', states: 'Uttar Pradesh, MP, Rajasthan, Bihar, Delhi' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🌺', greeting: 'నమస్కారం', states: 'Andhra Pradesh, Telangana' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🌼', greeting: 'ನಮಸ್ಕಾರ', states: 'Karnataka' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🌷', greeting: 'नमस्कार', states: 'Maharashtra, Goa' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🌿', greeting: 'নমস্কার', states: 'West Bengal, Tripura' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🌾', greeting: 'નમસ્તે', states: 'Gujarat, Dadra' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🍃', greeting: 'നമസ്കാരം', states: 'Kerala, Lakshadweep' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🌻', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', states: 'Punjab, Haryana, Delhi' },
  { code: 'od', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🌊', greeting: 'ନମସ୍କାର', states: 'Odisha' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🍵', greeting: 'নমস্কাৰ', states: 'Assam, Arunachal Pradesh' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🌙', greeting: 'السلام علیکم', states: 'Jammu & Kashmir, UP, Bihar' },
  { code: 'hinglish', name: 'Hinglish', native: 'Hinglish', flag: '🎯', greeting: 'Namaste bhai!', states: 'Urban India' },
];

export const SupportedLanguagesPage: React.FC = () => (
  <SiteLayout
    title="Supported Indian Languages — 13 Languages Including Tamil, Hindi, Telugu | AapThozhi"
    description="AapThozhi supports 13 Indian languages including Tamil, Hindi, Telugu, Kannada, Marathi, Bengali, Gujarati, Malayalam, Punjabi, Odia, Assamese, Urdu, and Hinglish."
  >
    <div className="page-container">
      <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div className="section-label">13 Languages</div>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
          Supported Indian Languages
        </h1>
        <p className="section-desc">
          AapThozhi automatically detects your spoken language. You do not need to choose from a menu — just speak naturally and the assistant will respond in the same language.
        </p>

        <div className="alert-box" role="note" style={{ marginTop: '1.25rem' }}>
          <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>ℹ️</span>
          <span><strong>Language detection:</strong> AapThozhi uses voice analysis to detect your language. If it is unsure, it will ask you to confirm — it will never decide automatically based on your location alone.</span>
        </div>
      </div>

      {/* Language grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.5rem' }} role="list" aria-label="Supported languages">
        {LANGUAGES.map((l) => (
          <div
            key={l.code}
            role="listitem"
            style={{
              padding: '1.25rem', borderRadius: '1.25rem',
              background: 'linear-gradient(135deg, #141B3B, #0D1333)',
              border: '2px solid rgba(155,93,229,0.2)',
              transition: 'all 0.22s',
            }}
            aria-label={`${l.name} — ${l.native}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.75rem' }} aria-hidden="true">{l.flag}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{l.name}</div>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: '#C9A7FF' }}>{l.native}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#F3A6C8', fontWeight: 700, marginBottom: '0.375rem' }}>
              "{l.greeting}"
            </div>
            <div style={{ fontSize: '0.75rem', color: '#7882A4' }}>{l.states}</div>
          </div>
        ))}
      </div>

      <div className="disclaimer-box" style={{ marginTop: '2.5rem' }} role="note">
        <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>📢</span>
        <span>More regional languages and dialects are being added progressively. <Link to="/contact" style={{ color: '#F3A6C8' }}>Contact us</Link> if you need a language not listed above.</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(155,93,229,0.15)' }}>
        <Link to="/app" className="cta-primary" aria-label="Try AapThozhi in your language">🎙️ Try in your language</Link>
        <Link to="/how-it-works" className="cta-secondary">How it works →</Link>
      </div>
    </div>
  </SiteLayout>
);
