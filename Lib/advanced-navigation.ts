import { getElevationProfile } from './navigation';

export interface Segment {
	id: string;
	name: string;
	startPoint: { lat: number; lng: number };
	endPoint: { lat: number; lng: number };
	bestTime: number;
	leaderboard: { userId: string; time: number; date: Date }[];
}

export interface HeatmapData {
	lat: number;
	lng: number;
	intensity: number;
}

export async function generateVoiceNavigation(instruction: string, distance: number): Promise<void> {
	const speech = require('expo-speech');
	const message = `${instruction} em ${distance} metros`;
	try {
		await speech.speak(message, { language: 'pt-BR', rate: 0.9 });
	} catch {}
}

export async function getSegmentLeaderboard(segmentId: string): Promise<Segment['leaderboard']> {
	console.log('[nav] get leaderboard for segment', segmentId);
	return [
		{ userId: '1', time: 125, date: new Date() },
		{ userId: '2', time: 132, date: new Date() },
		{ userId: '3', time: 138, date: new Date() },
	];
}

export async function createHeatmap(userId: string, activities: any[]): Promise<HeatmapData[]> {
	console.log('[nav] create heatmap for user', userId);
	const points = activities.flatMap(a => a.path || []).slice(0, 100);
	return points.map(p => ({
		lat: p.latitude,
		lng: p.longitude,
		intensity: Math.random(),
	}));
}

export async function autoLapDetection(path: any[], targetDistance: number = 1000): Promise<number[]> {
	const laps: number[] = [];
	let currentDistance = 0;
	
	for (let i = 1; i < path.length; i++) {
		const prev = path[i-1];
		const curr = path[i];
		const segmentDist = calculateDistance(prev, curr);
		currentDistance += segmentDist;
		
		if (currentDistance >= targetDistance) {
			laps.push(i);
			currentDistance = 0;
		}
	}
	
	return laps;
}

function calculateDistance(p1: any, p2: any): number {
	const R = 6371e3; // Earth radius in meters
	const φ1 = p1.latitude * Math.PI / 180;
	const φ2 = p2.latitude * Math.PI / 180;
	const Δφ = (p2.latitude - p1.latitude) * Math.PI / 180;
	const Δλ = (p2.longitude - p1.longitude) * Math.PI / 180;
	
	const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	
	return R * c;
}