import Constants from 'expo-constants';

export const API_BASE_URL: string = ((): string => {
  const fromEnv = (Constants?.expoConfig as any)?.extra?.API_BASE_URL || (Constants?.manifest as any)?.extra?.API_BASE_URL;
  if (typeof fromEnv === 'string' && fromEnv.length > 0) return fromEnv;
  // Fallback to local dev
  return 'http://localhost:3000';
})();

