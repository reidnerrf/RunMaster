import { store } from '@/store'
import { updateWorkoutPlan } from '@/store/slices/workoutSlice'

export async function applyRiskAdjustment(reductionPct: number = 0.2, days: number = 7) {
	const state = store.getState() as any
	const plans = state.workout?.plans ?? []
	if (!plans.length) return
	const active = plans.find((p: any) => p.isActive)
	if (!active) return
	const updates = { ...active }
	updates.workouts = (active.workouts ?? []).map((w: any) => {
		// naive: reduce distance/duration in the next N days
		const date = parsePlanDate(active.startDate, w.week, w.day)
		if (Date.now() - date.getTime() <= days * 24 * 60 * 60 * 1000 && Date.now() <= date.getTime()) {
			return {
				...w,
				distance: typeof w.distance === 'number' ? +(w.distance * (1 - reductionPct)).toFixed(1) : w.distance,
				duration: typeof w.duration === 'number' ? Math.round(w.duration * (1 - reductionPct)) : w.duration,
				pace: w.pace,
			}
		}
		return w
	})
	store.dispatch(updateWorkoutPlan({ id: active.id, updates }))
}

function parsePlanDate(startDate: string, week: number, day: number): Date {
	const start = new Date(startDate)
	const d = new Date(start.getTime())
	d.setDate(start.getDate() + (week - 1) * 7 + (day - 1))
	return d
}