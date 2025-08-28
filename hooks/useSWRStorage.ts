import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Key = string;
type Fetcher<T> = () => Promise<T>;

const memoryCache = new Map<Key, { ts: number; data: any }>();

export function useSWRStorage<T>(key: Key, fetcher: Fetcher<T>, ttlMs = 5 * 60 * 1000) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const mounted = useRef(true);

  useEffect(() => { return () => { mounted.current = false; }; }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError(null);
      // memory
      const m = memoryCache.get(key);
      if (m && Date.now() - m.ts < ttlMs) setData(m.data as T);
      // storage
      try {
        const raw = await AsyncStorage.getItem('swr:' + key);
        if (raw) {
          const parsed = JSON.parse(raw) as { ts: number; data: T };
          if (Date.now() - parsed.ts < ttlMs && !m) setData(parsed.data);
        }
      } catch {}
      // revalidate
      try {
        const fresh = await fetcher();
        if (cancelled || !mounted.current) return;
        setData(fresh);
        memoryCache.set(key, { ts: Date.now(), data: fresh });
        try { await AsyncStorage.setItem('swr:' + key, JSON.stringify({ ts: Date.now(), data: fresh })); } catch {}
      } catch (e) { if (!cancelled) setError(e); } finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [key]);

  return { data, error, loading } as const;
}

