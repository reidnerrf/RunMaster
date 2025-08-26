import * as Storage from './storage';

const SETTINGS_KEY = 'runmaster_settings_v1';

export type SafetyLayers = {
  lighting: boolean;
  airQuality: boolean;
  weather: boolean;
};

export type AppSettings = {
  safetyLayers: SafetyLayers;
  spotifyConnected?: boolean;
  appleMusicConnected?: boolean;
  healthConnected?: boolean;
  autoOutdoor?: boolean;
  widgetDailyGoalKm?: number;
};

const DEFAULT_SETTINGS: AppSettings = {
  safetyLayers: { lighting: false, airQuality: false, weather: false },
  spotifyConnected: false,
  appleMusicConnected: false,
  healthConnected: false,
  autoOutdoor: false,
  widgetDailyGoalKm: 5,
};

export async function getSettings(): Promise<AppSettings> {
  const raw = await Storage.getItem(SETTINGS_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed, safetyLayers: { ...DEFAULT_SETTINGS.safetyLayers, ...(parsed.safetyLayers || {}) } } as AppSettings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function setSettings(s: Partial<AppSettings>) {
  const prev = await getSettings();
  const next: AppSettings = {
    ...prev,
    ...s,
    safetyLayers: { ...prev.safetyLayers, ...(s.safetyLayers || {}) },
  };
  await Storage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}

export async function setSafetyLayers(patch: Partial<SafetyLayers>) {
  return setSettings({ safetyLayers: patch as any });
}

