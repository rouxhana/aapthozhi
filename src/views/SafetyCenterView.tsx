import React, { useEffect } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Lock,
  PhoneOff,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Volume2,
  XCircle,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { speechService } from '../services/speechService';

interface SafetyCenterViewProps {
  currentLanguage: LanguageCode;
  onBack: () => void;
}

export const SafetyCenterView: React.FC<SafetyCenterViewProps> = ({
  currentLanguage,
  onBack,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const safetyAnnouncement = `${t.safetyTitle}. ${t.neverAskOtp} Always verify through official channels.`;

  useEffect(() => {
    speechService.speak(safetyAnnouncement, currentLanguage);
    return () => {
      speechService.stop();
    };
  }, [currentLanguage]);

  const rules = [
    {
      icon: <Building2 className="text-[#45C27C]" size={26} />,
      title: 'Use Official Government Portals Only',
      desc: 'All genuine government scheme websites end in .gov.in or .nic.in. AapThozhi exclusively directs you to verified portals.',
    },
    {
      icon: <PhoneOff className="text-[#EF6A7B]" size={26} />,
      title: 'Do Not Pay Unknown Middlemen',
      desc: 'Government welfare schemes and scholarship applications are completely free. Never give cash to agents promising guaranteed approval.',
    },
    {
      icon: <UserCheck className="text-[#F3A6C8]" size={26} />,
      title: 'Ask a Trusted Person Before Signing',
      desc: 'If any form or paper looks unfamiliar, show it to your local Anganwadi didi or a family member before putting your signature or thumbprint.',
    },
    {
      icon: <CheckCircle2 className="text-[#9B5DE5]" size={26} />,
      title: 'Verify Details Before Submitting',
      desc: 'Check that student names, Aadhaar numbers, and bank account numbers are correctly entered so money transfers are never delayed.',
    },
    {
      icon: <Lock className="text-[#C9A7FF]" size={26} />,
      title: 'You Control What You Share',
      desc: 'Your voice inputs and saved plans reside on your device. You can erase your history anytime in Settings with a single tap.',
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

        <SpeakerButton
          textToSpeak={safetyAnnouncement}
          langCode={currentLanguage}
          size="md"
        />
      </div>

      {/* Main Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#241328] via-[#1A1233] to-[#0D1026] border-3 border-[#EF6A7B] shadow-2xl text-center">
        {/* Large Crossed-out Fraud Warning Icon */}
        <div className="relative w-20 h-20 rounded-3xl bg-[#EF6A7B]/20 border-2 border-[#EF6A7B] flex items-center justify-center text-[#EF6A7B] mx-auto mb-4 shadow-xl shadow-[#EF6A7B]/30 animate-pulse">
          <ShieldAlert size={44} />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-[#EF6A7B] bg-[#EF6A7B]/20 px-3.5 py-1 rounded-full inline-block mb-2">
          Golden Safety Rule
        </span>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight">
          {t.neverAskOtp}
        </h2>

        <p className="text-xs sm:text-sm text-[#F7F5FA] max-w-md mx-auto leading-relaxed bg-[#0B1026]/70 p-4 rounded-2xl border border-[#EF6A7B]/30">
          No bank, government department, or police will ever call you to ask for your ATM PIN, UPI PIN, or SMS code. If someone asks, it is fraud!
        </p>
      </div>

      {/* 5 Safety Pillars */}
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-[#C9A7FF] block">
          5 Pillars of Everyday Digital Safety:
        </span>

        {rules.map((rule, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-[#131A3B] border border-[#9B5DE5]/25 flex items-start gap-3.5 hover:border-[#9B5DE5] transition-colors"
          >
            <div className="p-2.5 rounded-xl bg-[#0B1026] border border-[#9B5DE5]/20 shrink-0 mt-0.5">
              {rule.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white m-0">
                  {rule.title}
                </h3>
                <SpeakerButton
                  textToSpeak={`${rule.title}. ${rule.desc}`}
                  langCode={currentLanguage}
                  size="sm"
                />
              </div>
              <p className="text-xs text-[#B7BDD3] mt-1 leading-relaxed">
                {rule.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
