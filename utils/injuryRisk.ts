import { WorkoutSession } from '@/store/slices/workoutSlice'

export type InjuryRisk = {
	score: number; // 0..1
	level: 'low' | 'moderate' | 'high';
	reasons: string[];
}

export function estimateInjuryRisk(history: WorkoutSession[], opts?: { windowDays?: number }): InjuryRisk {
	const windowDays = opts?.windowDays ?? 28
	const now = Date.now()
	const dayMs = 24 * 60 * 60 * 1000
	const recent = history.filter((w) => now - new Date(w.startTime).getTime() <= windowDays * dayMs)
	// Acute (last 7 days) vs Chronic (last 28 days)
	const acute = sumDistance(recent.filter((w) => now - new Date(w.startTime).getTime() <= 7 * dayMs))
	const chronic = sumDistance(recent)
	const chronicAvgPerWeek = chronic * (7 / 28)
	const acwr = chronicAvgPerWeek === 0 ? 0 : acute / chronicAvgPerWeek

	let score = clamp((acwr - 1) / 1.5, 0, 1) // >1.0 aumenta risco, >2.5 alto
	const reasons: string[] = []
	if (acwr > 1.2) reasons.push('Carga aguda acima do crônico')
	if (acwr > 1.8) reasons.push('Aumento rápido de volume')

	const avgPacePenalty = pacePenalty(recent)
	score = clamp(score + avgPacePenalty, 0, 1)
	if (avgPacePenalty > 0.15) reasons.push('Pace elevado em sessões recentes')

	const level: InjuryRisk['level'] = score > 0.66 ? 'high' : score > 0.33 ? 'moderate' : 'low'
	return { score, level, reasons }
}

function sumDistance(list: WorkoutSession[]): number {
	return list.reduce((acc, w) => acc + (w.distance ?? 0) / 1000, 0) // km
}

function clamp(v: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, v))
}

function pacePenalty(list: WorkoutSession[]): number {
	// Simple proxy: if average speed is much higher than median, penalize
	const speeds = list.map((w) => w.speed ?? 0).filter((s) => s > 0)
	if (speeds.length < 4) return 0
	speeds.sort((a, b) => a - b)
	const median = speeds[Math.floor(speeds.length / 2)]
	const recentAvg = average(speeds.slice(-Math.min(4, speeds.length)))
	if (median === 0) return 0
	const ratio = recentAvg / median
	return ratio > 1.2 ? clamp((ratio - 1.2) / 1.0, 0, 0.4) : 0
}

function average(arr: number[]): number { return arr.reduce((a, b) => a + b, 0) / arr.length }