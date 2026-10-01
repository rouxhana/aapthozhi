import React, { useEffect, useState } from 'react';
import {
  Bell,
  Bookmark,
  Building,
  Check,
  FolderCheck,
  MapPin,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { speechService } from '../services/speechService';

interface NotificationTutorialViewProps {
  currentLanguage: LanguageCode;
  onFinishTutorial: () => void;
  onSkip: () => void;
}

export const NotificationTutorialView: React.FC<NotificationTutorialViewProps> = ({
  currentLanguage,
  onFinishTutorial,
  onSkip,
}) => {
  const [playingExampleIndex, setPlayingExampleIndex] = useState<number | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  useEffect(() => {
    speechService.speak(t.notificationTutorialVoice, currentLanguage);
    return () => {
      speechService.stop();
    };
  }, [currentLanguage]);

  const examples = [
    {
      icon: <FolderCheck className="text-[#45C27C]" size={22} />,
      title: 'Your document list is ready',
      desc: 'Check the 4 documents needed for education assistance.',
      audio: 'Your document list is ready. Keep your daughter’s study certificate and Aadhaar ready.',
    },
    {
      icon: <Bookmark className="text-[#F3A6C8]" size={22} />,
      title: 'You saved an education-support plan',
      desc: 'Saved for Seva Sahayata Kendra visit.',
      audio: 'You saved an education-support plan. Tap anytime to view what to say at the counter.',
    },
    {
      icon: <Building className="text-[#9B5DE5]" size={22} />,
      title: 'Official scheme page updated',
      desc: 'Latest application dates announced on scholarship portal.',
      audio: 'Official scheme page updated with latest guidelines.',
    },
    {
      icon: <MapPin className="text-amber-400" size={22} />,
      title: 'Nearby help-centre plan ready',
      desc: 'Anganwadi centre is 0.8 km away.',
      audio: 'Nearby help centre plan ready. Anganwadi centre is just point-eight kilometres away.',
    },
  ];

  const handlePlayExample = (idx: number, audio: string) => {
    setPlayingExampleIndex(idx);
    speechService.speak(audio, currentLanguage, 1.0, () => {
      setPlayingExampleIndex(null);
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1026] text-white flex flex-col justify-between p-4 sm:p-6 relative">
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#9B5DE5]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between">
        <span className="text-xs uppercase font-extrabold tracking-wider text-[#F3A6C8] bg-[#9B5DE5]/20 px-3 py-1 rounded-full">
          Quick Tutorial
        </span>

        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-[#B7BDD3] hover:text-white underline font-medium"
        >
          {t.skipBtn} →
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full my-auto py-6 flex flex-col items-center text-center">
        {/* Large Bell Icon with glowing pulse */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#9B5DE5]/30 to-[#F3A6C8]/20 border-2 border-[#F3A6C8] flex items-center justify-center shadow-xl shadow-[#9B5DE5]/30 animate-soundwave">
            <Bell size={48} className="text-[#F3A6C8]" />
          </div>
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#EF6A7B] text-white text-xs font-bold flex items-center justify-center border-2 border-[#0B1026]">
            1
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-2">
          {t.notificationTutorialTitle}
        </h2>

        <p className="text-sm text-[#F7F5FA] max-w-sm mb-6 leading-relaxed bg-[#131A3B] p-4 rounded-2xl border border-[#9B5DE5]/30">
          {t.notificationTutorialVoice}
        </p>

        {/* 4 Example cards */}
        <div className="w-full space-y-2 mb-6 text-left">
          <span className="text-[11px] uppercase tracking-wider text-[#C9A7FF] font-bold block mb-1">
            Example Audio Updates:
          </span>
          {examples.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                playingExampleIndex === idx
                  ? 'bg-[#1C2554] border-[#F3A6C8] shadow-md ring-1 ring-[#F3A6C8]/30'
                  : 'bg-[#141B3B] border-[#9B5DE5]/20 hover:border-[#9B5DE5]/50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="p-1.5 rounded-xl bg-[#0B1026] shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate m-0">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[#B7BDD3] truncate m-0">
                    {item.desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePlayExample(idx, item.audio)}
                className={`p-2 rounded-xl text-xs font-medium shrink-0 flex items-center gap-1 transition-colors ${
                  playingExampleIndex === idx
                    ? 'bg-[#F3A6C8] text-[#0B1026] font-bold'
                    : 'bg-[#0B1026] text-[#C9A7FF] hover:bg-[#9B5DE5] hover:text-white'
                }`}
                title="Hear sample update"
              >
                <Volume2 size={15} />
                <span className="hidden sm:inline">Hear</span>
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons: Hear example update, Continue, Skip */}
        <div className="w-full space-y-2.5">
          <button
            type="button"
            onClick={onFinishTutorial}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#9B5DE5] to-[#F3A6C8] text-[#0B1026] font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-[#9B5DE5]/30 hover:opacity-95 transition-all cursor-pointer"
          >
            <span>{t.continueBtn} to Home</span>
            <Check size={20} strokeWidth={3} />
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="w-full py-2.5 text-xs text-[#B7BDD3] hover:text-white font-medium"
          >
            {t.skipBtn}
          </button>
        </div>
      </main>

      <footer className="max-w-md mx-auto w-full text-center pb-2 text-xs text-[#B7BDD3]">
        Dekho. Suno. Karo. — Touch the bell anytime in the app to hear updates.
      </footer>
    </div>
  );
};
