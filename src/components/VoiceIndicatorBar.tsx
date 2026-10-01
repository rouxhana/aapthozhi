import React, { useEffect, useState } from 'react';
import { Square, Volume2 } from 'lucide-react';
import { speechService } from '../services/speechService';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { LanguageCode } from '../types';

export const VoiceIndicatorBar: React.FC = () => {
  const [speechState, setSpeechState] = useState({
    isSpeaking: false,
    currentText: '',
    speechRate: 1.0,
    langCode: 'ta' as LanguageCode,
  });

  useEffect(() => {
    const unsubscribe = speechService.subscribe((state) => {
      setSpeechState(state);
    });
    return unsubscribe;
  }, []);

  if (!speechState.isSpeaking) return null;

  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === speechState.langCode);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl bg-gradient-to-r from-[#0D1333] via-[#1B234A] to-[#0D1333] border-2 border-[#9B5DE5] rounded-2xl shadow-2xl p-3.5 backdrop-blur-md text-white animate-in fade-in slide-in-from-bottom duration-200"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#9B5DE5] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#9B5DE5]/50 animate-pulse">
            <Volume2 size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3A6C8]">
                Dekho. Suno. Karo.
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#9B5DE5]/30 text-[#C9A7FF] border border-[#9B5DE5]/40 font-medium">
                {currentLangInfo ? `${currentLangInfo.nativeName} (${currentLangInfo.name})` : 'Audio'}
              </span>
              {speechState.speechRate < 0.9 && (
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  🐢 0.75x Slow
                </span>
              )}
            </div>
            <p className="text-xs text-[#B7BDD3] truncate mt-0.5 italic">
              "{speechState.currentText.slice(0, 75)}..."
            </p>
          </div>
        </div>

        {/* Animated sound wave bars */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 px-2 py-1 bg-[#0B1026]/70 rounded-lg border border-[#9B5DE5]/20">
            <span className="w-1 bg-[#F3A6C8] rounded-full animate-wave-bar" style={{ height: '14px' }} />
            <span className="w-1 bg-[#9B5DE5] rounded-full animate-wave-bar [animation-delay:0.15s]" style={{ height: '22px' }} />
            <span className="w-1 bg-[#C9A7FF] rounded-full animate-wave-bar [animation-delay:0.3s]" style={{ height: '28px' }} />
            <span className="w-1 bg-[#F3A6C8] rounded-full animate-wave-bar [animation-delay:0.45s]" style={{ height: '18px' }} />
            <span className="w-1 bg-[#9B5DE5] rounded-full animate-wave-bar [animation-delay:0.6s]" style={{ height: '12px' }} />
          </div>

          <button
            type="button"
            onClick={() => speechService.stop()}
            title="Stop audio"
            className="p-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/40 border border-red-500/40 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Square size={14} fill="currentColor" />
            <span className="hidden sm:inline">Stop</span>
          </button>
        </div>
      </div>
    </div>
  );
};
