import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { startChallengesPolling, joinChallenge } from '@/utils/challengesLive';
import { track } from '@/utils/analyticsClient';

export default function ChallengesScreen() {
	const [items, setItems] = useState<any[]>([]);

	useEffect(() => {
		const stop = startChallengesPolling(setItems, 15000);
		return () => stop();
	}, []);

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Desafios ao vivo</ThemedText>
			<FlatList
				data={items}
				keyExtractor={(i) => i.id}
				renderItem={({ item }) => (
					<ThemedView style={styles.card}>
						<ThemedText type="subtitle">{item.name}</ThemedText>
						<ThemedText>{item.description}</ThemedText>
						<ThemedText>Participantes: {item.participants}</ThemedText>
						<TouchableOpacity
							style={styles.btn}
							onPress={async () => { await joinChallenge(item.id); track('challenge_joined', { challenge_id: item.id, type: item.type }).catch(() => {}); }}
						>
							<ThemedText>Entrar</ThemedText>
						</TouchableOpacity>
					</ThemedView>
				)}
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 8 },
	card: { padding: 12, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)', gap: 6, marginTop: 8 },
	btn: { marginTop: 6, backgroundColor: 'rgba(127,127,127,0.2)', padding: 8, borderRadius: 8, alignItems: 'center' },
});

