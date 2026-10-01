import React, { useState } from 'react';
import {
  AlertTriangle,
  BookmarkCheck,
  Check,
  ExternalLink,
  Lock,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { LanguageCode, SchemeInfo } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from './SpeakerButton';

interface ExternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: SchemeInfo;
  currentLanguage: LanguageCode;
  onSavePlan: () => void;
}

export const ExternalLinkModal: React.FC<ExternalLinkModalProps> = ({
  isOpen,
  onClose,
  scheme,
  currentLanguage,
  onSavePlan,
}) => {
  const [openedSimulated, setOpenedSimulated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const voiceSafetyText = `Official government portal safe access. Please keep your documents ready. ${t.safetyCardText}`;

  const handleSimulateOpen = () => {
    setOpenedSimulated(true);
  };

  const handleSave = () => {
    onSavePlan();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ext-link-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-[#0D1333] border-3 border-[#9B5DE5] rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#131A3B] border-b border-[#9B5DE5]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1">
                <Lock size={12} /> {t.officialGovSite}
              </span>
              <h2 id="ext-link-title" className="text-lg font-bold text-white m-0">
                {scheme.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SpeakerButton textToSpeak={voiceSafetyText} langCode={currentLanguage} size="md" />
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-[#1A234E] text-[#B7BDD3] hover:text-white hover:bg-red-500/20 transition-colors"
              aria-label="Close external portal modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Portal badge */}
          <div className="p-4 rounded-2xl bg-[#141B3B] border border-[#9B5DE5]/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#C9A7FF] font-medium">Verified Official Destination:</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                gov.in verified
              </span>
            </div>
            <p className="font-semibold text-white mt-1 text-sm">{scheme.officialPortalName}</p>
            <p className="text-xs text-[#B7BDD3] font-mono mt-0.5 truncate">{scheme.officialUrl}</p>
          </div>

          {/* Checklist before opening */}
          <div className="p-4 rounded-2xl bg-[#0B1026]/70 border border-[#9B5DE5]/20">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2.5">
              <span className="text-base">📋</span> {t.keepReady}
            </h3>
            <ul className="space-y-1.5 text-xs text-[#B7BDD3]">
              {scheme.documents
                .filter((d) => d.isRequired)
                .map((doc) => (
                  <li key={doc.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#45C27C]" />
                    <span className="text-white font-medium">{doc.name}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Critical anti-fraud alert */}
          <div className="p-4 rounded-2xl bg-[#EF6A7B]/15 border-2 border-[#EF6A7B]/50 flex items-start gap-3">
            <ShieldAlert className="text-[#EF6A7B] shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Safety & Anti-Fraud Rule</h4>
              <p className="text-xs text-[#F7F5FA] leading-relaxed">
                {t.safetyCardText} Official government websites will NEVER call to ask for your bank password or money transfer.
              </p>
            </div>
          </div>

          {/* Simulated Portal Preview */}
          {openedSimulated ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                <Check size={18} />
                <span>Simulated Secure Portal Window Opened</span>
              </div>
              <p className="text-xs text-[#B7BDD3] leading-relaxed">
                In this hackathon demonstration prototype, external links are simulated to safeguard user privacy. In live deployment, this opens the authenticated state portal in a secure browser tab.
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 bg-[#131A3B] border-t border-[#9B5DE5]/30 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2.5 rounded-2xl bg-[#0D1333] border border-[#9B5DE5]/40 text-[#C9A7FF] hover:bg-[#1A234E] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BookmarkCheck size={16} className={isSaved ? 'text-emerald-400' : ''} />
            <span>{isSaved ? 'Saved!' : t.saveForLaterBtn}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-[#0D1333] border border-[#9B5DE5]/30 text-[#B7BDD3] hover:text-white text-xs sm:text-sm font-medium"
            >
              Stay in AapThozhi
            </button>

            <button
              type="button"
              onClick={handleSimulateOpen}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-[#0B1026] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all"
            >
              <span>{t.onlineRouteTitle}</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
