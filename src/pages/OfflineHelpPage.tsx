import React from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

const offlineSteps = [
  { num: 1, icon: '🗣️', title: 'Tell AapThozhi your need by voice', desc: 'Speak your need in your language. Example: "I need gas cylinder help" or "My daughter needs a scholarship."' },
  { num: 2, icon: '📋', title: 'Receive your offline plan card', desc: 'AapThozhi generates a step-by-step visual plan in your language — which office, which day, which counter.' },
  { num: 3, icon: '🗂️', title: 'Gather your documents in a folder', desc: 'The plan lists every document you need (with pictures of what each document looks like, to avoid confusion).' },
  { num: 4, icon: '📍', title: 'Walk to the nearest help centre', desc: 'AapThozhi shows the nearest Post Office, Anganwadi Centre, CSC Centre, or Panchayat Office — with distance from your location.' },
  { num: 5, icon: '💬', title: '"What to say" card at the counter', desc: 'If you are not comfortable speaking to officials, show the official the digital "What to say" card — it explains your need in simple official language.' },
];

const centres = [
  { icon: '📮', name: 'Post Office', desc: 'Sukanya Samriddhi, savings accounts, pension collection, Aadhaar updates' },
  { icon: '🏥', name: 'Anganwadi Centre', desc: 'Matru Vandana (nutrition grant), child health cards, ICDS schemes' },
  { icon: '💻', name: 'Common Service Centre (CSC)', desc: 'Online applications, Aadhaar correction, Ayushman Bharat enrolment' },
  { icon: '⛽', name: 'Gas Agency Counter', desc: 'Ujjwala gas cylinder connection, KYC updates, subsidy claims' },
  { icon: '🏛️', name: 'Gram Panchayat Office', desc: 'NSAP pension, BPL card, local welfare schemes' },
  { icon: '🏢', name: 'District Social Welfare Office', desc: 'Widow pension, disability benefits, scholarship verification' },
];

export const OfflineHelpPage: React.FC = () => (
  <SiteLayout
    title="Offline Help Plan — Where to Go, What to Carry, What to Say | AapThozhi"
    description="AapThozhi's offline help plan shows Indian women exactly which office to visit, which documents to carry, and what to say at the counter — in their own language."
  >
    <div className="page-container">
      <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div className="section-label">📍 Offline Route</div>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
          Offline Help Guide
        </h1>
        <p className="section-desc">
          No internet? No problem. AapThozhi can create a printable offline plan that tells you exactly where to go, what to carry in a folder, whom to ask for, and what words to say.
        </p>
      </div>

      {/* Steps */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Your 5-Step Offline Plan</h2>
      <ul className="steps-list" role="list">
        {offlineSteps.map((s) => (
          <li key={s.num} className="step-item">
            <div className="step-num">{s.num}</div>
            <div className="step-content">
              <h3>{s.icon} {s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Help centres */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Where to Go — Help Centre Types</h2>
        <p style={{ color: '#B7BDD3', fontSize: '0.9rem', marginBottom: '1.5rem' }}>AapThozhi will tell you the nearest one based on your location (with your permission).</p>
        <div className="card-grid">
          {centres.map((c) => (
            <div key={c.name} className="card">
              <span className="card-icon" aria-hidden="true">{c.icon}</span>
              <h3 className="card-title">{c.name}</h3>
              <p className="card-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What to carry */}
      <div style={{ marginTop: '2.5rem', padding: '1.5rem', borderRadius: '1.25rem', background: '#141B3B', border: '2px solid rgba(243,166,200,0.25)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🗂️ Standard Documents to Always Carry
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.625rem' }}>
          {['🪪 Aadhaar Card (original + copy)', '🏦 Bank Passbook (first page)', '📸 2 Passport Photos', '📄 Ration Card (if BPL)', '📋 School/Bonafide Certificate (for education)', '💑 Marriage Certificate (if applicable)', '📃 Income Certificate from Tahsildar', '🗺️ Address Proof (electricity bill or voter ID)'].map(d => (
            <div key={d} style={{ padding: '0.625rem 0.875rem', borderRadius: '0.625rem', background: 'rgba(155,93,229,0.1)', border: '1px solid rgba(155,93,229,0.25)', fontSize: '0.875rem', color: '#F7F5FA' }}>{d}</div>
          ))}
        </div>
      </div>

      <div className="disclaimer-box" style={{ marginTop: '2rem' }} role="note">
        <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>⚠️</span>
        <span>Document requirements may vary by scheme and state. Always verify with your local office. AapThozhi links only to official government sources.</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(155,93,229,0.15)' }}>
        <Link to="/app" className="cta-primary">🎙️ Generate my offline plan</Link>
        <Link to="/schemes" className="cta-secondary">📋 Browse scheme guide</Link>
      </div>
    </div>
  </SiteLayout>
);
