export type LanguageCode =
  | 'hi'
  | 'ta'
  | 'bn'
  | 'te'
  | 'mr'
  | 'kn'
  | 'gu'
  | 'ml'
  | 'pa'
  | 'od'
  | 'as'
  | 'ur'
  | 'en'
  | 'hinglish';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  tagline: string;
  welcomeVoiceText: string;
  demoPhrase: string;
  speechLang: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  iconType: 'id-card' | 'bank-passbook' | 'certificate' | 'photo' | 'unknown';
  isRequired: boolean;
  helpTip: string;
}

export interface SchemeInfo {
  id: string;
  category: 'education' | 'maternity' | 'pension' | 'health' | 'skills';
  title: string;
  description: string;
  tagline: string;
  benefits: string[];
  eligibility: string[];
  documents: DocumentItem[];
  officialUrl: string;
  officialPortalName: string;
  offlineCenterTypes: string[];
  whatToSayText: string;
  slowExplanationSteps: {
    stepNumber: number;
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface HelpCenter {
  id: string;
  name: string;
  type: 'seva-kendra' | 'anganwadi' | 'csc' | 'panchayat';
  distance: string;
  walkingTime: string;
  rickshawTime: string;
  address: string;
  phone: string;
  timings: string;
  supportedServices: string[];
  latitude: number;
  longitude: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  icon: 'folder' | 'bookmark' | 'building' | 'pin';
  read: boolean;
  category: 'document' | 'plan' | 'scheme' | 'centre';
  audioText: string;
}

export interface SavedPlan {
  id: string;
  schemeId: string;
  schemeTitle: string;
  routeType: 'online' | 'offline';
  centerName?: string;
  savedAt: string;
  notes: string;
}

export interface UserState {
  hasCompletedLanguageDetection: boolean;
  selectedLanguage: LanguageCode;
  hasLocationPermission: boolean;
  simulatedRegion?: {
    state: string;
    city: string;
  };
  isLoggedIn: boolean;
  isGuest: boolean;
  phoneNumber?: string;
  hasSeenNotificationTutorial: boolean;
  savedPlans: SavedPlan[];
  notifications: AppNotification[];
  privateMode: boolean;
  shareApprovedOnly: boolean;
  speechSpeed: number; // 1.0 normal, 0.75 slow
}
