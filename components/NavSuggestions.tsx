import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { getSuggestions } from '@/utils/navigationInsights';

type Props = { userId?: string };

export default function NavSuggestions({ userId }: Props) {
	const router = useRouter();
	const [items, setItems] = useState<string[]>([]);

	useEffect(() => {
		getSuggestions(userId).then(setItems).catch(() => setItems([]));
	}, [userId]);

	if (items.length === 0) return null;

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="subtitle">Sugestões rápidas</ThemedText>
			<View style={styles.row}>
				{items.map((name) => (
					<TouchableOpacity key={name} style={styles.chip} onPress={() => router.push(name as any)}>
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

