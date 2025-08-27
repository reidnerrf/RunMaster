import { getModelConfig, loadLocalModel, scoreWithLocalModel, getModelInfo } from './mlRuntime';
import { track } from './analyticsClient';

export type RouteFeat = { elevationGainM?: number; distanceKm?: number; surfaceTrail?: number };

export async function scoreRoutesOnnx(routeIds: string[], feats: RouteFeat[]): Promise<number[] | null> {
	const cfg = await getModelConfig();
	if (!cfg) return null;
	const ok = await loadLocalModel(cfg.uri);
	if (!ok) return null;
	const X = feats.map((f) => [
		(f.elevationGainM ?? 0) / 300,
		(f.distanceKm ?? 0) / 10,
		f.surfaceTrail ?? 0,
	]);
	const t0 = Date.now();
	const scores = await scoreWithLocalModel(routeIds, X);
	track('ml_inference', { model_name: getModelInfo()?.name ?? cfg.name, latency_ms: Date.now() - t0, success: !!scores }).catch(() => {});
	return scores;
}

