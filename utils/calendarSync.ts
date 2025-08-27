import { Platform } from 'react-native';
import { track } from './analyticsClient';

export async function syncToCalendar(direction: 'write' | 'read', items: number): Promise<boolean> {
  try {
    await track('calendar_sync', { direction, items });
  } catch {}
  // Stub: integrate with EventKit/Calendar Provider
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

