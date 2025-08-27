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

// Estimate VO2max from a best recent 5k/10k time using Daniels formula (very rough)
export function estimateVo2maxFromPace(distanceKm: number, totalSeconds: number): number | null {
  if (!distanceKm || !totalSeconds) return null;
  const velocity = distanceKm / (totalSeconds / 60); // km per minute
  const v = velocity * 1000 / 60; // m/s
  // Daniels VO2 running formula approximation
  const vo2 = 0.182258 * v + 3.5; // simplified for steady state
  return Math.round(vo2 * 10) / 10;
}

export type Zone = { name: string; paceMinPerKm: [number, number] };

// Pace zones based on easy pace and threshold estimates (very rough guidance)
export function getPaceZones(easyMinPerKm: number): Zone[] {
  const z1: Zone = { name: 'Z1 Recuperação', paceMinPerKm: [easyMinPerKm + 1.0, easyMinPerKm + 2.0] };
  const z2: Zone = { name: 'Z2 Leve', paceMinPerKm: [easyMinPerKm + 0.5, easyMinPerKm + 1.0] };
  const z3: Zone = { name: 'Z3 Moderado', paceMinPerKm: [easyMinPerKm + 0.2, easyMinPerKm + 0.5] };
  const z4: Zone = { name: 'Z4 Forte', paceMinPerKm: [easyMinPerKm - 0.2, easyMinPerKm + 0.2] };
  const z5: Zone = { name: 'Z5 VO2', paceMinPerKm: [easyMinPerKm - 0.6, easyMinPerKm - 0.2] };
  return [z1, z2, z3, z4, z5];
}

export function suggestPeriodizationPhase(weekOfCycle: number): 'base'|'build'|'peak' {
  if (weekOfCycle < 4) return 'base';
  if (weekOfCycle < 8) return 'build';
  return 'peak';
}

export interface RecentRun {
  date: number;
  distanceKm: number;
  durationSec: number;
  avgHr?: number;
}

export interface DynamicZonesResult {
  baseEasyMinPerKm: number;
  zones: Zone[];
  performanceIndex: number; // 0-100
  trend: 'up' | 'down' | 'flat';
}

export function autoAdjustPaceZones(recentRuns: RecentRun[], fallbackEasyMinPerKm: number = 6.0): DynamicZonesResult {
  if (!recentRuns || recentRuns.length === 0) {
    return { baseEasyMinPerKm: fallbackEasyMinPerKm, zones: getPaceZones(fallbackEasyMinPerKm), performanceIndex: 50, trend: 'flat' };
  }

  const sorted = [...recentRuns].sort((a,b) => a.date - b.date);
  const last = sorted.slice(-1)[0];
  const lastPace = (last.durationSec / 60) / Math.max(0.1, last.distanceKm); // min/km

  // Usa best effort nos últimos 30 dias como referência
  const last30 = sorted.filter(r => Date.now() - r.date <= 30*24*60*60*1000);
  const bestPace = Math.min(...last30.map(r => (r.durationSec / 60) / Math.max(0.1, r.distanceKm)));

  // Índice simples: melhor pace vs baseline 6:00
  const performanceIndex = Math.max(0, Math.min(100, Math.round(100 - ((bestPace - 4.0) * 25))));

  // Ajuste do easy pace baseado no melhor pace (quanto melhor, mais rápido o easy)
  const baseEasyMinPerKm = Math.max(4.8, Math.min(7.5, bestPace + 1.2));

  // Tendência: compara média dos últimos 7 vs 21 dias
  const last7 = sorted.filter(r => Date.now() - r.date <= 7*24*60*60*1000);
  const last21 = sorted.filter(r => Date.now() - r.date <= 21*24*60*60*1000);
  const avg7 = averagePace(last7);
  const avg21 = averagePace(last21);
  const trend = avg7 + 0.05 < avg21 ? 'up' : avg7 - 0.05 > avg21 ? 'down' : 'flat';

  return { baseEasyMinPerKm, zones: getPaceZones(baseEasyMinPerKm), performanceIndex, trend };
}

function averagePace(runs: RecentRun[]): number {
  if (!runs.length) return 6.0;
  const totals = runs.reduce((acc, r) => { acc.d += r.distanceKm; acc.t += r.durationSec; return acc; }, { d:0, t:0 });
  return (totals.t/60) / Math.max(0.1, totals.d);
}