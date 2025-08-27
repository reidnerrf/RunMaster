import AsyncStorage from '@react-native-async-storage/async-storage';

const PREF_KEY = 'ml_prefs:';

export type PersonalizationState = {
	weights: Record<string, number>; // per route/screen boost
};

export async function getPersonalization(userId?: string): Promise<PersonalizationState> {
	const raw = await AsyncStorage.getItem(PREF_KEY + (userId ?? 'anon'));
	return raw ? JSON.parse(raw) : { weights: {} };
}

export async function updateFeedback(userId: string | undefined, key: string, delta: number): Promise<void> {
	const state = await getPersonalization(userId);
	state.weights[key] = (state.weights[key] ?? 0) + delta;
	await AsyncStorage.setItem(PREF_KEY + (userId ?? 'anon'), JSON.stringify(state));
}

export function applyPersonalizationOrder(keys: string[], weights: Record<string, number>): string[] {
	return [...keys].sort((a, b) => (weights[b] ?? 0) - (weights[a] ?? 0));
}

