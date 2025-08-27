import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export type NavigationEvent = {
	screenName: string;
	paramsHash?: string;
	timestamp: number;
};

const HISTORY_KEY_PREFIX = 'navigation_history:';
const MAX_HISTORY = 50;

export async function recordScreenView(userId: string | undefined, event: NavigationEvent): Promise<void> {
	try {
		const key = `${HISTORY_KEY_PREFIX}${userId ?? 'anon'}`;
		const raw = await AsyncStorage.getItem(key);
		const list: NavigationEvent[] = raw ? JSON.parse(raw) : [];
		const next = [event, ...list].slice(0, MAX_HISTORY);
		await AsyncStorage.setItem(key, JSON.stringify(next));
	} catch {}
}

export async function getSuggestions(userId: string | undefined, limit: number = 3): Promise<string[]> {
	const key = `${HISTORY_KEY_PREFIX}${userId ?? 'anon'}`;
	const raw = await AsyncStorage.getItem(key);
	const list: NavigationEvent[] = raw ? JSON.parse(raw) : [];
	const counts = new Map<string, number>();
	for (const e of list) counts.set(e.screenName, (counts.get(e.screenName) ?? 0) + 1);
	return Array.from(counts.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit * 2)
		.map(([name]) => name);
}

export async function getHistory(userId: string | undefined): Promise<NavigationEvent[]> {
	const key = `${HISTORY_KEY_PREFIX}${userId ?? 'anon'}`;
	const raw = await AsyncStorage.getItem(key);
	return raw ? (JSON.parse(raw) as NavigationEvent[]) : [];
}

const OFFLINE_QUEUE_KEY_PREFIX = 'offline_queue:';

export type OfflineOp = {
	opId: string;
	entity: string;
	op: 'create' | 'update' | 'delete';
	payload: unknown;
	ts: number;
};

export async function enqueueOfflineOp(userId: string | undefined, op: OfflineOp): Promise<void> {
	const key = `${OFFLINE_QUEUE_KEY_PREFIX}${userId ?? 'anon'}`;
	const raw = await AsyncStorage.getItem(key);
	const list: OfflineOp[] = raw ? JSON.parse(raw) : [];
	await AsyncStorage.setItem(key, JSON.stringify([...list, op]));
}

export async function flushOfflineQueue(userId: string | undefined, sender: (op: OfflineOp) => Promise<boolean>): Promise<{ total: number; success: number; failed: number; }>{
	const key = `${OFFLINE_QUEUE_KEY_PREFIX}${userId ?? 'anon'}`;
	const raw = await AsyncStorage.getItem(key);
	const list: OfflineOp[] = raw ? JSON.parse(raw) : [];
	if (list.length === 0) return { total: 0, success: 0, failed: 0 };

	const state = await NetInfo.fetch();
	if (!state.isConnected) return { total: list.length, success: 0, failed: list.length };

	let success = 0;
	const remaining: OfflineOp[] = [];
	for (const op of list) {
		try {
			const ok = await sender(op);
			if (ok) success += 1; else remaining.push(op);
		} catch {
			remaining.push(op);
		}
	}
	await AsyncStorage.setItem(key, JSON.stringify(remaining));
	return { total: list.length, success, failed: remaining.length };
}

