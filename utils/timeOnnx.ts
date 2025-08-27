import { getModelConfig, loadLocalModel, scoreWithLocalModel, getModelInfo } from './mlRuntime';
import { getHistogram } from './timePredictor';
import { getHealthSignals } from './healthFeatures';
import { track } from './analyticsClient';
import { getWeatherForecast } from './weatherService';

export async function predictTimeWindowOnnx(): Promise<{ startHour: number; endHour: number } | null> {
	const cfg = await getModelConfig();
	if (!cfg) return null;
	const ok = await loadLocalModel(cfg.uri);
	if (!ok) return null;
	const hist = await getHistogram();
	const health = getHealthSignals();
	const forecast = await getWeatherForecast();
	const mTemp = normalizeTemp(forecast?.[0]?.temperature?.day);
	const eTemp = normalizeTemp(forecast?.[0]?.temperature?.night);
	const X = [[
		(hist[6] ?? 0) / 10,
		(hist[18] ?? 0) / 10,
		(health.weeklySleepAvgMin ?? 0) / 480,
		(health.lastNightSleepMin ?? 0) / 480,
		mTemp,
		eTemp,
	]];
	const t0 = Date.now();
	const scores = await scoreWithLocalModel(['morning', 'evening'], X);
	track('ml_inference', { model_name: getModelInfo()?.name ?? cfg.name, latency_ms: Date.now() - t0, success: !!scores }).catch(() => {});
	if (!scores) return null;
	return (scores[0] ?? 0) >= (scores[1] ?? 0) ? { startHour: 6, endHour: 8 } : { startHour: 18, endHour: 20 };
}

function normalizeTemp(v?: number): number { if (typeof v !== 'number') return 0; return (v - 10) / 25 }

