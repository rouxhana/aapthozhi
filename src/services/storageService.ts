import { AppNotification, SavedPlan, UserState } from '../types';

const STORAGE_KEY = 'aapthozhi_user_state_v1';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Your document list is ready',
    message: 'Check the 4 documents needed for education assistance for your daughter.',
    timestamp: '10 mins ago',
    icon: 'folder',
    read: false,
    category: 'document',
    audioText: 'Your document list is ready. Keep your daughter’s study certificate, Aadhaar card, and bank passbook ready.',
  },
  {
    id: 'notif-2',
    title: 'Nearby help-centre plan ready',
    message: 'Seva Sahayata Kendra is 1.2 km away. Tap to view walking time and what to say.',
    timestamp: '1 hour ago',
    icon: 'pin',
    read: false,
    category: 'centre',
    audioText: 'Nearby help centre plan is ready. Seva Sahayata Kendra is just 1.2 kilometres away.',
  },
  {
    id: 'notif-3',
    title: 'Official scheme page updated',
    message: 'National Scholarship Portal announced updated guidelines for girls education aid.',
    timestamp: 'Yesterday',
    icon: 'building',
    read: true,
    category: 'scheme',
    audioText: 'Official scheme page updated with latest guidelines.',
  },
];

const DEFAULT_STATE: UserState = {
  hasCompletedLanguageDetection: false,
  selectedLanguage: 'ta', // Default fallback for initial detection screen
  hasLocationPermission: false,
  simulatedRegion: {
    state: 'Tamil Nadu',
    city: 'Chennai',
  },
  isLoggedIn: false,
  isGuest: false,
  phoneNumber: '',
  hasSeenNotificationTutorial: false,
  savedPlans: [],
  notifications: INITIAL_NOTIFICATIONS,
  privateMode: false,
  shareApprovedOnly: true,
  speechSpeed: 1.0,
};

export const storageService = {
  getState(): UserState {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_STATE;
      return { ...DEFAULT_STATE, ...JSON.parse(data) };
    } catch {
      return DEFAULT_STATE;
    }
  },

  saveState(state: Partial<UserState>): UserState {
    const current = this.getState();
    const updated = { ...current, ...state };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  },

  savePlan(plan: SavedPlan): UserState {
    const current = this.getState();
    const existingIndex = current.savedPlans.findIndex((p) => p.schemeId === plan.schemeId);
    let updatedPlans = [...current.savedPlans];
    if (existingIndex >= 0) {
      updatedPlans[existingIndex] = plan;
    } else {
      updatedPlans = [plan, ...updatedPlans];
    }

    // Also add a notification for the saved plan
    const newNotif: AppNotification = {
      id: `notif-plan-${Date.now()}`,
      title: `You saved a plan: ${plan.schemeTitle}`,
      message: `Your ${plan.routeType === 'online' ? 'online portal' : 'nearby centre'} plan has been safely saved.`,
      timestamp: 'Just now',
      icon: 'bookmark',
      read: false,
      category: 'plan',
      audioText: `You have saved a plan for ${plan.schemeTitle}. You can access it anytime from your saved plans or notification bell.`,
    };

    return this.saveState({
      savedPlans: updatedPlans,
      notifications: [newNotif, ...current.notifications],
    });
  },

  deletePlan(planId: string): UserState {
    const current = this.getState();
    const updatedPlans = current.savedPlans.filter((p) => p.id !== planId);
    return this.saveState({ savedPlans: updatedPlans });
  },

  markNotificationRead(notifId: string): UserState {
    const current = this.getState();
    const updated = current.notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n));
    return this.saveState({ notifications: updated });
  },

  markAllNotificationsRead(): UserState {
    const current = this.getState();
    const updated = current.notifications.map((n) => ({ ...n, read: true }));
    return this.saveState({ notifications: updated });
  },

  deleteNotification(notifId: string): UserState {
    const current = this.getState();
    const updated = current.notifications.filter((n) => n.id !== notifId);
    return this.saveState({ notifications: updated });
  },

  resetAll(): UserState {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return DEFAULT_STATE;
  },
};
