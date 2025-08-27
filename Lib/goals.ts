import * as Storage from './storage';

export type Goals = {
  daily: { calories?: number; distanceKm?: number; steps?: number };
  weekly: { calories?: number; distanceKm?: number; steps?: number };
};

const KEY = 'runmaster_goals_v1';

export async function getGoals(): Promise<Goals> {
  const raw = await Storage.getItem(KEY);
  if (!raw) return { daily: {}, weekly: {} };
  try { return JSON.parse(raw) as Goals; } catch { return { daily: {}, weekly: {} }; }
}

export async function setGoals(goals: Goals): Promise<void> {
  await Storage.setItem(KEY, JSON.stringify(goals));
}

export async function setDailyNotification(): Promise<void> {
  try {
    const Notifications = require('expo-notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Suas metas de hoje', body: 'Não esqueça de bater seus objetivos!' },
      trigger: { hour: 8, minute: 0, repeats: true },
    });
  } catch {}
}