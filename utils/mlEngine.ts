export type SuggestionContext = {
	hourOfDay: number;
	dayOfWeek: number; // 0-6
	lastVisited?: string;
	userTier?: 'anon' | 'registered' | 'pro';
};

export function rankSuggestions(candidates: string[], context: SuggestionContext): string[] {
	// Stub de ML on-device: aplica heurísticas simples que simulam um modelo
	const scored = candidates.map((name) => ({ name, score: scoreCandidate(name, context) }));
	scored.sort((a, b) => b.score - a.score);
	return scored.map((s) => s.name);
}

function scoreCandidate(name: string, ctx: SuggestionContext): number {
	let score = 0;
	// Preferir última tela visitada
	if (ctx.lastVisited && name === ctx.lastVisited) score += 1.5;
	// Hora do dia: manhã favorece Home/Run, noite favorece Explore/Stats
	if (ctx.hourOfDay >= 5 && ctx.hourOfDay <= 10 && /run|home|index/i.test(name)) score += 1.2;
	if (ctx.hourOfDay >= 19 && /explore|stats|history/i.test(name)) score += 1.0;
	// Dia da semana: fim de semana mais exploração
	if ((ctx.dayOfWeek === 0 || ctx.dayOfWeek === 6) && /explore|challenge/i.test(name)) score += 0.6;
	// Tier de usuário
	if (ctx.userTier === 'pro') score += 0.2;
	return score;
}

