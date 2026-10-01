import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  FolderCheck,
  HeartHandshake,
  HeartPulse,
  IdCard,
  MapPin,
  MessageSquare,
  RotateCcw,
  Search,
  ShieldCheck,
  Volume2,
  X,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { speechService } from '../services/speechService';

interface SlowStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}

interface ExplainSlowlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: SlowStep[];
  currentLanguage: LanguageCode;
}

export const ExplainSlowlyModal: React.FC<ExplainSlowlyModalProps> = ({
  isOpen,
  onClose,
  title,
  steps,
  currentLanguage,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currentStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    if (isOpen && currentStep) {
      // Auto-play the current step text slowly (rate: 0.75)
      const text = `${t.stepWord} ${currentStep.stepNumber}: ${currentStep.title}. ${currentStep.description}`;
      speechService.speak(text, currentLanguage, 0.75);
    }
    return () => {
      speechService.stop();
    };
  }, [isOpen, currentStepIndex, currentLanguage]);

  if (!isOpen || !currentStep) return null;

  const renderStepIcon = (iconName: string) => {
    const props = { size: 56, className: 'text-[#F3A6C8]' };
    switch (iconName) {
      case 'folder-check':
        return <FolderCheck {...props} />;
      case 'map-pin':
        return <MapPin {...props} />;
      case 'message-square':
        return <MessageSquare {...props} />;
      case 'file-text':
        return <FileText {...props} />;
      case 'heart-pulse':
        return <HeartPulse {...props} />;
      case 'clipboard-list':
        return <ClipboardList {...props} />;
      case 'credit-card':
        return <CreditCard {...props} />;
      case 'id-card':
        return <IdCard {...props} />;
      case 'building-2':
        return <Building2 {...props} />;
      case 'search':
        return <Search {...props} />;
      case 'shield-check':
        return <ShieldCheck {...props} />;
      case 'heart-handshake':
        return <HeartHandshake {...props} />;
      default:
        return <CheckCircle2 {...props} />;
    }
  };

  const handleRepeat = () => {
    const text = `${t.stepWord} ${currentStep.stepNumber}: ${currentStep.title}. ${currentStep.description}`;
    speechService.speak(text, currentLanguage, 0.75);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="slow-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#131A3B] to-[#0D1333] border-3 border-[#9B5DE5] rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col">
        {/* Top bar with tortoise branding */}
        <div className="p-4 sm:p-5 bg-[#18214A] border-b border-[#9B5DE5]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" role="img" aria-label="Tortoise">
              🐢
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F3A6C8]">
                  Dekho. Suno. Karo.
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Slow Voice (0.75x)
                </span>
              </div>
              <h2 id="slow-title" className="text-base sm:text-lg font-bold text-white m-0">
                {t.explainSlowlyBtn}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-[#0D1333] text-[#B7BDD3] hover:text-white hover:bg-red-500/20 transition-colors"
            aria-label="Close step-by-step guidance"
          >
            <X size={20} />
          </button>
        </div>

        {/* Big step display */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col items-center text-center">
          {/* Progress dots */}
          <div className="flex items-center gap-2 mb-6">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-8 bg-[#F3A6C8] shadow-md shadow-[#F3A6C8]/50'
                    : idx < currentStepIndex
                    ? 'w-2.5 bg-[#45C27C]'
                    : 'w-2.5 bg-[#9B5DE5]/40'
                }`}
                aria-label={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Large illustration circle */}
          <div className="relative mb-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#9B5DE5]/30 to-[#F3A6C8]/20 border-2 border-[#F3A6C8] flex items-center justify-center shadow-xl shadow-[#9B5DE5]/25 animate-soundwave">
              {renderStepIcon(currentStep.icon)}
            </div>
            <span className="absolute -top-2 -left-2 w-9 h-9 rounded-full bg-[#F3A6C8] text-[#0B1026] font-extrabold flex items-center justify-center text-base border-2 border-[#0B1026] shadow-md">
              {currentStep.stepNumber}
            </span>
          </div>

          {/* Step Title & Description */}
          <span className="text-xs uppercase tracking-widest text-[#C9A7FF] font-semibold mb-1">
            {t.stepWord} {currentStep.stepNumber} of {steps.length}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            {currentStep.title}
          </h3>
          <p className="text-base sm:text-lg text-[#F7F5FA] font-medium max-w-md leading-relaxed bg-[#0B1026]/40 p-4 rounded-2xl border border-[#9B5DE5]/20">
            {currentStep.description}
          </p>

          <p className="text-xs text-[#B7BDD3] mt-3">
            {title}
          </p>
        </div>

        {/* Action Controls: Previous, Repeat, Next */}
        <div className="p-4 sm:p-5 bg-[#141B3B] border-t border-[#9B5DE5]/30 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="flex-1 py-3 px-3 rounded-2xl bg-[#0D1333] border border-[#9B5DE5]/30 text-white font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1A234E] disabled:opacity-30 disabled:pointer-events-none transition-all text-xs sm:text-sm"
          >
            <ArrowLeft size={16} />
            <span>{t.previousStepBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleRepeat}
            className="py-3 px-4 rounded-2xl bg-[#9B5DE5]/30 border border-[#9B5DE5] text-[#C9A7FF] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#9B5DE5] hover:text-white transition-all text-xs sm:text-sm shrink-0"
            title="Hear this step again slowly"
          >
            <RotateCcw size={16} />
            <Volume2 size={16} />
            <span className="hidden sm:inline">{t.repeatStepBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-[#9B5DE5] to-[#F3A6C8] text-[#0B1026] font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-[#9B5DE5]/30 hover:opacity-95 transition-all text-xs sm:text-sm"
          >
            <span>{currentStepIndex === steps.length - 1 ? 'Done' : t.nextStepBtn}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
