import * as Storage from './storage';

export type SavedRoute = {
  id: string;
  name: string;
  distance_km: number;
  notes?: string;
  points?: { latitude: number; longitude: number }[];
  elevation?: number[];
  savedAt: number;
  synced?: boolean;
  remoteId?: string;
};

const KEY = 'runmaster_saved_routes_v1';

export async function getRoutes(): Promise<SavedRoute[]> {
  const raw = await Storage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as SavedRoute[]; } catch { return []; }
}

export async function getRouteById(id: string): Promise<SavedRoute | null> {
  const all = await getRoutes();
  return all.find(r => r.id === id) || null;
}

export async function addRoute(r: Omit<SavedRoute, 'id'|'savedAt'>): Promise<SavedRoute[]> {
  const all = await getRoutes();
  const route: SavedRoute = { id: Date.now().toString(), savedAt: Date.now(), synced: false, ...r };
  const next = [route, ...all];
  await Storage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function updateRouteLocal(id: string, patch: Partial<SavedRoute>) {
  const all = await getRoutes();
  const next = all.map(r => r.id === id ? { ...r, ...patch, synced: patch.remoteId ? r.synced : false } : r);
  await Storage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function clearRoutes() { await Storage.removeItem(KEY); }

export async function setRoutes(routes: SavedRoute[]) {
  await Storage.setItem(KEY, JSON.stringify(routes));
}

export async function markRouteSynced(localId: string, remoteId: string) {
  const all = await getRoutes();
  const next = all.map(r => r.id === localId ? { ...r, synced: true, remoteId } : r);
  await Storage.setItem(KEY, JSON.stringify(next));
}

export async function deleteRouteLocal(id: string) {
  const all = await getRoutes();
  const next = all.filter(r => r.id !== id);
  await Storage.setItem(KEY, JSON.stringify(next));
}

export async function insertRouteAt(route: SavedRoute, index: number) {
  const all = await getRoutes();
  const clamped = Math.max(0, Math.min(index, all.length));
  const next = [...all.slice(0, clamped), route, ...all.slice(clamped)];
  await Storage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function getUnsyncedRoutes() {
  const all = await getRoutes();
  return all.filter(r => !r.synced);
}