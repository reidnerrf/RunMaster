import * as Storage from './storage';
import { getGoals, Goals } from './goals';
import { getRuns } from './runStore';

export type PlanDay = {
  date: string; // YYYY-MM-DD
  type: 'rest' | 'easy' | 'tempo' | 'interval' | 'long';
  targetKm?: number;
  description?: string;
};

export type WeeklyPlan = {
  weekStart: string; // YYYY-MM-DD (Mon)
  days: PlanDay[]; // 7 items
};

const KEY = 'runmaster_plan_v1';

function fmt(d: Date) { return d.toISOString().slice(0, 10); }
function startOfWeek(d: Date) { const s = new Date(d); const day = s.getDay(); const diff = (day === 0 ? -6 : 1) - day; s.setDate(s.getDate() + diff); s.setHours(0,0,0,0); return s; }

export async function getWeeklyPlan(anchor: Date = new Date()): Promise<WeeklyPlan | null> {
  const raw = await Storage.getItem(KEY);
  if (!raw) return null;
  try { const plan = JSON.parse(raw) as WeeklyPlan; return plan; } catch { return null; }
}

export async function setWeeklyPlan(plan: WeeklyPlan) {
  await Storage.setItem(KEY, JSON.stringify(plan));
}

export async function generatePlan(anchor: Date = new Date()): Promise<WeeklyPlan> {
  const goals = await getGoals();
  const runs = await getRuns();
  const sow = startOfWeek(anchor);

  // volume recente (últimos 14 dias)
  const cutoff = new Date(anchor); cutoff.setDate(cutoff.getDate() - 14);
  const lastKm = runs.filter(r => new Date(r.startedAt) >= cutoff).reduce((a, r) => a + r.distanceKm, 0);

  // objetivo diário preferencial
  const dailyTarget = goals.daily.distanceKm || Math.max(3, Math.min(8, lastKm / 6));

  // simples periodização: 2 fáceis, 1 tempo, 1 intervalado leve, 1 descanso, 1 fácil, 1 longo
  const template: Array<PlanDay['type']> = ['easy', 'interval', 'rest', 'easy', 'tempo', 'easy', 'long'];

  const days: PlanDay[] = new Array(7).fill(0).map((_, i) => {
    const d = new Date(sow); d.setDate(sow.getDate() + i);
    const type = template[i];
    let km = dailyTarget;
    if (type === 'long') km = Math.max(dailyTarget * 1.6, 8);
    if (type === 'interval') km = Math.max(dailyTarget * 1.2, 5);
    if (type === 'rest') km = undefined;

    const description =
      type === 'easy' ? 'Corrida leve, respiração confortável.' :
      type === 'tempo' ? 'Ritmo sustentado (limiar) por 15–20 min.' :
      type === 'interval' ? 'Intervalados: 6×400 m ritmo forte, rec 200 m.' :
      type === 'long' ? 'Treino longo, ritmo conversável.' :
      'Descanso/alongamento.';

    return { date: fmt(d), type, targetKm: km ? Math.round(km * 10) / 10 : undefined, description };
  });

  const plan: WeeklyPlan = { weekStart: fmt(sow), days };
  await setWeeklyPlan(plan);
  return plan;
}