import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public site pages
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SupportedLanguagesPage } from './pages/SupportedLanguagesPage';
import { SchemeGuidancePage } from './pages/SchemeGuidancePage';
import { OfflineHelpPage } from './pages/OfflineHelpPage';
import { PrivacySafetyPage } from './pages/PrivacySafetyPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfUsePage } from './pages/TermsOfUsePage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { NotFoundPage } from './pages/NotFoundPage';

// The existing SPA tool
import App from './App';

// Cookie consent banner
import { CookieConsent } from './components/CookieConsent';

const RootRouter: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public marketing / SEO pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/languages" element={<SupportedLanguagesPage />} />
        <Route path="/schemes" element={<SchemeGuidancePage />} />
        <Route path="/offline-help" element={<OfflineHelpPage />} />
        <Route path="/privacy-safety" element={<PrivacySafetyPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfUsePage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />

        {/* The actual voice assistant app — launched via /app */}
        <Route path="/app/*" element={<App />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global cookie consent (shown on all pages) */}
      <CookieConsent />
    </>
  );
};

export default RootRouter;
