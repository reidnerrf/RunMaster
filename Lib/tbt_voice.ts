import * as Haptics from 'expo-haptics';
let Speech: any = null; try { Speech = require('expo-speech'); } catch {}

export function speakInstruction(text: string) {
  try { if (Speech && Speech.speak) Speech.speak(text, { language: 'pt-BR' }); } catch {}
}

export async function cueHaptic(distanceM: number) {
  try {
    if (distanceM <= 25) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (distanceM <= 120) await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {}
}