import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', language: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.message.trim() || form.message.trim().length < 20) e.message = 'Please write at least 20 characters.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    // Simulate async send (mailto fallback)
    setTimeout(() => {
      setSubmitting(false);
      navigate('/thank-you');
    }, 900);
  };

  const field = (id: string, label: string, icon: string, required = false) => (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        <span aria-hidden="true">{icon}</span> {label}{required && <span style={{ color: '#EF6A7B' }}> *</span>}
      </label>
      <input
        id={id}
        className="form-input"
        value={(form as any)[id]}
        onChange={e => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: '' })); }}
        aria-required={required}
        aria-describedby={errors[id] ? `${id}-err` : undefined}
        placeholder={`Enter your ${label.toLowerCase()}`}
        autoComplete={id === 'email' ? 'email' : id === 'name' ? 'name' : id === 'phone' ? 'tel' : undefined}
      />
      {errors[id] && <span id={`${id}-err`} role="alert" style={{ color: '#EF6A7B', fontSize: '0.8125rem', fontWeight: 600 }}>⚠️ {errors[id]}</span>}
    </div>
  );

  return (
    <SiteLayout
      title="Contact AapThozhi — Partner, Collaborate, or Send Enquiry | AapThozhi"
      description="Contact AapThozhi to partner, collaborate, or ask a question. We welcome NGOs, field workers, government agencies, schools, and individual users."
    >
      <div className="page-container">
        <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
          <div className="section-label">Contact</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
            Contact / Partner With Us
          </h1>
          <p className="section-desc">
            Whether you are an individual user, an NGO, a field worker, a government agency, or a school — we would love to hear from you. Fill in the form below and we will respond within 2 working days.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Contact form */}
          <form className="site-form" onSubmit={handleSubmit} noValidate aria-label="Contact enquiry form" id="contact-form">
            {field('name', 'Your Name', '👤', true)}
            {field('email', 'Email Address', '📧', true)}
            {field('phone', 'Phone Number', '📱')}

            <div className="form-group">
              <label htmlFor="role" className="form-label"><span aria-hidden="true">🏷️</span> I am a</label>
              <select id="role" className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="">-- Select your role --</option>
                <option>Individual user / beneficiary</option>
                <option>NGO / civil society organisation</option>
                <option>Field worker / ASHA / Sakhi</option>
                <option>Government official</option>
                <option>Researcher / academic</option>
                <option>Journalist / media</option>
                <option>Technology partner</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="language" className="form-label"><span aria-hidden="true">🌐</span> Preferred language for response</label>
              <select id="language" className="form-select" value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
                <option value="">-- Any language (we will try to match) --</option>
                {['English', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Malayalam', 'Punjabi', 'Odia', 'Assamese', 'Urdu'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label"><span aria-hidden="true">✉️</span> Your message or enquiry <span style={{ color: '#EF6A7B' }}>*</span></label>
              <textarea
                id="message"
                className="form-textarea"
                value={form.message}
                onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: '' })); }}
                placeholder="Tell us about your enquiry, partnership idea, or question..."
                aria-required
                aria-describedby={errors.message ? 'message-err' : undefined}
              />
              {errors.message && <span id="message-err" role="alert" style={{ color: '#EF6A7B', fontSize: '0.8125rem', fontWeight: 600 }}>⚠️ {errors.message}</span>}
            </div>

            <button
              type="submit"
              className="cta-primary"
              style={{ border: 'none', width: '100%', justifyContent: 'center', fontSize: '1rem' }}
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? '⏳ Sending…' : '📨 Send Enquiry'}
            </button>

            <p style={{ fontSize: '0.75rem', color: '#7882A4', textAlign: 'center', margin: '0.5rem 0 0' }}>
              We respect your privacy. See our <Link to="/privacy-policy" style={{ color: '#F3A6C8' }}>Privacy Policy</Link>.
            </p>
          </form>

          {/* Right column: other contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <span className="card-icon" aria-hidden="true">🤝</span>
              <h3 className="card-title">Partnership enquiries</h3>
              <p className="card-desc">NGOs, community organisations, and field teams are welcome to collaborate. We support joint field deployments and training workshops.</p>
            </div>
            <div className="card">
              <span className="card-icon" aria-hidden="true">📞</span>
              <h3 className="card-title">Women's Emergency Helpline</h3>
              <p className="card-desc" style={{ marginBottom: '0.5rem' }}>For immediate help or safety concerns, please call:</p>
              <a href="tel:181" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(239,106,123,0.2)', border: '1.5px solid rgba(239,106,123,0.4)', borderRadius: '0.625rem', color: '#EF6A7B', fontWeight: 800, fontSize: '1.125rem', textDecoration: 'none' }} aria-label="Call Women Helpline 181">📞 181</a>
            </div>
            <div className="card">
              <span className="card-icon" aria-hidden="true">⚠️</span>
              <h3 className="card-title">Official-source disclaimer</h3>
              <p className="card-desc">AapThozhi provides guidance and links to official government sources. Eligibility and approvals are decided by the relevant authority.</p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};
