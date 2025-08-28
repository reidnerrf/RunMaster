import { API_BASE_URL } from '../constants/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WeatherFormat = 'json' | 'xml';

export interface WeatherLocationQuery {
  q: string; // city or "lat,lon"
  format?: WeatherFormat;
}

const CACHE_KEY_PREFIX = 'weather:current:';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedValue<T> { data: T; ts: number }

export async function getCurrentWeather<T = any>({ q, format = 'json' }: WeatherLocationQuery): Promise<T> {
  const cacheKey = `${CACHE_KEY_PREFIX}${q}:${format}`;
  // Try cache first
  try {
    const raw = await AsyncStorage.getItem(cacheKey);
    if (raw) {
      const cached = JSON.parse(raw) as CachedValue<T>;
      if (Date.now() - cached.ts < CACHE_TTL_MS) {
        return cached.data;
      }
    }
  } catch {}

  const url = `${API_BASE_URL}/weather/current?q=${encodeURIComponent(q)}${format === 'xml' ? '&format=xml' : ''}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Weather request failed: ${res.status} ${errText}`);
    }
    const data: any = format === 'xml' ? await res.text() : await res.json();
    // Store cache (best-effort)
    try { await AsyncStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() } satisfies CachedValue<any>)); } catch {}
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

export function makeLatLonQuery(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

export interface ForecastQuery {
  q: string;
  days?: number; // 1-10
  hours?: number; // optional slice of first day hourly
}

export async function getForecast<T = any>({ q, days = 3, hours }: ForecastQuery): Promise<T> {
  const url = `${API_BASE_URL}/weather/forecast?q=${encodeURIComponent(q)}&days=${days}${hours ? `&hours=${hours}` : ''}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Forecast request failed: ${res.status}`);
    const data = await res.json();
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

