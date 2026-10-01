import React from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

const SCHEMES = [
  { icon: '🌸', name: 'Sukanya Samriddhi Yojana (SSY)', cat: 'Savings & Education', who: 'Girls under 10 years (through parents)', benefit: 'High-interest savings account for daughter\'s education or marriage', where: 'Any Post Office or Government Bank', docs: 'Birth Certificate, Aadhaar, Photograph' },
  { icon: '🔥', name: 'Pradhan Mantri Ujjwala Yojana (PMUY)', cat: 'Household / Cooking Gas', who: 'Women from BPL (Below Poverty Line) households', benefit: 'Free LPG gas cylinder connection and first refill', where: 'Nearest Gas Agency counter', docs: 'BPL Ration Card, Aadhaar, Bank Account' },
  { icon: '🎓', name: 'Pragati Scholarship', cat: 'Higher Education', who: 'Girls in Diploma/Degree technical courses', benefit: '₹50,000 per year for tuition and living expenses', where: 'AICTE Online Portal or nearest AICTE office', docs: 'Aadhaar, Marksheets, Income Certificate, Bank Account' },
  { icon: '🤱', name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)', cat: 'Motherhood & Nutrition', who: 'First-time pregnant or nursing mothers', benefit: '₹5,000 direct bank transfer for nutrition and care', where: 'Anganwadi Centre or nearest Health Sub-Centre', docs: 'Aadhaar, MCP Card, Bank Account' },
  { icon: '🧵', name: 'Free Sewing Machine Scheme', cat: 'Livelihood / Skills', who: 'Women aged 20–40 from low-income families', benefit: 'Free sewing machine for home-based tailoring business', where: 'State Labour Department office or CSC Centre', docs: 'Aadhaar, Age Proof, Income Certificate, Photograph' },
  { icon: '🏥', name: 'Ayushman Bharat (PMJAY)', cat: 'Healthcare', who: 'BPL families — includes women and girls', benefit: 'Cashless hospital treatment up to ₹5,00,000 per family per year', where: 'Empanelled hospital or Common Service Centre (CSC)', docs: 'Ration Card / SECC data, Aadhaar' },
  { icon: '👵', name: 'National Social Assistance Programme (NSAP — Widow Pension)', cat: 'Social Security / Pension', who: 'Widows from BPL households aged 40+', benefit: '₹300–₹500 monthly direct bank pension', where: 'District Social Welfare Office or Gram Panchayat', docs: 'Husband\'s Death Certificate, Aadhaar, Bank Account, BPL Card' },
  { icon: '💰', name: 'Kanya Shree Prakalpa (West Bengal)', cat: 'Education Scholarship', who: 'Girls aged 13–18 enrolled in school', benefit: '₹750 annual scholarship + ₹25,000 one-time grant at 18', where: 'School Principal or District Social Welfare Office', docs: 'Aadhaar, School Enrolment Certificate, Bank Account' },
];

export const SchemeGuidancePage: React.FC = () => (
  <SiteLayout
    title="Indian Government Welfare Schemes for Women — Guidance & Eligibility | AapThozhi"
    description="Browse AapThozhi's verified guide to government welfare schemes for Indian women including Sukanya Samriddhi, Ujjwala, Pragati Scholarship, Matru Vandana, Ayushman Bharat, and more."
  >
    <div className="page-container">
      <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div className="section-label">Scheme Database</div>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
          Government Scheme Guidance
        </h1>
        <p className="section-desc">
          AapThozhi guides you to verified government schemes — who qualifies, what you get, and exactly where to apply. Use the voice assistant to search in your language.
        </p>
        <Link to="/app" className="cta-primary" style={{ display: 'inline-flex', marginTop: '1.25rem' }} aria-label="Search schemes by speaking in your language">
          🎙️ Search schemes by voice
        </Link>
      </div>

      <div className="disclaimer-box" role="note">
        <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>⚠️</span>
        <span><strong>AapThozhi provides guidance and links to official sources only.</strong> Eligibility and approvals are decided by the relevant authority. Always verify at official .gov.in portals.</span>
      </div>

      {/* Scheme cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>
        {SCHEMES.map((s) => (
          <article
            key={s.name}
            style={{
              padding: '1.5rem', borderRadius: '1.25rem',
              background: 'linear-gradient(135deg, #141B3B, #0D1333)',
              border: '2px solid rgba(155,93,229,0.2)',
            }}
            aria-label={s.name}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2.5rem' }} aria-hidden="true">{s.icon}</span>
              <div style={{ flex: 1, minWidth: 220 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#F3A6C8', background: 'rgba(155,93,229,0.18)', padding: '0.25rem 0.625rem', borderRadius: 9999, display: 'inline-block', marginBottom: '0.5rem' }}>{s.cat}</span>
                <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem' }}>{s.name}</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <div style={{ background: 'rgba(155,93,229,0.1)', borderRadius: '0.625rem', padding: '0.625rem 0.875rem', border: '1px solid rgba(155,93,229,0.25)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#C9A7FF', marginBottom: '0.25rem' }}>👤 Who it's for</div>
                    <div style={{ fontSize: '0.875rem', color: '#F7F5FA' }}>{s.who}</div>
                  </div>
                  <div style={{ background: 'rgba(69,194,124,0.1)', borderRadius: '0.625rem', padding: '0.625rem 0.875rem', border: '1px solid rgba(69,194,124,0.25)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#45C27C', marginBottom: '0.25rem' }}>✨ Main Benefit</div>
                    <div style={{ fontSize: '0.875rem', color: '#F7F5FA' }}>{s.benefit}</div>
                  </div>
                  <div style={{ background: 'rgba(243,166,200,0.08)', borderRadius: '0.625rem', padding: '0.625rem 0.875rem', border: '1px solid rgba(243,166,200,0.2)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#F3A6C8', marginBottom: '0.25rem' }}>📍 Where to apply</div>
                    <div style={{ fontSize: '0.875rem', color: '#F7F5FA' }}>{s.where}</div>
                  </div>
                  <div style={{ background: 'rgba(201,167,255,0.08)', borderRadius: '0.625rem', padding: '0.625rem 0.875rem', border: '1px solid rgba(201,167,255,0.2)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#C9A7FF', marginBottom: '0.25rem' }}>📄 Documents</div>
                    <div style={{ fontSize: '0.875rem', color: '#F7F5FA' }}>{s.docs}</div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(155,93,229,0.15)' }}>
        <Link to="/app" className="cta-primary">🎙️ Ask about a scheme by voice</Link>
        <Link to="/offline-help" className="cta-secondary">📍 Need offline help?</Link>
      </div>
    </div>
  </SiteLayout>
);
