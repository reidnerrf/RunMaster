import React, { useEffect, useMemo, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAppSelector } from '@/store/hooks';
import { estimateInjuryRisk } from '@/utils/injuryRisk';
import { inferInjuryRiskOnnx } from '@/utils/injuryOnnx';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { track } from '@/utils/analyticsClient';
import { applyRiskAdjustment } from '@/utils/planAdjuster';

export default function InjuryRiskCard() {
	const history = useAppSelector((s) => (s as any).workout?.history ?? []);
	const baseRisk = useMemo(() => estimateInjuryRisk(history), [history]);
	const [override, setOverride] = useState<number | null>(null);

	useEffect(() => {
		track('ml_suggestion_shown', { type: 'injury_risk', score: baseRisk.score }).catch(() => {});
		inferInjuryRiskOnnx(history).then((val) => {
			if (typeof val === 'number') setOverride(val);
		}).catch(() => {});
	}, [history]);

	const finalScore = override ?? baseRisk.score;
	const level = finalScore > 0.66 ? 'high' : finalScore > 0.33 ? 'moderate' : 'low';
	if (!history || history.length === 0) return null;
	return (
		<ThemedView style={[styles.card, level === 'high' ? styles.high : level === 'moderate' ? styles.moderate : styles.low]}>
			<ThemedText type="subtitle">Risco de Lesão: {level}</ThemedText>
			<ThemedText>Score: {(finalScore * 100).toFixed(0)}%</ThemedText>
			{baseRisk.reasons.map((r) => (
				<ThemedText key={r}>
					- {r}
				</ThemedText>
			))}
			<ThemedText>
				Sugestão: reduza intensidade/volume nesta semana se risco alto.
			</ThemedText>
			<View style={styles.row}>
				<TouchableOpacity style={styles.btn} onPress={async () => { track('ml_suggestion_accepted', { type: 'injury_risk' }).catch(() => {}); await applyRiskAdjustment(0.2, 7); }}>
					<ThemedText>Ajustar Plano</ThemedText>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnSecondary} onPress={() => track('ml_suggestion_dismissed', { type: 'injury_risk' }).catch(() => {})}>
					<ThemedText>Ignorar</ThemedText>
				</TouchableOpacity>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	card: { padding: 12, borderRadius: 8, gap: 4, marginTop: 8 },
	high: { backgroundColor: 'rgba(255,0,0,0.12)' },
	moderate: { backgroundColor: 'rgba(255,165,0,0.12)' },
	low: { backgroundColor: 'rgba(0,128,0,0.12)' },
  row: { flexDirection: 'row', gap: 8, marginTop: 6 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(127,127,127,0.25)', borderRadius: 8 },
  btnSecondary: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(127,127,127,0.15)', borderRadius: 8 }
});

