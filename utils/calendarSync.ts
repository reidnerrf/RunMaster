import { Platform } from 'react-native';
import { track } from './analyticsClient';
import * as Calendar from 'expo-calendar';

let defaultCalendarId: string | null = null;

export async function ensureCalendar(): Promise<string | null> {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') return null;
    const calendars = await Calendar.getCalendarsAsync(Calendar.CalendarEntityType.EVENT);
    const existing = calendars.find((c) => c.title === 'Pulse Treinos');
    if (existing) { defaultCalendarId = existing.id; return existing.id; }
    const source = Platform.OS === 'ios' ? (await Calendar.getDefaultCalendarAsync())?.source : { isLocalAccount: true, name: 'Pulse' } as any;
    const id = await Calendar.createCalendarAsync({
      title: 'Pulse Treinos',
      color: '#6C63FF',
      entityType: Calendar.CalendarEntityType.EVENT,
      sourceId: Platform.OS === 'ios' ? source?.id : undefined,
      source: Platform.OS === 'android' ? source : undefined,
      name: 'Pulse',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    defaultCalendarId = id;
    return id;
  } catch {
    return null;
  }
}

export type CalendarEventInput = { title: string; notes?: string; startDate: Date; endDate: Date; location?: string };

export async function addEventToCalendar(ev: CalendarEventInput): Promise<string | null> {
  try {
    const calId = defaultCalendarId || (await ensureCalendar());
    if (!calId) return null;
    const eventId = await Calendar.createEventAsync(calId, {
      title: ev.title,
      notes: ev.notes,
      startDate: ev.startDate,
      endDate: ev.endDate,
      location: ev.location,
      timeZone: undefined,
    });
    try { await track('calendar_sync', { direction: 'write', items: 1 }); } catch {}
    return eventId;
  } catch {
    return null;
  }
}

export async function syncToCalendar(direction: 'write' | 'read', items: number): Promise<boolean> {
  try { await track('calendar_sync', { direction, items }); } catch {}
  return true;
}

