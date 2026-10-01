import React, { useEffect, useState } from 'react';
import {
  BookmarkCheck,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  FolderCheck,
  HeartHandshake,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Search,
  Share2,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react';
import { HelpCenter, LanguageCode, SchemeInfo } from '../types';
import { MOCK_HELP_CENTRES } from '../data/helpCentres';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { WhatToSayModal } from '../components/WhatToSayModal';
import { speechService } from '../services/speechService';

interface OfflinePlanViewProps {
  scheme: SchemeInfo;
  currentLanguage: LanguageCode;
  onSavePlan: () => void;
  onBack: () => void;
}

export const OfflinePlanView: React.FC<OfflinePlanViewProps> = ({
  scheme,
  currentLanguage,
  onSavePlan,
  onBack,
}) => {
  const [selectedCenter, setSelectedCenter] = useState<HelpCenter>(MOCK_HELP_CENTRES[0]);
  const [isWhatToSayOpen, setIsWhatToSayOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [searchAreaInput, setSearchAreaInput] = useState('');
  const [displayedCentres, setDisplayedCentres] = useState<HelpCenter[]>(MOCK_HELP_CENTRES);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const getLocalizedPlanAnnouncement = (): string => {
    switch (currentLanguage) {
      case 'ta':
        return `${scheme.title} நேரடி உதவி வழிகாட்டல். 5 எளிய படிகள்: 1. எங்கு செல்ல வேண்டும்: ${selectedCenter.name}, தொலைவு ${selectedCenter.distance}. 2. யாரைச் சந்திக்க வேண்டும்: உதவி மைய அலுவலர். 3. கொண்டு செல்ல வேண்டியவை: தேவையான ஆவணங்கள். 4. என்ன கூற வேண்டும்: எங்கள் கோரிக்கை அட்டை. 5. நிலை அறிதல்: 7 வேலை நாட்கள்.`;
      case 'hi':
        return `${scheme.title} के लिए नज़दीकी सहायता योजना। 5 आसान चरण: 1. कहाँ जाएँ: ${selectedCenter.name}, दूरी ${selectedCenter.distance}। 2. किससे मिलें: नागरिक सुविधा सहायक। 3. साथ क्या ले जाएँ: ज़रूरी दस्तावेज़। 4. क्या बोलें: हमारा सहायता कार्ड दिखाएँ। 5. कब जाँचें: 7 कार्य दिवस।`;
      case 'te':
        return `${scheme.title} సహాయ మార్గదర్శకత్వం. 5 సులభ దశలు: 1. ఎక్కడికి వెళ్లాలి: ${selectedCenter.name}, దూరం ${selectedCenter.distance}. 2. ఎవరిని కలవాలి: సహాయ కేంద్రం అధికారి. 3. వెంట ఏమి తీసుకెళ్లాలి: అవసరమైన పత్రాలు. 4. అక్కడ ఏమి చెప్పాలి: సహాయ సందేశం. 5. తనిఖీ: 7 రోజుల్లో.`;
      case 'bn':
        return `${scheme.title} সরাসরি সহায়তা নির্দেশিকা। ৫টি সহজ ধাপ: ১. কোথায় যাবেন: ${selectedCenter.name}, দূরত্ব ${selectedCenter.distance}। ২. কার সাথে দেখা করবেন: সহায়তা কর্মী। ৩. সাথে কি নেবেন: প্রয়োজনীয় কাগজপত্র। ৪. কী বলবেন: সাহায্য কার্ডটি দেখান। ৫. পরবর্তী আপডেট: ৭ কার্যদিবস।`;
      case 'mr':
        return `${scheme.title} थेट मदत नियोजन. ५ सोप्या पायऱ्या: १. कुठे जावे: ${selectedCenter.name}, अंतर ${selectedCenter.distance}. २. कोणाला भेटावे: मदत कक्ष अधिकारी. ३. सोबत काय न्यावे: आवश्यक कागदपत्रे. ४. काय बोलावे: आमचा संदेश दाखवा. ५. पुढील पाठपुरावा: ७ कामकाजाचे दिवस.`;
      case 'kn':
        return `${scheme.title} ನೇರ ಸಹಾಯ ಯೋಜನೆ. 5 ಸರಳ ಹಂತಗಳು: 1. ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು: ${selectedCenter.name}, ದೂರ ${selectedCenter.distance}. 2. ಯಾರನ್ನು ಭೇಟಿಯಾಗಬೇಕು: ಸಹಾಯ ಕೇಂದ್ರದ ಅಧಿಕಾರಿ. 3. ಜತೆಯಲ್ಲಿ ಏನು ಒಯ್ಯಬೇಕು: ಅಗತ್ಯ ದಾಖಲೆಗಳು. 4. ಏನು ಹೇಳಬೇಕು: ನಮ್ಮ ಸಂದೇಶ ಕಾರ್ಡ್. 5. ಪರಿಶೀಲನೆ: 7 ದಿನಗಳಲ್ಲಿ.`;
      case 'gu':
        return `${scheme.title} સહાય માર્ગદર્શિકા. ૫ સરળ પગલાં: ૧. ક્યાં જવું: ${selectedCenter.name}, અંતર ${selectedCenter.distance}. ૨. કોને મળવું: સહાયક કર્મચારી. ૩. સાથે શું લઈ જવું: જરૂરી દસ્તાવેજો. ૪. શું કહેવું: અમારી સહાય સ્ક્રીન બતાવો. ૫. ચકાસણી: ૭ દિવસમાં.`;
      case 'ml':
        return `${scheme.title} സഹായ നിർദ്ദേശങ്ങൾ. 5 ലളിത ഘട്ടങ്ങൾ: 1. എവിടെ പോകണം: ${selectedCenter.name}, ദൂരം ${selectedCenter.distance}. 2. ആരെ കാണണം: ഹെൽപ്പ് ഡെസ്ക് ഉദ്യോഗസ്ഥൻ. 3. കരുതേണ്ടവ: ആവശ്യമായ രേഖകൾ. 4. എന്തു പറയണം: സഹായ കാർഡ് കാണിക്കുക. 5. അടുത്ത പരിശോധന: 7 ദിവസത്തിനുള്ളിൽ.`;
      case 'pa':
        return `${scheme.title} ਸਹਾਇਤਾ ਗਾਈਡ। 5 ਆਸਾਨ ਕਦਮ: 1. ਕਿੱਥੇ ਜਾਣਾ ਹੈ: ${selectedCenter.name}, ਦੂਰੀ ${selectedCenter.distance}। 2. ਕਿਸ ਨੂੰ ਮਿਲਣਾ ਹੈ: ਸਹਾਇਤਾ ਅਧਿਕਾਰੀ। 3. ਨਾਲ ਕੀ ਲੈ ਜਾਣਾ ਹੈ: ਲੋੜੀਂਦੇ ਕਾਗਜ਼ਾਤ। 4. ਕੀ ਕਹਿਣਾ ਹੈ: ਸਾਡਾ ਕਾਰਡ ਦਿਖਾਓ। 5. ਜਾਂਚ: 7 ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਵਿੱਚ।`;
      case 'od':
        return `${scheme.title} ସହାୟତା ମାର୍ଗଦର୍ଶିକା। ୫ଟି ପଦକ୍ଷେପ: ୧. କେଉଁଠାକୁ ଯିବେ: ${selectedCenter.name}, ଦୂରତା ${selectedCenter.distance}। ୨. କାହାକୁ ଭେଟିବେ: ସହାୟକ ଅଧିକାରୀ। ୩. ସାଥିରେ କଣ ନେବେ: କାଗଜପତ୍ର। ୪. କଣ କହିବେ: ଆମର ସହାୟତା କାର୍ଡ଼। ୫. ଯାଞ୍ଚ: ୭ କାର୍ଯ୍ୟଦିବସ।`;
      case 'as':
        return `${scheme.title} সহায় নিৰ্দেশনা। ৫টা খোজ: ১. ক’লৈ যাব: ${selectedCenter.name}, দূৰত্ব ${selectedCenter.distance}। ২. কাক লগ পাব: সহায়ক বিষয়া। ৩. লগত কি নিব: প্ৰয়োজনীয় নথিপত্ৰ। ৪. কি ক’ব: সাহায্য কাৰ্ডখন দেখুৱাওক। ৫. পৰৱৰ্তী খবৰ: ৭ কাৰ্যদিনৰ ভিতৰত।`;
      case 'ur':
        return `${scheme.title} کی رہنمائی کا منصوبہ۔ 5 آسان مراحل: 1. کہاں جانا ہے: ${selectedCenter.name}، فاصلہ ${selectedCenter.distance}۔ 2. کس سے ملنا ہے: معاون اہلکار۔ 3. ساتھ کیا لے جانا ہے: ضروری دستاویزات۔ 4. کیا کہنا ہے: کارڈ دکھائیں۔ 5. اگلا قدم: 7 کام کے دن۔`;
      case 'hinglish':
        return `${scheme.title} ke liye nearby help plan. 5 easy steps: 1. Kahan jana hai: ${selectedCenter.name}, distance ${selectedCenter.distance}. 2. Kisse milna hai: Citizen facilitation officer. 3. Saath kya le jana hai: Required documents. 4. Kya bolna hai: Show our counter card. 5. Kab check karein: 7 working days.`;
      default:
        return `Offline guidance plan for ${scheme.title}. Five step plan: 1. Where to go: ${selectedCenter.name}, ${selectedCenter.distance} away. 2. Who can help: Citizen facilitation officer. 3. What to carry: Required documents. 4. What to say: Use our counter card. 5. When to check: 7 working days.`;
    }
  };

  const planAnnouncement = getLocalizedPlanAnnouncement();

  useEffect(() => {
    speechService.speak(planAnnouncement, currentLanguage, 1.0);
    return () => {
      speechService.stop();
    };
  }, [currentLanguage, selectedCenter]);

  const handleSave = () => {
    onSavePlan();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSearchArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAreaInput.trim()) {
      setDisplayedCentres(MOCK_HELP_CENTRES);
      return;
    }
    const filtered = MOCK_HELP_CENTRES.filter(
      (c) =>
        c.name.toLowerCase().includes(searchAreaInput.toLowerCase()) ||
        c.address.toLowerCase().includes(searchAreaInput.toLowerCase())
    );
    setDisplayedCentres(filtered.length > 0 ? filtered : MOCK_HELP_CENTRES);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-xs text-[#C9A7FF] font-medium"
        >
          ← Back to Scheme
        </button>

        <div className="flex items-center gap-2">
          <SpeakerButton
            textToSpeak={planAnnouncement}
            langCode={currentLanguage}
            size="md"
            ariaLabel="Hear offline plan"
          />

          <button
            type="button"
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/40 text-xs text-[#F3A6C8] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookmarkCheck size={16} className={isSaved ? 'text-emerald-400' : ''} />
            <span>{isSaved ? 'Saved!' : t.saveForLaterBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1C163B] to-[#0E102E] border-2 border-[#F3A6C8]/40 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F3A6C8]/20 border border-[#F3A6C8]/40 flex items-center justify-center text-[#F3A6C8]">
            <MapPin size={26} />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#F3A6C8]">
              Route B • Offline Support Plan
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {t.offlineFiveStepsTitle}
            </h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#B7BDD3] leading-relaxed">
          Follow this 5-step visual guide to visit your local help desk with confidence. No smartphone internet needed once you are there!
        </p>
      </div>

      {/* Visual 5-Step Plan */}
      <div className="space-y-3">
        {/* Step 1: Where to go */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131A3B] border border-[#9B5DE5]/30 flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#9B5DE5]/20 border border-[#9B5DE5]/40 flex items-center justify-center text-[#C9A7FF] shrink-0 font-bold">
            <Building2 size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase font-bold text-[#F3A6C8] block mb-0.5">
              {t.stepWhereToGo}
            </span>
            <h3 className="text-base font-bold text-white m-0">
              {selectedCenter.name}
            </h3>
            <p className="text-xs text-[#B7BDD3] mt-1">
              📍 {selectedCenter.address} ({selectedCenter.distance} away)
            </p>
          </div>
        </div>

        {/* Step 2: Who can help */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131A3B] border border-[#9B5DE5]/30 flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#45C27C]/20 border border-[#45C27C]/40 flex items-center justify-center text-[#45C27C] shrink-0 font-bold">
            <Users size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase font-bold text-[#45C27C] block mb-0.5">
              {t.stepWhoCanHelp}
            </span>
            <h3 className="text-base font-bold text-white m-0">
              Citizen Facilitation Helper / ASHA / VLE Officer
            </h3>
            <p className="text-xs text-[#B7BDD3] mt-1">
              Designated female assistance desk available at reception counter.
            </p>
          </div>
        </div>

        {/* Step 3: What to carry */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131A3B] border border-[#9B5DE5]/30 flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 font-bold">
            <FolderCheck size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase font-bold text-amber-400 block mb-0.5">
              {t.stepWhatToCarry}
            </span>
            <h3 className="text-base font-bold text-white m-0">
              4 Documents in a File
            </h3>
            <p className="text-xs text-[#B7BDD3] mt-1">
              School Bonafide Certificate, Student/Mother Aadhaar Card, Bank Passbook, and 2 passport photos.
            </p>
          </div>
        </div>

        {/* Step 4: What to say (The Standout Feature!) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#241A4A] to-[#161236] border-2 border-[#F3A6C8] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F3A6C8] text-[#0B1026] flex items-center justify-center shrink-0 font-bold shadow-md">
              <MessageSquare size={24} />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#F3A6C8] block mb-0.5">
                {t.stepWhatToSay} (Standout Feature)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white m-0">
                “What to say when you go” Counter Card
              </h3>
              <p className="text-xs text-[#F7F5FA] mt-1 max-w-md">
                Show this high-contrast screen or play aloud at the desk so the helper understands immediately.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsWhatToSayOpen(true)}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-[#F3A6C8] hover:bg-[#efa0c3] text-[#0B1026] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F3A6C8]/30 transition-all cursor-pointer shrink-0"
          >
            <Sparkles size={16} />
            <span>Open Counter Card</span>
          </button>
        </div>

        {/* Step 5: When to check again */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131A3B] border border-[#9B5DE5]/30 flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0 font-bold">
            <Calendar size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase font-bold text-indigo-300 block mb-0.5">
              {t.stepWhenToCheck}
            </span>
            <h3 className="text-base font-bold text-white m-0">
              Collect Stamped Slip & Check within 7-10 Days
            </h3>
            <p className="text-xs text-[#B7BDD3] mt-1">
              Ask for an acknowledgement receipt number. You will receive an SMS update on your mobile phone.
            </p>
          </div>
        </div>
      </div>

      {/* Mock Nearby Centres List */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white m-0">
              Nearby Official Help Centres
            </h3>
            <p className="text-xs text-[#B7BDD3] m-0">
              Verified public facilitation centres around your area
            </p>
          </div>

          {/* Search Another Area */}
          <form onSubmit={handleSearchArea} className="flex items-center gap-2">
            <input
              type="text"
              value={searchAreaInput}
              onChange={(e) => setSearchAreaInput(e.target.value)}
              placeholder="Search area / PIN code..."
              className="px-3 py-1.5 rounded-xl bg-[#0D1333] border border-[#9B5DE5]/40 text-xs text-white placeholder-[#B7BDD3]/60 focus:outline-none focus:border-[#F3A6C8]"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#9B5DE5] text-white hover:bg-[#8338EC] text-xs transition-colors"
            >
              <Search size={14} />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {displayedCentres.map((centre) => {
            const isSelected = selectedCenter.id === centre.id;

            return (
              <div
                key={centre.id}
                onClick={() => setSelectedCenter(centre)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#1C2454] to-[#12183B] border-[#F3A6C8] shadow-lg shadow-[#9B5DE5]/20 ring-1 ring-[#F3A6C8]/40'
                    : 'bg-[#141B3B] border-[#9B5DE5]/25 hover:border-[#9B5DE5]/60 hover:bg-[#1A234E]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-white m-0 leading-snug">
                      {centre.name}
                    </h4>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#9B5DE5]/20 text-[#F3A6C8] font-bold shrink-0">
                      {centre.distance}
                    </span>
                  </div>

                  <p className="text-xs text-[#B7BDD3] leading-relaxed mb-3">
                    {centre.address}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#C9A7FF] bg-[#0B1026]/50 p-2.5 rounded-xl border border-[#9B5DE5]/15 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span>🚶 Walking:</span>
                      <strong className="text-white">{centre.walkingTime}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>🛺 Auto:</span>
                      <strong className="text-white">{centre.rickshawTime}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Clock size={12} className="shrink-0" />
                      <span className="truncate">{centre.timings}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#9B5DE5]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${centre.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-[#0B1026] text-[#45C27C] hover:bg-[#45C27C] hover:text-[#0B1026] transition-colors"
                      title="Call centre"
                    >
                      <Phone size={14} />
                    </a>
                    <SpeakerButton
                      textToSpeak={`${centre.name} is ${centre.distance} away. Address: ${centre.address}. Timings: ${centre.timings}.`}
                      langCode={currentLanguage}
                      size="sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCenter(centre);
                      setIsWhatToSayOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#F3A6C8] text-[#0B1026] font-extrabold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <span>{t.showThisRequestBtn}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What to Say Modal */}
      <WhatToSayModal
        isOpen={isWhatToSayOpen}
        onClose={() => setIsWhatToSayOpen(false)}
        messageText={scheme.whatToSayText}
        schemeTitle={scheme.title}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};
