import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getTheme, Theme, ThemeMode } from '../Lib/theme';
import * as Storage from '../Lib/storage';
import { getSettings, setSettings } from '../Lib/settings';

const THEME_STORAGE_KEY = 'runmaster_theme_v1';

type ThemeContextValue = {
  mode: ThemeMode;
  theme: Theme;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
  autoOutdoor: boolean;
  setAutoOutdoor: (v: boolean) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [hydrated, setHydrated] = useState(false);
  const [autoOutdoor, setAutoOutdoorState] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await Storage.getItem(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'high') setMode(saved as ThemeMode);
        const s = await getSettings();
        setAutoOutdoorState(!!(s as any).autoOutdoor);
      } catch {}
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    Storage.setItem(THEME_STORAGE_KEY, mode).catch(() => {});
  }, [mode]);

  // Auto outdoor: if enabled and between 18-6h, use high visibility
  useEffect(() => {
    if (!autoOutdoor) return;
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
      if (mode !== 'high') setMode('high');
    }
  }, [autoOutdoor]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const setAutoOutdoor = useCallback(async (v: boolean) => {
    setAutoOutdoorState(v);
    try { await setSettings({ autoOutdoor: v } as any); } catch {}
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    theme,
    setMode: (m) => setMode(m),
    toggle: () => setMode((prev) => (prev === 'light' ? 'dark' : prev === 'dark' ? 'high' : 'light')),
    autoOutdoor,
    setAutoOutdoor,
  }), [mode, theme, autoOutdoor, setAutoOutdoor]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    const fallback: ThemeContextValue = {
      mode: 'light',
      theme: getTheme('light'),
      setMode: () => {},
      toggle: () => {},
      autoOutdoor: false,
      setAutoOutdoor: async () => {},
    };
    return fallback;
  }
  return ctx;
};