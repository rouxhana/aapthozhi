import React, { useEffect, useState } from 'react';
import { LanguageCode, SchemeInfo, UserState } from './types';
import { storageService } from './services/storageService';
import { SCHEMES_DATA } from './data/schemes';
import { SUPPORTED_LANGUAGES } from './data/languages';
import { TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { VoiceIndicatorBar } from './components/VoiceIndicatorBar';
import { LanguageModal } from './components/LanguageModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LanguageDetectiveView } from './views/LanguageDetectiveView';
import { RegionalAssistConsentView } from './views/RegionalAssistConsentView';
import { AuthView } from './views/AuthView';
import { NotificationTutorialView } from './views/NotificationTutorialView';
import { HomeView } from './views/HomeView';
import { ChatConversationView } from './views/ChatConversationView';
import { SchemeDetailView } from './views/SchemeDetailView';
import { OfflinePlanView } from './views/OfflinePlanView';
import { PointAndAskView } from './views/PointAndAskView';
import { TrustedHelperView } from './views/TrustedHelperView';
import { SafetyCenterView } from './views/SafetyCenterView';
import { SettingsView } from './views/SettingsView';
import confetti from 'canvas-confetti';

type AppScreen =
  | 'detective'
  | 'regional-consent'
  | 'auth'
  | 'notif-tutorial'
  | 'home'
  | 'chat'
  | 'scheme-detail'
  | 'offline-plan'
  | 'point-and-ask'
  | 'trusted-helper'
  | 'safety-center'
  | 'settings';

export const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(() => storageService.getState());
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    const s = storageService.getState();
    if (!s.hasCompletedLanguageDetection) return 'detective';
    if (!s.hasSeenNotificationTutorial) return 'notif-tutorial';
    return 'home';
  });

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('scheme-education-girl');
  const [currentVoiceQuery, setCurrentVoiceQuery] = useState<string>('I need help for my daughter’s education.');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Sync state changes with persistence
  const updateState = (partial: Partial<UserState>) => {
    const updated = storageService.saveState(partial);
    setUserState(updated);
  };

  const currentScheme =
    SCHEMES_DATA.find((s) => s.id === selectedSchemeId) || SCHEMES_DATA[0];

  const unreadNotificationCount = userState.notifications.filter((n) => !n.read).length;

  // Flow Step 1 -> Step 2: Language Detected & Confirmed
  const handleConfirmLanguage = (lang: LanguageCode) => {
    updateState({
      selectedLanguage: lang,
      hasCompletedLanguageDetection: true,
    });
    setCurrentScreen('regional-consent');
  };

  // Flow Step 2 -> Step 3: Location Allowed
  const handleAllowLocation = (region: { state: string; city: string }) => {
    updateState({
      hasLocationPermission: true,
      simulatedRegion: region,
    });
    setCurrentScreen('auth');
  };

  // Flow Step 2 -> Step 3: Location Skipped
  const handleSkipLocation = () => {
    updateState({
      hasLocationPermission: false,
    });
    setCurrentScreen('auth');
  };

  // Flow Step 3 -> Step 4: Login / OTP Success
  const handleLoginSuccess = (phone?: string) => {
    updateState({
      isLoggedIn: true,
      isGuest: false,
      phoneNumber: phone,
    });
    setCurrentScreen('notif-tutorial');
  };

  // Flow Step 3 -> Step 4: Continue as Guest
  const handleContinueGuest = () => {
    updateState({
      isLoggedIn: false,
      isGuest: true,
    });
    setCurrentScreen('notif-tutorial');
  };

  // Flow Step 4 -> Step 5: Notification Tutorial Finished / Skipped
  const handleFinishTutorial = () => {
    updateState({
      hasSeenNotificationTutorial: true,
    });
    setCurrentScreen('home');
  };

  // Home Screen: Service Card Selected
  const handleSelectService = (category: 'education' | 'maternity' | 'pension' | 'health') => {
    const matchingScheme = SCHEMES_DATA.find((s) => s.category === category) || SCHEMES_DATA[0];
    setSelectedSchemeId(matchingScheme.id);
    setCurrentScreen('scheme-detail');
  };

  // Home Screen: Voice Query Triggered
  const handleVoiceSearchQuery = (query: string) => {
    setCurrentVoiceQuery(query);
    // Find relevant scheme
    const lower = query.toLowerCase();
    if (lower.includes('pregnancy') || lower.includes('mother') && lower.includes('baby')) {
      setSelectedSchemeId('scheme-maternity-care');
    } else if (lower.includes('pension') || lower.includes('old age') || lower.includes('widow')) {
      setSelectedSchemeId('scheme-elderly-pension');
    } else if (lower.includes('health') || lower.includes('hospital') || lower.includes('doctor')) {
      setSelectedSchemeId('scheme-health-care');
    } else {
      setSelectedSchemeId('scheme-education-girl');
    }
    setCurrentScreen('chat');
  };

  // Chat Screen -> Scheme Detail
  const handleOpenSchemeFromChat = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    setCurrentScreen('scheme-detail');
  };

  // Scheme Detail -> Route Selected
  const handleSelectRoute = (route: 'online' | 'offline') => {
    if (route === 'offline') {
      setCurrentScreen('offline-plan');
    }
  };

  // Save Plan Action
  const handleSavePlan = () => {
    storageService.savePlan({
      id: `plan-${Date.now()}`,
      schemeId: currentScheme.id,
      schemeTitle: currentScheme.title,
      routeType: currentScreen === 'offline-plan' ? 'offline' : 'online',
      centerName: currentScreen === 'offline-plan' ? 'Seva Sahayata Kendra' : 'National Portal',
      savedAt: new Date().toLocaleDateString(),
      notes: 'Saved for fast counter assistance.',
    });
    const refreshed = storageService.getState();
    setUserState(refreshed);

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#45C27C', '#F3A6C8', '#9B5DE5', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
  };

  // Reset demo session completely
  const handleResetAllData = () => {
    const cleanState = storageService.resetAll();
    setUserState(cleanState);
    setCurrentScreen('detective');
  };

  // Notification Drawer callbacks
  const handleMarkAllRead = () => {
    const updated = storageService.markAllNotificationsRead();
    setUserState(updated);
  };

  const handleDeleteNotification = (id: string) => {
    const updated = storageService.deleteNotification(id);
    setUserState(updated);
  };

  // Screen Rendering
  const isSetupScreen =
    currentScreen === 'detective' ||
    currentScreen === 'regional-consent' ||
    currentScreen === 'auth' ||
    currentScreen === 'notif-tutorial';

  return (
    <div className="min-h-screen bg-[#0B1026] text-white flex flex-col font-sans selection:bg-[#9B5DE5] selection:text-white">
      {/* App Header (shown on main dashboard and inner pages) */}
      {!isSetupScreen && (
        <Header
          currentLanguage={userState.selectedLanguage}
          unreadCount={unreadNotificationCount}
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          onOpenPrivacySettings={() => setCurrentScreen('settings')}
          showBack={currentScreen !== 'home'}
          onBack={() => setCurrentScreen('home')}
          pageTitle={currentScreen}
        />
      )}

      {/* Screen Views */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'detective' && (
          <LanguageDetectiveView
            onConfirmLanguage={handleConfirmLanguage}
            onOpenLanguageList={() => setIsLanguageModalOpen(true)}
          />
        )}

        {currentScreen === 'regional-consent' && (
          <RegionalAssistConsentView
            currentLanguage={userState.selectedLanguage}
            onAllowLocation={handleAllowLocation}
            onSkipLocation={handleSkipLocation}
            onBack={() => setCurrentScreen('detective')}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthView
            currentLanguage={userState.selectedLanguage}
            onLoginSuccess={handleLoginSuccess}
            onContinueGuest={handleContinueGuest}
            onBack={() => setCurrentScreen('regional-consent')}
          />
        )}

        {currentScreen === 'notif-tutorial' && (
          <NotificationTutorialView
            currentLanguage={userState.selectedLanguage}
            onFinishTutorial={handleFinishTutorial}
            onSkip={handleFinishTutorial}
          />
        )}

        {currentScreen === 'home' && (
          <HomeView
            currentLanguage={userState.selectedLanguage}
            userName={userState.phoneNumber}
            onSelectService={handleSelectService}
            onVoiceSearchQuery={handleVoiceSearchQuery}
            onOpenPointAndAsk={() => setCurrentScreen('point-and-ask')}
            onOpenTrustedHelper={() => setCurrentScreen('trusted-helper')}
            onOpenSafetyCenter={() => setCurrentScreen('safety-center')}
          />
        )}

        {currentScreen === 'chat' && (
          <ChatConversationView
            currentLanguage={userState.selectedLanguage}
            initialQuery={currentVoiceQuery}
            onOpenScheme={handleOpenSchemeFromChat}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'scheme-detail' && (
          <SchemeDetailView
            scheme={currentScheme}
            currentLanguage={userState.selectedLanguage}
            onSelectRoute={handleSelectRoute}
            onSavePlan={handleSavePlan}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'offline-plan' && (
          <OfflinePlanView
            scheme={currentScheme}
            currentLanguage={userState.selectedLanguage}
            onSavePlan={handleSavePlan}
            onBack={() => setCurrentScreen('scheme-detail')}
          />
        )}

        {currentScreen === 'point-and-ask' && (
          <PointAndAskView
            currentLanguage={userState.selectedLanguage}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'trusted-helper' && (
          <TrustedHelperView
            currentLanguage={userState.selectedLanguage}
            onBack={() => setCurrentScreen('home')}
            onOpenPrivacySettings={() => setCurrentScreen('settings')}
          />
        )}

        {currentScreen === 'safety-center' && (
          <SafetyCenterView
            currentLanguage={userState.selectedLanguage}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsView
            userState={userState}
            onUpdateState={updateState}
            onResetAllData={handleResetAllData}
            onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
      </div>

      {/* Global Floating Voice Playback Bar */}
      <VoiceIndicatorBar />

      {/* Language Switcher Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguage={userState.selectedLanguage}
        onSelectLanguage={(newLang) => {
          updateState({ selectedLanguage: newLang });
        }}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={userState.notifications}
        currentLanguage={userState.selectedLanguage}
        onMarkAllRead={handleMarkAllRead}
        onDeleteNotification={handleDeleteNotification}
      />
    </div>
  );
};

export default App;
