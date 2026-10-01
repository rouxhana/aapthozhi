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
import { SCHEMES_DATA } from '../data/schemes';
import { SpeakerButton } from '../components/SpeakerButton';
import { ExplainSlowlyModal } from '../components/ExplainSlowlyModal';
import { speechService } from '../services/speechService';

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
  initialQuery = 'I need help for my daughter’s education.',
  onOpenScheme,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListeningNext, setIsListeningNext] = useState(false);
  const [isSlowModalOpen, setIsSlowModalOpen] = useState(false);
  const [isEditingInput, setIsEditingInput] = useState(false);
  const [customInputText, setCustomInputText] = useState('');

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currentScheme = SCHEMES_DATA[0]; // Education Support by default for the demo

  useEffect(() => {
    // Initialize friendly conversation sequence
    const userMsg: ChatMessage = {
      id: 'msg-1',
      sender: 'user',
      text: initialQuery,
      audioText: initialQuery,
    };

    const assistantMsg: ChatMessage = {
      id: 'msg-2',
      sender: 'assistant',
      text: `Namaste! I understand you want education support for your daughter. Under the Balika Shiksha Welfare Grant, eligible families receive annual school grants, free books, and uniforms. You only need 3 main papers to apply: her school study certificate, her Aadhaar card, and your bank passbook.`,
      audioText: `Namaste! I understand you want education support for your daughter. Under the Balika Shiksha Welfare Grant, eligible families receive annual school grants, free books, and uniforms. You only need 3 main papers to apply: her school study certificate, her Aadhaar card, and your bank passbook.`,
      schemeIdTarget: 'scheme-education-girl',
      showSchemeAction: true,
    };

    setMessages([userMsg, assistantMsg]);

    // Speak initial assistant reply
    const timer = setTimeout(() => {
      speechService.speak(assistantMsg.audioText, currentLanguage, 1.0);
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
    setCustomInputText(initialQuery);
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;

    const updatedUserMsg: ChatMessage = {
      id: `msg-corr-${Date.now()}`,
      sender: 'user',
      text: customInputText,
      audioText: customInputText,
    };

    const replyMsg: ChatMessage = {
      id: `msg-reply-${Date.now()}`,
      sender: 'assistant',
      text: `Got it! Updating your request to: "${customInputText}". AapThozhi has verified the latest guidelines for this assistance. Tap the card below to see documents and nearby help centres.`,
      audioText: `Got it! Updating your request to: ${customInputText}. Tap the card below to see documents and nearby help centres.`,
      schemeIdTarget: 'scheme-education-girl',
      showSchemeAction: true,
    };

    setMessages((prev) => [...prev, updatedUserMsg, replyMsg]);
    setIsEditingInput(false);
    speechService.speak(replyMsg.audioText, currentLanguage);
  };

  const handleNextVoiceAnswer = () => {
    setIsListeningNext(true);
    speechService.speak(t.listening, currentLanguage);

    setTimeout(() => {
      setIsListeningNext(false);
      const userReply: ChatMessage = {
        id: `msg-voice-${Date.now()}`,
        sender: 'user',
        text: 'Where is the nearest centre to apply?',
        audioText: 'Where is the nearest centre to apply?',
      };
      const assistantReply: ChatMessage = {
        id: `msg-assistant-loc-${Date.now()}`,
        sender: 'assistant',
        text: 'The nearest help centre is Seva Sahayata Kendra, just 1.2 kilometres away. You can also visit your ward Anganwadi centre (0.8 km). I have prepared the exact paper checklist and a "What to Say" card for you!',
        audioText: 'The nearest help centre is Seva Sahayata Kendra, just 1.2 kilometres away. You can also visit your ward Anganwadi centre. I have prepared the exact paper checklist and what to say card for you!',
        schemeIdTarget: 'scheme-education-girl',
        showSchemeAction: true,
      };

      setMessages((prev) => [...prev, userReply, assistantReply]);
      speechService.speak(assistantReply.audioText, currentLanguage);
    }, 2500);
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
