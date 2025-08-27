import React, { useEffect, useMemo, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useAppSelector } from '@/store/hooks'
import { recommendRoute } from '@/utils/routeRecommender'
import { scoreRoutesOnnx } from '@/utils/routeOnnx'
import { track } from '@/utils/analyticsClient'
import { useRouter } from 'expo-router'

export default function RouteHint() {
	const router = useRouter()
	const routes = useAppSelector((s) => (s as any).explorer?.routes ?? []) as Array<{ id: string; name: string; elevation?: { gain: number }; terrain?: { surface: string } }>
  const [bestId, setBestId] = useState<string | null>(null)

	const rec = useMemo(() => {
		const candidates = routes.map((r) => ({ id: r.id, name: r.name, elevationGainM: r.elevation?.gain, surface: (r.terrain?.surface as any) }))
		return recommendRoute(candidates, { preferTrail: false, maxElevationM: 200 })
	}, [routes])

  useEffect(() => {
    (async () => {
      if (routes.length === 0) return;
      const ids = routes.map((r) => r.id)
      const feats = routes.map((r) => ({ elevationGainM: r.elevation?.gain, distanceKm: undefined, surfaceTrail: r.terrain?.surface === 'dirt' ? 1 : 0 }))
      const scores = await scoreRoutesOnnx(ids, feats)
      if (scores) {
        let maxIdx = 0
        for (let i = 1; i < scores.length; i++) if ((scores[i] ?? 0) > (scores[maxIdx] ?? 0)) maxIdx = i
        setBestId(ids[maxIdx])

        try { await track('ml_suggestion_shown', { type: 'terrain_route', score: scores[maxIdx] }); } catch {}
      }
    })().catch(() => {})
  }, [routes])

	const chosen = routes.find((r) => r.id === bestId) ?? rec
	if (!chosen) return null

	return (
		<ThemedView style={styles.card}>
			<ThemedText type="subtitle">Rota sugerida</ThemedText>
			<ThemedText>{chosen.name}</ThemedText>
			<View style={styles.row}>
				<TouchableOpacity style={styles.btn} onPress={() => { track('ml_suggestion_accepted', { type: 'route', id: chosen.id }).catch(() => {}); router.push('/explore') }}>
					<ThemedText>Aceitar</ThemedText>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnSecondary} onPress={() => { track('ml_suggestion_dismissed', { type: 'route', id: chosen.id }).catch(() => {}) }}>
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