export interface SafetyAlert {
	type: 'hydration' | 'nutrition' | 'sos' | 'return_start';
	message: string;
	timestamp: Date;
	acknowledged: boolean;
}

export interface LiveTrackingSession {
	id: string;
	userId: string;
	shareUrl: string;
	startTime: Date;
	lastUpdate: Date;
	isActive: boolean;
}

export function detectSOS(accelerationData: number[]): boolean {
	// Simple fall detection based on acceleration spikes
	if (accelerationData.length < 3) return false;
	const recent = accelerationData.slice(-3);
	const avg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
	const spikes = recent.filter(val => Math.abs(val - avg) > 15).length;
	return spikes >= 2;
}

export function calculateReturnToStart(currentLocation: { lat: number; lng: number }, startLocation: { lat: number; lng: number }): { distance: number; bearing: number } {
	const R = 6371; // Earth radius in km
	const dLat = (startLocation.lat - currentLocation.lat) * Math.PI / 180;
	const dLon = (startLocation.lng - currentLocation.lng) * Math.PI / 180;
	const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(currentLocation.lat * Math.PI / 180) * Math.cos(startLocation.lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	const distance = R * c;
	
	const y = Math.sin(startLocation.lng - currentLocation.lng) * Math.cos(startLocation.lat);
	const x = Math.cos(currentLocation.lat) * Math.sin(startLocation.lat) - Math.sin(currentLocation.lat) * Math.cos(startLocation.lat) * Math.cos(startLocation.lng - currentLocation.lng);
	const bearing = Math.atan2(y, x) * 180 / Math.PI;
	
	return { distance, bearing: (bearing + 360) % 360 };
}

export function shouldHydrateAlert(lastHydration: Date, distanceKm: number, temperature: number): boolean {
	const hoursSince = (Date.now() - lastHydration.getTime()) / (1000 * 60 * 60);
	const baseInterval = 1.5; // hours
	const distanceFactor = Math.max(1, distanceKm / 5);
	const tempFactor = temperature > 25 ? 0.7 : 1;
	return hoursSince > (baseInterval * distanceFactor * tempFactor);
}

export function generateShareableUrl(sessionId: string): string {
	return `https://pulse.app/track/${sessionId}`;
}