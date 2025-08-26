import { acwr } from './analysis';

export interface RecoveryInputs {
  recentLoads: { date: number; load: number }[]; // TSS ou similar
  hrv: number; // ms
  sleepHours: number;
  sleepQuality: number; // 0-100
  soreness: number; // 0-100
  restingHr?: number;
}

export interface RecoveryAdvice {
  level: 'rest' | 'active_recovery' | 'easy' | 'moderate';
  message: string;
  tips: string[];
  risk: 'low' | 'medium' | 'high';
}

export function smartRecovery(inputs: RecoveryInputs): RecoveryAdvice {
  const now = Date.now();
  const sevenDays = inputs.recentLoads.filter(r => now - r.date <= 7*24*60*60*1000);
  const fourWeeks = inputs.recentLoads.filter(r => now - r.date <= 28*24*60*60*1000);
  const weeklyLoad = sevenDays.reduce((s,r)=> s+r.load,0);
  const chronicLoad = fourWeeks.reduce((s,r)=> s+r.load,0) / 4;
  const ratio = chronicLoad > 0 ? weeklyLoad / chronicLoad : 1;

  let score = 0;
  // ACWR elevada aumenta necessidade de recuperação
  if (ratio > 1.5) score += 30; else if (ratio > 1.2) score += 15;
  // HRV baixo
  if (inputs.hrv < 40) score += 25; else if (inputs.hrv < 60) score += 10;
  // Sono ruim
  if (inputs.sleepHours < 6) score += 20; if (inputs.sleepQuality < 60) score += 15;
  // Dor muscular
  if (inputs.soreness > 60) score += 20; else if (inputs.soreness > 40) score += 10;

  if (score >= 60) {
    return {
      level: 'rest',
      message: 'Seu corpo pede descanso hoje. Priorize recuperação total.',
      tips: ['Sono 8-9h', 'Hidratação', 'Alongamento leve', 'Alimentação rica em proteínas'],
      risk: 'high'
    };
  }
  if (score >= 40) {
    return {
      level: 'active_recovery',
      message: 'Recomendada recuperação ativa para manter o fluxo sem sobrecarga.',
      tips: ['30-40min caminhada/ciclismo leve', 'Mobilidade', 'Banho morno', 'Massagem'],
      risk: 'medium'
    };
  }
  if (score >= 20) {
    return {
      level: 'easy',
      message: 'Ok para treino leve. Mantenha ritmo conversável.',
      tips: ['20-40min easy', 'Alongamento', 'Sono de qualidade'],
      risk: 'low'
    };
  }
  return {
    level: 'moderate',
    message: 'Pronto para treino moderado. Siga o plano.',
    tips: ['Aquecimento completo', 'Hidratação', 'Recuperação pós-treino'],
    risk: 'low'
  };
}