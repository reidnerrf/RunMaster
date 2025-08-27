import React, { useEffect, useState } from 'react';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { getModelInfo } from '@/utils/mlRuntime';

export default function ActiveModelIndicator() {
	const [info, setInfo] = useState<{ name: string; version: string } | null>(null);
	useEffect(() => {
		setInfo(getModelInfo());
	}, []);
	return (
		<ThemedView style={{ padding: 8, borderRadius: 6, backgroundColor: 'rgba(127,127,127,0.12)', marginVertical: 6 }}>
			<ThemedText>
				Modelo ativo: {info ? `${info.name} v${info.version}` : 'Heurístico (sem modelo carregado)'}
			</ThemedText>
		</ThemedView>
	);
}

