import { track } from './analyticsClient';

export type Trigger =
  | { type: 'time_of_day'; at: string; timezone?: string }
  | { type: 'post_run'; minDistanceKm?: number }
  | { type: 'streak'; days: number };

export type Action =
  | { type: 'send_notification'; templateId: string; data?: Record<string, any> }
  | { type: 'start_workout_plan'; planId: string }
  | { type: 'open_screen'; screen: string };

export type Rule = {
  id: string;
  name: string;
  enabled: boolean;
  trigger: Trigger;
  action: Action;
};

const rules: Rule[] = [];

export function addRule(rule: Rule) {
  rules.push(rule);
}

export function removeRule(ruleId: string) {
  const idx = rules.findIndex((r) => r.id === ruleId);
  if (idx >= 0) rules.splice(idx, 1);
}

export async function evaluate(event: { type: string; [k: string]: any }, helpers: { notify: (tpl: string, data?: any) => Promise<void> }) {
  for (const r of rules) {
    if (!r.enabled) continue;
    if (match(r.trigger, event)) {
      await perform(r.action, helpers);
      try { await track('automation_fired', { rule_id: r.id, trigger: event.type }); } catch {}
    }
  }
}

function match(trigger: Trigger, event: { type: string; [k: string]: any }): boolean {
  if (trigger.type === 'post_run' && event.type === 'run_completed') {
    if (typeof trigger.minDistanceKm === 'number') return (event.distance_km ?? event.distanceKm ?? 0) >= trigger.minDistanceKm;
    return true;
  }
  if (trigger.type === 'streak' && event.type === 'streak_day') {
    return (event.current ?? 0) >= trigger.days;
  }
  // time_of_day triggers should be scheduled by orchestrator
  return false;
}

async function perform(action: Action, helpers: { notify: (tpl: string, data?: any) => Promise<void> }) {
  if (action.type === 'send_notification') {
    await helpers.notify(action.templateId, action.data);
    return;
  }
  // Other action types would integrate here
}

