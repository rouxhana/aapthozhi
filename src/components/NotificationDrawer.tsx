import React, { useState } from 'react';
import {
  Bell,
  Bookmark,
  Building,
  CheckCheck,
  FolderCheck,
  MapPin,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import { AppNotification, LanguageCode } from '../types';
import { SpeakerButton } from './SpeakerButton';
import { TRANSLATIONS } from '../data/translations';
import { speechService } from '../services/speechService';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  currentLanguage: LanguageCode;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  currentLanguage,
  onMarkAllRead,
  onDeleteNotification,
}) => {
  const [readAloudOnReceive, setReadAloudOnReceive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const unreadList = notifications.filter((n) => !n.read);

  const getIcon = (iconType: AppNotification['icon']) => {
    switch (iconType) {
      case 'folder':
        return <FolderCheck className="text-[#45C27C]" size={22} />;
      case 'bookmark':
        return <Bookmark className="text-[#F3A6C8]" size={22} />;
      case 'building':
        return <Building className="text-[#9B5DE5]" size={22} />;
      case 'pin':
        return <MapPin className="text-amber-400" size={22} />;
      default:
        return <Bell className="text-[#C9A7FF]" size={22} />;
    }
  };

  const playAllUnread = () => {
    if (notifications.length === 0) return;
    const combinedText = notifications
      .map((n, idx) => `Update ${idx + 1}: ${n.title}. ${n.message}`)
      .join(' ... ');
    speechService.speak(combinedText, currentLanguage);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md h-full bg-[#0D1333] border-l-2 border-[#9B5DE5]/40 shadow-2xl flex flex-col text-white animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#9B5DE5]/20 bg-[#131A3B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#9B5DE5]/20 border border-[#9B5DE5]/40 text-[#F3A6C8]">
              <Bell size={22} />
            </div>
            <div>
              <h2 id="notif-drawer-title" className="text-lg font-bold text-white m-0">
                {t.notificationsTitle}
              </h2>
              <p className="text-xs text-[#B7BDD3] m-0">
                {unreadList.length} unread updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={playAllUnread}
              title="Read all updates aloud"
              className="p-2 rounded-xl bg-[#1A234E] text-[#F3A6C8] hover:bg-[#9B5DE5] hover:text-white border border-[#9B5DE5]/30 transition-colors"
            >
              <Volume2 size={18} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-[#1A234E] text-[#B7BDD3] hover:text-white hover:bg-red-500/20 transition-colors"
              aria-label="Close notification panel"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2.5 bg-[#101636] border-b border-[#9B5DE5]/20 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={unreadList.length === 0}
            className="flex items-center gap-1.5 text-[#C9A7FF] hover:text-white disabled:opacity-50 transition-colors font-medium"
          >
            <CheckCheck size={16} />
            {t.markAllRead}
          </button>

          <span className="text-[11px] text-[#B7BDD3]">
            {isPaused ? '⏸ Updates paused' : '● Live notifications active'}
          </span>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 px-4 text-[#B7BDD3]">
              <Bell size={40} className="mx-auto text-[#B7BDD3]/40 mb-3" />
              <p className="font-semibold text-white">{t.noNotifications}</p>
              <p className="text-xs mt-1">
                You will hear a chime when you save plans or document lists.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  notif.read
                    ? 'bg-[#121838]/70 border-[#9B5DE5]/20 opacity-80'
                    : 'bg-gradient-to-br from-[#161F48] to-[#121838] border-[#9B5DE5]/50 shadow-md ring-1 ring-[#F3A6C8]/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#0B1026] border border-[#9B5DE5]/30 shrink-0 mt-0.5">
                    {getIcon(notif.icon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-white truncate m-0">
                        {notif.title}
                      </h3>
                      <span className="text-[10px] text-[#B7BDD3] shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-[#B7BDD3] mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#9B5DE5]/15">
                      <SpeakerButton
                        textToSpeak={notif.audioText || notif.message}
                        langCode={currentLanguage}
                        size="sm"
                        showText={true}
                        buttonLabel="Hear update"
                      />

                      <button
                        type="button"
                        onClick={() => onDeleteNotification(notif.id)}
                        className="p-1.5 rounded-lg text-[#B7BDD3] hover:text-[#EF6A7B] hover:bg-red-500/10 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Preferences footer */}
        <div className="p-4 bg-[#101636] border-t border-[#9B5DE5]/25 space-y-2.5 text-xs text-[#B7BDD3]">
          <div className="flex items-center justify-between">
            <span>Read updates aloud automatically:</span>
            <input
              type="checkbox"
              checked={readAloudOnReceive}
              onChange={(e) => setReadAloudOnReceive(e.target.checked)}
              className="accent-[#9B5DE5] w-4 h-4 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Pause all notifications temporarily:</span>
            <input
              type="checkbox"
              checked={isPaused}
              onChange={(e) => setIsPaused(e.target.checked)}
              className="accent-[#EF6A7B] w-4 h-4 rounded cursor-pointer"
            />
          </div>

          <p className="text-[11px] text-[#B7BDD3]/70 pt-1 border-t border-[#9B5DE5]/15 italic">
            🛡 Privacy notice: Notifications never contain bank account numbers or sensitive credentials.
          </p>
        </div>
      </div>
    </div>
  );
};
