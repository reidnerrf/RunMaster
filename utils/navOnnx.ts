import { getModelConfig, loadLocalModel, scoreWithLocalModel, getModelInfo } from './mlRuntime';
import { track } from './analyticsClient';

export async function rankWithOnnx(candidates: string[], features: number[][]): Promise<number[] | null> {
	const cfg = await getModelConfig();
	if (!cfg) return null;
	const ok = await loadLocalModel(cfg.uri);
	if (!ok) return null;
	const t0 = Date.now();
	const scores = await scoreWithLocalModel(candidates, features);
	track('ml_inference', { model_name: getModelInfo()?.name ?? cfg.name, latency_ms: Date.now() - t0, success: !!scores }).catch(() => {});
	return scores;
}

