import React, { useEffect, useState } from 'react';
import {
  Check,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { LanguageCode } from '../types';
import {
  INDIAN_STATES_CITIES,
  REGIONAL_LANGUAGE_SUGGESTIONS,
  SUPPORTED_LANGUAGES,
} from '../data/languages';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { speechService } from '../services/speechService';

interface RegionalAssistConsentViewProps {
  currentLanguage: LanguageCode;
  onAllowLocation: (region: { state: string; city: string }) => void;
  onSkipLocation: () => void;
  onBack: () => void;
}

export const RegionalAssistConsentView: React.FC<RegionalAssistConsentViewProps> = ({
  currentLanguage,
  onAllowLocation,
  onSkipLocation,
  onBack,
}) => {
  const [hasPromptedAllowed, setHasPromptedAllowed] = useState(false);
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [deniedMessageVisible, setDeniedMessageVisible] = useState(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  useEffect(() => {
    // Read voice guidance in chosen language
    speechService.speak(t.regionalAssistVoice, currentLanguage, 1.0);
    return () => {
      speechService.stop();
    };
  }, [currentLanguage]);

  const currentStateObj = INDIAN_STATES_CITIES.find((s) => s.state === selectedState);
  const suggestedLangs = REGIONAL_LANGUAGE_SUGGESTIONS[selectedState] || ['ta', 'en'];

  const handleAllow = () => {
    setHasPromptedAllowed(true);
    const audioConfirm = `Location approximate set to ${selectedCity}, ${selectedState}.`;
    speechService.speak(audioConfirm, currentLanguage, 1.0);
  };

  const handleDeny = () => {
    setDeniedMessageVisible(true);
    speechService.speak(t.locationDeniedMsg, currentLanguage, 1.0);
    setTimeout(() => {
      onSkipLocation();
    }, 1800);
  };

  const handleFinalContinue = () => {
    onAllowLocation({ state: selectedState, city: selectedCity });
  };

  return (
    <div className="min-h-screen bg-[#0B1026] text-white flex flex-col justify-between p-4 sm:p-6 relative">
      {/* Background orbs */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#9B5DE5]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#45C27C]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-xs text-[#C9A7FF] font-medium"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <SpeakerButton
            textToSpeak={t.regionalAssistVoice}
            langCode={currentLanguage}
            size="md"
            ariaLabel="Hear location explanation"
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-lg mx-auto w-full my-auto py-6 flex flex-col items-center text-center">
        {/* Illustrations: Map Pin + Privacy Shield */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#1B234A] to-[#141B3B] border-2 border-[#9B5DE5]/40 flex items-center justify-center shadow-xl shadow-[#9B5DE5]/20">
            <MapPin size={46} className="text-[#F3A6C8] animate-bounce" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#0B1026] border-2 border-[#45C27C] flex items-center justify-center text-[#45C27C] shadow-md">
            <ShieldCheck size={22} />
          </div>
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-[#F3A6C8] bg-[#9B5DE5]/20 px-3.5 py-1 rounded-full mb-2">
          {t.regionalAssistTitle}
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
          Find nearby help & local languages
        </h2>

        <p className="text-sm text-[#B7BDD3] max-w-md mb-6 leading-relaxed">
          {t.regionalAssistDesc}
        </p>

        {/* If denied message */}
        {deniedMessageVisible && (
          <div className="w-full p-4 mb-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-sm font-medium animate-in fade-in">
            {t.locationDeniedMsg}
          </div>
        )}

        {!hasPromptedAllowed ? (
          /* Two Large Choices: Allow or Not Now */
          <div className="w-full space-y-3.5">
            <button
              type="button"
              onClick={handleAllow}
              className="w-full py-4 px-6 rounded-2xl bg-[#45C27C] hover:bg-[#3db270] text-[#0B1026] font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-[#45C27C]/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#0B1026] text-[#45C27C] flex items-center justify-center">
                <Check size={16} strokeWidth={3.5} />
              </div>
              <span>{t.allowLocationBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleDeny}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-[#C9A7FF] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Lock size={16} className="text-[#B7BDD3]" />
              <span>{t.notNowBtn}</span>
            </button>
          </div>
        ) : (
          /* Simulated Region Selector for Demo */
          <div className="w-full bg-[#131A3B] border-2 border-[#45C27C]/60 rounded-3xl p-6 text-left animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#45C27C] flex items-center gap-1.5">
                <Check size={16} /> Approximate Region Detected
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#45C27C]/20 text-[#45C27C]">
                Private & Secure
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-[#B7BDD3] block mb-1">State / Province:</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    const stateObj = INDIAN_STATES_CITIES.find((s) => s.state === e.target.value);
                    if (stateObj && stateObj.cities.length > 0) {
                      setSelectedCity(stateObj.cities[0]);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#0D1333] border border-[#9B5DE5]/40 text-white text-xs font-medium focus:outline-none focus:border-[#F3A6C8]"
                >
                  {INDIAN_STATES_CITIES.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#B7BDD3] block mb-1">City / District:</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0D1333] border border-[#9B5DE5]/40 text-white text-xs font-medium focus:outline-none focus:border-[#F3A6C8]"
                >
                  {currentStateObj?.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Regional Language Suggestions */}
            <div className="p-3.5 bg-[#0B1026]/70 rounded-2xl border border-[#9B5DE5]/20 mb-5">
              <span className="text-xs text-[#C9A7FF] font-semibold block mb-2">
                Languages commonly spoken around {selectedCity}:
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedLangs.map((code) => {
                  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
                  if (!lang) return null;
                  return (
                    <span
                      key={code}
                      className="px-2.5 py-1 rounded-xl bg-[#9B5DE5]/25 border border-[#9B5DE5]/40 text-xs text-white font-medium flex items-center gap-1"
                    >
                      <Sparkles size={12} className="text-[#F3A6C8]" />
                      {lang.nativeName} ({lang.name})
                    </span>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#B7BDD3] mt-2 italic">
                Notice: All Indian languages remain freely accessible anytime.
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinalContinue}
              className="w-full py-3.5 rounded-2xl bg-[#45C27C] hover:bg-[#3db270] text-[#0B1026] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#45C27C]/30 transition-all cursor-pointer"
            >
              <span>Continue to Secure Login</span>
              <Check size={18} strokeWidth={3} />
            </button>
          </div>
        )}

        {/* Privacy Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#B7BDD3] max-w-sm">
          <ShieldCheck size={16} className="text-[#45C27C] shrink-0" />
          <span>{t.approxLocationReassurance}</span>
        </div>
      </main>

      <footer className="max-w-xl mx-auto w-full text-center pb-2 text-xs text-[#B7BDD3]">
        Dekho. Suno. Karo. — You are always in control of your data.
      </footer>
    </div>
  );
};
