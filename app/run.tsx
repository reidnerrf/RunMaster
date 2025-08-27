import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { getState, RunState, startRun, pauseRun, resumeRun, stopRun, subscribe } from '@/utils/runSession';

export default function RunScreen() {
	const [state, setState] = useState<RunState>(getState());

	useEffect(() => {
		return subscribe(setState);
	}, []);

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Corrida</ThemedText>
			<ThemedText>Estado: {state.phase}</ThemedText>
			<View style={styles.row}>
				<TouchableOpacity style={styles.btn} onPress={startRun}><ThemedText>Iniciar</ThemedText></TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={pauseRun}><ThemedText>Pausar</ThemedText></TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={resumeRun}><ThemedText>Retomar</ThemedText></TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={stopRun}><ThemedText>Encerrar</ThemedText></TouchableOpacity>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 12 },
	row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
	btn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.2)' },
});

