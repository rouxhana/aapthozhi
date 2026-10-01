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

// Marathi distinctive Devanagari vocabulary
const MARATHI_DEVANAGARI_WORDS = new Set([
  'नमस्कार',
  'मदत',
  'हवी',
  'मुलगी',
  'मुलीच्या',
  'मुलीसाठी',
  'शिक्षणासाठी',
  'कागदपत्रे',
  'केंद्रात',
  'ताई',
  'आहे',
  'आहेत',
  'काय',
  'कसे',
  'योजना',
  'शासकीय',
  'पाहिजे',
  'करा',
  'माहिती',
  'अर्ज',
  'मिळेल',
  'गावात',
  'शाळा',
  'आरोग्य',
  'पेन्शन',
  'माझ्या',
  'सरकारी',
  'दाखला',
  'रेशन',
  'आधार',
  'फॉर्म',
]);

// Multilingual Romanized Phonetic Keywords Dictionaries
const ROMAN_VOCABULARY: Record<LanguageCode, string[]> = {
  te: [
    'namaskaram',
    'namaskaramu',
    'sahayam',
    'sahayamu',
    'kavali',
    'ammaayi',
    'ammayi',
    'chaduvu',
    'pathakam',
    'pathakalu',
    'darakhasthu',
    'darakhastu',
    'meeseva',
    'sachivalayam',
    'vidya',
    'aarogya',
    'pinchanu',
    'pension',
    'pedalu',
    'illu',
    'pelli',
    'thalli',
    'pillalu',
    'yojana',
    'telugu',
    'cheppandi',
    'andi',
    'kavale',
    'naaku',
    'biddalu',
    'sarkari',
    'prabhutva',
    'kendra',
  ],
  ta: [
    'vanakkam',
    'thozhi',
    'udavi',
    'udhavi',
    'vendum',
    'vendume',
    'magal',
    'magalin',
    'padipu',
    'palli',
    'thittam',
    'thittangal',
    'kalvi',
    'maruthuva',
    'pengal',
    'maniyum',
    'arangu',
    'vinnappam',
    'tamil',
    'solunga',
    'sollungko',
    'kudumbam',
    'kidaikuma',
    'enakku',
    'arasiyal',
    'sarkaar',
    'seva',
    'aadhaar',
  ],
  kn: [
    'namaskara',
    'sahaya',
    'beku',
    'bekagide',
    'magalu',
    'shaale',
    'shikshana',
    'yojane',
    'mahile',
    'aarogya',
    'pension',
    'dakhale',
    'kendra',
    'kannada',
    'heli',
    'dayavittu',
    'sarakara',
    'yavudu',
    'nanna',
    'madat',
    'karnatak',
    'sahayavu',
  ],
  mr: [
    'namaskar',
    'madat',
    'havi',
    'mulgi',
    'mulisathi',
    'shikshan',
    'shikshanasathi',
    'aahe',
    'kaay',
    'tai',
    'dakhla',
    'yojana',
    'mahila',
    'arogya',
    'kam',
    'shasan',
    'marathi',
    'kasa',
    'kashi',
    'pahije',
    'sanga',
    'gav',
    'mazya',
    'shaskiya',
    'sarkari',
    'kagadpatre',
  ],
  hi: [
    'namaste',
    'madad',
    'chahiye',
    'beti',
    'padhai',
    'shiksha',
    'yojana',
    'kendra',
    'sarkar',
    'bataiye',
    'dastavej',
    'mahila',
    'kripya',
    'kaise',
    'hoga',
    'swasthya',
    'pension',
    'hindi',
  ],
  bn: [
    'nomoshkar',
    'namaskar',
    'sahajjo',
    'chaye',
    'meye',
    'meyeder',
    'porashona',
    'prakalpa',
    'sarkari',
    'bangla',
    'janan',
    'amar',
    'dorkar',
  ],
  gu: [
    'namaste',
    'madad',
    'joiye',
    'dikri',
    'bhanatar',
    'yojana',
    'gujarati',
    'sarkari',
    'sahay',
  ],
  ml: [
    'namaskaram',
    'sahayam',
    'venam',
    'makal',
    'paditham',
    'padanam',
    'padhathi',
    'malayalam',
    'sahayikumo',
  ],
  pa: [
    'sat',
    'sri',
    'akal',
    'madad',
    'chahidi',
    'dhee',
    'parhai',
    'yojna',
    'punjabi',
    'sarkari',
  ],
  ur: [
    'assalam',
    'alaikum',
    'madad',
    'chahiye',
    'beti',
    'taleem',
    'imdad',
    'urdu',
    'hukumat',
  ],
  od: [
    'namaskar',
    'sahajya',
    'darkar',
    'jhia',
    'pathapadhara',
    'yojana',
    'odia',
    'sarkari',
  ],
  as: [
    'namaskar',
    'sahay',
    'lage',
    'suwali',
    'shikshar',
    'achoni',
    'asomiya',
    'sarkari',
  ],
  hinglish: [
    'namaste',
    'madad',
    'chahiye',
    'beti',
    'padhai',
    'education',
    'government',
    'help',
    'scheme',
    'yojana',
  ],
  en: [
    'hello',
    'daughter',
    'education',
    'government',
    'scheme',
    'assistance',
    'pension',
    'hospital',
    'card',
  ],
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

      // Locale mapping for Web Speech API
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

      if (preferredLangCode && preferredLangCode !== 'auto' && localeMap[preferredLangCode]) {
        this.recognition.lang = localeMap[preferredLangCode];
      } else {
        // Multi-accent detection default: Indian English or Hindi
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
          const classified = this.classifyLanguageFromText(
            finalTranscript,
            preferredLangCode as LanguageCode
          );
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
  public classifyLanguageFromText(
    text: string,
    preferredLangCode?: LanguageCode | 'auto'
  ): {
    detectedLang: LanguageCode;
    confidence: number;
    scriptName: string;
  } {
    if (!text || text.trim() === '') {
      const fallback = preferredLangCode && preferredLangCode !== 'auto' ? preferredLangCode : 'ta';
      return { detectedLang: fallback as LanguageCode, confidence: 95, scriptName: 'Tamil' };
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
      if (cleaned.includes('ৰ') || cleaned.includes('ৱ') || cleaned.includes('নমস্কাৰ')) {
        return { detectedLang: 'as', confidence: 97, scriptName: 'Assamese (অসমীয়া)' };
      }
      return { detectedLang: 'bn', confidence: 98, scriptName: 'Bengali (বাংলা)' };
    }

    // 10. Check Devanagari Script (Hindi vs Marathi)
    const devanagariMatches = cleaned.match(SCRIPT_RANGES.hi_mr);
    if (devanagariMatches && devanagariMatches.length > 0) {
      const words = cleaned.split(/\s+/);
      let isMarathi = false;
      for (const w of words) {
        if (MARATHI_DEVANAGARI_WORDS.has(w)) {
          isMarathi = true;
          break;
        }
      }
      if (isMarathi || (preferredLangCode === 'mr')) {
        return { detectedLang: 'mr', confidence: 98, scriptName: 'Marathi (मराठी)' };
      }
      return { detectedLang: 'hi', confidence: 98, scriptName: 'Hindi (हिन्दी)' };
    }

    // 11. Roman Script / Phonetic Word Classifier
    const cleanWords = cleaned.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);

    // Score all languages against their phonetic dictionaries
    const scores: Record<LanguageCode, number> = {
      te: 0,
      ta: 0,
      kn: 0,
      mr: 0,
      hi: 0,
      bn: 0,
      gu: 0,
      ml: 0,
      pa: 0,
      od: 0,
      as: 0,
      ur: 0,
      hinglish: 0,
      en: 0,
    };

    // If user explicitly spoke in a preferred language, add strong prior
    if (preferredLangCode && preferredLangCode !== 'auto' && scores[preferredLangCode] !== undefined) {
      scores[preferredLangCode] += 2;
    }

    for (const [langCode, vocabList] of Object.entries(ROMAN_VOCABULARY) as [LanguageCode, string[]][]) {
      for (const word of cleanWords) {
        if (vocabList.includes(word)) {
          scores[langCode] += 2;
        } else {
          // Check substring for partial matches (e.g. namaskaramu -> namaskaram)
          for (const marker of vocabList) {
            if (marker.length >= 4 && (word.includes(marker) || marker.includes(word))) {
              scores[langCode] += 1;
              break;
            }
          }
        }
      }
    }

    // Find the highest scoring language
    let bestLang: LanguageCode = 'ta';
    let highestScore = -1;

    for (const [lang, score] of Object.entries(scores) as [LanguageCode, number][]) {
      if (score > highestScore) {
        highestScore = score;
        bestLang = lang;
      }
    }

    if (highestScore > 0) {
      const scriptNames: Record<LanguageCode, string> = {
        te: 'Telugu (తెలుగు)',
        ta: 'Tamil (தமிழ்)',
        kn: 'Kannada (ಕನ್ನಡ)',
        mr: 'Marathi (मराठी)',
        hi: 'Hindi (हिन्दी)',
        bn: 'Bengali (বাংলা)',
        gu: 'Gujarati (ગુજરાતી)',
        ml: 'Malayalam (മലയാളം)',
        pa: 'Punjabi (ਪੰਜਾਬੀ)',
        od: 'Odia (ଓଡ଼ିଆ)',
        as: 'Assamese (অসমীয়া)',
        ur: 'Urdu (اردو)',
        hinglish: 'Romanized Hindi (Hinglish)',
        en: 'English (Indian English)',
      };
      return {
        detectedLang: bestLang,
        confidence: Math.min(99, 85 + highestScore * 4),
        scriptName: scriptNames[bestLang] || 'Regional Language',
      };
    }

    // If preferred language was set and no markers conflicted, respect it
    if (preferredLangCode && preferredLangCode !== 'auto') {
      return {
        detectedLang: preferredLangCode as LanguageCode,
        confidence: 94,
        scriptName: preferredLangCode.toUpperCase(),
      };
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
