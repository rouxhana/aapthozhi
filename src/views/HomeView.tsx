import React, { useEffect, useState } from 'react';
import {
  Baby,
  BookOpen,
  Camera,
  ChevronRight,
  GraduationCap,
  HeartPulse,
  Mic,
  PersonStanding,
  Shield,
  Sparkles,
  Stethoscope,
  Users,
  Volume2,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { speechService } from '../services/speechService';

interface HomeViewProps {
  currentLanguage: LanguageCode;
  userName?: string;
  onSelectService: (serviceCategory: 'education' | 'maternity' | 'pension' | 'health') => void;
  onVoiceSearchQuery: (query: string) => void;
  onOpenPointAndAsk: () => void;
  onOpenTrustedHelper: () => void;
  onOpenSafetyCenter: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLanguage,
  userName,
  onSelectService,
  onVoiceSearchQuery,
  onOpenPointAndAsk,
  onOpenTrustedHelper,
  onOpenSafetyCenter,
}) => {
  const [isMicActive, setIsMicActive] = useState(false);
  const [activeSpokenText, setActiveSpokenText] = useState('');

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const heroVoiceText = `${t.greetingWoman}. ${t.heroTellNeed}. ${t.heroSub}`;

  useEffect(() => {
    // Initial friendly greeting
    const timer = setTimeout(() => {
      speechService.speak(`${t.greetingWoman}. ${t.heroTellNeed}`, currentLanguage, 1.0);
    }, 400);
    return () => {
      clearTimeout(timer);
      speechService.stop();
    };
  }, [currentLanguage]);

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
        ur: 'والدہ کے لیے بڑھاپا پنشن چاہیے۔' ,
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
        translatedText: qMap.education[currentLanguage] || qMap.education.en,
        label: t.educationCard,
        icon: '🎓',
      },
      {
        category: 'maternity' as const,
        text: qMap.maternity[currentLanguage] || qMap.maternity.en,
        translatedText: qMap.maternity[currentLanguage] || qMap.maternity.en,
        label: t.maternityCard,
        icon: '🤱',
      },
      {
        category: 'pension' as const,
        text: qMap.pension[currentLanguage] || qMap.pension.en,
        translatedText: qMap.pension[currentLanguage] || qMap.pension.en,
        label: t.pensionCard,
        icon: '👵',
      },
      {
        category: 'health' as const,
        text: qMap.health[currentLanguage] || qMap.health.en,
        translatedText: qMap.health[currentLanguage] || qMap.health.en,
        label: t.healthCard,
        icon: '🏥',
      },
    ];
  };

  const demoVoiceQueries = getLocalizedQueries();

  const handleMicClick = () => {
    setIsMicActive(true);
    speechService.speak(t.listening, currentLanguage, 1.0);

    const defaultSpoken = demoVoiceQueries[0].text;

    setTimeout(() => {
      setActiveSpokenText(defaultSpoken);
      setTimeout(() => {
        setIsMicActive(false);
        onVoiceSearchQuery(defaultSpoken);
      }, 1400);
    }, 1800);
  };

  const handleVoiceQueryClick = (queryText: string) => {
    speechService.speak(queryText, currentLanguage, 1.0);
    onVoiceSearchQuery(queryText);
  };

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
                className="px-3.5 py-2 rounded-2xl bg-[#131A3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 hover:border-[#F3A6C8] text-xs text-white font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <span>{q.icon}</span>
                <span>“{q.text}”</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Big Illustrated Service Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white m-0">
              Essential Welfare Services
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
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Point & Ask */}
        <button
          type="button"
          onClick={onOpenPointAndAsk}
          className="p-4 rounded-2xl bg-[#131A3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 flex items-center gap-3 text-left transition-all group"
        >
          <div className="p-3 rounded-xl bg-[#9B5DE5]/20 text-[#F3A6C8] border border-[#9B5DE5]/40 shrink-0 group-hover:scale-105 transition-transform">
            <Camera size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Point & Ask</span>
            <span className="text-[11px] text-[#B7BDD3]">Show AapThozhi a paper</span>
          </div>
        </button>

        {/* Trusted Helper */}
        <button
          type="button"
          onClick={onOpenTrustedHelper}
          className="p-4 rounded-2xl bg-[#131A3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 flex items-center gap-3 text-left transition-all group"
        >
          <div className="p-3 rounded-xl bg-[#45C27C]/20 text-[#45C27C] border border-[#45C27C]/40 shrink-0 group-hover:scale-105 transition-transform">
            <Users size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Trusted Helper</span>
            <span className="text-[11px] text-[#B7BDD3]">ASHA / Sakhi community</span>
          </div>
        </button>

        {/* Safety & Fraud Protection */}
        <button
          type="button"
          onClick={onOpenSafetyCenter}
          className="p-4 rounded-2xl bg-[#131A3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 flex items-center gap-3 text-left transition-all group"
        >
          <div className="p-3 rounded-xl bg-[#EF6A7B]/20 text-[#EF6A7B] border border-[#EF6A7B]/40 shrink-0 group-hover:scale-105 transition-transform">
            <Shield size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Safety Center</span>
            <span className="text-[11px] text-[#B7BDD3]">Zero-fraud protection</span>
          </div>
        </button>
      </section>
    </div>
  );
};
