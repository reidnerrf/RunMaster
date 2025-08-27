// Background tracking utilities for real location updates while app is in background.
// Works only if expo-task-manager and expo-location are available at runtime.

import * as Storage from './storage';

export type BgPoint = { latitude: number; longitude: number; timestamp: number };
export const TASK_NAME = 'RUNMASTER_LOCATION_UPDATES';

let TaskManager: any = null;
let Location: any = null;
try { TaskManager = require('expo-task-manager'); } catch {}
try { Location = require('expo-location'); } catch {}

function bufferKey(runId: string) { return `runmaster_bg_buf_${runId}`; }

async function appendPoints(runId: string, pts: BgPoint[]) {
  const key = bufferKey(runId);
  const raw = await Storage.getItem(key);
  const arr: BgPoint[] = raw ? (JSON.parse(raw) as BgPoint[]) : [];
  arr.push(...pts);
  await Storage.setItem(key, JSON.stringify(arr));
}

export async function popBufferedPoints(runId: string): Promise<BgPoint[]> {
  const key = bufferKey(runId);
  const raw = await Storage.getItem(key);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as BgPoint[];
    await Storage.removeItem(key);
    return arr;
  } catch {
    await Storage.removeItem(key);
    return [];
  }
}

let registered = false;
export function registerBackgroundTask() {
  if (registered) return;
  if (!TaskManager || !Location) return;
  try {
    TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
      if (error) return;
      const { locations, taskName } = (data || {}) as any;
      // The runId is not directly available; we use a global current id in storage.
      const runId = await Storage.getItem('runmaster_current_run_id');
      if (!runId) return;
      if (locations && locations.length) {
        const pts: BgPoint[] = locations.map((loc: any) => ({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, timestamp: loc.timestamp ?? Date.now() }));
        await appendPoints(runId, pts);
      }
    });
    registered = true;
  } catch {
    // ignore
  }
}

export async function startBackground(runId: string) {
  if (!Location || !TaskManager) return { ok: false, reason: 'modules_unavailable' } as const;
  try {
    await Storage.setItem('runmaster_current_run_id', runId);
    const fg = await Location.requestForegroundPermissionsAsync();
    if (fg.status !== 'granted') return { ok: false, reason: 'no_foreground_perm' } as const;
    const bg = await Location.requestBackgroundPermissionsAsync?.();
    if (bg && bg.status !== 'granted') return { ok: false, reason: 'no_background_perm' } as const;

    const isRegistered = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
    if (!isRegistered) {
      await Location.startLocationUpdatesAsync(TASK_NAME, {
        accuracy: Location.Accuracy?.BestForNavigation ?? 5,
        timeInterval: 1000,
        distanceInterval: 4,
        showsBackgroundLocationIndicator: true,
        pausesUpdatesAutomatically: false,
        foregroundService: {
          notificationTitle: 'Pulse',
          notificationBody: 'Rastreamento de corrida ativo',
        },
      });
    }
    return { ok: true } as const;
  } catch (e) {
    return { ok: false, reason: 'start_failed' } as const;
  }
}

export async function stopBackground() {
  if (!Location) return;
  try {
    const isRegistered = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
    if (isRegistered) await Location.stopLocationUpdatesAsync(TASK_NAME);
  } catch {}
  await Storage.removeItem('runmaster_current_run_id');
}

export async function sendWatchCommand(cmd: 'start' | 'pause' | 'resume' | 'finish', payload?: any) {
	console.log('[watch] command', cmd, payload || {});
	return { ok: true };
}

export async function updateDailyGoalWidget(km: number) {
	console.log('[widget] update daily goal', km);
	return { ok: true };
}