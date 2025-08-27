import React, { useMemo } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAppSelector } from '@/store/hooks';
import { estimateInjuryRisk } from '@/utils/injuryRisk';
import { StyleSheet } from 'react-native';

export default function InjuryRiskCard() {
	const history = useAppSelector((s) => (s as any).workout?.history ?? []);
	const risk = useMemo(() => estimateInjuryRisk(history), [history]);
	if (!history || history.length === 0) return null;
	return (
		<ThemedView style={[styles.card, risk.level === 'high' ? styles.high : risk.level === 'moderate' ? styles.moderate : styles.low]}>
			<ThemedText type="subtitle">Risco de Lesão: {risk.level}</ThemedText>
			<ThemedText>Score: {(risk.score * 100).toFixed(0)}%</ThemedText>
			{risk.reasons.map((r) => (
				<ThemedText key={r}>
					- {r}
				</ThemedText>
			))}
			<ThemedText>
				Sugestão: reduza intensidade/volume nesta semana se risco alto.
			</ThemedText>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	card: { padding: 12, borderRadius: 8, gap: 4, marginTop: 8 },
	high: { backgroundColor: 'rgba(255,0,0,0.12)' },
	moderate: { backgroundColor: 'rgba(255,165,0,0.12)' },
	low: { backgroundColor: 'rgba(0,128,0,0.12)' },
});

