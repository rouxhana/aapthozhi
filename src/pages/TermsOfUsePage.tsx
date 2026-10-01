import React from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

export const TermsOfUsePage: React.FC = () => (
  <SiteLayout
    title="Terms of Use — AapThozhi Voice Guide for Indian Women"
    description="AapThozhi Terms of Use — informational guidance only, no legal advice, official-source disclaimer, user responsibilities, and MIT open-source licence."
  >
    <div className="page-container prose" style={{ maxWidth: 760 }}>
      <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div className="section-label">Legal</div>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>Terms of Use</h1>
        <p style={{ color: '#7882A4', fontSize: '0.875rem' }}>Last updated: 1 October 2025</p>
      </div>

      <div className="disclaimer-box" role="note">
        <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>⚠️</span>
        <span><strong>AapThozhi provides guidance and links to official government sources only.</strong> Eligibility, benefits, and approvals are decided solely by the relevant government authority.</span>
      </div>

      <div className="prose" style={{ marginTop: '1.5rem' }}>
        <h2>1. Acceptance of terms</h2>
        <p>By accessing or using AapThozhi ("the Service"), you agree to be bound by these Terms of Use. If you do not agree, do not use the Service.</p>

        <h2>2. Nature of the Service</h2>
        <p>AapThozhi is an informational and navigational guide. It:</p>
        <ul>
          <li>Provides summaries of government welfare schemes sourced from official .gov.in portals.</li>
          <li>Generates voice-guided step-by-step plans to help users understand eligibility and application processes.</li>
          <li>Links to official government websites for actual applications.</li>
        </ul>
        <p><strong>AapThozhi does not:</strong> apply for schemes on your behalf, guarantee approval, provide legal advice, or store any personal documents.</p>

        <h2>3. Official-source disclaimer</h2>
        <p>All scheme information on AapThozhi is drawn from publicly available official government sources. However, scheme details, eligibility criteria, and benefit amounts can change. <strong>Always verify current information at the official .gov.in or .nic.in portal before acting.</strong></p>

        <h2>4. No payment required</h2>
        <p>Government welfare schemes are free to apply for. AapThozhi is a free service. <strong>Do not pay anyone who claims to offer guaranteed approval</strong> using or claiming to be associated with AapThozhi.</p>

        <h2>5. User responsibilities</h2>
        <ul>
          <li>Provide accurate information when interacting with the voice assistant.</li>
          <li>Verify eligibility and documents with the official government office before travelling.</li>
          <li>Do not misuse the Service to access information on behalf of others without their consent.</li>
        </ul>

        <h2>6. Intellectual property</h2>
        <p>AapThozhi is released under the <a href="https://github.com/rouxhana/aapthozhi/blob/main/LICENSE" rel="noopener noreferrer">MIT Licence</a>. You are free to use, copy, modify, and distribute the code with attribution.</p>

        <h2>7. Limitation of liability</h2>
        <p>AapThozhi is provided "as is" without warranty of any kind. The project maintainers are not liable for any loss or damage arising from use of the Service, errors in scheme information, or decisions made by government authorities.</p>

        <h2>8. Governing law</h2>
        <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts of India.</p>

        <h2>9. Contact</h2>
        <p>Questions about these terms: <Link to="/contact">Contact form</Link>.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(155,93,229,0.15)' }}>
        <Link to="/privacy-policy" className="cta-secondary">Privacy Policy</Link>
        <Link to="/accessibility" className="cta-secondary">Accessibility</Link>
      </div>
    </div>
  </SiteLayout>
);
