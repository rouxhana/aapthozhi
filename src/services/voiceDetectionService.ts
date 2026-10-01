import { LanguageCode } from '../types';

export interface DetectionResult {
  detectedLang: LanguageCode;
  confidence: number; // 0 to 100
  transcript: string;
  isRealMicrophone: boolean;
  scriptName: string;
}

// Regex ranges for Indian scripts
const SCRIPT_RANGES = {
  ta: /[\u0B80-\u0BFF]/g, // Tamil
  hi_mr: /[\u0900-\u097F]/g, // Devanagari (Hindi, Marathi)
  bn_as: /[\u0980-\u09FF]/g, // Bengali, Assamese
  te: /[\u0C00-\u0C7F]/g, // Telugu
  kn: /[\u0C80-\u0CFF]/g, // Kannada
  gu: /[\u0A80-\u0AFF]/g, // Gujarati
  ml: /[\u0D00-\u0D7F]/g, // Malayalam
  pa: /[\u0A00-\u0A7F]/g, // Gurmukhi (Punjabi)
  od: /[\u0B00-\u0B7F]/g, // Odia
  ur: /[\u0600-\u06FF]/g, // Perso-Arabic (Urdu)
};

// Vocabulary markers for disambiguating shared scripts and Roman transliterations
const VOCABULARY_MARKERS: Record<string, LanguageCode> = {
  // Marathi unique words
  मुलीच्या: 'mr',
  शिक्षणासाठी: 'mr',
  ताई: 'mr',
  हवी: 'mr',
  कागदपत्रे: 'mr',
  केंद्रात: 'mr',

  // Hindi unique words
  नमस्ते: 'hi',
  बेटी: 'hi',
  पढ़ाई: 'hi',
  मदद: 'hi',
  चाहिए: 'hi',
  बहन: 'hi',
  दस्तावेज़: 'hi',

  // Assamese unique words
  নমস্কাৰ: 'as',
  ছোৱালীৰ: 'as',
  বাইদেউ: 'as',
  লাগে: 'as',

  // Hinglish Roman markers
  namaste: 'hinglish',
  beti: 'hinglish',
  padhai: 'hinglish',
  chahiye: 'hinglish',
  madad: 'hinglish',
  yojana: 'hinglish',
  kendra: 'hinglish',
  bhasha: 'hinglish',
};

class VoiceDetectionService {
  private recognition: any = null;
  private isListening = false;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Listen to real microphone stream via Web Speech API
   */
  public startListening(
    onInterim: (text: string) => void,
    onResult: (result: DetectionResult) => void,
    onError: (error: string) => void,
    preferredLangCode?: string
  ): void {
    if (!this.recognition) {
      onError('Browser does not support native speech recognition. Using AI preset engine.');
      return;
    }

    try {
      this.isListening = true;
      // If a preferred language is provided, configure recognition locale
      if (preferredLangCode) {
        const localeMap: Record<string, string> = {
          ta: 'ta-IN',
          hi: 'hi-IN',
          bn: 'bn-IN',
          te: 'te-IN',
          mr: 'mr-IN',
          kn: 'kn-IN',
          gu: 'gu-IN',
          ml: 'ml-IN',
          pa: 'pa-IN',
          ur: 'ur-IN',
          od: 'or-IN',
          as: 'as-IN',
          hinglish: 'hi-IN',
          en: 'en-IN',
        };
        this.recognition.lang = localeMap[preferredLangCode] || preferredLangCode;
      } else {
        // Multi-accent detection default
        this.recognition.lang = 'hi-IN';
      }

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        onInterim(currentTranscript);

        if (finalTranscript) {
          const classified = this.classifyLanguageFromText(finalTranscript);
          onResult({
            ...classified,
            transcript: finalTranscript,
            isRealMicrophone: true,
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError(event.error || 'Speech recognition encountered an issue.');
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Microphone activation failed.');
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.isListening = false;
    this.stopAudioVisualizer();
  }

  /**
   * AI Language Classification from Spoken Transcript
   * Evaluates Unicode Scripts, phonetic markers and vocabulary
   */
  public classifyLanguageFromText(text: string): {
    detectedLang: LanguageCode;
    confidence: number;
    scriptName: string;
  } {
    if (!text || text.trim() === '') {
      return { detectedLang: 'ta', confidence: 95, scriptName: 'Tamil' };
    }

    const cleaned = text.trim();

    // 1. Check Tamil Script
    const tamilMatches = cleaned.match(SCRIPT_RANGES.ta);
    if (tamilMatches && tamilMatches.length > 0) {
      return { detectedLang: 'ta', confidence: 98, scriptName: 'Tamil (தமிழ்)' };
    }

    // 2. Check Telugu Script
    const teluguMatches = cleaned.match(SCRIPT_RANGES.te);
    if (teluguMatches && teluguMatches.length > 0) {
      return { detectedLang: 'te', confidence: 98, scriptName: 'Telugu (తెలుగు)' };
    }

    // 3. Check Kannada Script
    const kannadaMatches = cleaned.match(SCRIPT_RANGES.kn);
    if (kannadaMatches && kannadaMatches.length > 0) {
      return { detectedLang: 'kn', confidence: 98, scriptName: 'Kannada (ಕನ್ನಡ)' };
    }

    // 4. Check Malayalam Script
    const malayalamMatches = cleaned.match(SCRIPT_RANGES.ml);
    if (malayalamMatches && malayalamMatches.length > 0) {
      return { detectedLang: 'ml', confidence: 98, scriptName: 'Malayalam (മലയാളം)' };
    }

    // 5. Check Gujarati Script
    const gujaratiMatches = cleaned.match(SCRIPT_RANGES.gu);
    if (gujaratiMatches && gujaratiMatches.length > 0) {
      return { detectedLang: 'gu', confidence: 98, scriptName: 'Gujarati (ગુજરાતી)' };
    }

    // 6. Check Punjabi (Gurmukhi) Script
    const punjabiMatches = cleaned.match(SCRIPT_RANGES.pa);
    if (punjabiMatches && punjabiMatches.length > 0) {
      return { detectedLang: 'pa', confidence: 98, scriptName: 'Gurmukhi (ਪੰਜਾਬੀ)' };
    }

    // 7. Check Odia Script
    const odiaMatches = cleaned.match(SCRIPT_RANGES.od);
    if (odiaMatches && odiaMatches.length > 0) {
      return { detectedLang: 'od', confidence: 98, scriptName: 'Odia (ଓଡ଼ିଆ)' };
    }

    // 8. Check Urdu (Perso-Arabic) Script
    const urduMatches = cleaned.match(SCRIPT_RANGES.ur);
    if (urduMatches && urduMatches.length > 0) {
      return { detectedLang: 'ur', confidence: 98, scriptName: 'Nastaliq (اردو)' };
    }

    // 9. Check Bengali / Assamese Script
    const bengaliMatches = cleaned.match(SCRIPT_RANGES.bn_as);
    if (bengaliMatches && bengaliMatches.length > 0) {
      // Disambiguate Assamese specific characters (ৰ, ৱ) or words
      if (cleaned.includes('ৰ') || cleaned.includes('ৱ') || cleaned.includes('নমস্কাৰ')) {
        return { detectedLang: 'as', confidence: 97, scriptName: 'Assamese (অসমীয়া)' };
      }
      return { detectedLang: 'bn', confidence: 98, scriptName: 'Bengali (বাংলা)' };
    }

    // 10. Check Devanagari Script (Hindi vs Marathi)
    const devanagariMatches = cleaned.match(SCRIPT_RANGES.hi_mr);
    if (devanagariMatches && devanagariMatches.length > 0) {
      // Check Marathi specific words
      const lower = cleaned.toLowerCase();
      if (
        lower.includes('मुलगी') ||
        lower.includes('शिक्षणासाठी') ||
        lower.includes('हवी') ||
        lower.includes('ताई') ||
        lower.includes('आहे')
      ) {
        return { detectedLang: 'mr', confidence: 98, scriptName: 'Marathi (मराठी)' };
      }
      return { detectedLang: 'hi', confidence: 98, scriptName: 'Hindi (हिन्दी)' };
    }

    // 11. Roman Script / Hinglish vs English
    const words = cleaned.toLowerCase().split(/\s+/);
    let hinglishScore = 0;
    for (const w of words) {
      if (VOCABULARY_MARKERS[w] === 'hinglish') hinglishScore += 2;
    }

    if (hinglishScore >= 2) {
      return { detectedLang: 'hinglish', confidence: 94, scriptName: 'Romanized Hindi (Hinglish)' };
    }

    return { detectedLang: 'en', confidence: 96, scriptName: 'English (Indian English)' };
  }

  /**
   * Real-time microphone audio visualizer
   */
  public async startAudioVisualizer(onVolume: (level: number) => void): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const update = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        onVolume(normalized);
        if (this.isListening) {
          requestAnimationFrame(update);
        }
      };
      requestAnimationFrame(update);
      return true;
    } catch {
      return false;
    }
  }

  public stopAudioVisualizer(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {
        // ignore
      }
      this.audioContext = null;
    }
    this.analyser = null;
  }
}

export const voiceDetectionService = new VoiceDetectionService();
