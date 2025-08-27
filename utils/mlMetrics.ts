import AsyncStorage from '@react-native-async-storage/async-storage';
import { track } from './analyticsClient';

const KEY = 'ml_metrics';

type Sample = { latency_ms: number; success: boolean };

type Bucket = {
	count: number;
	success: number;
	samples: number[]; // store limited latencies
};

type Metrics = Record<string, Bucket>; // modelName → bucket

async function read(): Promise<Metrics> {
	const raw = await AsyncStorage.getItem(KEY);
	return raw ? JSON.parse(raw) : {};
}

async function write(m: Metrics): Promise<void> {
	await AsyncStorage.setItem(KEY, JSON.stringify(m));
}

export async function recordInference(modelName: string, s: Sample): Promise<void> {
	const m = await read();
	const b = m[modelName] ?? { count: 0, success: 0, samples: [] };
	b.count += 1;
	if (s.success) b.success += 1;
	if (b.samples.length < 100) b.samples.push(s.latency_ms);
	m[modelName] = b;
	await write(m);
}

export function p95(values: number[]): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const idx = Math.floor(0.95 * (sorted.length - 1));
	return sorted[idx];
}

export async function flushMetrics(): Promise<void> {
	const m = await read();
	for (const [name, b] of Object.entries(m)) {
		if (b.count === 0) continue;
		track('ml_metrics_flush', {
			model_name: name,
			count: b.count,
			success: b.success,
			p95_ms: p95(b.samples),
		}).catch(() => {});
	}
	await write({});
}

export function startMetricsFlusher(intervalMs: number = 60000): () => void {
	const id = setInterval(() => {
		flushMetrics().catch(() => {});
	}, intervalMs);
	return () => clearInterval(id);
}

