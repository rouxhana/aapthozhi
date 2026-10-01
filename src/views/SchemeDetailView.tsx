import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Building,
  Check,
  CheckCircle2,
  FileQuestion,
  FileText,
  Globe,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  IdCard,
  Image,
  MapPin,
  PhoneCall,
  Smartphone,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react';
import { DocumentItem, LanguageCode, SchemeInfo } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { ExplainSlowlyModal } from '../components/ExplainSlowlyModal';
import { ExternalLinkModal } from '../components/ExternalLinkModal';
import { speechService } from '../services/speechService';

interface SchemeDetailViewProps {
  scheme: SchemeInfo;
  currentLanguage: LanguageCode;
  onSelectRoute: (routeType: 'online' | 'offline') => void;
  onSavePlan: () => void;
  onBack: () => void;
}

export const SchemeDetailView: React.FC<SchemeDetailViewProps> = ({
  scheme,
  currentLanguage,
  onSelectRoute,
  onSavePlan,
  onBack,
}) => {
  const [isSlowModalOpen, setIsSlowModalOpen] = useState(false);
  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);
  const [selectedDocForHelp, setSelectedDocForHelp] = useState<DocumentItem | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const fullAnnouncement = `${scheme.title}. ${scheme.description}. ${t.whatItHelpsWith}: ${scheme.benefits.slice(0, 2).join('. ')}. ${t.documentsNeeded}: ${scheme.documents.map((d) => d.name).join(', ')}.`;

  useEffect(() => {
    // Read scheme introduction
    const timer = setTimeout(() => {
      speechService.speak(`${scheme.title}. ${scheme.tagline}.`, currentLanguage, 1.0);
    }, 400);
    return () => {
      clearTimeout(timer);
      speechService.stop();
    };
  }, [scheme, currentLanguage]);

  const renderDocIcon = (type: DocumentItem['iconType']) => {
    switch (type) {
      case 'id-card':
        return <IdCard className="text-[#9B5DE5]" size={24} />;
      case 'bank-passbook':
        return <FileText className="text-[#45C27C]" size={24} />;
      case 'certificate':
        return <GraduationCap className="text-[#F3A6C8]" size={24} />;
      case 'photo':
        return <Image className="text-amber-400" size={24} />;
      default:
        return <FileQuestion className="text-[#EF6A7B]" size={24} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Bar Navigation & Explain Slowly Button */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-xs text-[#C9A7FF] font-medium"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          {/* Explain Slowly Tortoise Button */}
          <button
            type="button"
            onClick={() => setIsSlowModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-[#9B5DE5]/20 border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            title="Explain this scheme step-by-step slowly"
          >
            <span className="text-base" role="img" aria-label="Tortoise">
              🐢
            </span>
            <span>{t.explainSlowlyBtn}</span>
          </button>

          <SpeakerButton
            textToSpeak={fullAnnouncement}
            langCode={currentLanguage}
            size="md"
            ariaLabel="Hear scheme overview"
          />
        </div>
      </div>

      {/* Main Scheme Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#161F48] to-[#0E1430] border-2 border-[#9B5DE5]/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#9B5DE5] to-[#F3A6C8] flex items-center justify-center text-white shrink-0 shadow-xl shadow-[#9B5DE5]/40">
              <GraduationCap size={44} />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#F3A6C8] bg-[#9B5DE5]/25 px-3 py-0.5 rounded-full inline-block mb-1">
                Scheme Action Card
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {scheme.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#C9A7FF] mt-1 font-medium">
                {scheme.tagline}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#F7F5FA] mt-4 leading-relaxed bg-[#0B1026]/40 p-4 rounded-2xl border border-[#9B5DE5]/20">
          {scheme.description}
        </p>

        {/* Prototype Disclaimer Badge */}
        <div className="mt-4 flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
          <AlertCircle size={16} className="shrink-0" />
          <span>{t.prototypeDisclaimer}</span>
        </div>
      </div>

      {/* Two Column Grid: Benefits & Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Benefits Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#131A3B] border border-[#9B5DE5]/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-[#F3A6C8]" />
              {t.whatItHelpsWith}
            </h3>
            <SpeakerButton
              textToSpeak={`${t.whatItHelpsWith}: ${scheme.benefits.join('. ')}`}
              langCode={currentLanguage}
              size="sm"
            />
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-[#B7BDD3]">
            {scheme.benefits.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#45C27C]/20 text-[#45C27C] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  ✓
                </span>
                <span className="text-[#F7F5FA]">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Eligibility Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#131A3B] border border-[#9B5DE5]/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#45C27C]" />
              {t.whoIsEligible}
            </h3>
            <SpeakerButton
              textToSpeak={`${t.whoIsEligible}: ${scheme.eligibility.join('. ')}`}
              langCode={currentLanguage}
              size="sm"
            />
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-[#B7BDD3]">
            {scheme.eligibility.map((e, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#9B5DE5]/20 text-[#C9A7FF] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  •
                </span>
                <span className="text-[#F7F5FA]">{e}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Visual Document Checklist */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#131A3B] border-2 border-[#9B5DE5]/35 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white m-0">
              {t.documentsNeeded}
            </h3>
            <p className="text-xs text-[#B7BDD3] m-0">
              Keep these ready in a small folder before applying
            </p>
          </div>
          <SpeakerButton
            textToSpeak={`${t.documentsNeeded}: ${scheme.documents.map((d) => d.name).join(', ')}`}
            langCode={currentLanguage}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scheme.documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocForHelp(doc)}
              className="p-3.5 rounded-2xl bg-[#0D1333] border border-[#9B5DE5]/30 hover:border-[#F3A6C8] transition-all flex items-start gap-3 cursor-pointer group"
            >
              <div className="p-2.5 rounded-xl bg-[#141B3B] shrink-0 border border-[#9B5DE5]/20 group-hover:scale-105 transition-transform">
                {renderDocIcon(doc.iconType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-white truncate m-0">
                    {doc.name}
                  </h4>
                  {doc.isRequired ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#45C27C]/20 text-[#45C27C] font-semibold shrink-0">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold shrink-0">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#B7BDD3] mt-1 leading-snug">
                  {doc.description}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#C9A7FF]">
                  <span className="hover:underline flex items-center gap-1">
                    <HelpCircle size={12} /> Tap for tip
                  </span>
                  <SpeakerButton
                    textToSpeak={`${doc.name}. ${doc.description}. Tip: ${doc.helpTip}`}
                    langCode={currentLanguage}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Document Explanation Tooltip Card */}
      {selectedDocForHelp && (
        <div className="p-4 rounded-2xl bg-[#1A234E] border-2 border-[#F3A6C8] flex items-start justify-between gap-3 animate-in zoom-in-95">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#0B1026]">
              {renderDocIcon(selectedDocForHelp.iconType)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{selectedDocForHelp.name}</h4>
              <p className="text-xs text-[#F7F5FA] mt-1">{selectedDocForHelp.helpTip}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDocForHelp(null)}
            className="text-xs text-[#B7BDD3] hover:text-white px-2 py-1 bg-[#0B1026] rounded-lg"
          >
            ✕ Close
          </button>
        </div>
      )}

      {/* TWO EQUAL NEXT-STEP ROUTES */}
      <div className="pt-4 space-y-4">
        <div className="text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#F3A6C8] bg-[#9B5DE5]/20 px-3 py-1 rounded-full mb-1 inline-block">
            Next Action
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            {t.howToContinue}
          </h3>
          <p className="text-xs text-[#B7BDD3]">
            Choose online application or step-by-step assistance at a nearby centre
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Route A: ONLINE ROUTE */}
          <div
            onClick={() => setIsExternalModalOpen(true)}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#121A3B] to-[#0A1028] border-2 border-[#9B5DE5] hover:border-[#F3A6C8] hover:shadow-2xl hover:shadow-[#9B5DE5]/30 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  <Smartphone size={28} />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Route A
                </span>
              </div>

              <h4 className="text-lg font-bold text-white group-hover:text-[#F3A6C8] transition-colors">
                {t.onlineRouteTitle}
              </h4>
              <p className="text-xs text-[#B7BDD3] mt-1 leading-relaxed">
                {t.onlineRouteDesc}. Verified government portal with anti-fraud safety checklist.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#9B5DE5]/20 flex items-center justify-between text-xs font-bold text-[#C9A7FF]">
              <span>Check preparation & open portal</span>
              <Globe size={18} className="text-[#F3A6C8] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Route B: OFFLINE ROUTE */}
          <div
            onClick={() => onSelectRoute('offline')}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#1E1738] to-[#110D28] border-2 border-[#F3A6C8] hover:border-[#45C27C] hover:shadow-2xl hover:shadow-[#F3A6C8]/30 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F3A6C8] to-[#EF6A7B] flex items-center justify-center text-[#0B1026] shadow-lg group-hover:scale-105 transition-transform font-bold">
                  <MapPin size={28} />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#F3A6C8]/20 text-[#F3A6C8] font-semibold border border-[#F3A6C8]/30">
                  Route B
                </span>
              </div>

              <h4 className="text-lg font-bold text-white group-hover:text-[#45C27C] transition-colors">
                {t.offlineRouteTitle}
              </h4>
              <p className="text-xs text-[#B7BDD3] mt-1 leading-relaxed">
                {t.offlineRouteDesc}. 5-step visual plan with exact "What to say" card.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F3A6C8]/20 flex items-center justify-between text-xs font-bold text-[#F3A6C8]">
              <span>View nearby centres & 5-step plan</span>
              <Users size={18} className="text-[#45C27C] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExplainSlowlyModal
        isOpen={isSlowModalOpen}
        onClose={() => setIsSlowModalOpen(false)}
        title={scheme.title}
        steps={scheme.slowExplanationSteps}
        currentLanguage={currentLanguage}
      />

      <ExternalLinkModal
        isOpen={isExternalModalOpen}
        onClose={() => setIsExternalModalOpen(false)}
        scheme={scheme}
        currentLanguage={currentLanguage}
        onSavePlan={onSavePlan}
      />
    </div>
  );
};
