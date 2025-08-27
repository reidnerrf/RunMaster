export async function connectHealth(platform: 'apple' | 'google') {
	console.log('[health] connect', platform);
	return { ok: true };
}

export async function readLatestMetrics() {
	console.log('[health] read metrics');
	return { restingHr: 58, vo2max: 48.2 };
}