export type ApiRun = {
  _id?: string;
  userId: string;
  startedAt: number;
  durationSec: number;
  distanceKm: number;
  calories: number;
  avgPace: string;
  path?: { latitude: number; longitude: number; timestamp: number }[];
  splits?: { km: number; paceSec: number; avgHr?: number }[];
  createdAt?: number;
  updatedAt?: number;
};

export type ApiRoute = {
  _id?: string;
  userId: string;
  name: string;
  distanceKm: number;
  notes?: string;
  points?: { latitude: number; longitude: number }[];
  elevation?: number[]; // mock profile values per point
};

export type ApiLeaderboardRow = { user: string; distanceKm: number; city?: string; routeId?: string };

export type ApiChallenge = {
  _id?: string;
  title: string;
  scope: string; // e.g., 'city:Sao Paulo' | 'neighborhood:Pinheiros' | 'route:ROUTE_ID'
  startAt: number;
  endAt: number;
  participants: string[]; // userIds
};

const DEFAULT_BASE_URL = 'http://localhost:3000'; // set via setApiBaseUrl at runtime
let BASE_URL = DEFAULT_BASE_URL;

export function setApiBaseUrl(url: string) { BASE_URL = url; }

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await globalThis.fetch(`${BASE_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async listRuns(userId: string): Promise<ApiRun[]> {
    return http<ApiRun[]>(`/runs?userId=${encodeURIComponent(userId)}`);
  },
  async createRun(payload: ApiRun): Promise<ApiRun> {
    return http<ApiRun>(`/runs`, { method: 'POST', body: JSON.stringify(payload) });
  },
  async updateRun(id: string, payload: Partial<ApiRun>): Promise<ApiRun> {
    return http<ApiRun>(`/runs/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  async deleteRun(id: string): Promise<{ ok: boolean }> {
    return http<{ ok: boolean }>(`/runs/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  // Routes (optional server support)
  async listRoutes(userId: string): Promise<ApiRoute[]> {
    return http<ApiRoute[]>(`/routes?userId=${encodeURIComponent(userId)}`);
  },
  async createRoute(payload: ApiRoute): Promise<ApiRoute> {
    return http<ApiRoute>(`/routes`, { method: 'POST', body: JSON.stringify(payload) });
  },
  async updateRoute(id: string, payload: Partial<ApiRoute>): Promise<ApiRoute> {
    return http<ApiRoute>(`/routes/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  async deleteRoute(id: string): Promise<{ ok: boolean }> {
    return http<{ ok: boolean }>(`/routes/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  // Leaderboard (mock or server-backed)
  async leaderboard(scope: 'city' | 'route' | 'neighborhood', q: { city?: string; routeId?: string; neighborhood?: string }): Promise<ApiLeaderboardRow[]> {
    const qs = Object.entries(q)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    return http<ApiLeaderboardRow[]>(`/leaderboard/${scope}?${qs}`);
  },
  // Challenges
  async listChallenges(scope?: string): Promise<ApiChallenge[]> {
    const qs = scope ? `?scope=${encodeURIComponent(scope)}` : '';
    return http<ApiChallenge[]>(`/challenges${qs}`);
  },
  async createChallenge(payload: ApiChallenge): Promise<ApiChallenge> {
    return http<ApiChallenge>(`/challenges`, { method: 'POST', body: JSON.stringify(payload) });
  },
  async joinChallenge(id: string, userId: string): Promise<{ ok: boolean }> {
    return http<{ ok: boolean }>(`/challenges/${encodeURIComponent(id)}/join`, { method: 'POST', body: JSON.stringify({ userId }) });
  },
  // Export PDF
  async exportRunPdf(id: string): Promise<string> {
    // returns a shareable URL
    return `${BASE_URL}/export/run/${encodeURIComponent(id)}.pdf`;
  },
};

export async function getRemoteConfig(userId?: string, group?: string): Promise<{ flags: Record<string, boolean>; variants: Record<string, string> }> {
	const url = new URL(BASE_URL + '/config');
	if (userId) url.searchParams.set('userId', userId);
	if (group) url.searchParams.set('group', group);
	const res = await fetch(url.toString());
	if (!res.ok) throw new Error('Failed to fetch remote config');
	return res.json();
}