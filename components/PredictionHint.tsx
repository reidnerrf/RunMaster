import React, { useEffect, useState } from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { predictNextWindow } from '@/utils/timePredictor';
import { predictTimeWindowOnnx } from '@/utils/timeOnnx';
import { track } from '@/utils/analyticsClient';

export default function PredictionHint() {
	const [text, setText] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const onnx = await predictTimeWindowOnnx();
			const win = onnx ?? (await predictNextWindow());
			if (win) {
				const msg = `Sua melhor janela de treino: ${win.startHour}h–${win.endHour}h`;
				setText(msg);
				track('ml_suggestion_shown', { type: 'time_window', score: 1 }).catch(() => {});
			} else {
				setText(null);
			}
		})().catch(() => setText(null));
	}, []);

	if (!text) return null;

	return (
		<ThemedView style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(255,126,71,0.15)', marginTop: 8 }}>
			<ThemedText>{text}</ThemedText>
		</ThemedView>
	);
}

