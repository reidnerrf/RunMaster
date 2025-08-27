import { acwr, getRecoveryAdvice } from '../Lib/analysis';

const now = Date.now();

describe('analysis', () => {
	it('computes ACWR and returns recovery advice', () => {
		const runs = [
			{ id: '1', startedAt: now - 2 * 24 * 3600 * 1000, distanceKm: 10 } as any,
			{ id: '2', startedAt: now - 9 * 24 * 3600 * 1000, distanceKm: 45 } as any,
		];
		const r = acwr(runs, now);
		expect(r).toBeGreaterThan(0);
		const latest = runs[0] as any;
		const adv = getRecoveryAdvice(runs as any, latest);
		expect(adv.messages.length).toBeGreaterThan(0);
	});
});