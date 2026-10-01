import React, { useEffect, useState } from 'react';
import {
  Check,
  Heart,
  HeartHandshake,
  Lock,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  Volume2,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { speechService } from '../services/speechService';

interface TrustedHelperViewProps {
  currentLanguage: LanguageCode;
  onBack: () => void;
  onOpenPrivacySettings: () => void;
}

export const TrustedHelperView: React.FC<TrustedHelperViewProps> = ({
  currentLanguage,
  onBack,
  onOpenPrivacySettings,
}) => {
  const [selectedHelper, setSelectedHelper] = useState<string | null>(null);
  const [shareStepOnly, setShareStepOnly] = useState(true);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const helperVoice = `${t.trustedHelperTitle}. ${t.trustedHelperVoice}`;

  useEffect(() => {
    speechService.speak(helperVoice, currentLanguage);
    return () => {
      speechService.stop();
    };
  }, [currentLanguage]);

  const helpers = [
    {
      id: 'asha',
      title: t.ashaWorker,
      role: 'Government Health & Nutrition Companion',
      desc: 'Connect with your local village or ward ASHA didi for maternal care, immunization, and child health.',
      icon: <HeartHandshake className="text-[#F3A6C8]" size={36} />,
      contact: 'Village Sub-Centre / Ward PHC',
    },
    {
      id: 'sakhi',
      title: t.sakhiHelper,
      role: 'Self Help Group & Livelihood Leader',
      desc: 'Trained local women leaders assisting with micro-loans, education paperwork, and scheme applications.',
      icon: <Users className="text-[#9B5DE5]" size={36} />,
      contact: 'Panchayat Grama Sangha',
    },
    {
      id: 'family',
      title: t.familyWoman,
      role: 'Educated Daughter, Sister or Neighbor',
      desc: 'Send a simplified checklist SMS or WhatsApp to a trusted woman in your family to review.',
      icon: <Heart className="text-[#45C27C]" size={36} />,
      contact: 'Your Direct Contacts',
    },
    {
      id: 'not-now',
      title: 'Not Now (Keep Everything Private)',
      role: 'Self-guided mode',
      desc: 'Explore and save your plans on this device only. No notifications or steps will be shared.',
      icon: <Lock className="text-[#B7BDD3]" size={36} />,
      contact: 'Private Mode Enabled',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-xs text-[#C9A7FF] font-medium"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <SpeakerButton
            textToSpeak={helperVoice}
            langCode={currentLanguage}
            size="md"
          />
          <button
            type="button"
            onClick={onOpenPrivacySettings}
            className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-xs text-[#C9A7FF] font-medium flex items-center gap-1.5"
          >
            <ShieldCheck size={15} className="text-[#45C27C]" />
            <span>Privacy Controls</span>
          </button>
        </div>
      </div>

      {/* Main Title Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1A193F] to-[#0E102E] border-2 border-[#9B5DE5]/50 shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-[#F3A6C8] flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-[#9B5DE5]/30">
          <Users size={32} />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-[#F3A6C8] bg-[#9B5DE5]/20 px-3 py-0.5 rounded-full inline-block mb-1">
          Supportive Community
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight">
          {t.trustedHelperTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#F7F5FA] max-w-md mx-auto leading-relaxed bg-[#0B1026]/40 p-3.5 rounded-2xl border border-[#9B5DE5]/20">
          🛡 {t.trustedHelperVoice}
        </p>
      </div>

      {/* 4 Large Helper Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {helpers.map((h) => {
          const isSelected = selectedHelper === h.id;

          return (
            <div
              key={h.id}
              onClick={() => {
                setSelectedHelper(h.id);
                speechService.speak(`${h.title}. ${h.desc}`, currentLanguage);
              }}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-[#1C2354] to-[#12183B] border-[#F3A6C8] shadow-xl shadow-[#9B5DE5]/20 ring-2 ring-[#F3A6C8]/40'
                  : 'bg-[#141B3B] border-[#9B5DE5]/30 hover:border-[#9B5DE5] hover:bg-[#1A234E]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-2xl bg-[#0B1026] border border-[#9B5DE5]/20 shrink-0">
                    {h.icon}
                  </div>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-[#45C27C] text-[#0B1026] flex items-center justify-center font-bold">
                      <Check size={16} strokeWidth={3} />
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A7FF] block mb-0.5">
                  {h.role}
                </span>
                <h3 className="text-base font-bold text-white mb-1 leading-snug">
                  {h.title}
                </h3>
                <p className="text-xs text-[#B7BDD3] leading-relaxed">
                  {h.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#9B5DE5]/20 flex items-center justify-between text-xs text-[#C9A7FF]">
                <span>{h.contact}</span>
                <SpeakerButton
                  textToSpeak={`${h.title}. ${h.desc}`}
                  langCode={currentLanguage}
                  size="sm"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sharing Control Switcher */}
      <div className="p-4 rounded-2xl bg-[#101533] border border-[#9B5DE5]/30 flex items-center justify-between text-xs text-[#B7BDD3]">
        <div className="flex items-center gap-2">
          <Share2 size={16} className="text-[#F3A6C8]" />
          <span>Share ONLY the single approved action step (Recommended)</span>
        </div>
        <input
          type="checkbox"
          checked={shareStepOnly}
          onChange={(e) => setShareStepOnly(e.target.checked)}
          className="accent-[#9B5DE5] w-4 h-4 cursor-pointer"
        />
      </div>
    </div>
  );
};
