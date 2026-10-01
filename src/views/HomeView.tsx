import React, { useEffect, useState, useMemo } from 'react';
import {
  Baby,
  Camera,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  FileText,
  Flame,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  HelpCircle,
  Loader2,
  MapPin,
  Mic,
  MicOff,
  PersonStanding,
  PiggyBank,
  RotateCcw,
  Scissors,
  Search,
  Shield,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { speechService } from '../services/speechService';
import { voiceDetectionService } from '../services/voiceDetectionService';
import { SCHEMES_DATABASE, SchemeDatabaseRecord } from '../data/schemesDatabase';
import { WhatToSayModal } from '../components/WhatToSayModal';
import { ExternalLinkModal } from '../components/ExternalLinkModal';

export interface SchemeItem {
  id: number | string;
  scheme_name: string;
  category: string;
  who_is_it_for: string;
  main_benefit: string;
  documents_needed: string;
  how_to_apply: string;
  keywords: string[];
  state?: string;
  official_url?: string;
}

interface HomeViewProps {
  currentLanguage: LanguageCode;
  userName?: string;
  onSelectService: (serviceCategory: 'education' | 'maternity' | 'pension' | 'health') => void;
  onVoiceSearchQuery: (query: string) => void;
  onOpenPointAndAsk: () => void;
  onOpenTrustedHelper: () => void;
  onOpenSafetyCenter: () => void;
  onSelectSchemeId?: (schemeId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLanguage,
  userName,
  onSelectService,
  onVoiceSearchQuery,
  onOpenPointAndAsk,
  onOpenTrustedHelper,
  onOpenSafetyCenter,
  onSelectSchemeId,
}) => {
  const [isMicActive, setIsMicActive] = useState(false);
  const [activeSpokenText, setActiveSpokenText] = useState('');
  const [allSchemes, setAllSchemes] = useState<SchemeItem[]>(SCHEMES_DATABASE);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [activeWhatToSayScheme, setActiveWhatToSayScheme] = useState<SchemeItem | null>(null);
  const [externalModalUrl, setExternalModalUrl] = useState<{ url: string; portalName: string } | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const heroVoiceText = `${t.greetingWoman}. ${t.heroTellNeed}. ${t.heroSub}`;

  // Initial friendly audio greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      speechService.speak(`${t.greetingWoman}. ${t.heroTellNeed}`, currentLanguage, 1.0);
    }, 400);
    return () => {
      clearTimeout(timer);
      speechService.stop();
    };
  }, [currentLanguage]);

  // Standard React useEffect hook to dynamically fetch schemes data from /all_schemes.json on component render
  useEffect(() => {
    setIsLoading(true);

    fetch('/all_schemes.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: SchemeItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllSchemes(data);
        }
      })
      .catch((err) => {
        console.warn('Direct /all_schemes.json fetch failed, trying relative path:', err);
        // Fallback for subpaths or local bundled database
        return fetch('./all_schemes.json')
          .then((res) => {
            if (!res.ok) throw new Error(`Relative fetch failed: ${res.status}`);
            return res.json();
          })
          .then((data: SchemeItem[]) => {
            if (Array.isArray(data) && data.length > 0) {
              setAllSchemes(data);
            }
          })
          .catch((fallbackErr) => {
            console.warn('Using bundled schemes fallback:', fallbackErr);
            setAllSchemes(SCHEMES_DATABASE);
          });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Simple text filtering input match rule:
  // When users interact with the microphone state or search inputs, it quickly pulls matches from our database.
  const matchedSchemes = useMemo(() => {
    if (!allSchemes || allSchemes.length === 0) return [];

    let result = allSchemes;

    // Filter by category if selected
    if (selectedCategoryFilter !== 'All') {
      result = result.filter((s) =>
        (s.category || '').toLowerCase().includes(selectedCategoryFilter.toLowerCase())
      );
    }

    const query = searchInput.trim().toLowerCase();
    if (!query) {
      // Default view: show initial featured citizen schemes
      return result.slice(0, 10);
    }

    const rawTokens = query.split(/\s+/).filter(Boolean);

    // Multilingual synonym mappings for voice recognition and vernacular queries
    const synonymMap: Record<string, string[]> = {
      gas: ['gas', 'cylinder', 'stove', 'chulha', 'ujjwala', 'lpg', 'cooking', 'kitchen', 'गैस', 'चूल्हा', 'గ్యాస్', 'అடுப்பு', 'அடுப்பு', 'ಸಿಲಿಂಡರ್'],
      sewing: ['sewing', 'machine', 'stitching', 'tailor', 'silai', 'सिलाई', 'कुట్టు', 'தையல்', 'ಹೊಲಿಗೆ', 'शिलाई'],
      education: ['education', 'scholarship', 'school', 'college', 'student', 'study', 'books', 'fees', 'pragati', 'balika', 'shiksha', 'padhai', 'beti', 'చదువు', 'கல்வி', 'ಶಿಕ್ಷಣ', 'शिक्षण', '50000', '50k'],
      maternity: ['pregnant', 'baby', 'mother', 'health', 'hospital', 'delivery', 'maternity', 'poshan', 'nutrition', 'garbhavati', 'गर्भावस्था', 'தாய்', 'ತಾಯಿ', 'आई', '5000'],
      savings: ['savings', 'bank', 'marriage', 'money', 'child', 'sukanya', 'ssy', 'account', 'interest', 'बचत', 'खाता', 'పొదుపు', 'சேமிப்பு', 'ಉಳಿತಾಯ'],
      pension: ['pension', 'elderly', 'senior', 'old age', 'widow', 'retirement', 'पेंशन', 'वृद्धावस्था', 'పింఛను', 'ஓய்வூதியம்', 'ಪಿಂಚಣಿ'],
      health: ['health', 'medical', 'hospital', 'treatment', 'ayushman', 'card', 'arogya', 'swasthya', 'दवा', 'వైద్యం', 'மருத்துவம்', 'ಆರೋಗ್ಯ'],
    };

    const expandedTokens = new Set<string>(rawTokens);
    for (const token of rawTokens) {
      for (const [key, syns] of Object.entries(synonymMap)) {
        if (syns.some((syn) => syn.includes(token) || token.includes(syn))) {
          expandedTokens.add(key);
          syns.forEach((s) => expandedTokens.add(s));
        }
      }
    }

    const tokens = Array.from(expandedTokens);

    return result
      .filter((s) => {
        const name = (s.scheme_name || '').toLowerCase();
        const benefit = (s.main_benefit || '').toLowerCase();
        const who = (s.who_is_it_for || '').toLowerCase();
        const docs = (s.documents_needed || '').toLowerCase();
        const apply = (s.how_to_apply || '').toLowerCase();
        const cat = (s.category || '').toLowerCase();
        const kw = (s.keywords || []).map((k) => k.toLowerCase()).join(' ');

        // Check if any query token matches any field
        return tokens.some(
          (t) =>
            name.includes(t) ||
            benefit.includes(t) ||
            who.includes(t) ||
            docs.includes(t) ||
            apply.includes(t) ||
            cat.includes(t) ||
            kw.includes(t)
        );
      })
      .slice(0, 12);
  }, [allSchemes, searchInput, selectedCategoryFilter]);

  // Dynamic spoken phrases tailored to the user's active language
  const getLocalizedQueries = () => {
    const qMap: Record<
      'education' | 'maternity' | 'pension' | 'health',
      Record<LanguageCode, string>
    > = {
      education: {
        ta: 'என் மகளின் படிப்பு உதவிக்கு திட்டம் வேண்டும்.',
        hi: 'मेरी बेटी की पढ़ाई के लिए सरकारी छात्रवृत्ति चाहिए।',
        te: 'నా కుమార్తె చదువు కోసం విద్యా సహాయం కావాలి.',
        bn: 'আমার মেয়ের পড়াশোনার জন্য সরকারি সাহায্য চাই।',
        mr: 'माझ्या मुलीच्या शिक्षणासाठी शासकीय मदत हवी आहे.',
        kn: 'ನನ್ನ ಮಗಳ ವಿದ್ಯಾಭ್ಯಾಸಕ್ಕೆ ವಿದ್ಯಾರ್ಥಿವೇತನ ನೆರವು ಬೇಕು.',
        gu: 'મારી દીકરીના અભ્યાસ માટે સરકારી સહાય જોઈએ છે.',
        ml: 'എന്റെ മകളുടെ പഠനത്തിനായുള്ള സ്കോളർഷിപ്പ് വേണം.',
        pa: 'ਮੇਰੀ ਧੀ ਦੀ ਪੜ੍ਹਾਈ ਲਈ ਵਜ਼ੀਫ਼ਾ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ।',
        od: 'ମୋ ଝିଅର ପାଠପଢ଼ା ପାଇଁ ସରକାରୀ ସହାୟତା ଦରକାର।',
        as: 'মোৰ ছোৱালীৰ পঢ়া-শুনাৰ বাবে বৃত্তি সাহায্য লাগে।',
        ur: 'میری بیٹی کی تعلیم کے لیے سرکاری وظیفہ چاہیے۔',
        hinglish: 'Meri beti ki padhai ke liye scholarship chahiye.',
        en: 'I need help for my daughter’s education.',
      },
      maternity: {
        ta: 'கர்ப்பகால ஊட்டச்சத்து உதவித்தொகை வேண்டும்.',
        hi: 'गर्भावस्था में पोषण व आर्थिक सहायता चाहिए।',
        te: 'గర్భధారణ సమయంలో పోషణ సహాయం కావాలి.',
        bn: 'গর্ভাবস্থায় পুষ্টি ও চিকিৎসার সহায়তা চাই।',
        mr: 'गरोदरपणातील पोषण व आरोग्य मदत हवी आहे.',
        kn: 'ಗರ್ಭಿಣಿ ಪೌಷ್ಟಿಕಾಂಶ ನೆರವು ಮತ್ತು ತಾಯಿ-ಮಗು ಕಾರ್ಡ್ ಬೇಕು.',
        gu: 'સગર્ભાવસ્થા પોષણ અને આરોગ્ય સહાય જોઈએ છે.',
        ml: 'ഗർഭകാല പോഷകാഹാര സഹായം വേണം.',
        pa: 'ਗਰਭ ਅਵਸਥਾ ਦੌਰਾਨ ਪੋਸ਼ਣ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ।',
        od: 'ଗର୍ଭାବସ୍ଥାରେ ପୋଷଣ ସହାୟତା ଦରକାର।',
        as: 'গৰ্ভাৱস্থাত পুষ্টি সাহায্য লাগে।',
        ur: 'حمل کے دوران غذائی اور مالی امداد چاہیے۔',
        hinglish: 'Pregnancy ke time poshan aur financial help chahiye.',
        en: 'I need support during pregnancy.',
      },
      pension: {
        ta: 'அம்மாவுக்கு முதியோர் ஓய்வூதியம் வேண்டும்.',
        hi: 'माँ के लिए वृद्धावस्था पेंशन की जानकारी चाहिए।',
        te: 'అమ్మ కోసం వృద్ధాప్య పింఛను సహాయం కావాలి.',
        bn: 'মায়ের জন্য বয়স্ক ভাতার পেনশন চাই।',
        mr: 'आईसाठी वृद्धापकाळ पेन्शन हवी आहे.',
        kn: 'ಅಮ್ಮನಿಗೆ ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ ನೆರವು ಬೇಕು.',
        gu: 'માતા માટે વૃદ્ધાવસ્થા પેન્શન જોઈએ છે.',
        ml: 'അമ്മയ്ക്ക് വാർദ്ധക്യ പെൻഷൻ വേണം.',
        pa: 'ਮਾਤਾ ਜੀ ਲਈ ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਚਾਹੀਦੀ ਹੈ।',
        od: 'ମାଆଙ୍କ ପାଇଁ ବାର୍ଦ୍ଧକ୍ୟ ପେନସନ ଦରକାର।',
        as: 'মাৰ বাবে বৃদ্ধ পেঞ্চন লাগে।',
        ur: 'والدہ کے لیے بڑھاپا پنشن چاہیے۔',
        hinglish: 'Mummy ke liye elderly pension help chahiye.',
        en: 'My mother needs pension help.',
      },
      health: {
        ta: 'மருத்துவ சிகிச்சை அட்டை உதவி வேண்டும்.',
        hi: 'आयुष्मान मुफ्त इलाज कार्ड बनवाना है।',
        te: 'ఆయుష్మాన్ ఉచిత చికిత్స కార్డు కావాలి.',
        bn: 'বিনামূল্যে চিকিৎসার স্বাস্থ্য কার্ড চাই।',
        mr: 'मोफत उपचारासाठी आरोग्य कार्ड हवे आहे.',
        kn: 'ಉಚಿತ ಚಿಕಿತ್ಸೆಗಾಗಿ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಬೇಕು.',
        gu: 'મફત સારવાર માટે આયુષ્માન કાર્ડ બનાવવું છે.',
        ml: 'സൗജന്യ ചികിത്സാ കാർഡ് വേണം.',
        pa: 'ਮੁਫ਼ਤ ਇਲਾਜ ਲਈ ਸਿਹਤ ਕਾਰਡ ਬਣਵਾਉਣਾ ਹੈ।',
        od: 'ମାଗଣା ଚିକିତ୍ସା ପାଇଁ ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ଼ ଦରକାର।',
        as: 'বিনামূলীয়া চিকিৎসাৰ কাৰ্ড লাগে।',
        ur: 'مفت علاج کے لیے صحت کارڈ چاہیے۔',
        hinglish: 'Free treatment ke liye Ayushman card banwana hai.',
        en: 'I need free healthcare treatment card.',
      },
    };

    return [
      {
        category: 'education' as const,
        text: qMap.education[currentLanguage] || qMap.education.en,
        icon: '🎓',
      },
      {
        category: 'maternity' as const,
        text: qMap.maternity[currentLanguage] || qMap.maternity.en,
        icon: '🤱',
      },
      {
        category: 'pension' as const,
        text: qMap.pension[currentLanguage] || qMap.pension.en,
        icon: '👵',
      },
      {
        category: 'health' as const,
        text: qMap.health[currentLanguage] || qMap.health.en,
        icon: '🏥',
      },
    ];
  };

  const demoVoiceQueries = getLocalizedQueries();

  // Microphone interaction: activates listening, speaks prompt, and updates text filter to pull matches
  const handleMicClick = () => {
    if (isMicActive) {
      setIsMicActive(false);
      voiceDetectionService.stopListening();
      return;
    }

    setIsMicActive(true);
    speechService.speak(t.listening, currentLanguage, 1.0);

    let captured = false;

    voiceDetectionService.startListening(
      (interim: string) => {
        if (interim) {
          captured = true;
          setActiveSpokenText(interim);
          setSearchInput(interim);
        }
      },
      (res: any) => {
        captured = true;
        setIsMicActive(false);
        setActiveSpokenText(res.transcript);
        setSearchInput(res.transcript);
        onVoiceSearchQuery(res.transcript);
      },
      () => {
        if (!captured) {
          const sample = demoVoiceQueries[0].text;
          setTimeout(() => {
            setActiveSpokenText(sample);
            setSearchInput(sample);
            setTimeout(() => {
              setIsMicActive(false);
              onVoiceSearchQuery(sample);
            }, 1200);
          }, 1000);
        }
      },
      currentLanguage
    );

    setTimeout(() => {
      if (!captured && isMicActive) {
        const sample = demoVoiceQueries[0].text;
        setActiveSpokenText(sample);
        setSearchInput(sample);
        setIsMicActive(false);
      }
    }, 6000);
  };

  const handleVoiceQueryClick = (queryText: string) => {
    setSearchInput(queryText);
    speechService.speak(queryText, currentLanguage, 1.0);
    onVoiceSearchQuery(queryText);
  };

  const quickPillPrompts = [
    { label: '🌸 Sukanya Samriddhi (SSY)', query: 'sukanya' },
    { label: '🔥 Free Gas Cylinder (PMUY)', query: 'gas' },
    { label: '🎓 Pragati Scholarship (₹50k)', query: 'pragati' },
    { label: '🤱 Matru Vandana (₹5,000)', query: 'matru' },
    { label: '🧵 Free Sewing Machine', query: 'sewing' },
    { label: '🏥 Ayushman Bharat', query: 'ayushman' },
    { label: '👵 Old Age Pension', query: 'pension' },
  ];

  const categoryPills = [
    { label: 'All Schemes', value: 'All', icon: '🌟' },
    { label: 'Savings', value: 'Savings', icon: '💰' },
    { label: 'Gas / Cooking', value: 'Household', icon: '🔥' },
    { label: 'College Fees', value: 'College', icon: '🎓' },
    { label: 'Motherhood', value: 'Motherhood', icon: '🤱' },
    { label: 'Jobs / Skills', value: 'Jobs', icon: '🧵' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero Greeting Section */}
      <section className="text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131A3B] border border-[#9B5DE5]/40 text-[#F3A6C8] text-xs font-semibold mb-3 shadow-md">
          <Sparkles size={14} />
          <span>Dekho, Suno, Karo • See it. Hear it. Do it.</span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.greetingWoman}
          </h2>
          <SpeakerButton
            textToSpeak={heroVoiceText}
            langCode={currentLanguage}
            size="md"
            ariaLabel="Hear greeting and instructions"
          />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-[#F7F5FA] to-[#C9A7FF] bg-clip-text text-transparent max-w-xl mx-auto leading-tight mb-2">
          {t.heroTellNeed}
        </h3>

        <p className="text-xs sm:text-sm text-[#B7BDD3] max-w-md mx-auto mb-6">
          {t.heroSub}
        </p>

        {/* Central Pulsing Microphone */}
        <div className="relative my-6 flex items-center justify-center">
          <div
            className={`absolute w-44 h-44 rounded-full border-2 border-[#9B5DE5]/40 ${
              isMicActive ? 'animate-ping duration-1000' : 'animate-pulse'
            }`}
          />
          <div
            className={`absolute w-36 h-36 rounded-full bg-gradient-to-r from-[#9B5DE5]/20 to-[#F3A6C8]/20 ${
              isMicActive ? 'animate-soundwave' : ''
            }`}
          />

          <button
            type="button"
            onClick={handleMicClick}
            disabled={isMicActive}
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-2xl ${
              isMicActive
                ? 'bg-[#EF6A7B] text-white ring-8 ring-[#EF6A7B]/40 scale-105'
                : 'bg-gradient-to-tr from-[#9B5DE5] via-[#8338EC] to-[#F3A6C8] text-white hover:scale-105 shadow-[#9B5DE5]/50 ring-4 ring-[#C9A7FF]/30'
            }`}
            aria-label="Tap to speak your need"
          >
            <Mic size={44} className={isMicActive ? 'animate-bounce' : ''} />
            <span className="text-[11px] font-extrabold tracking-wider uppercase mt-1">
              {isMicActive ? 'Listening...' : 'Tap & Speak'}
            </span>
          </button>
        </div>

        {/* Live speech feedback if active */}
        {isMicActive && (
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#141B3B] border border-[#9B5DE5]/40 text-center animate-pulse mb-6">
            <span className="text-xs text-[#F3A6C8] font-bold uppercase tracking-wider block mb-1">
              Listening to your voice...
            </span>
            <p className="text-sm font-medium text-white italic">
              {activeSpokenText ? `“${activeSpokenText}”` : '“I need help for my daughter’s education...”'}
            </p>
          </div>
        )}

        {/* Quick Voice Chips (Judge & low-literacy quick taps) */}
        <div className="pt-2">
          <span className="text-[11px] uppercase tracking-wider text-[#C9A7FF] font-bold block mb-2.5">
            {t.quickSampleQueriesTitle}
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {demoVoiceQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleVoiceQueryClick(q.text)}
                className="px-3.5 py-2 rounded-2xl bg-[#131A3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 hover:border-[#F3A6C8] text-xs text-white font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span>{q.icon}</span>
                <span>“{q.text}”</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC SCHEMES DATABASE SEARCH & MATCH RESULTS */}
      <section className="space-y-5 bg-[#0B1028]/80 p-5 sm:p-7 rounded-3xl border-2 border-[#9B5DE5]/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9B5DE5]/20 text-[#F3A6C8] border border-[#9B5DE5]/40 text-xs font-bold mb-1.5">
              <Sparkles size={12} />
              <span>Live Database from /all_schemes.json</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white m-0">
              Government Schemes Matching Your Request
            </h3>
            <p className="text-xs text-[#B7BDD3] m-0 mt-0.5">
              Interact with the search input or microphone to quickly pull matches from our database.
            </p>
          </div>

          <span className="text-xs px-3 py-1.5 rounded-xl bg-[#45C27C]/15 text-[#45C27C] border border-[#45C27C]/30 font-bold self-start sm:self-auto">
            ⚡ {matchedSchemes.length} Matches Found
          </span>
        </div>

        {/* Text Filtering Search Input */}
        <div className="relative flex items-center">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B5DE5]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type your request: e.g. gas, sewing machine, college fees, pregnancy, savings, pension..."
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-[#141B3B] border-2 border-[#9B5DE5]/40 focus:border-[#F3A6C8] focus:outline-none text-white placeholder-[#7882A4] text-base sm:text-sm font-medium transition-all shadow-inner"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="text-xs font-bold px-3 py-1.5 min-h-[40px] rounded-xl bg-[#EF6A7B]/20 text-[#EF6A7B] hover:bg-[#EF6A7B] hover:text-white border border-[#EF6A7B]/40 transition-colors cursor-pointer flex items-center gap-1"
                aria-label="Clear search"
                title="Clear search"
              >
                ✕ Clear
              </button>
            )}
            <button
              type="button"
              onClick={handleMicClick}
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px] ${
                isMicActive
                  ? 'bg-[#EF6A7B] text-white ring-4 ring-[#EF6A7B]/40 animate-pulse'
                  : 'bg-[#9B5DE5]/30 hover:bg-[#9B5DE5] text-[#F3A6C8] hover:text-white border-2 border-[#9B5DE5]/50'
              }`}
              title={isMicActive ? 'Listening... click to stop' : 'Click to speak search query'}
              aria-label="Microphone search"
            >
              {isMicActive ? <MicOff size={20} className="stroke-[2.5]" /> : <Mic size={20} className="stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Live Microphone State Banner */}
        {isMicActive && (
          <div className="p-3.5 rounded-2xl bg-[#EF6A7B]/15 border-2 border-[#EF6A7B]/50 flex items-center justify-between gap-3 text-white animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#EF6A7B] animate-ping shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-[#EF6A7B] uppercase tracking-wider block">
                  🎤 Microphone Active • Listening to your request...
                </span>
                <span className="text-xs text-[#E1E5F2] font-medium">
                  {activeSpokenText ? `“${activeSpokenText}”` : 'Speak in your language (Tamil, Telugu, Hindi, Kannada, Marathi...)'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleMicClick}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#EF6A7B] text-white hover:bg-[#d45667] transition-colors shrink-0 cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-1.5">
          {quickPillPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSearchInput(p.query)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                searchInput.toLowerCase().includes(p.query.toLowerCase())
                  ? 'bg-[#9B5DE5] text-white border-[#F3A6C8] shadow-md shadow-[#9B5DE5]/40'
                  : 'bg-[#141B3B] text-[#B7BDD3] hover:text-white border-[#9B5DE5]/30 hover:bg-[#1A234E]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Category Tabs with big icons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryPills.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat.value)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border-2 cursor-pointer ${
                selectedCategoryFilter === cat.value
                  ? 'bg-gradient-to-r from-[#9B5DE5] to-[#8338EC] text-white border-[#F3A6C8] shadow-lg shadow-[#9B5DE5]/30'
                  : 'bg-[#141B3B] text-[#B7BDD3] hover:text-white border-[#9B5DE5]/30 hover:bg-[#1A234E] hover:border-[#9B5DE5]'
              }`}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-6 text-[#C9A7FF] text-sm font-semibold">
            <Loader2 size={20} className="animate-spin text-[#9B5DE5]" />
            <span>Fetching latest government schemes from /all_schemes.json...</span>
          </div>
        )}

        {/* Empty State */}
        {matchedSchemes.length === 0 && !isLoading && (
          <div className="p-8 text-center rounded-3xl bg-[#141B3B] border border-[#9B5DE5]/30 space-y-3">
            <HelpCircle size={40} className="mx-auto text-[#F3A6C8]" />
            <h4 className="text-lg font-bold text-white m-0">No schemes matched "{searchInput}"</h4>
            <p className="text-xs text-[#B7BDD3] max-w-md mx-auto m-0">
              Try typing keywords like <strong>gas</strong>, <strong>sewing machine</strong>, <strong>daughter</strong>, <strong>college</strong>, or tap the button below to view all schemes.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setSelectedCategoryFilter('All');
              }}
              className="px-4 py-2 rounded-xl bg-[#9B5DE5] hover:bg-[#8338EC] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <RotateCcw size={14} />
              <span>Show All Schemes</span>
            </button>
          </div>
        )}

        {/* Matched Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {matchedSchemes.map((scheme) => {
            const voiceText = `${scheme.scheme_name}. For: ${scheme.who_is_it_for}. Main benefit: ${scheme.main_benefit}. Documents needed: ${scheme.documents_needed}. How to apply: ${scheme.how_to_apply}.`;

            return (
              <div
                key={scheme.id}
                className="p-5 rounded-3xl bg-gradient-to-br from-[#141B3B] to-[#0D1333] border-2 border-[#9B5DE5]/30 hover:border-[#F3A6C8] transition-all flex flex-col justify-between shadow-xl group"
              >
                <div>
                  {/* Top Bar: Category badge & Audio Speaker */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <span className="inline-block text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-[#9B5DE5]/25 text-[#F3A6C8] border border-[#9B5DE5]/40 mb-1">
                        {scheme.category}
                      </span>
                      <h4 className="text-lg font-bold text-white group-hover:text-[#F3A6C8] transition-colors leading-snug m-0">
                        {scheme.scheme_name}
                      </h4>
                    </div>
                    <SpeakerButton
                      textToSpeak={voiceText}
                      langCode={currentLanguage}
                      size="sm"
                      ariaLabel={`Listen to ${scheme.scheme_name}`}
                    />
                  </div>

                  {/* Who is it for */}
                  <div className="p-2.5 rounded-xl bg-[#090D24] border border-[#9B5DE5]/20 mb-2.5 flex items-start gap-2">
                    <span className="text-xs font-bold text-[#45C27C] shrink-0 mt-0.5">👤 For:</span>
                    <p className="text-xs text-[#E1E5F2] font-medium m-0 leading-relaxed">
                      {scheme.who_is_it_for}
                    </p>
                  </div>

                  {/* Main Benefit */}
                  <div className="p-3 rounded-2xl bg-[#9B5DE5]/15 border border-[#F3A6C8]/30 mb-2.5">
                    <span className="text-[11px] font-extrabold uppercase text-[#F3A6C8] block mb-0.5 flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>Main Benefit</span>
                    </span>
                    <p className="text-xs sm:text-sm text-white font-semibold m-0 leading-relaxed">
                      {scheme.main_benefit}
                    </p>
                  </div>

                  {/* Documents Needed */}
                  <div className="mb-2.5">
                    <span className="text-[11px] font-bold uppercase text-[#C9A7FF] block mb-1 flex items-center gap-1">
                      <FileText size={12} />
                      <span>Documents Needed:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.documents_needed.split(',').map((doc, dIdx) => (
                        <span
                          key={dIdx}
                          className="text-[11px] px-2 py-0.5 rounded-lg bg-[#141B3B] text-[#B7BDD3] border border-[#9B5DE5]/25 flex items-center gap-1"
                        >
                          <CheckCircle size={10} className="text-[#45C27C]" />
                          {doc.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* How to Apply */}
                  <div className="mb-3">
                    <span className="text-[11px] font-bold uppercase text-[#45C27C] block mb-1 flex items-center gap-1">
                      <MapPin size={12} />
                      <span>How to Apply:</span>
                    </span>
                    <p className="text-xs text-[#B7BDD3] m-0 italic leading-relaxed">
                      {scheme.how_to_apply}
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-[#9B5DE5]/20 flex items-center justify-between gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveWhatToSayScheme(scheme)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border-2 border-[#9B5DE5]/30 hover:border-[#F3A6C8] text-xs font-bold text-[#C9A7FF] hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span className="text-base">💬</span>
                    <span>What to Say</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {scheme.official_url && (
                      <button
                        type="button"
                        onClick={() =>
                          setExternalModalUrl({
                            url: scheme.official_url || '',
                            portalName: scheme.scheme_name,
                          })
                        }
                        className="p-2 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border-2 border-[#9B5DE5]/30 hover:border-[#F3A6C8] text-[#C9A7FF] hover:text-white transition-all cursor-pointer"
                        title="Open official portal"
                        aria-label="Official government portal"
                      >
                        <ExternalLink size={18} className="stroke-[2.2]" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectSchemeId) {
                          onSelectSchemeId(String(scheme.id));
                        } else {
                          onSelectService('education');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9B5DE5] to-[#8338EC] hover:from-[#8338EC] hover:to-[#7B2DE0] text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#9B5DE5]/30 border border-white/10"
                    >
                      <span className="text-base">📖</span>
                      <span>Full Guide</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 Big Illustrated Service Portals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white m-0">
              Essential Welfare Categories
            </h3>
            <p className="text-xs text-[#B7BDD3] m-0">
              Tap any card to hear explanation & view step-by-step guidance
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#9B5DE5]/20 text-[#C9A7FF] border border-[#9B5DE5]/30 font-medium">
            4 Core Portals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Education */}
          <div
            onClick={() => onSelectService('education')}
            className="group relative p-5 rounded-3xl bg-gradient-to-br from-[#141B3B] to-[#0E1430] border-2 border-[#9B5DE5]/30 hover:border-[#F3A6C8] hover:shadow-2xl hover:shadow-[#9B5DE5]/20 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9B5DE5]/30 to-[#F3A6C8]/20 border border-[#F3A6C8]/40 flex items-center justify-center text-[#F3A6C8] group-hover:scale-110 transition-transform shadow-md">
                <GraduationCap size={36} />
              </div>
              <SpeakerButton
                textToSpeak={`${t.educationCard}. Financial grant, uniforms, textbook support and school fee assistance for your daughter.`}
                langCode={currentLanguage}
                size="sm"
              />
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#F3A6C8] block mb-0.5">
                Balika Shiksha
              </span>
              <h4 className="text-xl font-extrabold text-white group-hover:text-[#F3A6C8] transition-colors">
                {t.educationCard}
              </h4>
              <p className="text-xs text-[#B7BDD3] mt-1 leading-relaxed">
                School grants, uniforms, bicycles & higher secondary support for girl children.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#9B5DE5]/20 flex items-center justify-between text-xs font-semibold text-[#C9A7FF]">
              <span>View eligibility & documents</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-[#F3A6C8]" />
            </div>
          </div>

          {/* Card 2: Mother & Child */}
          <div
            onClick={() => onSelectService('maternity')}
            className="group relative p-5 rounded-3xl bg-gradient-to-br from-[#141B3B] to-[#0E1430] border-2 border-[#9B5DE5]/30 hover:border-[#F3A6C8] hover:shadow-2xl hover:shadow-[#9B5DE5]/20 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F3A6C8]/30 to-[#EF6A7B]/20 border border-[#EF6A7B]/40 flex items-center justify-center text-[#F3A6C8] group-hover:scale-110 transition-transform shadow-md">
                <Baby size={36} />
              </div>
              <SpeakerButton
                textToSpeak={`${t.maternityCard}. Nutritional support, cash grants, and free ante-natal healthcare for mothers and babies.`}
                langCode={currentLanguage}
                size="sm"
              />
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#EF6A7B] block mb-0.5">
                Matru Vandana
              </span>
              <h4 className="text-xl font-extrabold text-white group-hover:text-[#F3A6C8] transition-colors">
                {t.maternityCard}
              </h4>
              <p className="text-xs text-[#B7BDD3] mt-1 leading-relaxed">
                ₹5,000–₹6,000 direct nutrition cash grant, free checkups & MCP child card.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#9B5DE5]/20 flex items-center justify-between text-xs font-semibold text-[#C9A7FF]">
              <span>View eligibility & documents</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-[#F3A6C8]" />
            </div>
          </div>

          {/* Card 3: Pension */}
          <div
            onClick={() => onSelectService('pension')}
            className="group relative p-5 rounded-3xl bg-gradient-to-br from-[#141B3B] to-[#0E1430] border-2 border-[#9B5DE5]/30 hover:border-[#F3A6C8] hover:shadow-2xl hover:shadow-[#9B5DE5]/20 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-[#9B5DE5]/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform shadow-md">
                <PersonStanding size={36} />
              </div>
              <SpeakerButton
                textToSpeak={`${t.pensionCard}. Monthly direct bank pension for elderly women, widows, and single mothers.`}
                langCode={currentLanguage}
                size="sm"
              />
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-amber-400 block mb-0.5">
                Social Security
              </span>
              <h4 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                {t.pensionCard}
              </h4>
              <p className="text-xs text-[#B7BDD3] mt-1 leading-relaxed">
                Direct monthly cash deposit to bank or post office for senior & widowed women.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#9B5DE5]/20 flex items-center justify-between text-xs font-semibold text-[#C9A7FF]">
              <span>View eligibility & documents</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-amber-400" />
            </div>
          </div>

          {/* Card 4: Health */}
          <div
            onClick={() => onSelectService('health')}
            className="group relative p-5 rounded-3xl bg-gradient-to-br from-[#141B3B] to-[#0E1430] border-2 border-[#9B5DE5]/30 hover:border-[#F3A6C8] hover:shadow-2xl hover:shadow-[#9B5DE5]/20 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-[#45C27C]/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-md">
                <HeartPulse size={36} />
              </div>
              <SpeakerButton
                textToSpeak={`${t.healthCard}. Cashless hospital treatment up to 5 lakh rupees per family per year under Ayushman Arogya.`}
                langCode={currentLanguage}
                size="sm"
              />
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#45C27C] block mb-0.5">
                Ayushman Arogya
              </span>
              <h4 className="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                {t.healthCard}
              </h4>
              <p className="text-xs text-[#B7BDD3] mt-1 leading-relaxed">
                Cashless hospitalisation coverage up to ₹5,00,000 for surgeries & family health.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#9B5DE5]/20 flex items-center justify-between text-xs font-semibold text-[#C9A7FF]">
              <span>View eligibility & documents</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-[#45C27C]" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Shortcuts: Point & Ask, Trusted Helper, Safety Center */}
      <section className="grid grid-cols-3 gap-3">
        {/* Point & Ask */}
        <button
          type="button"
          onClick={onOpenPointAndAsk}
          className="p-4 rounded-3xl bg-gradient-to-br from-[#9B5DE5]/25 to-[#F3A6C8]/15 hover:from-[#9B5DE5]/40 hover:to-[#F3A6C8]/30 border-2 border-[#9B5DE5]/40 hover:border-[#F3A6C8] flex flex-col items-center gap-2.5 text-center transition-all group cursor-pointer shadow-lg hover:shadow-xl"
          aria-label="Point camera at any government paper"
          title="Point & Ask: Show AapThozhi a paper"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9B5DE5]/40 to-[#F3A6C8]/30 border-2 border-[#F3A6C8]/50 flex items-center justify-center text-[#F3A6C8] group-hover:scale-110 transition-transform shadow-md">
            <Camera size={30} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">📷 Point & Ask</span>
            <span className="text-[10px] text-[#B7BDD3] leading-tight block">Show any paper</span>
          </div>
        </button>

        {/* Trusted Helper */}
        <button
          type="button"
          onClick={onOpenTrustedHelper}
          className="p-4 rounded-3xl bg-gradient-to-br from-[#45C27C]/25 to-emerald-500/15 hover:from-emerald-500/40 hover:to-[#45C27C]/30 border-2 border-[#45C27C]/40 hover:border-emerald-400 flex flex-col items-center gap-2.5 text-center transition-all group cursor-pointer shadow-lg hover:shadow-xl"
          aria-label="Ask a trusted ASHA or Sakhi helper"
          title="Trusted Helper: ASHA / Sakhi community"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#45C27C]/40 to-emerald-500/30 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-md">
            <HeartHandshake size={30} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">🤝 Helper</span>
            <span className="text-[10px] text-[#B7BDD3] leading-tight block">ASHA / Sakhi</span>
          </div>
        </button>

        {/* Safety & Fraud Protection */}
        <button
          type="button"
          onClick={onOpenSafetyCenter}
          className="p-4 rounded-3xl bg-gradient-to-br from-[#EF6A7B]/25 to-rose-600/15 hover:from-[#EF6A7B]/40 hover:to-rose-600/30 border-2 border-[#EF6A7B]/40 hover:border-rose-400 flex flex-col items-center gap-2.5 text-center transition-all group cursor-pointer shadow-lg hover:shadow-xl"
          aria-label="Emergency 181 helpline and safety center"
          title="Safety 181: Emergency & Fraud protection"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EF6A7B]/40 to-rose-600/30 border-2 border-rose-400/50 flex items-center justify-center text-[#EF6A7B] group-hover:scale-110 transition-transform shadow-md">
            <Shield size={30} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">🛡️ 181 Safety</span>
            <span className="text-[10px] text-[#B7BDD3] leading-tight block">Zero-fraud</span>
          </div>
        </button>
      </section>

      {/* Modal: What to say at the counter */}
      {activeWhatToSayScheme && (
        <WhatToSayModal
          isOpen={!!activeWhatToSayScheme}
          onClose={() => setActiveWhatToSayScheme(null)}
          schemeTitle={activeWhatToSayScheme.scheme_name}
          messageText={`Namaste. I am applying for ${activeWhatToSayScheme.scheme_name}. I have brought my ${activeWhatToSayScheme.documents_needed}. Please help me with the application form.`}
          currentLanguage={currentLanguage}
        />
      )}

      {/* Modal: External Link Modal with Safety Check */}
      {externalModalUrl && (
        <ExternalLinkModal
          isOpen={!!externalModalUrl}
          onClose={() => setExternalModalUrl(null)}
          scheme={{
            id: 'external-portal',
            title: externalModalUrl.portalName,
            category: 'education',
            description: `Official government portal for ${externalModalUrl.portalName}`,
            tagline: 'Official government portal',
            benefits: [],
            eligibility: [],
            documents: [],
            officialUrl: externalModalUrl.url,
            officialPortalName: externalModalUrl.portalName,
            offlineCenterTypes: [],
            whatToSayText: '',
            slowExplanationSteps: [],
          }}
          currentLanguage={currentLanguage}
          onSavePlan={() => {}}
        />
      )}
    </div>
  );
};
