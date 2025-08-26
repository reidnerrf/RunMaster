export interface Habit {
	id: string;
	userId: string;
	type: 'daily_distance' | 'weekly_runs' | 'monthly_volume';
	goal: number;
	current: number;
	streak: number;
	bestStreak: number;
	startDate: Date;
}

export interface Challenge {
	id: string;
	title: string;
	description: string;
	duration: 'weekly' | 'monthly';
	goal: number;
	participants: string[];
	leaderboard: { userId: string; progress: number }[];
}

export function calculateStreak(runs: any[], targetDays: number = 7): number {
	if (!runs.length) return 0;
	const sorted = runs.sort((a, b) => b.startedAt - a.startedAt);
	let streak = 0;
	let currentDate = new Date();
	
	for (let i = 0; i < targetDays; i++) {
		const dayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i);
		const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
		const hasRun = runs.some(r => r.startedAt >= dayStart.getTime() && r.startedAt < dayEnd.getTime());
		if (hasRun) streak++;
		else break;
	}
	return streak;
}

export function suggestGoalAdjustment(history: any[], currentGoal: number): number {
	const recentRuns = history.filter(r => Date.now() - r.startedAt < 30 * 24 * 60 * 60 * 1000);
	if (recentRuns.length < 5) return currentGoal;
	
	const avgDistance = recentRuns.reduce((sum, r) => sum + r.distanceKm, 0) / recentRuns.length;
	const completionRate = recentRuns.filter(r => r.distanceKm >= currentGoal).length / recentRuns.length;
	
	if (completionRate > 0.8) return Math.round(currentGoal * 1.1);
	if (completionRate < 0.3) return Math.round(currentGoal * 0.9);
	return currentGoal;
}

export function generateDailyQuest(): string {
	const quests = [
		'Complete 5km em ritmo confortável',
		'Faça 3 sprints de 100m',
		'Corra em uma nova rota',
		'Bata seu recorde de pace em 1km',
		'Complete uma corrida matinal',
	];
	return quests[Math.floor(Math.random() * quests.length)];
}