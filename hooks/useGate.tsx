import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import PremiumGate from '../components/PremiumGate';

export type GateContextValue = {
  isPremium: boolean;
  open: (source?: string) => void;
  close: () => void;
  requirePremium: (action: () => void, source?: string) => () => void;
};

const GateContext = createContext<GateContextValue | undefined>(undefined);

export const GateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [source, setSource] = useState<string | undefined>(undefined);

  const open = useCallback((src?: string) => {
    setSource(src);
    setVisible(true);
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const requirePremium = useCallback((action: () => void, src?: string) => {
    return () => {
      if (user?.isPremium) return action();
      open(src);
    };
  }, [open, user?.isPremium]);

  const value = useMemo<GateContextValue>(() => ({ isPremium: !!user?.isPremium, open, close, requirePremium }), [user?.isPremium, open, close, requirePremium]);

  return (
    <GateContext.Provider value={value}>
      {children}
      <PremiumGate visible={visible} onClose={close} source={source} />
    </GateContext.Provider>
  );
};

export const useGate = () => {
  const ctx = useContext(GateContext);
  if (!ctx) throw new Error('useGate must be used within GateProvider');
  return ctx;
};