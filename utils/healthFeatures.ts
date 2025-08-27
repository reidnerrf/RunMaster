import { store } from '@/store';

export type HealthSignals = {
	avgRestingHR?: number;
	lastNightSleepMin?: number;
	weeklySleepAvgMin?: number;
};

export function getHealthSignals(): HealthSignals {
	const state = store.getState() as any;
	const wellness = state.wellness as any;
	const rest = wellness?.restHistory ?? [];
	const sleeps = rest.filter((r: any) => r.type === 'sleep');
	const lastNight = sleeps.slice(-1)[0];
	const lastNightSleepMin = lastNight?.duration ?? undefined;
	const weekly = sleeps.slice(-7);
	const weeklySleepAvgMin = weekly.length ? Math.round(weekly.reduce((a: number, r: any) => a + (r.duration ?? 0), 0) / weekly.length) : undefined;
	// HRV/Resting HR would come from HealthKit/Google Fit; placeholder undefined for now
	return { lastNightSleepMin, weeklySleepAvgMin };
}

