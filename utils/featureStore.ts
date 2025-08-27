import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = 'features:';

export type FeatureVector = number[];

export async function getFeatures(key: string): Promise<FeatureVector | null> {
	const raw = await AsyncStorage.getItem(KEY_PREFIX + key);
	return raw ? (JSON.parse(raw) as FeatureVector) : null;
}

export async function setFeatures(key: string, v: FeatureVector): Promise<void> {
	await AsyncStorage.setItem(KEY_PREFIX + key, JSON.stringify(v));
}

export function buildNavFeatures(params: {
	hourOfDay: number;
	dayOfWeek: number;
	frequencyScore: number; // 0..1
	isWeekend: boolean;
}): FeatureVector {
	return [
		params.hourOfDay / 24,
		params.dayOfWeek / 6,
		params.frequencyScore,
		params.isWeekend ? 1 : 0,
	];
}

