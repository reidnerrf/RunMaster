import { getModelConfig, loadLocalModel, scoreWithLocalModel, getModelInfo } from './mlRuntime';
import { getHistogram } from './timePredictor';
import { getHealthSignals } from './healthFeatures';
import { track } from './analyticsClient';

export async function predictTimeWindowOnnx(): Promise<{ startHour: number; endHour: number } | null> {
	const cfg = await getModelConfig();
	if (!cfg) return null;
	const ok = await loadLocalModel(cfg.uri);
	if (!ok) return null;
	const hist = await getHistogram();
	const health = getHealthSignals();
	const X = [[
		(hist[6] ?? 0) / 10,
		(hist[18] ?? 0) / 10,
		(health.weeklySleepAvgMin ?? 0) / 480,
		(health.lastNightSleepMin ?? 0) / 480,
	]];
	const t0 = Date.now();
	const scores = await scoreWithLocalModel(['morning', 'evening'], X);
	track('ml_inference', { model_name: getModelInfo()?.name ?? cfg.name, latency_ms: Date.now() - t0, success: !!scores }).catch(() => {});
	if (!scores) return null;
	return (scores[0] ?? 0) >= (scores[1] ?? 0) ? { startHour: 6, endHour: 8 } : { startHour: 18, endHour: 20 };
}

