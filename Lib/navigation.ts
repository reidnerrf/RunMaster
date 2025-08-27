let Speech: any = null;
try { Speech = require('expo-speech'); } catch {}

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function initNavigationSdk(provider: 'mapbox' | 'google' = 'mapbox') {
	console.log('[nav] init sdk', provider);
	if (provider === 'mapbox' && !MAPBOX_TOKEN) console.warn('[nav] MAPBOX_TOKEN not set');
	if (provider === 'google' && !GOOGLE_MAPS_API_KEY) console.warn('[nav] GOOGLE_MAPS_API_KEY not set');
}

export async function requestOfflineTiles(region: { north: number; south: number; east: number; west: number }) {
	console.log('[nav] download offline tiles', region);
	return { ok: true };
}

export async function getElevationProfile(points: { latitude: number; longitude: number }[]) {
	console.log('[nav] elevation for', points.length, 'points');
	// Return dummy elevation profile
	return points.map((p, i) => Math.round(10 + Math.sin(i / 8) * 6));
}

export async function startTurnByTurn(route: { name: string; points: { latitude: number; longitude: number }[] }) {
	console.log('[nav] start TBT for', route.name);
	if (Speech) try { Speech.speak('Navegação iniciada. Siga em frente 200 metros.', { language: 'pt-BR' }); } catch {}
	return { ok: true };
}