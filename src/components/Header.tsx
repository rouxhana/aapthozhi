import React from 'react';
import { ArrowLeft, Bell, Globe, PhoneCall, Shield, ShieldAlert, Sparkles, Volume2 } from 'lucide-react';
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
  onOpenSafety?: () => void;
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
  onOpenSafety,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);

  const voiceAnnouncement =
    headerVoiceText ||
    `${t.appName}. ${t.tagline}. ${pageTitle ? `Current page: ${pageTitle}` : ''}`;

  return (
    <header className="sticky top-0 z-40 bg-[#0B1026]/95 backdrop-blur-md border-b-2 border-[#9B5DE5]/30 px-3 sm:px-6 py-2.5 shadow-xl">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Left side: Back or Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {showBack && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="p-2 sm:p-2.5 rounded-2xl bg-[#141B3B] text-[#C9A7FF] hover:bg-[#9B5DE5] hover:text-white border-2 border-[#9B5DE5]/40 transition-all flex items-center gap-1.5 font-bold text-xs sm:text-sm shrink-0 shadow-md cursor-pointer"
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft size={22} className="stroke-[2.5]" />
              <span className="hidden sm:inline">Back</span>
            </button>
          ) : null}

          <div
            className="flex items-center gap-2 sm:gap-3 min-w-0 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#9B5DE5] via-[#8338EC] to-[#F3A6C8] p-1 shadow-lg shadow-[#9B5DE5]/40 group-hover:scale-105 transition-transform flex items-center justify-center">
                <img src="/logo.svg" alt="AapThozhi Logo" className="w-full h-full object-contain" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-[#0B1026] rounded-full shadow-sm" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 m-0 p-0 leading-tight">
                  {t.appName}
                  <Sparkles size={16} className="text-[#F3A6C8] hidden sm:inline" />
                </h1>
                <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-[#9B5DE5]/25 text-[#F3A6C8] border border-[#9B5DE5]/40 font-bold whitespace-nowrap shadow-sm">
                  {currentLangInfo?.nativeName || 'தமிழ்'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#B7BDD3] truncate m-0 p-0 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Accessibility Voice, SOS 181, Language, Notifications, Privacy */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Main Speaker for Screen Announcement */}
          <SpeakerButton
            textToSpeak={voiceAnnouncement}
            langCode={currentLanguage}
            size="md"
            ariaLabel="Hear page description"
            className="shadow-md"
          />

          {/* Quick SOS 181 Emergency Call / Safety trigger */}
          <button
            type="button"
            onClick={onOpenSafety}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-[#EF6A7B] to-rose-600 hover:from-rose-500 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-[#EF6A7B]/40 border border-white/20 transition-transform active:scale-95 cursor-pointer"
            title="Helpline 181 - Women Emergency & Safety Center"
            aria-label="Women Emergency Helpline 181"
          >
            <ShieldAlert size={20} className="stroke-[2.5] animate-pulse" />
            <span className="hidden sm:inline">181 SOS</span>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-[#141B3B] text-[#C9A7FF] hover:bg-[#9B5DE5]/30 hover:text-white border-2 border-[#9B5DE5]/40 transition-all text-xs sm:text-sm font-bold shadow-md cursor-pointer"
            title="Change language"
            aria-label="Change language"
          >
            <Globe size={22} className="text-[#F3A6C8] stroke-[2.2]" />
            <span className="hidden md:inline">{currentLangInfo?.name || 'Language'}</span>
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 sm:p-2.5 rounded-2xl bg-[#141B3B] text-[#C9A7FF] hover:bg-[#9B5DE5]/30 hover:text-white border-2 border-[#9B5DE5]/40 transition-all shadow-md cursor-pointer"
            title="Notifications"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell size={22} className="stroke-[2.2]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-[#EF6A7B] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#0B1026] animate-pulse shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Privacy & Safety Settings */}
          <button
            type="button"
            onClick={onOpenPrivacySettings}
            className="p-2 sm:p-2.5 rounded-2xl bg-[#141B3B] text-[#C9A7FF] hover:bg-[#9B5DE5]/30 hover:text-white border-2 border-[#9B5DE5]/40 transition-all shadow-md cursor-pointer"
            title="Privacy and Safety"
            aria-label="Privacy and Safety settings"
          >
            <Shield size={22} className="text-[#45C27C] stroke-[2.2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
