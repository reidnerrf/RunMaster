import { estimateVo2maxFromPace, getPaceZones } from './analysis';

export interface TrainingPhase {
	phase: 'base' | 'build' | 'peak' | 'recovery';
	week: number;
	targetVolume: number;
	targetIntensity: number;
	workouts: string[];
}

export interface HeartRateZone {
	zone: number;
	name: string;
	percentage: number;
	description: string;
}

export interface RacePrediction {
	distance: number;
	predictedTime: number;
	confidence: number;
	recommendations: string[];
}

export function calculateHeartRateZones(maxHR: number): HeartRateZone[] {
	return [
		{ zone: 1, name: 'Recuperação', percentage: 0.5, description: 'Muito leve, recuperação ativa' },
		{ zone: 2, name: 'Aeróbico', percentage: 0.6, description: 'Confortável, base aeróbica' },
		{ zone: 3, name: 'Tempo', percentage: 0.7, description: 'Moderado, ritmo de maratona' },
		{ zone: 4, name: 'Threshold', percentage: 0.8, description: 'Forte, ritmo de meia' },
		{ zone: 5, name: 'VO2max', percentage: 0.9, description: 'Muito forte, intervalos' },
	].map(z => ({
		...z,
		percentage: z.percentage * maxHR,
	}));
}

export function predictRaceTime(recentRuns: any[], targetDistance: number): RacePrediction | null {
	if (recentRuns.length < 3) return null;
	
	const vo2max = estimateVo2maxFromPace(5, recentRuns[0].durationSec);
	if (!vo2max) return null;
	
	// Simple Riegel formula: T2 = T1 * (D2/D1)^1.06
	const baseRun = recentRuns.find(r => Math.abs(r.distanceKm - 5) < 1);
	if (!baseRun) return null;
	
	const ratio = Math.pow(targetDistance / baseRun.distanceKm, 1.06);
	const predictedTime = baseRun.durationSec * ratio;
	
	const confidence = Math.min(0.9, 0.7 + (recentRuns.length * 0.05));
	const recommendations = [
		'Faça um teste de 5km para calibrar',
		'Inclua treinos de threshold',
		'Monitore sua recuperação',
	];
	
	return {
		distance: targetDistance,
		predictedTime: Math.round(predictedTime),
		confidence,
		recommendations,
	};
}

export function generatePeriodizationPlan(currentWeek: number, targetRace: string): TrainingPhase[] {
	const phases: TrainingPhase[] = [];
	
	for (let week = 1; week <= 16; week++) {
		let phase: TrainingPhase['phase'];
		let targetVolume: number;
		let targetIntensity: number;
		
		if (week <= 6) {
			phase = 'base';
			targetVolume = 30 + (week * 2);
			targetIntensity = 0.6;
		} else if (week <= 12) {
			phase = 'build';
			targetVolume = 40 + ((week - 6) * 1.5);
			targetIntensity = 0.75;
		} else if (week <= 14) {
			phase = 'peak';
			targetVolume = 45;
			targetIntensity = 0.85;
		} else {
			phase = 'recovery';
			targetVolume = 25;
			targetIntensity = 0.5;
		}
		
		phases.push({
			phase,
			week,
			targetVolume,
			targetIntensity,
			workouts: generateWorkoutsForWeek(phase, week),
		});
	}
	
	return phases;
}

function generateWorkoutsForWeek(phase: string, week: number): string[] {
	const workouts = [];
	
	if (phase === 'base') {
		workouts.push('Long run', 'Easy run', 'Recovery run');
	} else if (phase === 'build') {
		workouts.push('Long run', 'Tempo run', 'Interval training', 'Easy run');
	} else if (phase === 'peak') {
		workouts.push('Long run', 'Race pace', 'Speed work', 'Easy run');
	} else {
		workouts.push('Recovery run', 'Easy run');
	}
	
	return workouts;
}