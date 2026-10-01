import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

type SpeechListener = (state: { isSpeaking: boolean; currentText: string; speechRate: number; langCode: LanguageCode }) => void;

class SpeechService {
  private listeners: SpeechListener[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isCurrentlySpeaking = false;
  private currentText = '';
  private currentSpeed = 1.0;
  private currentLang: LanguageCode = 'ta';
  private simulatedTimer: number | null = null;

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.push(listener);
    listener({
      isSpeaking: this.isCurrentlySpeaking,
      currentText: this.currentText,
      speechRate: this.currentSpeed,
      langCode: this.currentLang,
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
    };
    this.listeners.forEach((listener) => listener(state));
  }

  public speak(
    text: string,
    langCode: LanguageCode = 'ta',
    speed: number = 1.0,
    onFinish?: () => void
  ): void {
    this.stop();

    if (!text || text.trim() === '') return;

    this.currentText = text;
    this.currentSpeed = speed;
    this.currentLang = langCode;
    this.isCurrentlySpeaking = true;
    this.notify();

    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    const speechLang = langInfo ? langInfo.speechLang : 'en-IN';

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = speechLang;
        utterance.rate = speed;
        utterance.pitch = 1.05; // Slightly warmer female-friendly pitch

        // Try to pick an Indian locale or female voice if available
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().includes(speechLang.toLowerCase().slice(0, 2)) ||
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('female')
        );
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }

        utterance.onend = () => {
          this.isCurrentlySpeaking = false;
          this.currentUtterance = null;
          this.notify();
          if (onFinish) onFinish();
        };

        utterance.onerror = () => {
          this.fallbackSimulation(text, speed, onFinish);
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);

        // Safety timeout in case browser speech gets stuck (known Chrome issue with speechSynthesis)
        const estimatedDurationMs = Math.max(2500, (text.length / 12) * 1000 * (1 / speed));
        if (this.simulatedTimer) clearTimeout(this.simulatedTimer);
        this.simulatedTimer = window.setTimeout(() => {
          if (this.isCurrentlySpeaking) {
            this.stop();
            if (onFinish) onFinish();
          }
        }, estimatedDurationMs + 2000);
      } catch {
        this.fallbackSimulation(text, speed, onFinish);
      }
    } else {
      this.fallbackSimulation(text, speed, onFinish);
    }
  }

  private fallbackSimulation(text: string, speed: number, onFinish?: () => void): void {
    const durationMs = Math.max(2200, (text.length / 10) * 800 * (1 / speed));
    if (this.simulatedTimer) clearTimeout(this.simulatedTimer);
    this.simulatedTimer = window.setTimeout(() => {
      this.isCurrentlySpeaking = false;
      this.notify();
      if (onFinish) onFinish();
    }, durationMs);
  }

  public stop(): void {
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
    this.currentUtterance = null;
    this.notify();
  }

  public getIsSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }
}

export const speechService = new SpeechService();
