import React, { useEffect } from 'react';
import { useAppState } from './AppState';
import { Activity, Zap } from 'lucide-react';

export function Splash() {
  const { actions } = useAppState();

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      // Check if user has completed onboarding (simulate checking localStorage)
      const hasOnboarded = localStorage.getItem('hasCompletedOnboarding') === 'true';
      const isAuthenticated = localStorage.getItem('authToken') !== null;
      
      if (hasOnboarded && isAuthenticated) {
        // Simulate loading user data
        const mockUser = {
          id: '1',
          name: 'João Silva',
          email: 'joao@example.com',
          avatar: 'JS',
          isPremium: true,
          isAdmin: false,
          preferences: {
            goal: 'performance' as const,
            preferredTime: 'morning' as const,
            terrain: 'road' as const,
            notifications: true,
            darkMode: 'auto' as const
          },
          stats: {
            totalDistance: 245.6,
            totalRuns: 42,
            weeklyDistance: 28.5,
            monthlyDistance: 124.3
          }
        };
        actions.login(mockUser);
      } else if (hasOnboarded) {
        actions.setCurrentFlow('auth');
      } else {
        actions.setCurrentFlow('onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [actions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="relative">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-elevated">
            <Activity className="w-12 h-12 text-white" />
          </div>
          
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">RunTracker</h1>
          <p className="text-white/80 text-lg">Track Every Step, Achieve Every Goal</p>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Checking permissions text */}
        <div className="space-y-2 mt-8">
          <p className="text-white/70 text-sm">Verificando permissões...</p>
          <div className="flex items-center justify-center space-x-1 text-xs text-white/60">
            <span>GPS</span>
            <span>•</span>
            <span>Notificações</span>
            <span>•</span>
            <span>HealthKit</span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
    </div>
  );
}