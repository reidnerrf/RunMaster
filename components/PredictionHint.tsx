import React, { useEffect, useState } from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

export default function PredictionHint() {
	const [text, setText] = useState<string | null>(null);

	useEffect(() => {
		const now = new Date();
		const hour = now.getHours();
		if (hour >= 6 && hour <= 9) setText('Sugestão: que tal iniciar uma corrida leve agora?');
		else if (hour >= 18 && hour <= 21) setText('Sugestão: horário ótimo para um treino moderado.');
		else setText(null);
	}, []);

	if (!text) return null;

	return (
		<ThemedView style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(255,126,71,0.15)', marginTop: 8 }}>
			<ThemedText>{text}</ThemedText>
		</ThemedView>
	);
}

