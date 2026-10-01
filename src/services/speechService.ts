import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

type SpeechListener = (state: {
  isSpeaking: boolean;
  currentText: string;
  speechRate: number;
  langCode: LanguageCode;
  engine: 'neural-tts' | 'browser-speech';
}) => void;

class SpeechService {
  private listeners: SpeechListener[] = [];
  private isCurrentlySpeaking = false;
  private currentText = '';
  private currentSpeed = 1.0;
  private currentLang: LanguageCode = 'ta';
  private activeAudio: HTMLAudioElement | null = null;
  private simulatedTimer: number | null = null;
  private currentEngine: 'neural-tts' | 'browser-speech' = 'neural-tts';
  private sessionId = 0;

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.push(listener);
    listener({
      isSpeaking: this.isCurrentlySpeaking,
      currentText: this.currentText,
      speechRate: this.currentSpeed,
      langCode: this.currentLang,
      engine: this.currentEngine,
    });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    const state = {
      isSpeaking: this.isCurrentlySpeaking,
      currentText: this.currentText,
      speechRate: this.currentSpeed,
      langCode: this.currentLang,
      engine: this.currentEngine,
    };
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (e) {
        console.error('Error in speech listener:', e);
      }
    });
  }

  /**
   * High-Definition Multilingual Text-to-Speech Engine
   * Primary: Google Multilingual Neural Audio (crystal-clear human native voices)
   * Secondary: Web Speech API (with regional Indian accents)
   */
  public speak(
    text: string,
    langCode: LanguageCode = 'ta',
    speed: number = 1.0,
    onFinish?: () => void
  ): void {
    // Increment session ID to discard any in-flight callbacks from previous utterances
    const mySessionId = ++this.sessionId;

    this.stopInternal(false);

    if (!text || text.trim() === '') {
      if (onFinish) onFinish();
      return;
    }

    this.currentText = text;
    this.currentSpeed = speed;
    this.currentLang = langCode;
    this.isCurrentlySpeaking = true;
    this.currentEngine = 'neural-tts';
    this.notify();

    // Map language code to Google TTS language code
    const ttsLangMap: Record<LanguageCode, string> = {
      ta: 'ta',
      hi: 'hi',
      bn: 'bn',
      te: 'te',
      mr: 'mr',
      kn: 'kn',
      gu: 'gu',
      ml: 'ml',
      pa: 'pa',
      od: 'hi', // Odia falls back to clear Hindi/English neural
      as: 'bn', // Assamese falls back to Bengali neural for phonetics
      ur: 'ur',
      hinglish: 'hi',
      en: 'en',
    };

    const targetLang = ttsLangMap[langCode] || 'en';

    // Break text into natural audio chunks (under 90 chars for smooth streaming)
    const chunks = this.splitIntoAudioChunks(text, 90);

    this.playAudioChunksSequentially(chunks, targetLang, speed, 0, mySessionId, () => {
      if (this.sessionId !== mySessionId) return;
      this.isCurrentlySpeaking = false;
      this.notify();
      if (onFinish) onFinish();
    });
  }

  private splitIntoAudioChunks(text: string, maxLength: number): string[] {
    const sentences = text.match(/[^.!?।\n]+[.!?।\n]*/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + ' ' + sentence).trim().length <= maxLength) {
        currentChunk = (currentChunk + ' ' + sentence).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        if (sentence.length > maxLength) {
          const words = sentence.split(' ');
          let subChunk = '';
          for (const w of words) {
            if ((subChunk + ' ' + w).trim().length <= maxLength) {
              subChunk = (subChunk + ' ' + w).trim();
            } else {
              if (subChunk) chunks.push(subChunk);
              subChunk = w;
            }
          }
          if (subChunk) currentChunk = subChunk;
        } else {
          currentChunk = sentence.trim();
        }
      }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks.length > 0 ? chunks : [text.slice(0, maxLength)];
  }

  private playAudioChunksSequentially(
    chunks: string[],
    lang: string,
    speed: number,
    index: number,
    mySessionId: number,
    onComplete: () => void
  ): void {
    if (this.sessionId !== mySessionId || !this.isCurrentlySpeaking) {
      return;
    }

    if (index >= chunks.length) {
      onComplete();
      return;
    }

    const chunk = chunks[index];
    const encoded = encodeURIComponent(chunk);
    // Use tw-ob as primary and gtx as secondary
    const primaryUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encoded}`;
    const secondaryUrl = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${lang}&q=${encoded}`;

    let isHandled = false;

    const proceedNext = () => {
      if (this.sessionId !== mySessionId) return;
      this.playAudioChunksSequentially(chunks, lang, speed, index + 1, mySessionId, onComplete);
    };

    const tryFallback = () => {
      if (isHandled || this.sessionId !== mySessionId) return;
      isHandled = true;
      this.fallbackStrictSpeechSynthesis(chunk, lang, speed, mySessionId, proceedNext);
    };

    try {
      const audio = new Audio();
      audio.setAttribute('referrerpolicy', 'no-referrer');
      (audio as any).referrerPolicy = 'no-referrer';
      audio.playbackRate = speed;
      this.activeAudio = audio;

      let hasTriedSecondary = false;

      audio.onended = () => {
        if (isHandled || this.sessionId !== mySessionId) return;
        isHandled = true;
        proceedNext();
      };

      audio.onerror = (e) => {
        if (isHandled || this.sessionId !== mySessionId) return;
        if (!hasTriedSecondary) {
          hasTriedSecondary = true;
          try {
            audio.src = secondaryUrl;
            const p = audio.play();
            if (p) {
              p.catch((err) => {
                if (err && err.name === 'AbortError') return;
                tryFallback();
              });
            }
          } catch {
            tryFallback();
          }
        } else {
          tryFallback();
        }
      };

      audio.src = primaryUrl;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (this.sessionId !== mySessionId) return;
          if (err && err.name === 'AbortError') {
            // User intentionally aborted or paused
            return;
          }
          if (!hasTriedSecondary) {
            hasTriedSecondary = true;
            try {
              audio.src = secondaryUrl;
              const p = audio.play();
              if (p) {
                p.catch((err2) => {
                  if (err2 && err2.name === 'AbortError') return;
                  tryFallback();
                });
              }
            } catch {
              tryFallback();
            }
          } else {
            tryFallback();
          }
        });
      }
    } catch {
      tryFallback();
    }
  }

  /**
   * Browser SpeechSynthesis Fallback
   * Uses native regional voice if available, or Google Hindi / Indian English voice with clear accent.
   */
  private fallbackStrictSpeechSynthesis(
    text: string,
    langCode: string,
    speed: number,
    mySessionId: number,
    onFinish: () => void
  ): void {
    if (this.sessionId !== mySessionId) return;
    this.currentEngine = 'browser-speech';
    this.notify();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = `${langCode}-IN`;
        utterance.rate = speed;

        const voices = window.speechSynthesis.getVoices();
        
        // 1. Try to find an exact matching voice for language code
        const matchingVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith(langCode.toLowerCase()) ||
            v.lang.toLowerCase().replace('_', '-').includes(`${langCode.toLowerCase()}-in`)
        );

        // 2. If no direct voice, try Indian English or Google Hindi voice
        const indianVoice =
          matchingVoice ||
          voices.find((v) => v.lang.toLowerCase().includes('hi-in') || v.name.toLowerCase().includes('hindi')) ||
          voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
          voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
          voices[0];

        if (indianVoice) {
          utterance.voice = indianVoice;
        }

        let finished = false;
        const completeOnce = () => {
          if (finished || this.sessionId !== mySessionId) return;
          finished = true;
          if (this.simulatedTimer) {
            clearTimeout(this.simulatedTimer);
            this.simulatedTimer = null;
          }
          onFinish();
        };

        utterance.onend = completeOnce;
        utterance.onerror = completeOnce;

        window.speechSynthesis.speak(utterance);

        // Safety timeout so speech never hangs
        const duration = Math.max(1500, (text.length / 8) * 1000 * (1 / speed));
        this.simulatedTimer = window.setTimeout(completeOnce, duration + 1000);
      } catch {
        onFinish();
      }
    } else {
      onFinish();
    }
  }

  public stop(): void {
    this.sessionId++; // Invalidate any running session
    this.stopInternal(true);
  }

  private stopInternal(notifyListeners: boolean): void {
    if (this.activeAudio) {
      // Remove handlers before pausing to prevent triggering onerror/onended
      this.activeAudio.onended = null;
      this.activeAudio.onerror = null;
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.activeAudio = null;
    }
    if (this.simulatedTimer) {
      clearTimeout(this.simulatedTimer);
      this.simulatedTimer = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.isCurrentlySpeaking = false;
    if (notifyListeners) {
      this.notify();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }
}

export const speechService = new SpeechService();
