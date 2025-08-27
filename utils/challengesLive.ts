// Uses existing backend endpoints to fetch/join challenges, providing a simple live updater

export async function fetchChallenges(scope: string = 'global') {
	const res = await fetch(`/challenges?scope=${encodeURIComponent(scope)}`);
	if (!res.ok) throw new Error('failed to fetch challenges');
	return res.json();
}

export async function joinChallenge(id: string) {
	const res = await fetch(`/challenges/${encodeURIComponent(id)}/join`, { method: 'POST' });
	if (!res.ok) throw new Error('failed to join');
	return res.json();
}

export function startChallengesPolling(onUpdate: (list: any[]) => void, intervalMs: number = 15000) {
	let stopped = false;
	async function tick() {
		try {
			const list = await fetchChallenges('live');
			onUpdate(list);
		} catch {}
		if (!stopped) setTimeout(tick, intervalMs);
	}
	tick();
	return () => { stopped = true };
}

