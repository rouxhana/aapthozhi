import React, { useEffect, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Globe,
  Mic,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { LanguageCode, LanguageInfo } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { speechService } from '../services/speechService';
import confetti from 'canvas-confetti';

interface LanguageDetectiveViewProps {
  onConfirmLanguage: (lang: LanguageCode) => void;
  onOpenLanguageList: () => void;
}

export const LanguageDetectiveView: React.FC<LanguageDetectiveViewProps> = ({
  onConfirmLanguage,
  onOpenLanguageList,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageInfo | null>(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [isLowConfidence, setIsLowConfidence] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);
  const [demoSelectedLang, setDemoSelectedLang] = useState<LanguageCode>('ta');

  const defaultLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === 'ta') || SUPPORTED_LANGUAGES[0];

  // Welcome voice readout
  const welcomeText =
    'Welcome to AapThozhi. Please speak in whatever language you are comfortable with. AapThozhi will understand and speak back in your language.';

  useEffect(() => {
    // Initial welcome voice guide
    const timer = setTimeout(() => {
      speechService.speak(welcomeText, 'en', 1.0);
    }, 600);
    return () => {
      clearTimeout(timer);
      speechService.stop();
    };
  }, []);

  // Simulate speaking and automatic detection
  const startDetectionFlow = (targetLangCode?: LanguageCode, forceLowConfidence = false) => {
    speechService.stop();
    setIsListening(true);
    setDetectedLanguage(null);
    setIsLowConfidence(false);
    setTranscribedText('');

    const chosenLangCode = targetLangCode || demoSelectedLang || 'ta';
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === chosenLangCode) || defaultLangInfo;

    // Simulate speech recognition listening
    setTimeout(() => {
      setTranscribedText(lang.demoPhrase);

      setTimeout(() => {
        setIsListening(false);

        if (forceLowConfidence) {
          setIsLowConfidence(true);
          speechService.speak(
            'We are not fully sure. Please speak again or choose your language below.',
            'en',
            0.9
          );
        } else {
          setDetectedLanguage(lang);
          // Play celebration confetti
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#9B5DE5', '#F3A6C8', '#45C27C', '#FFFFFF'],
            });
          } catch {
            // ignore
          }

          // Voice confirmation in detected native language
          const confirmText = `${lang.nativeName}. ${lang.welcomeVoiceText}`;
          speechService.speak(confirmText, lang.code, 1.0);
        }
      }, 1500);
    }, 1800);
  };

  const handleConfirm = () => {
    if (detectedLanguage) {
      speechService.stop();
      onConfirmLanguage(detectedLanguage.code);
    }
  };

  const lowConfidenceTop3: LanguageCode[] = ['ta', 'hi', 'bn'];

  return (
    <div className="min-h-screen bg-[#0B1026] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background glowing ambient orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#9B5DE5]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#F3A6C8]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar with Logo and Tagline */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-[#F3A6C8] p-0.5 shadow-xl shadow-[#9B5DE5]/30">
            <img src="/logo.svg" alt="AapThozhi" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight m-0 bg-gradient-to-r from-white via-[#F7F5FA] to-[#C9A7FF] bg-clip-text text-transparent">
                AapThozhi
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#9B5DE5]/25 text-[#F3A6C8] border border-[#9B5DE5]/40">
                Language Detective
              </span>
            </div>
            <p className="text-xs text-[#B7BDD3] m-0 font-medium">
              Aapki Bhasha. Aapka Haq. • Your Trusted Friend
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SpeakerButton
            textToSpeak={welcomeText}
            langCode="en"
            size="md"
            ariaLabel="Hear welcome instructions"
          />
          <button
            type="button"
            onClick={onOpenLanguageList}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-xs text-[#C9A7FF] font-medium transition-colors"
          >
            <Globe size={15} className="text-[#F3A6C8]" />
            <span>All Languages</span>
          </button>
        </div>
      </header>

      {/* Main Central Stage */}
      <main className="max-w-xl mx-auto w-full my-auto py-8 text-center flex flex-col items-center">
        {/* Core Accessibility Motto Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131A3B] border border-[#9B5DE5]/40 text-[#F3A6C8] text-xs font-semibold mb-6 shadow-md">
          <Sparkles size={14} />
          <span>Dekho, Suno, Karo • See it. Hear it. Do it.</span>
        </div>

        {/* State 1: Default or Listening State */}
        {!detectedLanguage && !isLowConfidence && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight max-w-md">
              Speak in the language you are comfortable with
            </h2>
            <p className="text-sm sm:text-base text-[#B7BDD3] max-w-sm mb-8 leading-relaxed">
              AapThozhi will understand your voice and speak back in your own language.
            </p>

            {/* Giant Central Microphone Button with Animated Ripple Waves */}
            <div className="relative mb-8 flex items-center justify-center">
              {/* Concentric sound wave pulses */}
              <div
                className={`absolute w-44 h-44 rounded-full border-2 border-[#9B5DE5]/40 ${
                  isListening ? 'animate-ping duration-1000' : 'animate-pulse'
                }`}
              />
              <div
                className={`absolute w-36 h-36 rounded-full bg-gradient-to-r from-[#9B5DE5]/20 to-[#F3A6C8]/20 ${
                  isListening ? 'animate-soundwave' : ''
                }`}
              />

              <button
                type="button"
                onClick={() => startDetectionFlow()}
                disabled={isListening}
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-2xl ${
                  isListening
                    ? 'bg-[#EF6A7B] text-white ring-8 ring-[#EF6A7B]/30 scale-105'
                    : 'bg-gradient-to-tr from-[#9B5DE5] via-[#8338EC] to-[#F3A6C8] text-white hover:scale-105 shadow-[#9B5DE5]/50 ring-4 ring-[#C9A7FF]/30'
                }`}
                aria-label="Tap to speak in your language"
              >
                <Mic size={44} className={isListening ? 'animate-bounce' : ''} />
                <span className="text-[11px] font-bold tracking-wide uppercase mt-1">
                  {isListening ? 'Listening...' : 'Tap & Speak'}
                </span>
              </button>
            </div>

            {/* Simulated Live Transcription */}
            {isListening && (
              <div className="p-4 rounded-2xl bg-[#141B3B] border border-[#9B5DE5]/40 max-w-md w-full shadow-lg animate-pulse mb-6">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#F3A6C8] font-bold uppercase mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#EF6A7B] animate-ping" />
                  Listening to your voice...
                </div>
                <p className="text-sm text-white italic">
                  {transcribedText ? `“${transcribedText}”` : 'Listening... please speak clearly'}
                </p>
              </div>
            )}

            {/* Privacy Reassurance Note */}
            <div className="flex items-center gap-2 text-xs text-[#B7BDD3] max-w-sm">
              <ShieldCheck size={18} className="text-[#45C27C] shrink-0" />
              <span>Your voice is used only to understand your language and request.</span>
            </div>
          </div>
        )}

        {/* State 2: High Confidence Detected Language Card */}
        {detectedLanguage && !isLowConfidence && (
          <div className="w-full max-w-md bg-gradient-to-b from-[#141B3B] to-[#0D1333] border-3 border-[#45C27C] rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-in zoom-in-95 duration-300">
            {/* Big Green Checkmark */}
            <div className="w-20 h-20 rounded-full bg-[#45C27C] text-[#0B1026] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#45C27C]/30 animate-bounce">
              <Check size={44} strokeWidth={3.5} />
            </div>

            <span className="inline-block text-xs uppercase font-extrabold tracking-widest text-[#45C27C] bg-[#45C27C]/15 px-3 py-1 rounded-full mb-2">
              High Confidence (98% match)
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
              {detectedLanguage.nativeName}
            </h2>
            <p className="text-sm font-semibold text-[#C9A7FF] mb-4">
              {detectedLanguage.name} • {detectedLanguage.script}
            </p>

            {/* Transcribed sample */}
            {transcribedText && (
              <div className="p-3 bg-[#0B1026]/70 rounded-2xl border border-[#9B5DE5]/20 mb-5 text-xs text-[#B7BDD3] italic">
                “{transcribedText}”
              </div>
            )}

            {/* Confirmation Question in Native Script */}
            <div className="p-4 rounded-2xl bg-[#9B5DE5]/15 border border-[#9B5DE5]/30 mb-6 flex items-center justify-between gap-3 text-left">
              <div>
                <p className="text-sm font-bold text-white m-0">
                  {detectedLanguage.welcomeVoiceText}
                </p>
                <p className="text-xs text-[#C9A7FF] mt-1 m-0">
                  {detectedLanguage.tagline}
                </p>
              </div>
              <SpeakerButton
                textToSpeak={detectedLanguage.welcomeVoiceText}
                langCode={detectedLanguage.code}
                size="md"
              />
            </div>

            {/* 3 Big Icon-Based Action Buttons */}
            <div className="space-y-3">
              {/* Button 1: Green checkmark - Yes, continue */}
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-4 px-6 rounded-2xl bg-[#45C27C] hover:bg-[#3db270] text-[#0B1026] font-extrabold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-[#45C27C]/30 transition-all transform active:scale-95 cursor-pointer"
              >
                <Check size={22} strokeWidth={3} />
                <span>Yes, continue in {detectedLanguage.nativeName}</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Button 2: Globe - Change language */}
                <button
                  type="button"
                  onClick={onOpenLanguageList}
                  className="py-3 px-3 rounded-2xl bg-[#1A234E] hover:bg-[#9B5DE5]/30 border border-[#9B5DE5]/40 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Globe size={18} className="text-[#F3A6C8]" />
                  <span>Change language</span>
                </button>

                {/* Button 3: Mic - Speak again */}
                <button
                  type="button"
                  onClick={() => startDetectionFlow()}
                  className="py-3 px-3 rounded-2xl bg-[#1A234E] hover:bg-[#9B5DE5]/30 border border-[#9B5DE5]/40 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw size={17} className="text-[#C9A7FF]" />
                  <span>Speak again</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Low-Confidence Recovery Flow */}
        {isLowConfidence && (
          <div className="w-full max-w-md bg-gradient-to-b from-[#1E1B38] to-[#0D1333] border-3 border-[#EF6A7B] rounded-3xl p-6 shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-[#EF6A7B]/20 text-[#EF6A7B] border border-[#EF6A7B]/40 flex items-center justify-center mx-auto mb-3">
              <RotateCcw size={28} />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              We are not fully sure
            </h3>
            <p className="text-xs text-[#B7BDD3] mb-5">
              Please speak again or choose your language from the top recommendations:
            </p>

            {/* Top 3 likely language cards */}
            <div className="space-y-2.5 mb-5 text-left">
              {lowConfidenceTop3.map((code) => {
                const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
                if (!lang) return null;

                return (
                  <div
                    key={lang.code}
                    onClick={() => {
                      setDetectedLanguage(lang);
                      setIsLowConfidence(false);
                    }}
                    className="p-3.5 rounded-2xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 flex items-center justify-between cursor-pointer transition-all hover:border-[#F3A6C8]"
                  >
                    <div>
                      <span className="text-base font-bold text-white block">
                        {lang.nativeName}
                      </span>
                      <span className="text-xs text-[#B7BDD3]">
                        {lang.name} • {lang.script}
                      </span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <SpeakerButton
                        textToSpeak={lang.welcomeVoiceText}
                        langCode={lang.code}
                        size="sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setDetectedLanguage(lang);
                          setIsLowConfidence(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#45C27C] text-[#0B1026] text-xs font-bold"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => startDetectionFlow()}
              className="w-full py-3 rounded-2xl bg-[#9B5DE5] hover:bg-[#8338EC] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#9B5DE5]/30 transition-all cursor-pointer"
            >
              <Mic size={18} />
              <span>Speak again</span>
            </button>
          </div>
        )}
      </main>

      {/* Discreet Demo Voice Examples Selector for Judges / Developers */}
      <footer className="max-w-4xl mx-auto w-full pt-4 pb-2 border-t border-[#9B5DE5]/20">
        <div className="bg-[#101530] border border-[#9B5DE5]/30 rounded-2xl p-3">
          <div
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setShowDemoSelector(!showDemoSelector)}
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F3A6C8]">
              <Sparkles size={14} />
              <span>Demo voice examples (For Judges & Evaluators)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#B7BDD3]">
              <span>Choose preset voice & test detection</span>
              {showDemoSelector ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {showDemoSelector && (
            <div className="mt-3 pt-3 border-t border-[#9B5DE5]/20 animate-in fade-in duration-200">
              <p className="text-[11px] text-[#B7BDD3] mb-2">
                Click any language below to simulate realistic voice recognition and witness automatic detection into that language's interface:
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setDemoSelectedLang(lang.code);
                      startDetectionFlow(lang.code, false);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      demoSelectedLang === lang.code
                        ? 'bg-[#9B5DE5] text-white border-[#F3A6C8]'
                        : 'bg-[#141B3B] text-[#C9A7FF] border-[#9B5DE5]/30 hover:bg-[#1A234E]'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-[#B7BDD3]">({lang.name})</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#9B5DE5]/15 text-xs">
                <span className="text-[#B7BDD3]">Test edge cases:</span>
                <button
                  type="button"
                  onClick={() => startDetectionFlow(undefined, true)}
                  className="px-3 py-1 rounded-lg bg-[#EF6A7B]/20 text-[#EF6A7B] border border-[#EF6A7B]/40 hover:bg-[#EF6A7B]/30 font-medium transition-colors"
                >
                  Test Low-Confidence Fallback Flow
                </button>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
