import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { getHistory, getSuggestions } from '@/utils/navigationInsights';
import { rankSuggestions } from '@/utils/mlEngine';
import { getPersonalization, updateFeedback, applyPersonalizationOrder } from '@/utils/personalization';
import { track } from '@/utils/analyticsClient';
import { getModelInfo } from '@/utils/mlRuntime';
import { recordInference } from '@/utils/mlMetrics';

type Props = { userId?: string };

export default function NavSuggestions({ userId }: Props) {
	const router = useRouter();
	const [items, setItems] = useState<string[]>([]);

	useEffect(() => {
		(async () => {
			const [candidates, history, prefs] = await Promise.all([
				getSuggestions(userId, 5),
				getHistory(userId),
				getPersonalization(userId),
			]);
			const last = history[0]?.screenName;
			const now = new Date();
			const t0 = Date.now();
			const ranked = rankSuggestions(candidates, {
				hourOfDay: now.getHours(),
				dayOfWeek: now.getDay(),
				lastVisited: last,
			});
			const info = getModelInfo();
			recordInference(info?.name ?? 'nav_suggester', { latency_ms: Date.now() - t0, success: true }).catch(() => {});
			const personalized = applyPersonalizationOrder(ranked, prefs.weights);
			setItems(personalized.slice(0, 3));
		})().catch(() => setItems([]));
	}, [userId]);

	if (items.length === 0) return null;

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="subtitle">Sugestões rápidas</ThemedText>
			<View style={styles.row}>
				{items.map((name) => (
					<TouchableOpacity
						key={name}
						style={styles.chip}
						onPress={async () => {
							track('nav_suggestion_click', { surface: 'home', key: name }).catch(() => {});
							await updateFeedback(userId, name, 0.05);
							router.push(name as any);
						}}
					>
						<ThemedText>{name}</ThemedText>
					</TouchableOpacity>
				))}
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { gap: 8, marginBottom: 12 },
	row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: 'rgba(127,127,127,0.15)' },
});

