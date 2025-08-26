type Lang = 'pt' | 'en' | 'es';

const dict: Record<Lang, Record<string, string>> = {
	pt: {
		start_run: 'INICIAR CORRIDA',
		premium_unlock: 'Desbloqueie o Premium',
		login: 'Entrar',
	},
	en: {
		start_run: 'START RUN',
		premium_unlock: 'Unlock Premium',
		login: 'Login',
	},
	es: {
		start_run: 'INICIAR CARRERA',
		premium_unlock: 'Desbloquear Premium',
		login: 'Entrar',
	},
};

let current: Lang = 'pt';
export function setLang(l: Lang) { current = l; }
export function t(key: string): string { return (dict[current] && dict[current][key]) || dict.pt[key] || key; }