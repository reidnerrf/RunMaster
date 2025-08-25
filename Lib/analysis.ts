import { Run } from './runStore';

function withinDays(ts: number, days: number, ref = Date.now()) {
  return ts >= ref - days * 24 * 3600 * 1000;
}

export function weeklyDistanceKm(runs: Run[], ref = Date.now()): number {
  return runs.filter(r => withinDays(r.startedAt, 7, ref)).reduce((s, r) => s + r.distanceKm, 0);
}

export function acwr(runs: Run[], ref = Date.now()): number | null {
  // Acute: last 7 days; Chronic: average of last 28 days (4 weeks)
  const acute = weeklyDistanceKm(runs, ref);
  const past28 = runs.filter(r => withinDays(r.startedAt, 28, ref));
  if (past28.length === 0) return null;
  const total28 = past28.reduce((s, r) => s + r.distanceKm, 0);
  const chronic = total28 / 4; // per-week average over 4 weeks
  if (chronic <= 0) return null;
  return acute / chronic;
}

export function getRecoveryAdvice(runs: Run[], latest: Run): { risk: 'low'|'moderate'|'high'; messages: string[] } {
  const ratio = acwr(runs, Date.now());
  const msgs: string[] = [];
  let risk: 'low'|'moderate'|'high' = 'low';
  if (ratio === null) {
    msgs.push('Continue construindo base de treinos para análises mais precisas.');
    risk = 'moderate';
  } else if (ratio > 1.5) {
    msgs.push('Carga aguda alta vs crônica. Reduza volume/ritmo nos próximos 1-2 dias.');
    msgs.push('Foque em recuperação: alongamento, sono adequado e hidratação.');
    risk = 'high';
  } else if (ratio < 0.8) {
    msgs.push('Carga abaixo do ideal. Inclua um treino moderado para manter evolução.');
    risk = 'moderate';
  } else {
    msgs.push('Carga equilibrada. Mantenha consistência e inclua descanso ativo.');
  }

  // Simple post-run tips
  if (latest.distanceKm >= 10) msgs.push('Aplique liberação miofascial nas panturrilhas e posterior.');
  if (latest.avgPace < '05:00') msgs.push('Inclua sessão de mobilidade de quadril para melhorar amplitude.');

  return { risk, messages: msgs };
}