import { Platform } from 'react-native';

export interface WidgetConfig {
	id: string;
	type: 'daily_goal' | 'weekly_progress' | 'weather' | 'social_feed';
	position: { x: number; y: number };
	size: { width: number; height: number };
	config: Record<string, any>;
}

export function createGlassEffect(intensity: number = 0.3): any {
	if (Platform.OS === 'web') {
		return {
			backdropFilter: 'blur(20px)',
			backgroundColor: `rgba(255, 255, 255, ${intensity})`,
			border: '1px solid rgba(255, 255, 255, 0.2)',
		};
	}
	// Native platforms use expo-blur
	return {};
}

export function generateAccessibilityLabel(element: string, context?: string): string {
	const labels: Record<string, string> = {
		start_button: 'Botão para iniciar corrida',
		pause_button: 'Botão para pausar corrida',
		stats_card: 'Card de estatísticas da corrida',
		map_view: 'Visualização do mapa da rota',
		pace_display: 'Exibição do pace atual',
		heart_rate: 'Frequência cardíaca atual',
	};
	
	const baseLabel = labels[element] || element;
	return context ? `${baseLabel}, ${context}` : baseLabel;
}

export function getDynamicTypeScale(fontSize: number, maxScale: number = 2.0): number {
	// Simulate Dynamic Type scaling
	const baseScale = 1.0;
	const userScale = 1.2; // This would come from system settings
	return Math.min(fontSize * userScale, fontSize * maxScale);
}

export function createShimmerEffect(width: number, height: number): any {
	return {
		width,
		height,
		backgroundColor: '#E5E5EA',
		overflow: 'hidden',
	};
}

export function generateEmptyState(message: string, actionLabel?: string): any {
	return {
		message,
		actionLabel,
		icon: '🏃‍♂️',
	};
}