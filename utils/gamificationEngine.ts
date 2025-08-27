import { store } from '@/store'
import { updateAchievementProgress, updateUserProfile } from '@/store/slices/gamificationSlice'
import { track } from '@/utils/analyticsClient'

export type DomainEvent =
	| { type: 'run_completed'; distanceKm: number; durationMin: number }
	| { type: 'streak_day'; current: number }
	| { type: 'social_share'; where: 'image' | 'text' | 'deep_link' }

export function handleEvent(e: DomainEvent) {
	const state = store.getState() as any
	const profile = state.gamification?.currentUserProfile
	if (!profile) return

	if (e.type === 'run_completed') {
		awardXp(profile.userId, Math.round(e.distanceKm * 10))
		updateAchievement('distance_10k', e.distanceKm >= 10, e.distanceKm)
	}
	if (e.type === 'streak_day') {
		updateAchievement('streak_7', e.current >= 7, e.current)
	}
	if (e.type === 'social_share') {
		updateAchievement('first_share', true, 1)
	}
}

function awardXp(userId: string, xp: number) {
	const state = store.getState() as any
	const profile = state.gamification?.currentUserProfile
	if (!profile) return
	const total = (profile.xp ?? 0) + xp
	const levelUp = total >= xpRequired(profile.level)
	const nextLevel = levelUp ? profile.level + 1 : profile.level
	store.dispatch(updateUserProfile({
		...profile,
		xp: levelUp ? 0 : total,
		totalXp: (profile.totalXp ?? 0) + xp,
		level: nextLevel,
		updatedAt: new Date().toISOString(),
	}))
	track('xp_gained', { amount: xp, reason: 'event' }).catch(() => {})
	if (levelUp) track('level_up', { level: nextLevel }).catch(() => {})
}

function updateAchievement(key: string, completed: boolean, progressValue: number) {
	store.dispatch(updateAchievementProgress({ id: key, progress: progressValue }))
	if (completed) {
		store.dispatch(updateAchievement({ id: key, isUnlocked: true, unlockedAt: new Date().toISOString() }))
		track('achievement_unlocked', { achievement_id: key }).catch(() => {})
	}
}

function xpRequired(level: number): number { return 100 + level * 50 }