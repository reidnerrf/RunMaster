import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper to reset module and get fresh instance each time
function loadAI() {
  jest.resetModules();
  // Ensure mocks are in place
  (global as any).fetch = jest.fn();
  // Use require instead of dynamic import to avoid vm modules
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('../Lib/openrouter-ai');
  return mod as typeof import('../Lib/openrouter-ai');
}

function mockOpenRouterResponse(content: string) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => ({
      id: 'test',
      object: 'chat.completion',
      created: Date.now(),
      model: 'z-ai/glm-4.5-air:free',
      choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 }
    })
  } as any;
}

describe('OpenRouter AI Service', () => {
  beforeEach(async () => {
    // Clear storage and fetch calls
    await AsyncStorage.clear();
    (global as any).fetch && ((global as any).fetch as jest.Mock).mockReset();
  });

  test('chat returns content and caches subsequent identical request', async () => {
    const { openRouterAI } = loadAI();

    // First call -> network hit
    ((global as any).fetch as jest.Mock).mockResolvedValueOnce(
      mockOpenRouterResponse('Olá, corredor!')
    );

    const messages = [
      { role: 'user', content: 'Diga olá' } as const
    ];
    const first = await openRouterAI.chat(messages as any);
    expect(first).toContain('Olá');
    expect((global as any).fetch).toHaveBeenCalledTimes(1);

    // Second call with same payload -> served from cache (no fetch)
    const second = await openRouterAI.chat(messages as any);
    expect(second).toEqual(first);
    expect((global as any).fetch).toHaveBeenCalledTimes(1);
  });

  test('chat inflight deduplication triggers single network request for concurrent calls', async () => {
    const { openRouterAI } = loadAI();

    let resolveFetch: (v: any) => void = () => {};
    const fetchPromise = new Promise<any>(res => { resolveFetch = res; });
    ((global as any).fetch as jest.Mock).mockReturnValue(fetchPromise);

    const messages = [
      { role: 'user', content: 'Sugira treinos' } as const
    ];

    const p1 = openRouterAI.chat(messages as any);
    const p2 = openRouterAI.chat(messages as any);

    // Allow microtasks to run so the fetch call is scheduled
    await new Promise<void>(resolve => queueMicrotask(() => resolve()));
    // Only one network call should be made
    expect((global as any).fetch).toHaveBeenCalledTimes(1);

    // Resolve network
    resolveFetch(mockOpenRouterResponse('Plano de treino A/B'));

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toContain('Plano');
    expect(r2).toEqual(r1);
  });

  test('suggestRoutes returns structured routes using AI response', async () => {
    const { openRouterAI } = loadAI();
    ((global as any).fetch as jest.Mock).mockResolvedValue(
      mockOpenRouterResponse('Rota 1: Parque; Rota 2: Avenida')
    );

    const result = await openRouterAI.suggestRoutes({
      location: { lat: -23.55, lon: -46.63 },
      distance_preference_km: 5,
      difficulty: 'moderate',
      weather_conditions: { temperature: 22 }
    } as any);

    expect(result).toHaveProperty('routes');
    expect(Array.isArray(result.routes)).toBe(true);
    expect(result.routes.length).toBeGreaterThan(0);
    expect(result).toHaveProperty('aiReasoning');
  });
});

