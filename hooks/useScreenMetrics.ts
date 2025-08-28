import { useEffect, useRef } from 'react';
import { track } from '../Lib/analytics';

export function useScreenMetrics(name: string) {
  const start = useRef<number>(Date.now());
  useEffect(() => {
    const t = Date.now() - start.current;
    track('screen_mount', { name, mountMs: t });
    return () => {
      const un = Date.now() - start.current;
      track('screen_unmount', { name, lifetimeMs: un });
    };
  }, [name]);
}

