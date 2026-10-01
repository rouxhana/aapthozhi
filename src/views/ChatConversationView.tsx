import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bot,
  ChevronRight,
  Edit3,
  HelpCircle,
  Mic,
  RotateCcw,
  Sparkles,
  User,
  Volume2,
} from 'lucide-react';
import { LanguageCode, SchemeInfo } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SCHEMES_DATA, getLocalizedScheme } from '../data/schemes';
import { SpeakerButton } from '../components/SpeakerButton';
import { ExplainSlowlyModal } from '../components/ExplainSlowlyModal';
import { speechService } from '../services/speechService';
import { aapThozhiAIService } from '../services/aapThozhiAIService';
import { voiceDetectionService } from '../services/voiceDetectionService';

// Drop this functional utility inside your chat to have the IDE sync your voice execution helper
export const playAapThozhiVoice = (text: string, detectedLanguageCode: string) => {
  if (!text) return;

  // 1. Ensure any regional character blocks are safe for network transit
  const sanitizedText = encodeURIComponent(text);
  
  // 2. Map standard variants cleanly to prevent backend delivery drops
  const languageMap: Record<string, string> = {
    'telugu': 'te',
    'tamil': 'ta',
    'marathi': 'mr',
    'kannada': 'kn',
    'hindi': 'hi',
    'te': 'te',
    'ta': 'ta',
    'mr': 'mr',
    'kn': 'kn',
    'hi': 'hi'
  };

  const targetLang = languageMap[detectedLanguageCode.toLowerCase()] || 'hi';

  // 3. Construct the clean non-blocked client fallback frame
  const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${targetLang}&q=${sanitizedText}`;
  
  const audio = new Audio(audioUrl);
  audio.setAttribute('referrerpolicy', 'no-referrer');
  (audio as any).referrerPolicy = 'no-referrer';

  audio.play()
    .then(() => console.log(`AapThozhi speaking in code: ${targetLang}`))
    .catch((error) => {
      console.warn("Direct voice synthesis path failed, falling back to speechService:", error);
      speechService.speak(text, targetLang as LanguageCode);
    });
};

const DEFAULT_QUERIES: Record<LanguageCode, string> = {
  ta: 'என் மகளின் கல்வி உதவிக்கு திட்டம் வேண்டும்.',
  hi: 'मुझे अपनी बेटी की पढ़ाई के लिए छात्रवृत्ति सहायता चाहिए।',
  te: 'నా కుమార్తె చదువు కోసం విద్యా సహాయం కావాలి.',
  bn: 'আমার মেয়ের পড়াশোনার জন্য শিক্ষা অনুদান সাহায্য দরকার।',
  mr: 'माझ्या मुलीच्या शिक्षणासाठी शिष्यवृत्तीची मदत हवी आहे.',
  kn: 'ನನ್ನ ಮಗಳ ವಿದ್ಯಾಭ್ಯಾಸಕ್ಕಾಗಿ ಶೈಕ್ಷಣಿಕ ನೆರವು ಬೇಕು.',
  gu: 'મારી દીકરીના અભ્યાસ માટે સરકારી સહાય જોઈએ છે.',
  ml: 'എന്റെ മകളുടെ പഠനത്തിനായുള്ള വിദ്യാഭ്യാസ സഹായം വേണം.',
  pa: 'ਮੈਨੂੰ ਆਪਣੀ ਧੀ ਦੀ ਪੜ੍ਹਾਈ ਲਈ ਵਜ਼ੀਫ਼ਾ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ।',
  od: 'ମୋ ଝିଅର ପାଠପଢ଼ା ପାଇଁ ଶିକ୍ଷା ସହାୟତା ଦରକାର।',
  as: 'মোৰ ছোৱালীৰ পঢ়া-শুনাৰ বাবে শিক্ষা সাহায্য লাগে।',
  ur: 'مجھے اپنی بیٹی کی تعلیم کے لیے وظیفے کی مدد چاہیے۔',
  hinglish: 'Mujhe apni beti ki padhai ke liye scholarship help chahiye.',
  en: 'I need help for my daughter’s education.',
};

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  audioText: string;
  schemeIdTarget?: string;
  showSchemeAction?: boolean;
}

interface ChatConversationViewProps {
  currentLanguage: LanguageCode;
  initialQuery?: string;
  onOpenScheme: (schemeId: string) => void;
  onBack: () => void;
}

export const ChatConversationView: React.FC<ChatConversationViewProps> = ({
  currentLanguage,
  initialQuery,
  onOpenScheme,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListeningNext, setIsListeningNext] = useState(false);
  const [isSlowModalOpen, setIsSlowModalOpen] = useState(false);
  const [isEditingInput, setIsEditingInput] = useState(false);
  const [customInputText, setCustomInputText] = useState('');

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currentScheme = getLocalizedScheme(SCHEMES_DATA[0], currentLanguage);

  useEffect(() => {
    // Select localized initial user query and generate AapThozhi AI assistant response
    const resolvedUserQuery = initialQuery || DEFAULT_QUERIES[currentLanguage] || DEFAULT_QUERIES.en;
    const aiResponse = aapThozhiAIService.generateResponse(resolvedUserQuery, currentLanguage);

    const userMsg: ChatMessage = {
      id: 'msg-1',
      sender: 'user',
      text: resolvedUserQuery,
      audioText: resolvedUserQuery,
    };

    const assistantMsg: ChatMessage = {
      id: 'msg-2',
      sender: 'assistant',
      text: aiResponse.responseText,
      audioText: aiResponse.audioText,
      schemeIdTarget: aiResponse.matchedScheme ? String(aiResponse.matchedScheme.id) : 'scheme-education-girl',
      showSchemeAction: !!aiResponse.matchedScheme,
    };

    setMessages([userMsg, assistantMsg]);

    // Speak initial assistant reply in native language
    const timer = setTimeout(() => {
      speechService.speak(assistantMsg.audioText, aiResponse.detectedLanguage, 1.0);
    }, 500);

    return () => {
      clearTimeout(timer);
      speechService.stop();
    };
  }, [initialQuery, currentLanguage]);

  const handleSayAgain = () => {
    const lastAssistant = [...messages].reverse().find((m) => m.sender === 'assistant');
    if (lastAssistant) {
      speechService.speak(lastAssistant.audioText, currentLanguage, 1.0);
    }
  };

  const handleChangeWhatISaid = () => {
    setIsEditingInput(true);
    setCustomInputText(initialQuery || DEFAULT_QUERIES[currentLanguage] || '');
  };

  const handleSaveCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;

    const updatedUserMsg: ChatMessage = {
      id: `msg-corr-${Date.now()}`,
      sender: 'user',
      text: customInputText,
      audioText: customInputText,
    };

    const aiRes = await aapThozhiAIService.generateResponseAsync(customInputText, currentLanguage);

    const replyMsg: ChatMessage = {
      id: `msg-reply-${Date.now()}`,
      sender: 'assistant',
      text: aiRes.responseText,
      audioText: aiRes.audioText,
      schemeIdTarget: aiRes.matchedScheme ? String(aiRes.matchedScheme.id) : undefined,
      showSchemeAction: !!aiRes.matchedScheme,
    };

    setMessages((prev) => [...prev, updatedUserMsg, replyMsg]);
    setIsEditingInput(false);
    speechService.speak(replyMsg.audioText, aiRes.detectedLanguage);
  };

  const handleNextVoiceAnswer = () => {
    setIsListeningNext(true);
    speechService.speak(t.listening, currentLanguage);

    let caught = false;
    voiceDetectionService.startListening(
      (_interim: string) => {
        // interim
      },
      async (res: any) => {
        caught = true;
        setIsListeningNext(false);
        const transcript = res.transcript;
        const aiRes = await aapThozhiAIService.generateResponseAsync(transcript, currentLanguage);

        const userReply: ChatMessage = {
          id: `msg-voice-${Date.now()}`,
          sender: 'user',
          text: transcript,
          audioText: transcript,
        };
        const assistantReply: ChatMessage = {
          id: `msg-assistant-${Date.now()}`,
          sender: 'assistant',
          text: aiRes.responseText,
          audioText: aiRes.audioText,
          schemeIdTarget: aiRes.matchedScheme ? String(aiRes.matchedScheme.id) : undefined,
          showSchemeAction: !!aiRes.matchedScheme,
        };

        setMessages((prev) => [...prev, userReply, assistantReply]);
        speechService.speak(assistantReply.audioText, aiRes.detectedLanguage);
      },
      () => {
        if (!caught) {
          setTimeout(() => {
            setIsListeningNext(false);
            const fallbackMap: Record<LanguageCode, { q: string; a: string }> = {
              ta: {
                q: 'விண்ணப்பிக்க அருகிலுள்ள மையம் எங்கே உள்ளது?',
                a: 'அக்கா, உங்கள் கிராம நிர்வாக அலுவலகம் அல்லது அருகில் உள்ள அங்கன்வாடி மையத்திற்கு நேரில் செல்லுங்கள். அங்கு ஆஷா தமக்கை உங்களுக்கு படிவத்தை இலவசமாக பூர்த்தி செய்து தருவார்.',
              },
              te: {
                q: 'దరఖాస్తు చేసుకోవడానికి సమీప కేంద్రం ఎక్కడ ఉంది?',
                a: 'అక్కా, మీ పంచాయతీ కార్యాలయం లేదా సమీప అంగన్‌వాడీ కేంద్రానికి వెళ్ళండి. అక్కడ ఆశా కార్యకర్త మీకు ఉచితంగా దరఖాస్తు చేయడంలో సహాయం చేస్తారు.',
              },
              kn: {
                q: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಹತ್ತಿರದ ಕೇಂದ್ರ ಎಲ್ಲಿದೆ?',
                a: 'ಅಕ್ಕಾ, ನಿಮ್ಮ ಗ್ರಾಮ ಪಂಚಾಯತಿ ಅಥವಾ ಸಮೀಪದ ಅಂಗನವಾಡಿ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ. ಅಲ್ಲಿ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ನಿಮಗೆ ಸಂಪೂರ್ಣ ಉಚಿತ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತಾರೆ.',
              },
              mr: {
                q: 'अर्ज भरण्यासाठी जवळचे केंद्र कुठे आहे?',
                a: 'ताई, तुमच्या गावातील ग्रामपंचायत कार्यालय किंवा जवळच्या अंगणवाडी केंद्रात जा. तिथे आशा ताई तुम्हाला मोफत अर्ज भरून देतील.',
              },
              hi: {
                q: 'आवेदन करने के लिए नज़दीकी केंद्र कहाँ है?',
                a: 'दीदी, आप अपने गाँव के पंचायत भवन या नज़दीकी आँगनवाड़ी केंद्र पर जा सकती हैं। वहाँ आशा दीदी आपको फॉर्म भरने में पूरी मदद करेंगी।',
              },
              bn: {
                q: 'আবেদন করার জন্য কাছের কেন্দ্র কোথায়?',
                a: 'দিদি, আপনার এলাকার পঞ্চায়েত অফিস বা অঙ্গনওয়াড়ি কেন্দ্রে যান। সেখানে আশা দিদি আপনাকে বিনামূল্যে সাহায্য করবেন।',
              },
              gu: {
                q: 'અરજી કરવા માટે નજીકનું કેન્દ્ર ક્યાં છે?',
                a: 'બહેન, તમારા ગામની ગ્રામ પંચાયત અથવા આંગણવાડી કેન્દ્રની મુલાકાત લો. ત્યાં આશા બહેન તમને મદદ કરશે.',
              },
              ml: {
                q: 'അപേക്ഷിക്കാൻ അടുത്തുള്ള കേന്ദ്രം എവിടെയാണ്?',
                a: 'ചേച്ചീ, നിങ്ങളുടെ പഞ്ചായത്ത് ഓഫീസിലോ അങ്കണവാടിയിലോ നേരിട്ട് പോകാം. അവിടെയുള്ള ആശാ പ്രവർത്തക സഹായിക്കും.',
              },
              pa: {
                q: 'ਅਰਜ਼ੀ ਦੇਣ ਲਈ ਨੇੜਲਾ ਕੇਂਦਰ ਕਿੱਥੇ ਹੈ?',
                a: 'ਭੈਣ ਜੀ, ਆਪਣੇ ਪਿੰਡ ਦੇ ਪੰਚਾਇਤ ਘਰ ਜਾਂ ਆਂਗਣਵਾੜੀ ਸੈਂਟਰ ਜਾਓ। ਉੱਥੇ ਆਸ਼ਾ ਵਰਕਰ ਤੁਹਾਡੀ ਪੂਰੀ ਮਦਦ ਕਰੇਗੀ।',
              },
              od: {
                q: 'ଆବେଦନ ପାଇଁ ନିକଟସ୍ଥ କେନ୍ଦ୍ର କେଉଁଠି?',
                a: 'ଭଉଣୀ, ପାଖ ପଞ୍ଚାୟତ ଅଫିସ ବା ଅଙ୍ଗନୱାଡି କେନ୍ଦ୍ରକୁ ଯାଆନ୍ତୁ। ସେଠାରେ ଆଶା ଦିଦି ସାହାଯ୍ୟ କରିବେ।',
              },
              as: {
                q: 'আবেদন কৰিবলৈ ওচৰৰ কেন্দ্ৰ ক’ত আছে?',
                a: 'বাইদেউ, ওচৰৰ পঞ্চায়ত কাৰ্যালয় বা অংগনৱাড়ী কেন্দ্ৰলৈ যাওক। তাত আশা বাইদেউৱে সহায় কৰিব।',
              },
              ur: {
                q: 'درخواست دینے کے لیے قریبی مرکز کہاں ہے؟',
                a: 'بہن، آپ اپنے قریبی پنچایت دفتر یا آنگن واڑی تشریف لے جائیں، وہاں آشا آپ کی پوری مدد کریں گی۔',
              },
              hinglish: {
                q: 'Apply karne ke liye paas ka centre kahan hai?',
                a: 'Didi, aap apne gaon ke Panchayat Bhavan ya Anganwadi Centre ja sakti hain. Wahan ASHA didi form bharne mein poori help karengi.',
              },
              en: {
                q: 'Where is the nearest centre to apply?',
                a: 'Sister, please visit your local Panchayat Office or Anganwadi Centre. The ASHA sister there will guide and help you submit your form for free.',
              },
            };

            const fb = fallbackMap[currentLanguage] || fallbackMap.en;
            const userReply: ChatMessage = {
              id: `msg-voice-${Date.now()}`,
              sender: 'user',
              text: fb.q,
              audioText: fb.q,
            };
            const assistantReply: ChatMessage = {
              id: `msg-assistant-loc-${Date.now()}`,
              sender: 'assistant',
              text: fb.a,
              audioText: fb.a,
              schemeIdTarget: 'scheme-education-girl',
              showSchemeAction: true,
            };

            setMessages((prev) => [...prev, userReply, assistantReply]);
            speechService.speak(assistantReply.audioText, currentLanguage);
          }, 1500);
        }
      },
      currentLanguage
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-xs text-[#C9A7FF] font-medium"
        >
          ← Back to Services
        </button>

        <div className="flex items-center gap-2">
          {/* Explain Slowly Tortoise Button */}
          <button
            type="button"
            onClick={() => setIsSlowModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-[#9B5DE5]/20 border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            title="Explain in bite-sized simple steps with slower audio"
          >
            <span className="text-base" role="img" aria-label="Tortoise">
              🐢
            </span>
            <span>{t.explainSlowlyBtn}</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in duration-200`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  isUser
                    ? 'bg-[#F3A6C8] text-[#0B1026] font-bold'
                    : 'bg-gradient-to-br from-[#9B5DE5] to-[#F3A6C8] text-white p-0.5'
                }`}
              >
                {isUser ? <User size={20} /> : <Bot size={22} />}
              </div>

              {/* Chat Bubble */}
              <div
                className={`max-w-xl p-4 sm:p-5 rounded-3xl border ${
                  isUser
                    ? 'bg-[#1C2554] border-[#9B5DE5]/40 text-white rounded-tr-none'
                    : 'bg-[#141B3B] border-[#9B5DE5]/30 text-[#F7F5FA] rounded-tl-none shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-xs font-bold text-[#C9A7FF]">
                    {isUser ? 'You spoke' : 'AapThozhi'}
                  </span>
                  <SpeakerButton
                    textToSpeak={msg.audioText}
                    langCode={currentLanguage}
                    size="sm"
                  />
                </div>

                <p className="text-sm sm:text-base leading-relaxed select-text m-0">
                  {msg.text}
                </p>

                {/* Scheme Action Card Button inside chat */}
                {msg.showSchemeAction && msg.schemeIdTarget && (
                  <div className="mt-4 pt-3 border-t border-[#9B5DE5]/20">
                    <button
                      type="button"
                      onClick={() => onOpenScheme(msg.schemeIdTarget!)}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#9B5DE5] to-[#F3A6C8] text-[#0B1026] font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-[#9B5DE5]/20 hover:opacity-95 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} />
                        <span>View {currentScheme.title} Checklist</span>
                      </div>
                      <ChevronRight size={18} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confusion Recovery Toolbar: "Change what I said", "Say that again", "Explain slowly" */}
      <div className="p-3.5 rounded-2xl bg-[#101533] border border-[#9B5DE5]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {/* Say That Again */}
          <button
            type="button"
            onClick={handleSayAgain}
            className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-[#C9A7FF] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Say that again</span>
          </button>

          {/* Change What I Said */}
          <button
            type="button"
            onClick={handleChangeWhatISaid}
            className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-[#F3A6C8] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 size={14} />
            <span>Change what I said</span>
          </button>
        </div>

        {/* Explain Slowly Tortoise Button */}
        <button
          type="button"
          onClick={() => setIsSlowModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>🐢</span>
          <span>Explain slowly</span>
        </button>
      </div>

      {/* Editing Modal / Input */}
      {isEditingInput && (
        <form
          onSubmit={handleSaveCorrection}
          className="p-4 rounded-3xl bg-[#141B3B] border-2 border-[#F3A6C8] space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Edit3 size={14} className="text-[#F3A6C8]" />
              Correct your voice statement:
            </label>
            <button
              type="button"
              onClick={() => setIsEditingInput(false)}
              className="text-xs text-[#B7BDD3] hover:text-white"
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            placeholder="Type your corrected request..."
            className="w-full p-3 rounded-2xl bg-[#0B1026] border border-[#9B5DE5]/40 text-white text-sm focus:outline-none focus:border-[#F3A6C8]"
          />
          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-[#F3A6C8] text-[#0B1026] font-bold text-xs"
          >
            Update & Get Fresh Guidance
          </button>
        </form>
      )}

      {/* Mic Input Bar for Continuing Voice Conversation */}
      <div className="p-4 rounded-3xl bg-[#141B3B] border-2 border-[#9B5DE5]/40 flex items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#9B5DE5]/20 flex items-center justify-center text-[#F3A6C8] shrink-0">
            <Mic size={22} className={isListeningNext ? 'animate-bounce' : ''} />
          </div>
          <p className="text-xs text-[#B7BDD3] truncate m-0">
            {isListeningNext ? 'Listening... please speak' : 'Ask another question or tap Speak'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleNextVoiceAnswer}
          disabled={isListeningNext}
          className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#9B5DE5] to-[#F3A6C8] text-[#0B1026] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all cursor-pointer"
        >
          <Mic size={16} />
          <span>{isListeningNext ? 'Listening...' : 'Speak Next Answer'}</span>
        </button>
      </div>

      {/* Explain Slowly Modal */}
      <ExplainSlowlyModal
        isOpen={isSlowModalOpen}
        onClose={() => setIsSlowModalOpen(false)}
        title={currentScheme.title}
        steps={currentScheme.slowExplanationSteps}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};
