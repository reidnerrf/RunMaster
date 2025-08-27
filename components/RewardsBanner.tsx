import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { track } from '@/utils/analyticsClient';

type Props = { partner: string; reward: string; onRedeem?: () => void };

export default function RewardsBanner({ partner, reward, onRedeem }: Props) {
	return (
		<ThemedView style={styles.card}>
			<ThemedText type="subtitle">Recompensa disponível</ThemedText>
			<ThemedText>{partner}: {reward}</ThemedText>
			<TouchableOpacity style={styles.btn} onPress={() => { track('reward_redeemed', { reward_id: reward, partner }).catch(() => {}); onRedeem?.(); }}>
				<ThemedText>Resgatar</ThemedText>
			</TouchableOpacity>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	card: { padding: 12, borderRadius: 8, backgroundColor: 'rgba(255,206,0,0.12)', gap: 6, marginTop: 8 },
	btn: { marginTop: 6, backgroundColor: 'rgba(127,127,127,0.2)', padding: 8, borderRadius: 8, alignItems: 'center' },
});

