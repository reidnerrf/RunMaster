import { WorkoutSession } from '@/store/slices/workoutSlice';
import { getModelConfig, loadLocalModel, getModelInfo, scoreWithLocalModel } from './mlRuntime';
import { getHealthSignals } from './healthFeatures';
import { track } from './analyticsClient';

function buildFeatures(history: WorkoutSession[]): number[][] {
	// Features: [acute_km, chronic_km, recent_avg_speed, recent_sessions]
	const now = Date.now();
	const day = 24 * 60 * 60 * 1000;
	const last7 = history.filter((w) => now - new Date(w.startTime).getTime() <= 7 * day);
	const last28 = history.filter((w) => now - new Date(w.startTime).getTime() <= 28 * day);
	const acute = last7.reduce((a, w) => a + (w.distance ?? 0) / 1000, 0);
	const chronic = last28.reduce((a, w) => a + (w.distance ?? 0) / 1000, 0);
	const speeds = last7.map((w) => w.speed ?? 0).filter((s) => s > 0);
	const recentAvgSpeed = speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
	const health = getHealthSignals();
	const sleepLast = (health.lastNightSleepMin ?? 0) / 480; // normalize to ~8h
	const sleepAvg = (health.weeklySleepAvgMin ?? 0) / 480;
	return [[acute, chronic / 4, recentAvgSpeed, last7.length, sleepLast, sleepAvg]];
}

export async function inferInjuryRiskOnnx(history: WorkoutSession[]): Promise<number | null> {
	const cfg = await getModelConfig();
	if (!cfg) return null;
	const loaded = await loadLocalModel(cfg.uri);
	const t0 = Date.now();
	const feats = buildFeatures(history);
	const scores = await scoreWithLocalModel(['risk'], feats);
	const latency = Date.now() - t0;
	track('ml_inference', { model_name: getModelInfo()?.name ?? cfg.name, latency_ms: latency, success: !!scores }).catch(() => {});
	if (!scores) return null;
	return Math.max(0, Math.min(1, scores[0]));
}

