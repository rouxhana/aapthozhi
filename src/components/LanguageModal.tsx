import React from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { LanguageCode } from '../types';
import { SpeakerButton } from './SpeakerButton';
import { TRANSLATIONS } from '../data/translations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#0D1333] border-2 border-[#9B5DE5]/50 rounded-3xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#9B5DE5]/20 flex items-center justify-between bg-[#131A3B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9B5DE5]/20 border border-[#9B5DE5]/40 flex items-center justify-center text-[#F3A6C8]">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 id="lang-modal-title" className="text-lg sm:text-xl font-bold text-white m-0">
                {t.changeLangBtn}
              </h2>
              <p className="text-xs text-[#B7BDD3] m-0 mt-0.5">
                {t.speakComfortable}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SpeakerButton
              textToSpeak={`${t.changeLangBtn}. ${t.speakComfortable}`}
              langCode={selectedLanguage}
              size="md"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-[#1A234E] text-[#B7BDD3] hover:text-white hover:bg-red-500/20 transition-colors"
              aria-label="Close language selector"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 max-h-[65vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;

              return (
                <div
                  key={lang.code}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#9B5DE5]/30 to-[#F3A6C8]/20 border-[#F3A6C8] shadow-lg shadow-[#9B5DE5]/20 ring-2 ring-[#F3A6C8]/30'
                      : 'bg-[#141B3B] border-[#9B5DE5]/25 hover:border-[#9B5DE5] hover:bg-[#1A234E]'
                  }`}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    onClose();
                  }}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-white tracking-wide">
                        {lang.nativeName}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#45C27C] text-[#0B1026] flex items-center justify-center">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#B7BDD3] font-medium mt-0.5">
                      {lang.name} • <span className="text-[#C9A7FF]">{lang.script}</span>
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <SpeakerButton
                      textToSpeak={lang.welcomeVoiceText}
                      langCode={lang.code}
                      size="sm"
                      ariaLabel={`Hear ${lang.name}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 bg-[#111633] border-t border-[#9B5DE5]/20 text-center">
          <p className="text-xs text-[#B7BDD3]">
            Dekho. Suno. Karo. — Every screen adapts immediately to your chosen language.
          </p>
        </div>
      </div>
    </div>
  );
};
