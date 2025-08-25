import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Storage from '../lib/storage';

export type User = {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isFree: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
  logout: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  downgradeToFree: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'runmaster_auth_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await Storage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as User;
          setUser(parsed);
        }
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const persist = async (u: User | null) => {
    if (u) await Storage.setItem(STORAGE_KEY, JSON.stringify(u));
    else await Storage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(async (email: string, password: string) => {
    const mockUser: User = { id: 'u1', name: 'Runner', email, isPremium: false };
    setUser(mockUser);
    await persist(mockUser);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const mockUser: User = { id: 'u1', name, email, isPremium: false };
    setUser(mockUser);
    await persist(mockUser);
  }, []);

  const socialLogin = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
    const mockUser: User = { id: provider + '_1', name: provider.toUpperCase() + ' Runner', email: provider + '@example.com', isPremium: false };
    setUser(mockUser);
    await persist(mockUser);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await persist(null);
  }, []);

  const upgradeToPremium = useCallback(async () => {
    if (!user) return;
    const upgraded = { ...user, isPremium: true };
    setUser(upgraded);
    await persist(upgraded);
    Alert.alert('Premium Ativado', 'Você agora é Premium! Recursos desbloqueados.');
  }, [user]);

  const downgradeToFree = useCallback(async () => {
    if (!user) return;
    const downgraded = { ...user, isPremium: false };
    setUser(downgraded);
    await persist(downgraded);
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isFree: !user?.isPremium,
    isPremium: !!user?.isPremium,
    login,
    signup,
    socialLogin,
    logout,
    upgradeToPremium,
    downgradeToFree,
  }), [user, loading, login, signup, socialLogin, logout, upgradeToPremium, downgradeToFree]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};