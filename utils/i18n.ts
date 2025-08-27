type Lang = 'pt' | 'en';
let current: Lang = 'pt';

const dict: Record<Lang, Record<string, string>> = {
  pt: {
    home_welcome: 'Pronto para correr?',
    home_start: 'Iniciar Corrida',
    workouts_title: 'Treinos',
    workouts_sub: 'Plano adaptativo semanal',
  },
  en: {
    home_welcome: 'Ready to run?',
    home_start: 'Start Run',
    workouts_title: 'Workouts',
    workouts_sub: 'Weekly adaptive plan',
  }
};

export function setLang(lang: Lang) { current = lang; }
export function t(key: string): string { return dict[current][key] || key; }

