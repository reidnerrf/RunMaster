import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { getModelConfig, setModelConfig, loadLocalModel, getModelInfo } from '@/utils/mlRuntime';
import { track } from '@/utils/analyticsClient';

export default function InjuryModelSettings() {
	const [uri, setUri] = useState('');
	const [name, setName] = useState('injury_risk');
	const [version, setVersion] = useState('0.0.1');
	const [status, setStatus] = useState<string>('');

	useEffect(() => {
		getModelConfig().then((cfg) => {
			if (cfg && cfg.name.startsWith('injury')) {
				setUri(cfg.uri);
				setName(cfg.name);
				setVersion(cfg.version);
			}
		});
	}, []);

	async function apply() {
		await setModelConfig({ uri, name, version });
		setStatus('Carregando modelo de risco...');
		const t0 = Date.now();
		const loaded = await loadLocalModel(uri);
		const info = getModelInfo();
		track('ml_model_loaded', { model_name: info?.name ?? name, model_version: info?.version ?? version, size_kb: 0 }).catch(() => {});
		track('ml_inference', { model_name: info?.name ?? name, latency_ms: Date.now() - t0, success: loaded }).catch(() => {});
		setStatus(loaded ? 'Modelo de risco carregado' : 'Falha ao carregar o modelo');
	}

	async function reset() {
		await setModelConfig(null);
		setStatus('Modelo removido (cálculo heurístico ativo)');
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Modelo de Risco de Lesão</ThemedText>
			<ThemedText>URI</ThemedText>
			<TextInput style={styles.input} value={uri} onChangeText={setUri} placeholder="https://.../injury.onnx" />
			<ThemedText>Nome</ThemedText>
			<TextInput style={styles.input} value={name} onChangeText={setName} />
			<ThemedText>Versão</ThemedText>
			<TextInput style={styles.input} value={version} onChangeText={setVersion} />
			<TouchableOpacity style={styles.btn} onPress={apply}><ThemedText>Aplicar</ThemedText></TouchableOpacity>
			<TouchableOpacity style={styles.btnSecondary} onPress={reset}><ThemedText>Remover Modelo</ThemedText></TouchableOpacity>
			<ThemedText>{status}</ThemedText>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 8 },
	input: { borderWidth: 1, borderColor: 'rgba(127,127,127,0.3)', borderRadius: 8, padding: 8 },
	btn: { marginTop: 8, backgroundColor: 'rgba(127,127,127,0.2)', padding: 10, borderRadius: 8, alignItems: 'center' },
	btnSecondary: { marginTop: 8, backgroundColor: 'rgba(127,127,127,0.1)', padding: 10, borderRadius: 8, alignItems: 'center' },
});

