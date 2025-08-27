import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'run_time_histogram';

// Maintains a histogram of runs per hour (0-23)
export async function recordRunAtHour(hour: number) {
	const hist = await getHistogram();
	hist[hour] = (hist[hour] ?? 0) + 1;
	await AsyncStorage.setItem(KEY, JSON.stringify(hist));
}

export async function getHistogram(): Promise<Record<number, number>> {
	const raw = await AsyncStorage.getItem(KEY);
	return raw ? JSON.parse(raw) : {};
}

export async function predictNextWindow(now: Date = new Date()): Promise<{ startHour: number; endHour: number } | null> {
	const hist = await getHistogram();
	const entries = Object.entries(hist).map(([h, c]) => ({ h: Number(h), c }));
	if (entries.length === 0) return null;
	entries.sort((a, b) => b.c - a.c);
	const best = entries[0].h;
	// Suggest a 2-hour window around best hour nearest to current time
	const start = best;
	const end = (best + 2) % 24;
	return { startHour: start, endHour: end };
}

