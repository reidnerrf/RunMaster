import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  isAdmin: boolean;
  preferences: {
    goal: 'weight-loss' | '10k' | 'performance' | null;
    preferredTime: 'morning' | 'afternoon' | 'evening' | null;
    terrain: 'road' | 'trail' | 'track' | null;
    notifications: boolean;
    darkMode: 'auto' | 'light' | 'dark';
  };
  stats: {
    totalDistance: number;
    totalRuns: number;
    weeklyDistance: number;
    monthlyDistance: number;
  };
}

export interface AppState {
  // App flow state
  isFirstLaunch: boolean;
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
  currentFlow: 'splash' | 'onboarding' | 'auth' | 'main' | 'running' | 'summary';
  
  // User data
  user: User | null;
  
  // Running session
  currentRun: {
    isActive: boolean;
    isPaused: boolean;
    startTime: Date | null;
    duration: number;
    distance: number;
    pace: string;
    heartRate: number;
    calories: number;
    route: any[];
  } | null;
  
  // UI state
  isDarkMode: boolean;
  showPremiumGate: boolean;
  selectedTab: string;
}

interface AppContextType {
  state: AppState;
  actions: {
    // Auth actions
    login: (user: User) => void;
    logout: () => void;
    completeOnboarding: (preferences: any) => void;
    
    // Running actions
    startRun: () => void;
    pauseRun: () => void;
    stopRun: () => void;
    finishRun: () => void;
    
    // Navigation actions
    setCurrentFlow: (flow: AppState['currentFlow']) => void;
    setSelectedTab: (tab: string) => void;
    
    // UI actions
    toggleDarkMode: () => void;
    showPremiumUpgrade: () => void;
    hidePremiumGate: () => void;
    
    // User actions
    upgradeToPremium: () => void;
    updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  };
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    isFirstLaunch: true,
    hasCompletedOnboarding: false,
    isAuthenticated: false,
    currentFlow: 'splash',
    user: null,
    currentRun: null,
    isDarkMode: false,
    showPremiumGate: false,
    selectedTab: 'home'
  });

  // Auto dark mode based on time
  useEffect(() => {
    const updateDarkMode = () => {
      if (state.user?.preferences.darkMode === 'auto') {
        const hour = new Date().getHours();
        const shouldBeDark = hour < 7 || hour >= 19; // Dark from 7PM to 7AM
        setState(prev => ({ ...prev, isDarkMode: shouldBeDark }));
        
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    updateDarkMode();
    const interval = setInterval(updateDarkMode, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [state.user?.preferences.darkMode]);

  const actions = {
    login: (user: User) => {
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user,
        currentFlow: 'main'
      }));
    },

    logout: () => {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        currentFlow: 'auth',
        currentRun: null
      }));
    },

    completeOnboarding: (preferences: any) => {
      setState(prev => ({
        ...prev,
        hasCompletedOnboarding: true,
        currentFlow: prev.isAuthenticated ? 'main' : 'auth',
        user: prev.user ? {
          ...prev.user,
          preferences: { ...prev.user.preferences, ...preferences }
        } : prev.user
      }));
    },

    startRun: () => {
      setState(prev => ({
        ...prev,
        currentFlow: 'running',
        currentRun: {
          isActive: true,
          isPaused: false,
          startTime: new Date(),
          duration: 0,
          distance: 0,
          pace: '0:00',
          heartRate: 0,
          calories: 0,
          route: []
        }
      }));
    },

    pauseRun: () => {
      setState(prev => ({
        ...prev,
        currentRun: prev.currentRun ? {
          ...prev.currentRun,
          isPaused: !prev.currentRun.isPaused
        } : prev.currentRun
      }));
    },

    stopRun: () => {
      setState(prev => ({
        ...prev,
        currentRun: prev.currentRun ? {
          ...prev.currentRun,
          isActive: false
        } : prev.currentRun
      }));
    },

    finishRun: () => {
      setState(prev => ({
        ...prev,
        currentFlow: 'summary',
        currentRun: prev.currentRun ? {
          ...prev.currentRun,
          isActive: false
        } : prev.currentRun
      }));
    },

    setCurrentFlow: (flow: AppState['currentFlow']) => {
      setState(prev => ({ ...prev, currentFlow: flow }));
    },

    setSelectedTab: (tab: string) => {
      setState(prev => ({ ...prev, selectedTab: tab }));
    },

    toggleDarkMode: () => {
      setState(prev => {
        const newDarkMode = !prev.isDarkMode;
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { ...prev, isDarkMode: newDarkMode };
      });
    },

    showPremiumUpgrade: () => {
      setState(prev => ({ ...prev, showPremiumGate: true }));
    },

    hidePremiumGate: () => {
      setState(prev => ({ ...prev, showPremiumGate: false }));
    },

    upgradeToPremium: () => {
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, isPremium: true } : prev.user,
        showPremiumGate: false
      }));
    },

    updateUserPreferences: (preferences: Partial<User['preferences']>) => {
      setState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          preferences: { ...prev.user.preferences, ...preferences }
        } : prev.user
      }));
    }
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}