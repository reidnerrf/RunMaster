export type AISuggestions = {
  route: {
    name: string;
    distance_km: number;
    difficulty: 'easy' | 'moderate' | 'hard';
    notes: string[];
  }[];
  music: {
    mood: string;
    bpm_range: [number, number];
    playlist_names: string[];
  };
  climate: {
    summary: string;
    temperature_c: number;
    precipitation_chance: number; // 0..1
    air_quality: 'good' | 'moderate' | 'bad';
  };
  pacing: {
    target_min_per_km: string; // e.g. "5:30"
    warmup_minutes: number;
    intervals?: string;
    tip: string;
  };
};

export async function suggestPlan(input: { city?: string; goal?: 'easy' | 'tempo' | 'long' | 'intervals'; recentPace?: string; distancePreferenceKm?: number; }): Promise<AISuggestions> {
  const body = {
    messages: [
      { role: 'system', content: 'Você é um coach de corrida que sugere rotas, músicas e pacing de forma concisa. Responda em JSON.' },
      { role: 'user', content: `Cidade: ${input.city ?? 'desconhecida'}; Meta: ${input.goal ?? 'easy'}; Pace recente: ${input.recentPace ?? '5:30'}; Distância preferida: ${input.distancePreferenceKm ?? 5}km.` },
    ],
    schema: {
      type: 'object',
      properties: {
        route: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              distance_km: { type: 'number' },
              difficulty: { type: 'string', enum: ['easy','moderate','hard'] },
              notes: { type: 'array', items: { type: 'string' } },
            }, required: ['name','distance_km','difficulty','notes']
          },
          minItems: 3
        },
        music: {
          type: 'object',
          properties: {
            mood: { type: 'string' },
            bpm_range: { type: 'array', items: { type: 'number' }, minItems: 2, maxItems: 2 },
            playlist_names: { type: 'array', items: { type: 'string' }, minItems: 3 },
          }, required: ['mood','bpm_range','playlist_names']
        },
        climate: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            temperature_c: { type: 'number' },
            precipitation_chance: { type: 'number' },
            air_quality: { type: 'string', enum: ['good','moderate','bad'] },
          }, required: ['summary','temperature_c','precipitation_chance','air_quality']
        },
        pacing: {
          type: 'object',
          properties: {
            target_min_per_km: { type: 'string' },
            warmup_minutes: { type: 'number' },
            intervals: { type: 'string' },
            tip: { type: 'string' },
          }, required: ['target_min_per_km','warmup_minutes','tip']
        }
      }, required: ['route','music','climate','pacing']
    }
  } as const;

  try {
    const res = await globalThis.fetch('https://api.a0.dev/ai/llm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json();
    if (json?.schema_data) return json.schema_data as AISuggestions;
  } catch (e) {
    // swallow, fallback below
  }

  // Fallback deterministic suggestion
  return {
    route: [
      { name: 'Parque Central Loop', distance_km: input.distancePreferenceKm ?? 5, difficulty: 'easy', notes: ['Plano', 'Bem iluminado', 'Pontos de água'] },
      { name: 'Beira-Rio Sprint', distance_km: 3, difficulty: 'moderate', notes: ['Ritmo', 'Vento moderado'] },
      { name: 'Colinas Desafio', distance_km: 8, difficulty: 'hard', notes: ['Subidas', 'Pouca sombra'] },
    ],
    music: { mood: 'motivacional', bpm_range: [150, 170], playlist_names: ['Sprint Boost', 'Flow Runner', 'Sunrise Pace'] },
    climate: { summary: 'Céu limpo com vento leve', temperature_c: 24, precipitation_chance: 0.1, air_quality: 'good' },
    pacing: { target_min_per_km: input.recentPace ?? '5:30', warmup_minutes: 8, intervals: input.goal === 'intervals' ? '5x(3min forte/2min leve)' : undefined, tip: 'Mantenha a cadência estável e respiração ritmada.' }
  };
}