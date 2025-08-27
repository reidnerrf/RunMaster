import * as Storage from './storage';

export type LiveSession = {
  id: string; // share id
  startedAt: number;
  lastUpdate: number;
  active: boolean;
};

const KEY = 'runmaster_live_session_v1';

export async function getLive(): Promise<LiveSession | null> {
  const raw = await Storage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as LiveSession; } catch { return null; }
}

export async function startLive(): Promise<LiveSession> {
  const s: LiveSession = { id: (Math.random().toString(36).slice(2, 8)).toUpperCase(), startedAt: Date.now(), lastUpdate: Date.now(), active: true };
  await Storage.setItem(KEY, JSON.stringify(s));
  return s;
}

export async function stopLive() {
  const s = await getLive();
  if (!s) return null;
  const next = { ...s, active: false, lastUpdate: Date.now() };
  await Storage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function pingLive() {
  const s = await getLive();
  if (!s || !s.active) return null;
  const next = { ...s, lastUpdate: Date.now() };
  await Storage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function buildShareUrl(id: string) {
  // mock: página pública seria um mini-mapa; aqui só montamos URL de exemplo
  return `https://live.runmaster.app/${id}`;
}