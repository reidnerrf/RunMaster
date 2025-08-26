type Lang = 'pt' | 'en' | 'es';

const dict: Record<Lang, Record<string, string>> = {
	pt: {
		start_run: 'INICIAR CORRIDA',
		premium_unlock: 'Desbloqueie o Premium',
		login: 'Entrar',
		km: 'km',
		miles: 'mi',
		pace: 'min/km',
		pace_mi: 'min/mi',
		calories: 'calorias',
		heart_rate: 'frequência cardíaca',
		time: 'tempo',
		distance: 'distância',
		start: 'Iniciar',
		pause: 'Pausar',
		resume: 'Retomar',
		finish: 'Finalizar',
		settings: 'Configurações',
		profile: 'Perfil',
		workouts: 'Treinos',
		stats: 'Estatísticas',
		social: 'Social',
		home: 'Início',
	},
	en: {
		start_run: 'START RUN',
		premium_unlock: 'Unlock Premium',
		login: 'Login',
		km: 'km',
		miles: 'mi',
		pace: 'min/km',
		pace_mi: 'min/mi',
		calories: 'calories',
		heart_rate: 'heart rate',
		time: 'time',
		distance: 'distance',
		start: 'Start',
		pause: 'Pause',
		resume: 'Resume',
		finish: 'Finish',
		settings: 'Settings',
		profile: 'Profile',
		workouts: 'Workouts',
		stats: 'Stats',
		social: 'Social',
		home: 'Home',
	},
	es: {
		start_run: 'INICIAR CARRERA',
		premium_unlock: 'Desbloquear Premium',
		login: 'Entrar',
		km: 'km',
		miles: 'mi',
		pace: 'min/km',
		pace_mi: 'min/mi',
		calories: 'calorías',
		heart_rate: 'frecuencia cardíaca',
		time: 'tiempo',
		distance: 'distancia',
		start: 'Iniciar',
		pause: 'Pausar',
		resume: 'Reanudar',
		finish: 'Finalizar',
		settings: 'Configuración',
		profile: 'Perfil',
		workouts: 'Entrenamientos',
		stats: 'Estadísticas',
		social: 'Social',
		home: 'Inicio',
	},
};

let current: Lang = 'pt';
export function setLang(l: Lang) { current = l; }
export function t(key: string): string { return (dict[current] && dict[current][key]) || dict.pt[key] || key; }

// RTL support
export const isRTL = (lang: Lang) => lang === 'ar' || lang === 'he';
export const getTextAlign = (lang: Lang) => isRTL(lang) ? 'right' : 'left';

// Unit regionalization
export const getUnitSystem = (lang: Lang) => lang === 'en' ? 'imperial' : 'metric';
export const formatDistance = (km: number, lang: Lang) => {
	if (getUnitSystem(lang) === 'imperial') {
		const miles = km * 0.621371;
		return `${miles.toFixed(1)} ${t('miles')}`;
	}
	return `${km.toFixed(1)} ${t('km')}`;
};