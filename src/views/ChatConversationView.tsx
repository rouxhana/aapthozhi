import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bot,
  ChevronRight,
  Loader2,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Sparkles,
  StopCircle,
  User,
  Volume2,
} from 'lucide-react';
import { LanguageCode, SchemeInfo } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SCHEMES_DATA, getLocalizedScheme } from '../data/schemes';
import { SpeakerButton } from '../components/SpeakerButton';
import { ExplainSlowlyModal } from '../components/ExplainSlowlyModal';
import { speechService, playAapThozhiVoice } from '../services/speechService';
import { aapThozhiAIService } from '../services/aapThozhiAIService';
import { geminiService } from '../services/geminiService';
import { voiceDetectionService } from '../services/voiceDetectionService';

export { playAapThozhiVoice };

// ─────────────────────────────────────────────────────────────────
// Default "starter" questions for each language (shown as user query)
// ─────────────────────────────────────────────────────────────────
const DEFAULT_QUERIES: Record<LanguageCode, string> = {
  ta: 'என் மகளின் கல்வி உதவிக்கு திட்டம் வேண்டும்.',
  hi: 'मुझे अपनी बेटी की पढ़ाई के लिए छात्रवृत्ति सहायता चाहिए।',
  te: 'నా కుమార్తె చదువు కోసం విద్యా సహాయం కావాలి.',
  bn: 'আমার মেয়ের পড়াশোনার জন্য শিক্ষা অনুদান সহাযতা দরকার।',
  mr: 'माझ्या मुलीच्या शिक्षणासाठी शिष्यवृत्तीची मदत हवी आहे.',
  kn: 'ನನ್ನ ಮಗಳ ವಿದ್ಯಾಭ್ಯಾಸಕ್ಕಾಗಿ ಶೈಕ್ಷಣಿಕ ನೆರವು ಬೇಕು.',
  gu: 'મારી દીકરીના અભ્યાસ માટે સરકારી સહાય જોઈએ છે.',
  ml: 'എന്റെ മകളുടെ പഠനത്തിനായുള്ള വിദ്യാഭ്യാസ സഹായം വേണം.',
  pa: 'ਮੈਨੂੰ ਆਪਣੀ ਧੀ ਦੀ ਪੜ੍ਹਾਈ ਲਈ ਵਜ਼ੀਫ਼ਾ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ।',
  od: 'ମୋ ଝିଅର ପାଠପଢ଼ା ପାଇଁ ଶିକ୍ଷା ସହାୟତା ଦରକାର।',
  as: 'মোৰ ছোৱালীৰ পঢ়া-শুনাৰ বাবে শিক্ষা সাহায্য লাগে।',
  ur: 'مجھے اپنی بیٹی کی تعلیم کے لیے وظیفے کی مدد چاہیے۔',
  hinglish: 'Mujhe apni beti ki padhai ke liye scholarship help chahiye.',
  en: 'I need help for my daughter\'s education.',
};

// "Thinking" messages per language
const THINKING_MESSAGES: Record<LanguageCode, string> = {
  ta: '🤔 யோசிக்கிறேன்…',
  hi: '🤔 सोच रही हूँ…',
  te: '🤔 ఆలోచిస్తున్నాను…',
  bn: '🤔 ভাবছি…',
  mr: '🤔 विचार करते आहे…',
  kn: '🤔 ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ…',
  gu: '🤔 વિચારી રही છું…',
  ml: '🤔 ആലോചിക്കുന്നു…',
  pa: '🤔 ਸੋਚ ਰਹੀ ਹਾਂ…',
  od: '🤔 ଭାବୁଛି…',
  as: '🤔 ভাবিছোঁ…',
  ur: '🤔 سوچ رہی ہوں…',
  hinglish: '🤔 Soch rahi hoon…',
  en: '🤔 Thinking…',
};

// "Listening" indicator per language
const LISTENING_LABELS: Record<LanguageCode, string> = {
  ta: '🎙️ கேட்கிறேன்…',
  hi: '🎙️ सुन रही हूँ…',
  te: '🎙️ వింటున్నాను…',
  bn: '🎙️ শুনছি…',
  mr: '🎙️ ऐकतेय…',
  kn: '🎙️ ಕೇಳುತ್ತಿದ್ದೇನೆ…',
  gu: '🎙️ સાંભળી રહ્યા…',
  ml: '🎙️ കേൾക്കുന്നു…',
  pa: '🎙️ ਸੁਣ ਰਹੀ ਹਾਂ…',
  od: '🎙️ ଶୁଣୁଛି…',
  as: '🎙️ শুনিছোঁ…',
  ur: '🎙️ سن رہی ہوں…',
  hinglish: '🎙️ Sun rahi hoon…',
  en: '🎙️ Listening…',
};

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'thinking';
  text: string;
  audioText: string;
  schemeIdTarget?: string;
  showSchemeAction?: boolean;
  source?: 'gemini-api' | 'local-dataset' | 'offline';
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
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSlowModalOpen, setIsSlowModalOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currentScheme = getLocalizedScheme(SCHEMES_DATA[0], currentLanguage);

  // Subscribe to speech service state
  useEffect(() => {
    const unsub = speechService.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
    });
    return unsub;
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // ── Initial load: send the opening query through Gemini async ──────────────
  useEffect(() => {
    const resolvedUserQuery = initialQuery || DEFAULT_QUERIES[currentLanguage] || DEFAULT_QUERIES.en;

    // Reset conversation history when starting fresh
    geminiService.clearHistory();

    const userMsg: ChatMessage = {
      id: 'msg-1',
      sender: 'user',
      text: resolvedUserQuery,
      audioText: resolvedUserQuery,
    };
    setMessages([userMsg]);
    setIsThinking(true);

    // Use full async Gemini path from the very first message
    aapThozhiAIService.generateResponseAsync(resolvedUserQuery, currentLanguage).then((aiResponse) => {
      setIsThinking(false);
      const assistantMsg: ChatMessage = {
        id: 'msg-2',
        sender: 'assistant',
        text: aiResponse.responseText,
        audioText: aiResponse.audioText,
        schemeIdTarget: aiResponse.matchedScheme ? String(aiResponse.matchedScheme.id) : undefined,
        showSchemeAction: !!aiResponse.matchedScheme,
        source: aiResponse.actionCategory === 'scheme' ? 'gemini-api' : 'local-dataset',
      };
      setMessages((prev) => [...prev, assistantMsg]);

      setTimeout(() => {
        speechService.speak(assistantMsg.audioText, aiResponse.detectedLanguage, 1.0);
      }, 400);
    });

    return () => {
      speechService.stop();
    };
  }, [initialQuery, currentLanguage]);

  // ── Send any message (typed or voice) through AI ──────────────────────────
  const sendMessage = async (query: string) => {
    if (!query.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: query,
      audioText: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    speechService.stop();

    const aiRes = await aapThozhiAIService.generateResponseAsync(query, currentLanguage);
    setIsThinking(false);

    const assistantMsg: ChatMessage = {
      id: `msg-a-${Date.now()}`,
      sender: 'assistant',
      text: aiRes.responseText,
      audioText: aiRes.audioText,
      schemeIdTarget: aiRes.matchedScheme ? String(aiRes.matchedScheme.id) : undefined,
      showSchemeAction: !!aiRes.matchedScheme,
      source: geminiService.isAvailable() ? 'gemini-api' : 'offline',
    };
    setMessages((prev) => [...prev, assistantMsg]);
    speechService.speak(assistantMsg.audioText, aiRes.detectedLanguage);
  };

  // ── Handle typed text submission ──────────────────────────────────────────
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      sendMessage(textInput.trim());
      setTextInput('');
    }
  };

  // ── Handle microphone button ──────────────────────────────────────────────
  const handleMicClick = () => {
    if (isListening) {
      voiceDetectionService.stopListening?.();
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    setIsListening(true);
    setInterimTranscript('');
    speechService.stop();

    voiceDetectionService.startListening(
      (interim: string) => {
        setInterimTranscript(interim);
      },
      async (res: any) => {
        setIsListening(false);
        setInterimTranscript('');
        const transcript = res.transcript || res;
        if (transcript.trim()) {
          await sendMessage(transcript.trim());
        }
      },
      () => {
        // No speech detected — show gentle prompt
        setIsListening(false);
        setInterimTranscript('');
        const noSpeech = {
          ta: 'மன்னிக்கவும், உங்கள் குரல் கேட்கவில்லை. மீண்டும் பேசுங்கள்.',
          hi: 'माफ़ करें, आवाज़ नहीं सुनाई दी। दोबारा बोलें।',
          te: 'క్షమించండి, మీ మాటలు వినలేదు. మళ్ళీ మాట్లాడండి.',
          kn: 'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ.',
          mr: 'माफ करा, तुमचा आवाज ऐकू आला नाही. पुन्हा बोला.',
          bn: 'দুঃখিত, আপনার কণ্ঠস্বর শোনা যায়নি। আবার বলুন।',
          gu: 'માફ કરો, અવાજ ન સંભળાયો. ફરી બોલો.',
          ml: 'ക്ഷമിക്കണം, ശബ്ദം കേട്ടില്ല. വീണ്ടും സംസാരിക്കൂ.',
          pa: 'ਮਾਫ਼ ਕਰਨਾ, ਆਵਾਜ਼ ਸੁਣਾਈ ਨਹੀਂ ਦਿੱਤੀ। ਦੁਬਾਰਾ ਬੋਲੋ।',
          od: 'ଦୁଃଖ ଅଛି, ଆପଣଙ୍କ ସ୍ୱର ଶୁଣି ହେଲା ନାହିଁ। ପୁଣି ଥରେ କୁହନ୍ତୁ।',
          as: "মাফ কৰিব, আপোনাৰ কথা শুনা নগ'ল। পুনৰাই কওক।",
          ur: 'معاف کریں، آواز نہیں آئی۔ دوبارہ بولیں۔',
          hinglish: 'Maaf karo, awaaz nahin aayi. Dobara bolein.',
          en: 'Sorry, I could not hear you. Please speak again.',
        } as Record<LanguageCode, string>;

        const hint = noSpeech[currentLanguage] || noSpeech.en;
        setMessages((prev) => [
          ...prev,
          { id: `msg-nsp-${Date.now()}`, sender: 'assistant', text: hint, audioText: hint, source: 'offline' },
        ]);
      },
      currentLanguage
    );
  };

  // ── Replay last response ──────────────────────────────────────────────────
  const handleSayAgain = () => {
    const lastAssistant = [...messages].reverse().find((m) => m.sender === 'assistant');
    if (lastAssistant) {
      speechService.speak(lastAssistant.audioText, currentLanguage, 0.85);
    }
  };

  const handleStopSpeaking = () => speechService.stop();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border-2 border-[#9B5DE5]/30 hover:border-[#F3A6C8] text-xs text-[#C9A7FF] hover:text-white font-bold flex items-center gap-2 cursor-pointer transition-colors"
          aria-label="Go back to Home"
          title="Back to Home"
        >
          <ArrowLeft size={16} className="stroke-[2.5]" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* AI source badge */}
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
            geminiService.isAvailable()
              ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
              : 'bg-[#141B3B] border-[#9B5DE5]/30 text-[#B7BDD3]'
          }`}>
            <Sparkles size={10} />
            {geminiService.isAvailable() ? 'Gemini AI' : 'Offline Mode'}
          </div>

          {/* Explain slowly */}
          <button
            type="button"
            onClick={() => setIsSlowModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Explain step by step, slowly"
            aria-label="Explain slowly in simple steps"
          >
            <span role="img" aria-label="Tortoise">🐢</span>
            <span>{t.explainSlowlyBtn}</span>
          </button>
        </div>
      </div>

      {/* ── Message stream ── */}
      <div className="space-y-4 min-h-[200px]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in duration-300`}
            >
              {/* Avatar */}
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-white ${
                  isUser
                    ? 'bg-[#F3A6C8] text-[#0B1026]'
                    : 'bg-gradient-to-br from-[#9B5DE5] to-[#F3A6C8]'
                }`}
              >
                {isUser ? <User size={20} /> : <Bot size={22} />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-xl p-4 sm:p-5 rounded-3xl border ${
                  isUser
                    ? 'bg-[#1C2554] border-[#9B5DE5]/40 text-white rounded-tr-none'
                    : 'bg-[#141B3B] border-[#9B5DE5]/30 text-[#F7F5FA] rounded-tl-none shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-bold text-[#C9A7FF]">
                    {isUser ? '🗣️ You' : '🤖 AapThozhi'}
                    {msg.source === 'gemini-api' && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] border border-emerald-400/30">AI</span>
                    )}
                  </span>
                  {!isUser && (
                    <SpeakerButton textToSpeak={msg.audioText} langCode={currentLanguage} size="sm" />
                  )}
                </div>

                <p className="text-sm sm:text-[0.9375rem] leading-relaxed select-text m-0 whitespace-pre-wrap">
                  {msg.text}
                </p>

                {/* Scheme action CTA */}
                {msg.showSchemeAction && msg.schemeIdTarget && (
                  <div className="mt-4 pt-3 border-t border-[#9B5DE5]/20">
                    <button
                      type="button"
                      onClick={() => onOpenScheme(msg.schemeIdTarget!)}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#9B5DE5] to-[#F3A6C8] text-[#0B1026] font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-lg hover:opacity-95 transition-all cursor-pointer"
                      aria-label="View scheme details and checklist"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} />
                        <span>📋 View Full Scheme Guide</span>
                      </div>
                      <ChevronRight size={18} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex items-start gap-3 animate-in fade-in duration-200">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-[#F3A6C8] flex items-center justify-center shrink-0 shadow-lg">
              <Bot size={22} className="text-white" />
            </div>
            <div className="px-5 py-4 rounded-3xl rounded-tl-none bg-[#141B3B] border border-[#9B5DE5]/30 flex items-center gap-3">
              <Loader2 size={18} className="text-[#F3A6C8] animate-spin" />
              <span className="text-sm text-[#B7BDD3]">
                {THINKING_MESSAGES[currentLanguage] || THINKING_MESSAGES.en}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick action bar: Say Again / Stop ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleSayAgain}
          disabled={isThinking}
          className="px-3 py-2 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-[#C9A7FF] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
          aria-label="Repeat last answer"
          title="Hear the last answer again"
        >
          <RotateCcw size={14} />
          <span>🔁 Say again</span>
        </button>

        {isSpeaking && (
          <button
            type="button"
            onClick={handleStopSpeaking}
            className="px-3 py-2 rounded-xl bg-[#EF6A7B]/20 hover:bg-[#EF6A7B]/30 border border-[#EF6A7B]/40 text-[#EF6A7B] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            aria-label="Stop speaking"
          >
            <StopCircle size={14} />
            <span>Stop</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsSlowModalOpen(true)}
          className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          aria-label="Explain slowly in steps"
        >
          🐢 Explain slowly
        </button>
      </div>

      {/* ── Listening interim transcript ── */}
      {isListening && (
        <div className="px-4 py-3 rounded-2xl bg-[#EF6A7B]/10 border-2 border-[#EF6A7B]/40 flex items-center gap-3 animate-pulse">
          <Mic size={20} className="text-[#EF6A7B] shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#EF6A7B]">{LISTENING_LABELS[currentLanguage]}</p>
            {interimTranscript && (
              <p className="text-sm text-[#F7F5FA] mt-0.5">{interimTranscript}</p>
            )}
          </div>
        </div>
      )}

      {/* ── Main input bar: text + mic ── */}
      <form
        onSubmit={handleTextSubmit}
        className="p-3 rounded-2xl bg-[#141B3B] border-2 border-[#9B5DE5]/40 flex items-center gap-2 shadow-xl"
        aria-label="Ask a question by text or voice"
      >
        {/* Mic button */}
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isThinking}
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer border-2 ${
            isListening
              ? 'bg-[#EF6A7B] border-[#EF6A7B] text-white ring-4 ring-[#EF6A7B]/30 animate-pulse'
              : 'bg-[#9B5DE5]/20 border-[#9B5DE5]/50 text-[#F3A6C8] hover:bg-[#9B5DE5]/35'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          title={isListening ? 'Tap to stop' : 'Tap and speak your question'}
        >
          {isListening ? <MicOff size={22} className="stroke-[2.5]" /> : <Mic size={22} className="stroke-[2.5]" />}
        </button>

        {/* Text input */}
        <input
          ref={textInputRef}
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={
            isListening
              ? (LISTENING_LABELS[currentLanguage] || '🎙️ Listening…')
              : (currentLanguage === 'ta' ? 'உங்கள் கேள்வி இங்கே தட்டச்சு செய்யுங்கள்...'
                : currentLanguage === 'hi' ? 'यहाँ अपना सवाल टाइप करें...'
                : currentLanguage === 'te' ? 'మీ ప్రశ్న ఇక్కడ టైప్ చేయండి...'
                : currentLanguage === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
                : currentLanguage === 'mr' ? 'तुमचा प्रश्न येथे टाइप करा...'
                : 'Type or speak your question…')
          }
          disabled={isThinking || isListening}
          className="flex-1 bg-transparent text-white text-base sm:text-sm placeholder:text-[#7882A4] focus:outline-none px-2"
          aria-label="Type your question"
          autoComplete="off"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!textInput.trim() || isThinking}
          className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#9B5DE5] to-[#F3A6C8] text-white flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          aria-label="Send message"
          title="Send"
        >
          {isThinking ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>

      {/* ── Disclaimer ── */}
      <p className="text-center text-[10px] text-[#7882A4] leading-relaxed">
        ⚠️ AapThozhi provides guidance only. Eligibility decisions are made by the relevant authority.
      </p>

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
