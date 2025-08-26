export interface Group {
	id: string;
	name: string;
	members: string[];
	challenges: Challenge[];
}

export interface Challenge {
	id: string;
	title: string;
	description: string;
	startDate: Date;
	endDate: Date;
	participants: string[];
	leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
	userId: string;
	username: string;
	score: number;
	rank: number;
}

export interface Story {
	id: string;
	runId: string;
	userId: string;
	mediaUrl?: string;
	caption: string;
	metrics: {
		distance: number;
		pace: string;
		calories: number;
	};
	createdAt: Date;
}

export async function createGroup(name: string, creatorId: string): Promise<Group> {
	console.log('[social] create group', name);
	return {
		id: Date.now().toString(),
		name,
		members: [creatorId],
		challenges: [],
	};
}

export async function joinChallenge(challengeId: string, userId: string): Promise<boolean> {
	console.log('[social] join challenge', challengeId, userId);
	return true;
}

export async function generateStory(runId: string, userId: string): Promise<Story> {
	console.log('[social] generate story for run', runId);
	return {
		id: Date.now().toString(),
		runId,
		userId,
		caption: 'Nova conquista! 🏃‍♂️',
		metrics: {
			distance: 5.2,
			pace: '5:30',
			calories: 320,
		},
		createdAt: new Date(),
	};
}

export async function getCityRankings(city: string): Promise<LeaderboardEntry[]> {
	console.log('[social] get rankings for', city);
	return [
		{ userId: '1', username: 'Runner1', score: 42.2, rank: 1 },
		{ userId: '2', username: 'Runner2', score: 38.5, rank: 2 },
		{ userId: '3', username: 'Runner3', score: 35.1, rank: 3 },
	];
}