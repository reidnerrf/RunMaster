import { NotificationManager, createNotificationManager } from '@/Lib/notifications';
import { track } from './analyticsClient';

let manager: NotificationManager | null = null;
let intervalHandle: any;

export function startReminderOrchestrator(periodMs: number = 60_000) {
  if (!manager) manager = createNotificationManager();
  stopReminderOrchestrator();
  intervalHandle = setInterval(async () => {
    try {
      // Simple daily reminder demo at roughly periodic intervals
      await manager!.sendNotification('me', 'daily_reminder', { streak: 3, daily_goal: '5km' }, { orchestrator: true });
      await track('smart_reminder_shown', { reason: 'daily_demo' });
    } catch {}
  }, periodMs);
  return stopReminderOrchestrator;
}

export function stopReminderOrchestrator() {
  if (intervalHandle) clearInterval(intervalHandle);
  intervalHandle = undefined;
}

