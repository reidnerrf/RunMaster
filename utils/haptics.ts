import * as Haptics from 'expo-haptics';

export async function hapticSelection() {
  try { await Haptics.selectionAsync(); } catch {}
}

export async function hapticSuccess() {
  try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
}

export async function hapticWarning() {
  try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
}

export async function hapticError() {
  try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); } catch {}
}

