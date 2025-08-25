import * as Storage from './storage';

export type Split = {
  km: number; // 1-based km index
  paceSec: number; // seconds per km for this split
  avgHr?: number; // average heart rate during this km
};

export type Run = {
  id: string;
  startedAt: number; // epoch ms
  durationSec: number;
  distanceKm: number;
  calories: number;
  avgPace: string; // mm:ss per km
  path?: { latitude: number; longitude: number; timestamp: number }[];
  splits?: Split[]; // per-km splits
  // sync flags
  synced?: boolean;
  remoteId?: string; // id from server when synced
};

const STORAGE_KEY = 'runmaster_runs_v1';

export async function getRuns(): Promise<Run[]> {
  const raw = await Storage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Run[]; } catch { return []; }
}

export async function setRuns(runs: Run[]): Promise<void> {
  await Storage.setItem(STORAGE_KEY, JSON.stringify(runs));
}

export async function addRun(run: Run): Promise<void> {
  const all = await getRuns();
  all.unshift(run);
  await Storage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export async function updateRun(id: string, patch: Partial<Run>): Promise<void> {
  const all = await getRuns();
  const idx = all.findIndex((r) => r.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...patch };
    await Storage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}

export async function clearRuns(): Promise<void> {
  await Storage.removeItem(STORAGE_KEY);
}

export async function summarize(): Promise<{
  totalDistanceKm: number;
  totalDurationSec: number;
  weekDistanceKm: number;
  monthDistanceKm: number;
}> {
  const runs = await getRuns();
  const now = new Date();
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0,0,0,0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  let totalDistanceKm = 0, totalDurationSec = 0, weekDistanceKm = 0, monthDistanceKm = 0;
  for (const r of runs) {
    totalDistanceKm += r.distanceKm;
    totalDurationSec += r.durationSec;
    const d = new Date(r.startedAt);
    if (d >= startOfWeek) weekDistanceKm += r.distanceKm;
    if (d >= startOfMonth) monthDistanceKm += r.distanceKm;
  }
  return { totalDistanceKm, totalDurationSec, weekDistanceKm, monthDistanceKm };
}

// Helpers to translate to API payload
export function toApiRun(userId: string, r: Run) {
  return {
    userId,
    startedAt: r.startedAt,
    durationSec: r.durationSec,
    distanceKm: r.distanceKm,
    calories: r.calories,
    avgPace: r.avgPace,
    path: r.path,
    splits: r.splits,
  };
}