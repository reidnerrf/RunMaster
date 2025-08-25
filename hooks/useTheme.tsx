import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getTheme, Theme, ThemeMode } from '../lib/theme';
import * as Storage from '../lib/storage';

const THEME_STORAGE_KEY = 'runmaster_theme_v1';

type ThemeContextValue = {
  mode: ThemeMode;
  theme: Theme;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await Storage.getItem(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') setMode(saved);
      } catch {}
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    Storage.setItem(THEME_STORAGE_KEY, mode).catch(() => {});
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    theme,
    setMode: (m) => setMode(m),
    toggle: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
  }), [mode, theme]);

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
    };
    return fallback;
  }
  return ctx;
};