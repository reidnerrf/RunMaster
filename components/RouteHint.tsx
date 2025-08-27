import React, { useMemo } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useAppSelector } from '@/store/hooks'
import { recommendRoute } from '@/utils/routeRecommender'
import { track } from '@/utils/analyticsClient'
import { useRouter } from 'expo-router'

export default function RouteHint() {
	const router = useRouter()
	const routes = useAppSelector((s) => (s as any).explorer?.routes ?? []) as Array<{ id: string; name: string; elevation?: { gain: number }; terrain?: { surface: string } }>

	const rec = useMemo(() => {
		const candidates = routes.map((r) => ({ id: r.id, name: r.name, elevationGainM: r.elevation?.gain, surface: (r.terrain?.surface as any) }))
		return recommendRoute(candidates, { preferTrail: false, maxElevationM: 200 })
	}, [routes])

	if (!rec) return null

	return (
		<ThemedView style={styles.card}>
			<ThemedText type="subtitle">Rota sugerida</ThemedText>
			<ThemedText>{rec.name}</ThemedText>
			<View style={styles.row}>
				<TouchableOpacity style={styles.btn} onPress={() => { track('ml_suggestion_accepted', { type: 'route', id: rec.id }).catch(() => {}); router.push('/explore') }}>
					<ThemedText>Aceitar</ThemedText>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnSecondary} onPress={() => { track('ml_suggestion_dismissed', { type: 'route', id: rec.id }).catch(() => {}) }}>
					<ThemedText>Agora não</ThemedText>
				</TouchableOpacity>
			</View>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	card: { padding: 12, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)', gap: 6, marginTop: 8 },
	row: { flexDirection: 'row', gap: 8, marginTop: 6 },
	btn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(127,127,127,0.25)', borderRadius: 8 },
	btnSecondary: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(127,127,127,0.15)', borderRadius: 8 }
})