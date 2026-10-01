import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speechService } from '../services/speechService';
import { LanguageCode } from '../types';

interface SpeakerButtonProps {
  textToSpeak: string;
  langCode?: LanguageCode;
  speed?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  showText?: boolean;
  buttonLabel?: string;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  textToSpeak,
  langCode = 'ta',
  speed = 1.0,
  className = '',
  size = 'md',
  ariaLabel = 'Listen to voice guidance',
  showText = false,
  buttonLabel = 'Hear',
}) => {
  const [isPlayingThis, setIsPlayingThis] = useState(false);

  useEffect(() => {
    const unsubscribe = speechService.subscribe((state) => {
      setIsPlayingThis(state.isSpeaking && state.currentText === textToSpeak);
    });
    return unsubscribe;
  }, [textToSpeak]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingThis) {
      speechService.stop();
    } else {
      speechService.speak(textToSpeak, langCode, speed);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs gap-1',
    md: 'p-2 text-sm gap-1.5',
    lg: 'p-3 text-base gap-2',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      title={isPlayingThis ? 'Stop audio' : 'Listen with voice'}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
        isPlayingThis
          ? 'bg-[#F3A6C8] text-[#0B1026] ring-4 ring-[#F3A6C8]/40 animate-pulse font-semibold'
          : 'bg-[#1A234E] text-[#C9A7FF] hover:bg-[#9B5DE5] hover:text-white border border-[#9B5DE5]/30'
      } ${sizeClasses[size]} ${className}`}
    >
      {isPlayingThis ? (
        <VolumeX size={iconSizes[size]} className="animate-bounce" />
      ) : (
        <Volume2 size={iconSizes[size]} />
      )}
      {showText && <span>{isPlayingThis ? 'Stop' : buttonLabel}</span>}
      {isPlayingThis && (
        <span className="flex gap-0.5 items-center ml-0.5">
          <span className="w-1 h-3 bg-[#0B1026] rounded-full animate-wave-bar" />
          <span className="w-1 h-4 bg-[#0B1026] rounded-full animate-wave-bar [animation-delay:0.2s]" />
          <span className="w-1 h-2 bg-[#0B1026] rounded-full animate-wave-bar [animation-delay:0.4s]" />
        </span>
      )}
    </button>
  );
};
