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
    this.listeners.forEach((listener) => listener(state));
  }

  /**
   * High-Definition Multilingual Text-to-Speech Engine
   * Primary: Google Neural Multilingual TTS (crystal-clear, human-sounding native accents)
   * Secondary: Web Speech API (with strict language matching)
   */
  public speak(
    text: string,
    langCode: LanguageCode = 'ta',
    speed: number = 1.0,
    onFinish?: () => void
  ): void {
    this.stop();

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

    // Map language code to Google TTS language parameter
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

    // Break text into natural audio chunks (under 180 chars for seamless streaming)
    const chunks = this.splitIntoAudioChunks(text, 180);

    this.playAudioChunksSequentially(chunks, targetLang, speed, 0, () => {
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
          // Break by comma or word
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
    onComplete: () => void
  ): void {
    if (index >= chunks.length || !this.isCurrentlySpeaking) {
      onComplete();
      return;
    }

    const chunk = chunks[index];
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(
      chunk
    )}`;

    try {
      const audio = new Audio(url);
      audio.playbackRate = speed;
      this.activeAudio = audio;

      audio.onended = () => {
        this.playAudioChunksSequentially(chunks, lang, speed, index + 1, onComplete);
      };

      audio.onerror = () => {
        // Fallback to strict browser speech synthesis if network fails
        this.fallbackStrictSpeechSynthesis(chunk, lang, speed, () => {
          this.playAudioChunksSequentially(chunks, lang, speed, index + 1, onComplete);
        });
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocks audio autoplay or URL is restricted
          this.fallbackStrictSpeechSynthesis(chunk, lang, speed, () => {
            this.playAudioChunksSequentially(chunks, lang, speed, index + 1, onComplete);
          });
        });
      }
    } catch {
      this.fallbackStrictSpeechSynthesis(chunk, lang, speed, () => {
        this.playAudioChunksSequentially(chunks, lang, speed, index + 1, onComplete);
      });
    }
  }

  /**
   * Fallback using browser speechSynthesis with STRICT voice checking
   * Prevents English voices from attempting to speak Tamil/Hindi/Bengali text!
   */
  private fallbackStrictSpeechSynthesis(
    text: string,
    langCode: string,
    speed: number,
    onFinish: () => void
  ): void {
    this.currentEngine = 'browser-speech';
    this.notify();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = `${langCode}-IN`;
        utterance.rate = speed;

        const voices = window.speechSynthesis.getVoices();
        // STRICT FILTER: Voice MUST match the language code or prefix!
        const strictMatchingVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith(langCode.toLowerCase()) ||
            v.lang.toLowerCase().replace('_', '-').includes(`${langCode.toLowerCase()}-in`)
        );

        if (strictMatchingVoice) {
          utterance.voice = strictMatchingVoice;
        } else if (langCode === 'en') {
          // For English, standard English voice is fine
          const englishVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
          if (englishVoice) utterance.voice = englishVoice;
        }

        utterance.onend = () => onFinish();
        utterance.onerror = () => onFinish();

        window.speechSynthesis.speak(utterance);

        // Safety timeout in case speech engine hangs
        const duration = Math.max(2000, (text.length / 10) * 1000 * (1 / speed));
        if (this.simulatedTimer) clearTimeout(this.simulatedTimer);
        this.simulatedTimer = window.setTimeout(() => onFinish(), duration + 1000);
      } catch {
        onFinish();
      }
    } else {
      onFinish();
    }
  }

  public stop(): void {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
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
    this.notify();
  }

  public getIsSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }
}

export const speechService = new SpeechService();
