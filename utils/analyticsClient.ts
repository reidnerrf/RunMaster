import AsyncStorage from '@react-native-async-storage/async-storage';

type EventPayload = Record<string, unknown>;

const QUEUE_KEY = 'analytics_queue';

async function getQueue(): Promise<EventPayload[]> {
	const raw = await AsyncStorage.getItem(QUEUE_KEY);
	return raw ? JSON.parse(raw) : [];
}

async function setQueue(q: EventPayload[]): Promise<void> {
	await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

export async function track(event: string, props: EventPayload = {}): Promise<void> {
	try {
		const envelope = {
			event_name: event,
			event_version: 1,
			timestamp: new Date().toISOString(),
			...props,
		};
		const q = await getQueue();
		q.push(envelope);
		await setQueue(q);
		// Fire-and-forget flush
		flush().catch(() => {});
	} catch {}
}

export async function flush(): Promise<void> {
	const q = await getQueue();
	if (q.length === 0) return;
	try {
		// Replace with provider SDK integration (Segment/Amplitude/etc.)
		// For now, console to help debug in dev.
		for (const e of q) {
			// eslint-disable-next-line no-console
			console.log('[analytics]', e);
		}
		await setQueue([]);
	} catch {
		// keep queue on failure
	}
}

