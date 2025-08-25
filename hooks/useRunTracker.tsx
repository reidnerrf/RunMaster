import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { registerBackgroundTask, startBackground, stopBackground, popBufferedPoints } from '../lib/background';
import { ensureRunTrackingChannel } from '../lib/notifications';

export type LatLng = { latitude: number; longitude: number };
export type TrackPoint = LatLng & { timestamp: number };
export type RunStatus = 'idle' | 'running' | 'paused' | 'finished';

export type TrackerState = {
  status: RunStatus;
  elapsedSec: number;
  distanceKm: number;
  paceStr: string; // mm:ss per km
  calories: number;
  heartRate: number; // simulated for now
  path: TrackPoint[];
  lastMilestoneKm: number; // integer km milestones crossed
  isAutoPaused?: boolean;
};

function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon));
  return R * c;
}

function formatPace(distanceKm: number, elapsedSec: number): string {
  if (!distanceKm || distanceKm <= 0) return '--:--';
  const secPerKm = elapsedSec / distanceKm;
  const min = Math.floor(secPerKm / 60);
  const sec = Math.max(0, Math.round(secPerKm % 60));
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// Try to require expo-location at runtime to avoid hard dependency failures
let ExpoLocation: any = null;
try { ExpoLocation = require('expo-location'); } catch {}

export type UseRunTrackerOptions = {
  assumedWeightKg?: number; // for calorie calc
  highAccuracy?: boolean;
  enableAutoPause?: boolean;
};

export function useRunTracker(opts: UseRunTrackerOptions = {}) {
  const assumedWeightKg = opts.assumedWeightKg ?? 70;
  const enableAutoPause = opts.enableAutoPause ?? true;
  const [status, setStatus] = useState<RunStatus>('idle');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(150);
  const [path, setPath] = useState<TrackPoint[]>([]);
  const [lastMilestoneKm, setLastMilestoneKm] = useState(0);
  const [isAutoPaused, setIsAutoPaused] = useState(false);

  // per-km split aggregation buffers
  const splitKmRef = useRef(1);
  const splitStartSecRef = useRef(0);
  const splitHrSamplesRef = useRef<number[]>([]);
  const splitsRef = useRef<{ km: number; paceSec: number; avgHr?: number }[]>([]);

  const paceStr = useMemo(() => formatPace(distanceKm, elapsedSec), [distanceKm, elapsedSec]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchSubRef = useRef<any>(null);
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bgDrainRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runIdRef = useRef<string | null>(null);
  const autoPauseRef = useRef({ belowSince: 0, aboveSince: 0, manuallyPaused: false });
  const lastPointRef = useRef<TrackPoint | null>(null);

  const stopAllTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (simTimerRef.current) { clearInterval(simTimerRef.current); simTimerRef.current = null; }
    if (bgDrainRef.current) { clearInterval(bgDrainRef.current); bgDrainRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setElapsedSec((s) => s + 1);
      setHeartRate((h) => {
        const nh = Math.max(120, Math.min(190, h + (Math.random() * 6 - 3)));
        splitHrSamplesRef.current.push(nh);
        return nh;
      });
    }, 1000);
  }, []);

  const updateCalories = useCallback((distKm: number) => {
    // Rough estimate: kcal ≈ 1.036 * weight(kg) * distance(km)
    const kcal = 1.036 * assumedWeightKg * distKm;
    setCalories(Math.round(kcal));
  }, [assumedWeightKg]);

  const onDistanceAdvance = useCallback((prevKm: number, newKm: number) => {
    // If crossed into a new integer km, finalize split(s)
    const prevInt = Math.floor(prevKm);
    const newInt = Math.floor(newKm);
    if (newInt > prevInt) {
      for (let k = prevInt + 1; k <= newInt; k++) {
        const splitKm = splitKmRef.current;
        const elapsedForSplit = elapsedSec - splitStartSecRef.current;
        const hrSamples = splitHrSamplesRef.current;
        const avgHr = hrSamples.length ? Math.round(hrSamples.reduce((a, b) => a + b, 0) / hrSamples.length) : undefined;
        const paceSec = Math.max(1, Math.round(elapsedForSplit));
        splitsRef.current.push({ km: splitKm, paceSec, avgHr });
        // reset for next split
        splitKmRef.current = splitKm + 1;
        splitStartSecRef.current = elapsedSec;
        splitHrSamplesRef.current = [];
        setLastMilestoneKm(splitKm);
      }
    }
  }, [elapsedSec]);

  const handleNewPoint = useCallback((pt: TrackPoint) => {
    // Auto-pause decision first
    if (enableAutoPause) {
      const last = lastPointRef.current;
      if (last) {
        const dtSec = Math.max(0.5, (pt.timestamp - last.timestamp) / 1000);
        const incKm = haversineKm(last, pt);
        const speedMS = (incKm * 1000) / dtSec; // meters per second
        const now = Date.now();
        // thresholds
        const below = speedMS < 0.6; // ~ <2.16 km/h
        const above = speedMS > 1.2; // ~ >4.32 km/h
        if (below) {
          if (autoPauseRef.current.belowSince === 0) autoPauseRef.current.belowSince = now;
          autoPauseRef.current.aboveSince = 0;
        } else if (above) {
          if (autoPauseRef.current.aboveSince === 0) autoPauseRef.current.aboveSince = now;
          autoPauseRef.current.belowSince = 0;
        }
        // Trigger pause/resume
        if (status === 'running' && !autoPauseRef.current.manuallyPaused && autoPauseRef.current.belowSince && now - autoPauseRef.current.belowSince > 6000) {
          // auto pause
          setStatus('paused');
          setIsAutoPaused(true);
          stopAllTimers();
          if (watchSubRef.current?.remove) watchSubRef.current.remove();
          watchSubRef.current = null;
        } else if (status === 'paused' && isAutoPaused && autoPauseRef.current.aboveSince && now - autoPauseRef.current.aboveSince > 3000) {
          // auto resume
          setIsAutoPaused(false);
          setStatus('running');
          startTimer();
          // resume watcher best-effort
          if (ExpoLocation?.watchPositionAsync) {
            ExpoLocation.watchPositionAsync(
              { accuracy: ExpoLocation.Accuracy?.BestForNavigation ?? 5, timeInterval: 1000, distanceInterval: 4 },
              (loc: any) => {
                handleNewPoint({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, timestamp: loc.timestamp ?? Date.now() });
              }
            ).then((sub: any) => { watchSubRef.current = sub; }).catch(() => {});
          }
        }
      }
      lastPointRef.current = pt;
    }

    setPath((prev) => {
      const next = [...prev, pt];
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        const inc = haversineKm(last, pt);
        setDistanceKm((d) => {
          const nd = d + inc;
          updateCalories(nd);
          onDistanceAdvance(d, nd);
          return nd;
        });
      }
      return next;
    });
  }, [enableAutoPause, updateCalories, onDistanceAdvance, status, isAutoPaused, startTimer, stopAllTimers]);

  const beginSimulation = useCallback(() => {
    // Simulate a gentle path around a starting point
    const start: TrackPoint = { latitude: -23.55052, longitude: -46.633308, timestamp: Date.now() };
    setPath([start]);
    simTimerRef.current = setInterval(() => {
      setPath((prev) => {
        const last = prev[prev.length - 1];
        const bearing = Math.random() * 360;
        const stepMeters = 8 + Math.random() * 6; // ~ 8-14 m per second ~ 5:00-7:00 pace
        const dLat = (stepMeters / 111320) * Math.cos((bearing * Math.PI) / 180);
        const dLon = (stepMeters / (111320 * Math.cos((last.latitude * Math.PI) / 180))) * Math.sin((bearing * Math.PI) / 180);
        const next: TrackPoint = { latitude: last.latitude + dLat, longitude: last.longitude + dLon, timestamp: Date.now() };
        const inc = haversineKm(last, next);
        setDistanceKm((d) => {
          const nd = d + inc;
          updateCalories(nd);
          onDistanceAdvance(d, nd);
          return nd;
        });
        return [...prev, next];
      });
    }, 1000);
  }, [updateCalories, onDistanceAdvance]);

  const drainBackground = useCallback(async () => {
    const id = runIdRef.current; if (!id) return;
    const buffered = await popBufferedPoints(id);
    if (!buffered.length) return;
    buffered.forEach((pt) => handleNewPoint(pt));
  }, [handleNewPoint]);

  const start = useCallback(async () => {
    if (status === 'running') return;
    const rid = Date.now().toString();
    runIdRef.current = rid;

    setStatus('running');
    setElapsedSec(0);
    setDistanceKm(0);
    setCalories(0);
    setHeartRate(150);
    setPath([]);
    setLastMilestoneKm(0);
    splitKmRef.current = 1;
    splitStartSecRef.current = 0;
    splitHrSamplesRef.current = [];
    splitsRef.current = [];

    // ensure Android channel for foreground service
    await ensureRunTrackingChannel();

    startTimer();
    registerBackgroundTask();

    if (ExpoLocation?.requestForegroundPermissionsAsync) {
      try {
        const { status: perm } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (perm !== 'granted') {
          beginSimulation();
        } else {
          // Start with current position
          const current = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy?.High ?? 3 });
          handleNewPoint({ latitude: current.coords.latitude, longitude: current.coords.longitude, timestamp: current.timestamp ?? Date.now() });
          // Watch updates
          watchSubRef.current = await ExpoLocation.watchPositionAsync(
            { accuracy: ExpoLocation.Accuracy?.BestForNavigation ?? 5, timeInterval: 1000, distanceInterval: 4 },
            (loc: any) => {
              handleNewPoint({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, timestamp: loc.timestamp ?? Date.now() });
            }
          );
          // Also start background updates (best effort)
          await startBackground(rid);
          // Periodically drain points captured while background
          bgDrainRef.current = setInterval(drainBackground, 2000);
        }
      } catch (e) {
        // Fallback to simulation if anything goes wrong
        beginSimulation();
      }
    } else {
      // No expo-location available
      beginSimulation();
    }
  }, [status, startTimer, beginSimulation, handleNewPoint, drainBackground]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    setStatus('paused');
    setIsAutoPaused(false);
    autoPauseRef.current.manuallyPaused = true;
    stopAllTimers();
    if (watchSubRef.current?.remove) watchSubRef.current.remove();
    watchSubRef.current = null;
  }, [status, stopAllTimers]);

  const resume = useCallback(async () => {
    if (status !== 'paused') return;
    setStatus('running');
    setIsAutoPaused(false);
    autoPauseRef.current.manuallyPaused = false;
    startTimer();
    // resume watching if possible else keep sim
    if (ExpoLocation?.requestForegroundPermissionsAsync) {
      try {
        const { status: perm } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (perm !== 'granted') {
          if (!simTimerRef.current) beginSimulation();
          return;
        }
        watchSubRef.current = await ExpoLocation.watchPositionAsync(
          { accuracy: ExpoLocation.Accuracy?.BestForNavigation ?? 5, timeInterval: 1000, distanceInterval: 4 },
          (loc: any) => {
            handleNewPoint({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, timestamp: loc.timestamp ?? Date.now() });
          }
        );
        // resume BG drain
        if (!bgDrainRef.current) bgDrainRef.current = setInterval(drainBackground, 2000);
      } catch (e) {
        if (!simTimerRef.current) beginSimulation();
      }
    } else {
      if (!simTimerRef.current) beginSimulation();
    }
  }, [status, startTimer, beginSimulation, handleNewPoint, drainBackground]);

  const finish = useCallback(() => {
    if (status === 'idle' || status === 'finished') return;
    setStatus('finished');
    setIsAutoPaused(false);
    autoPauseRef.current = { belowSince: 0, aboveSince: 0, manuallyPaused: false };
    stopAllTimers();
    if (watchSubRef.current?.remove) watchSubRef.current.remove();
    watchSubRef.current = null;
    stopBackground();
  }, [status, stopAllTimers]);

  useEffect(() => () => {
    stopAllTimers();
    if (watchSubRef.current?.remove) watchSubRef.current.remove();
    stopBackground();
  }, [stopAllTimers]);

  return {
    state: { status, elapsedSec, distanceKm, calories, heartRate, path, paceStr, lastMilestoneKm, isAutoPaused } as TrackerState,
    start,
    pause,
    resume,
    finish,
    // expose splits for saving on finish
    getSplits: () => [...splitsRef.current],
  };
}

export function formatHHMMSS(totalSeconds: number) {
  const hh = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const mm = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const ss = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}