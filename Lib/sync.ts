import { api } from './api';
import { getRuns, setRuns, Run, toApiRun } from './runStore';
import { getUnsyncedRoutes, markRouteSynced, getRoutes, setRoutes, SavedRoute } from './routeStore';

export async function pushUnsyncedRuns(userId: string) {
  const local = await getRuns();
  const unsynced = local.filter((r) => !r.synced);
  if (unsynced.length === 0) return { pushed: 0 };
  let pushed = 0;
  const next: Run[] = [...local];
  for (const r of unsynced) {
    try {
      const created = await api.createRun({ ...toApiRun(userId, r) });
      const idx = next.findIndex((x) => x.id === r.id);
      if (idx >= 0) next[idx] = { ...next[idx], synced: true, remoteId: created._id };
      pushed++;
    } catch (e) {
      // Stop on first error to avoid rate issues
      break;
    }
  }
  await setRuns(next);
  return { pushed };
}

export async function pullServerRuns(userId: string) {
  // Optional: merge from server to local if needed
  try {
    const server = await api.listRuns(userId);
    // This function could implement richer merging; for simplicity we won't overwrite local unsynced
    const local = await getRuns();
    const localRemoteIds = new Set(local.map((r) => r.remoteId).filter(Boolean) as string[]);
    const merged: Run[] = [...local];
    for (const sr of server) {
      if (sr._id && !localRemoteIds.has(sr._id)) {
        merged.push({
          id: `remote_${sr._id}`,
          remoteId: sr._id,
          startedAt: sr.startedAt,
          durationSec: sr.durationSec,
          distanceKm: sr.distanceKm,
          calories: sr.calories,
          avgPace: sr.avgPace,
          path: sr.path,
          splits: sr.splits as any,
          synced: true,
        });
      }
    }
    await setRuns(merged.sort((a, b) => b.startedAt - a.startedAt));
    return { pulled: server.length };
  } catch (e) {
    return { pulled: 0 };
  }
}

export async function syncRoutes(userId: string) {
  try {
    const unsynced = await getUnsyncedRoutes();
    for (const r of unsynced) {
      try {
        const created = await api.createRoute({ userId, name: r.name, distanceKm: r.distance_km, notes: r.notes, points: r.points, elevation: r.elevation });
        await markRouteSynced(r.id, (created as any)._id || created.name);
      } catch {}
    }
    // Pull
    const remote = await api.listRoutes(userId).catch(() => []);
    if (remote && remote.length) {
      // Merge by remoteId/name
      const local = await getRoutes();
      const byRemote = new Map(local.filter(l => l.remoteId).map(l => [l.remoteId!, l]));
      const merged: SavedRoute[] = [
        ...local,
        ...remote
          .filter(rr => !byRemote.has((rr as any)._id))
          .map(rr => ({ id: Date.now().toString() + Math.random(), savedAt: Date.now(), name: rr.name, distance_km: rr.distanceKm, notes: rr.notes, points: rr.points, elevation: rr.elevation, synced: true, remoteId: (rr as any)._id }))
      ];
      await setRoutes(merged);
    }
    return { ok: true };
  } catch (e) {
    return { ok: false };
  }
}