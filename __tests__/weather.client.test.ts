import { getCurrentWeather } from '../utils/weather';

describe('weather client', () => {
  const originalFetch = global.fetch as any;

  beforeEach(() => {
    (global as any).fetch = jest.fn(async () => ({ ok: true, json: async () => ({ ok: true }) }));
  });
  afterEach(() => {
    (global as any).fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('calls API and returns JSON', async () => {
    const res = await getCurrentWeather({ q: 'Test City' });
    expect(res).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

