import React, { useState } from 'react';
import {
  Check,
  Copy,
  Maximize2,
  Minimize2,
  Share2,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { speechService } from '../services/speechService';
import { SpeakerButton } from './SpeakerButton';

interface WhatToSayModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageText: string;
  schemeTitle: string;
  currentLanguage: LanguageCode;
}

export const WhatToSayModal: React.FC<WhatToSayModalProps> = ({
  isOpen,
  onClose,
  messageText,
  schemeTitle,
  currentLanguage,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `AapThozhi Request: ${schemeTitle}`,
          text: messageText,
        })
        .catch(() => {
          // fallback
          setShared(true);
          setTimeout(() => setShared(false), 2500);
        });
    } else {
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="what-to-say-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 ${
        isFullScreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`relative w-full flex flex-col bg-[#0D1333] border-3 border-[#F3A6C8] rounded-3xl shadow-2xl overflow-hidden text-white transition-all ${
          isFullScreen
            ? 'h-full max-w-none rounded-none border-0 bg-[#0B1026] justify-between p-6 sm:p-12'
            : 'max-w-xl max-h-[90vh]'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-6 border-b border-[#9B5DE5]/30 flex items-center justify-between ${
            isFullScreen ? 'border-b-2 border-[#F3A6C8]/40' : 'bg-[#141B3B]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F3A6C8]/20 border border-[#F3A6C8]/50 flex items-center justify-center text-[#F3A6C8]">
              <Sparkles size={22} />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#F3A6C8]">
                Real-World Assistance Card
              </span>
              <h2 id="what-to-say-title" className="text-lg sm:text-xl font-bold text-white m-0">
                {t.whatToSayTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-xl bg-[#1A234E] text-[#C9A7FF] hover:bg-[#9B5DE5] hover:text-white border border-[#9B5DE5]/30 transition-colors"
              title={isFullScreen ? 'Exit full screen' : 'Full screen to show helper'}
            >
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-[#1A234E] text-[#B7BDD3] hover:text-white hover:bg-red-500/20 transition-colors"
              aria-label="Close message card"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Big Contrast Message Card */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center overflow-y-auto">
          <div className="p-1 mb-3">
            <span className="text-xs text-[#C9A7FF] font-medium">
              Target Scheme: <strong className="text-white">{schemeTitle}</strong>
            </span>
          </div>

          {/* High-contrast helper card */}
          <div
            className={`rounded-3xl border-3 border-[#F3A6C8] shadow-2xl p-6 sm:p-8 transition-all relative ${
              isFullScreen
                ? 'bg-[#F7F5FA] text-[#0B1026] text-2xl sm:text-4xl font-extrabold leading-snug'
                : 'bg-gradient-to-br from-[#1C2554] to-[#12193D] text-[#FFFFFF] text-lg sm:text-2xl font-bold leading-relaxed'
            }`}
          >
            <div className="absolute top-3 right-3 opacity-30">
              <Sparkles size={isFullScreen ? 40 : 28} className={isFullScreen ? 'text-[#9B5DE5]' : 'text-[#F3A6C8]'} />
            </div>

            <p className="m-0 select-text">
              “{messageText}”
            </p>

            <div
              className={`mt-4 pt-4 border-t flex items-center justify-between text-xs font-semibold ${
                isFullScreen
                  ? 'border-gray-300 text-gray-600'
                  : 'border-[#9B5DE5]/30 text-[#C9A7FF]'
              }`}
            >
              <span>AapThozhi Desk Card</span>
              <span>{isFullScreen ? 'Show this directly to the clerk' : 'Read aloud or show screen'}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#B7BDD3] text-center mt-4">
            💡 {t.whatToSayTip}
          </p>
        </div>

        {/* Action Buttons: Play aloud, Full-screen, Share, Copy */}
        <div className="p-4 sm:p-6 bg-[#141B3B] border-t border-[#9B5DE5]/30 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <SpeakerButton
              textToSpeak={messageText}
              langCode={currentLanguage}
              size="lg"
              showText={true}
              buttonLabel={t.playAloudBtn}
              className="bg-gradient-to-r from-[#9B5DE5] to-[#F3A6C8] text-[#0B1026] font-bold border-0 shadow-lg shadow-[#9B5DE5]/30 hover:opacity-95"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="px-3.5 py-2.5 rounded-2xl bg-[#0D1333] border border-[#9B5DE5]/40 text-[#C9A7FF] hover:bg-[#1A234E] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Maximize2 size={16} />
              <span>{isFullScreen ? 'Exit' : t.fullScreenBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2.5 rounded-2xl bg-[#0D1333] border border-[#9B5DE5]/40 text-[#C9A7FF] hover:bg-[#1A234E] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              {shared ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
              <span>{shared ? 'Shared' : t.shareBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2.5 rounded-2xl bg-[#0D1333] border border-[#9B5DE5]/40 text-[#C9A7FF] hover:bg-[#1A234E] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : t.copyBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
