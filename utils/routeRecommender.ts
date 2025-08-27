// Stub de recomendação de rota por proximidade/terreno preferido
export type Route = { id: string; name: string; elevationGainM?: number; surface?: 'asphalt' | 'trail' };

export function recommendRoute(candidates: Route[], prefs?: { preferTrail?: boolean; maxElevationM?: number }): Route | null {
	if (candidates.length === 0) return null;
	let list = candidates;
	if (prefs?.preferTrail) list = list.filter((r) => r.surface === 'trail') || list;
	if (typeof prefs?.maxElevationM === 'number') list = list.filter((r) => (r.elevationGainM ?? 0) <= prefs!.maxElevationM!) || list;
	return list[0] ?? candidates[0];
}

