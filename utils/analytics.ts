import { track as rawTrack } from '@/utils/analyticsClient';

export function track(event: string, props?: Record<string, any>) {
  try { rawTrack(event, props || {}); } catch {}
}

export function screenView(name: string, params?: Record<string, any>) {
  track('screen_view', { name, ...params });
}

export function tap(name: string, params?: Record<string, any>) {
  track('tap', { name, ...params });
}

