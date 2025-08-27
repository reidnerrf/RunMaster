import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

type Props = { title: string; description: string; badgeUri?: string };

export default function ShareAchievement({ title, description, badgeUri }: Props) {
	async function share() {
		// Placeholder: share a simple text file (replace with snapshot capture)
		const path = FileSystem.cacheDirectory + 'achievement.txt';
		await FileSystem.writeAsStringAsync(path, `${title}\n${description}`);
		if (await Sharing.isAvailableAsync()) {
			await Sharing.shareAsync(path);
		}
	}

	return (
		<ThemedView style={styles.card}>
			<View style={styles.row}>
				{badgeUri ? <Image source={{ uri: badgeUri }} style={{ width: 48, height: 48 }} /> : null}
				<View style={{ flex: 1 }}>
					<ThemedText type="subtitle">{title}</ThemedText>
					<ThemedText>{description}</ThemedText>
				</View>
			</View>
			<TouchableOpacity style={styles.btn} onPress={share}>
				<ThemedText>Compartilhar</ThemedText>
			</TouchableOpacity>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	card: { padding: 12, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)', gap: 6, marginTop: 8 },
	row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
	btn: { marginTop: 6, backgroundColor: 'rgba(127,127,127,0.2)', padding: 8, borderRadius: 8, alignItems: 'center' },
});

