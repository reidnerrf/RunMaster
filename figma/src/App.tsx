import React, { useEffect } from 'react';
import { AppStateProvider, useAppState } from './components/AppState';
import { Splash } from './components/Splash';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';
import { Home } from './components/Home';
import { Running } from './components/Running';
import { Summary } from './components/Summary';
import { Community } from './components/Community';
import { Explore } from './components/Explore';
import { Insights } from './components/Insights';
import { Settings } from './components/Settings';
import { Admin } from './components/Admin';
import { PremiumGate } from './components/PremiumGate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  Home as HomeIcon, 
  Play, 
  Users, 
  Compass, 
  TrendingUp
} from 'lucide-react';

function AppRouter() {
  const { state, actions } = useAppState();

  // Splash screen and initial flow
  if (state.currentFlow === 'splash') {
    return <Splash />;
  }

  // Onboarding flow
  if (state.currentFlow === 'onboarding') {
    return <Onboarding />;
  }

  // Authentication flow
  if (state.currentFlow === 'auth' || !state.isAuthenticated) {
    return <Auth />;
  }

  // Running session
  if (state.currentFlow === 'running') {
    return <Running />;
  }

  // Post-run summary
  if (state.currentFlow === 'summary') {
    return <Summary />;
  }

  // Main app with tabs
  const mainTabs = [
    { id: 'home', label: 'Home', icon: HomeIcon, component: Home },
    { id: 'explore', label: 'Explorar', icon: Compass, component: Explore },
    { id: 'running', label: 'Correr', icon: Play, component: Running },
    { id: 'community', label: 'Comunidade', icon: Users, component: Community },
    { id: 'insights', label: 'Insights', icon: TrendingUp, component: Insights },
  ];

  return (
    <div className="app-container">
      <Tabs value={state.selectedTab} onValueChange={actions.setSelectedTab} className="flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          {mainTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="m-0 h-full animate-fade-in">
              <tab.component />
            </TabsContent>
          ))}
          
          {/* Settings */}
          <TabsContent value="settings" className="m-0 h-full animate-fade-in">
            <Settings />
          </TabsContent>

          {/* Admin (only for admin users) */}
          {state.user?.isAdmin && (
            <TabsContent value="admin" className="m-0 h-full animate-fade-in">
              <Admin />
            </TabsContent>
          )}
        </div>
        
        <TabsList className="tab-bar grid grid-cols-5 h-20 bg-card/95 backdrop-blur-lg border-t border-border rounded-none p-2">
          {mainTabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex flex-col gap-1 p-3 rounded-lg haptic-feedback transition-smooth data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-card hover:bg-muted/50"
            >
              <tab.icon className="icon-grid" />
              <span className="text-xs font-medium">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Premium Gate Modal */}
      <PremiumGate />
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppRouter />
    </AppStateProvider>
  );
}