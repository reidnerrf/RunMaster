import { useEffect, useRef, useState } from 'react';

export function useRunGame({ enabled, getDistanceKm }: { enabled: boolean; getDistanceKm: () => number }) {
  const [points, setPoints] = useState(0);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const lastKmRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(() => {
      const d = getDistanceKm();
      // award 1 point every 0.3 km
      const step = 0.3;
      const prevSteps = Math.floor(lastKmRef.current / step);
      const newSteps = Math.floor(d / step);
      if (newSteps > prevSteps) {
        const gained = newSteps - prevSteps;
        setPoints((p) => p + gained);
        setLastEvent(`+${gained} 🪙`);
        setTimeout(() => setLastEvent(null), 1200);
        lastKmRef.current = d;
      }
    }, 1000);
    return () => clearInterval(t);
  }, [enabled, getDistanceKm]);

  return { points, lastEvent };
}