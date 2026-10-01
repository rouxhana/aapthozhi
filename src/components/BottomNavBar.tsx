import React from 'react';
import {
  Camera,
  HeartHandshake,
  Home,
  Mic,
  PackageCheck,
  ShieldAlert,
} from 'lucide-react';
import { LanguageCode } from '../types';

interface BottomNavBarProps {
  currentScreen: string;
  onNavigate: (screen: any) => void;
  currentLanguage: LanguageCode;
  onQuickSpeak: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  currentLanguage,
  onQuickSpeak,
}) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      iconColor: 'text-[#C9A7FF]',
      activeBg: 'bg-[#9B5DE5]/30 border-[#9B5DE5]',
      aria: 'Go to Home Screen',
    },
    {
      id: 'mic-action',
      label: 'Speak',
      icon: Mic,
      isSpecialAction: true,
      aria: 'Speak your question or welfare need',
    },
    {
      id: 'point-and-ask',
      label: 'Camera',
      icon: Camera,
      iconColor: 'text-[#F3A6C8]',
      activeBg: 'bg-[#F3A6C8]/25 border-[#F3A6C8]',
      aria: 'Show AapThozhi any government letter or form',
    },
    {
      id: 'offline-plan',
      label: 'Papers',
      icon: PackageCheck,
      iconColor: 'text-amber-400',
      activeBg: 'bg-amber-500/25 border-amber-400',
      aria: 'View saved offline documents checklist',
    },
    {
      id: 'trusted-helper',
      label: 'Helper',
      icon: HeartHandshake,
      iconColor: 'text-emerald-400',
      activeBg: 'bg-emerald-500/25 border-emerald-400',
      aria: 'Ask local ASHA or Sakhi community sister',
    },
    {
      id: 'safety-center',
      label: '181 SOS',
      icon: ShieldAlert,
      iconColor: 'text-[#EF6A7B]',
      activeBg: 'bg-[#EF6A7B]/25 border-[#EF6A7B]',
      aria: 'Emergency helpline and anti-fraud center',
    },
  ];

  return (
    <nav
      aria-label="Main Navigation Tools"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B1028]/95 backdrop-blur-2xl border-t-2 border-[#9B5DE5]/40 px-2 sm:px-4 py-1.5 shadow-[0_-10px_35px_rgba(0,0,0,0.7)]"
    >
      <div className="max-w-xl mx-auto flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          if (item.isSpecialAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={onQuickSpeak}
                aria-label={item.aria}
                title={item.aria}
                className="relative -top-4 flex flex-col items-center justify-center focus:outline-none group cursor-pointer"
              >
                <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#9B5DE5] via-[#8338EC] to-[#F3A6C8] text-white flex items-center justify-center shadow-2xl shadow-[#9B5DE5]/70 ring-4 ring-[#0B1028] group-hover:scale-110 active:scale-95 transition-all">
                  <Mic size={30} className="stroke-[2.5] animate-pulse" />
                </div>
                <span className="text-[10px] font-black uppercase text-[#F3A6C8] tracking-widest mt-0.5 bg-[#0B1028] px-2 py-0.5 rounded-full border border-[#9B5DE5]/40 shadow-sm">
                  🎙️ Speak
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-label={item.aria}
              title={item.aria}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? `${item.activeBg} text-white font-extrabold shadow-lg border`
                  : 'text-[#B7BDD3] hover:text-white hover:bg-[#141B3B]/60'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-transform ${
                  isActive ? 'scale-115 text-white' : `${item.iconColor} group-hover:scale-110`
                }`}
              >
                <Icon size={26} className="stroke-[2.2]" />
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-black tracking-tight text-center leading-tight truncate w-full ${
                  isActive ? 'text-white' : 'text-[#B7BDD3]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
