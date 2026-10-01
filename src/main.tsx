import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import RootRouter from './RootRouter.tsx';

// GA4 privacy-safe initialisation (no cookies until consent given)
if (typeof window !== 'undefined' && import.meta.env.VITE_GA4_ID) {
  const ga4Id = import.meta.env.VITE_GA4_ID as string;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
  document.head.appendChild(script);
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  // anonymize_ip + no ad features = privacy-safe baseline
  gtag('config', ga4Id, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <RootRouter />
    </HashRouter>
  </StrictMode>,
);
