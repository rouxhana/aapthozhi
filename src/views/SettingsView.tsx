import React, { useEffect, useState } from 'react';
import {
  Bell,
  Globe,
  Lock,
  MapPin,
  RotateCcw,
  Shield,
  ShieldCheck,
  Trash2,
  Volume2,
} from 'lucide-react';
import { LanguageCode, UserState } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { SpeakerButton } from '../components/SpeakerButton';
import { speechService } from '../services/speechService';

interface SettingsViewProps {
  userState: UserState;
  onUpdateState: (newState: Partial<UserState>) => void;
  onResetAllData: () => void;
  onOpenLanguageModal: () => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userState,
  onUpdateState,
  onResetAllData,
  onOpenLanguageModal,
  onBack,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletedToast, setDeletedToast] = useState(false);

  const t = TRANSLATIONS[userState.selectedLanguage] || TRANSLATIONS.en;
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === userState.selectedLanguage);

  const settingsAnnouncement = `Settings and Privacy. You have full control over your language, location, and data history.`;

  useEffect(() => {
    speechService.speak(settingsAnnouncement, userState.selectedLanguage);
    return () => {
      speechService.stop();
    };
  }, [userState.selectedLanguage]);

  const handleToggleLocation = () => {
    onUpdateState({ hasLocationPermission: !userState.hasLocationPermission });
  };

  const handleTogglePrivateMode = () => {
    onUpdateState({ privateMode: !userState.privateMode });
  };

  const handleDeletePlans = () => {
    onUpdateState({ savedPlans: [] });
    setDeletedToast(true);
    setTimeout(() => setDeletedToast(false), 2500);
  };

  const handleResetEverything = () => {
    onResetAllData();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
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
          textToSpeak={settingsAnnouncement}
          langCode={userState.selectedLanguage}
          size="md"
        />
      </div>

      {/* Main Title Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#161B42] to-[#0D102A] border-2 border-[#9B5DE5]/40 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#9B5DE5]/20 border border-[#9B5DE5]/40 flex items-center justify-center text-[#C9A7FF]">
            <ShieldCheck size={26} />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#F3A6C8]">
              Data Privacy & Control
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white m-0">
              {t.settingsTitle}
            </h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#B7BDD3] leading-relaxed">
          You are in complete control of your AapThozhi experience. No tracking without permission, and all saved items can be deleted with a single touch.
        </p>
      </div>

      {deletedToast && (
        <div className="p-3 rounded-2xl bg-[#45C27C]/20 border border-[#45C27C]/40 text-[#45C27C] text-xs font-bold text-center animate-in fade-in">
          ✓ Saved plans successfully cleared!
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* 1. Language Preference */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131A3B] border border-[#9B5DE5]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0B1026] text-[#F3A6C8]">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white m-0">Selected Language</h3>
              <p className="text-xs text-[#B7BDD3] m-0">
                {currentLang?.nativeName} ({currentLang?.name})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="px-3.5 py-1.5 rounded-xl bg-[#9B5DE5] hover:bg-[#8338EC] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* 2. Approximate Location Toggle */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131A3B] border border-[#9B5DE5]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0B1026] text-[#45C27C]">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white m-0">Regional Location Access</h3>
              <p className="text-xs text-[#B7BDD3] m-0">
                {userState.hasLocationPermission
                  ? `Enabled (${userState.simulatedRegion?.city}, ${userState.simulatedRegion?.state})`
                  : 'Disabled (Manual selection)'}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={userState.hasLocationPermission}
            onChange={handleToggleLocation}
            className="accent-[#45C27C] w-5 h-5 rounded cursor-pointer"
          />
        </div>

        {/* 3. Private Mode */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131A3B] border border-[#9B5DE5]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0B1026] text-amber-400">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white m-0">{t.privateModeLabel}</h3>
              <p className="text-xs text-[#B7BDD3] m-0">
                Do not save search queries in local storage
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={userState.privateMode}
            onChange={handleTogglePrivateMode}
            className="accent-amber-400 w-5 h-5 rounded cursor-pointer"
          />
        </div>

        {/* 4. Clear Saved Plans */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131A3B] border border-[#9B5DE5]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0B1026] text-[#EF6A7B]">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white m-0">Delete Saved Plans</h3>
              <p className="text-xs text-[#B7BDD3] m-0">
                Currently holding {userState.savedPlans.length} saved welfare plans
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDeletePlans}
            disabled={userState.savedPlans.length === 0}
            className="px-3.5 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 text-xs font-semibold disabled:opacity-40 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* 5. Reset App Demo State */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131A3B] border border-[#EF6A7B]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0B1026] text-[#EF6A7B]">
              <RotateCcw size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white m-0">Reset Demo Experience</h3>
              <p className="text-xs text-[#B7BDD3] m-0">
                Return to the initial Language Detective screen
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#EF6A7B] text-[#0B1026] font-bold text-xs hover:bg-[#efa0c3] transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-sm bg-[#0D1333] border-2 border-[#EF6A7B] rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-[#EF6A7B] flex items-center justify-center mx-auto">
              <RotateCcw size={24} />
            </div>
            <h3 className="text-base font-bold text-white">Reset Demo Session?</h3>
            <p className="text-xs text-[#B7BDD3]">
              This will clear local storage and start fresh from the first Language Detective microphone screen.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#141B3B] text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetEverything}
                className="px-4 py-2 rounded-xl bg-[#EF6A7B] text-[#0B1026] text-xs font-bold"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
