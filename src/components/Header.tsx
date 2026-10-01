import React from 'react';
import { ArrowLeft, Bell, Globe, Shield, Sparkles } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { TRANSLATIONS } from '../data/translations';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { LanguageCode } from '../types';

interface HeaderProps {
  currentLanguage: LanguageCode;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenLanguageModal: () => void;
  onOpenPrivacySettings: () => void;
  onBack?: () => void;
  showBack?: boolean;
  pageTitle?: string;
  headerVoiceText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  unreadCount,
  onOpenNotifications,
  onOpenLanguageModal,
  onOpenPrivacySettings,
  onBack,
  showBack = false,
  pageTitle,
  headerVoiceText,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);

  const voiceAnnouncement =
    headerVoiceText ||
    `${t.appName}. ${t.tagline}. ${pageTitle ? `Current page: ${pageTitle}` : ''}`;

  return (
    <header className="sticky top-0 z-40 bg-[#0B1026]/90 backdrop-blur-md border-b border-[#9B5DE5]/20 px-3 sm:px-6 py-2.5 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Left side: Back or Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {showBack && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-[#141B3B] text-[#C9A7FF] hover:bg-[#9B5DE5] hover:text-white border border-[#9B5DE5]/30 transition-all flex items-center gap-1.5 font-medium text-xs sm:text-sm shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>
          ) : null}

          <div className="flex items-center gap-2 sm:gap-3 min-w-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-[#F3A6C8] p-0.5 shadow-md shadow-[#9B5DE5]/30">
                <img src="/logo.svg" alt="AapThozhi Logo" className="w-full h-full object-contain" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0B1026] rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 m-0 p-0 leading-tight">
                  {t.appName}
                  <Sparkles size={14} className="text-[#F3A6C8] hidden sm:inline" />
                </h1>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#9B5DE5]/20 text-[#C9A7FF] border border-[#9B5DE5]/30 font-medium whitespace-nowrap">
                  {currentLangInfo?.nativeName || 'தமிழ்'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#B7BDD3] truncate m-0 p-0">
                {t.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Accessibility Voice, Notifications, Language, Privacy */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Main Speaker for Screen Announcement */}
          <SpeakerButton
            textToSpeak={voiceAnnouncement}
            langCode={currentLanguage}
            size="md"
            ariaLabel="Hear page description"
            className="shadow-sm"
          />

          {/* Language Switcher */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#141B3B] text-[#C9A7FF] hover:bg-[#9B5DE5]/30 border border-[#9B5DE5]/40 transition-colors text-xs sm:text-sm font-medium"
            title="Change language"
            aria-label="Change language"
          >
            <Globe size={17} className="text-[#F3A6C8]" />
            <span className="hidden md:inline">{currentLangInfo?.name || 'Language'}</span>
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 sm:p-2.5 rounded-xl bg-[#141B3B] text-[#C9A7FF] hover:bg-[#9B5DE5]/30 border border-[#9B5DE5]/30 transition-colors"
            title="Notifications"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#EF6A7B] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#0B1026] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Privacy & Safety Settings */}
          <button
            type="button"
            onClick={onOpenPrivacySettings}
            className="p-2 sm:p-2.5 rounded-xl bg-[#141B3B] text-[#C9A7FF] hover:bg-[#9B5DE5]/30 border border-[#9B5DE5]/30 transition-colors"
            title="Privacy and Safety"
            aria-label="Privacy and Safety settings"
          >
            <Shield size={18} className="text-[#45C27C]" />
          </button>
        </div>
      </div>
    </header>
  );
};
