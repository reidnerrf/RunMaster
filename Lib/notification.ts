let Notifications: any = null;
try { Notifications = require('expo-notifications'); } catch {}

export async function ensureRunTrackingChannel() {
  if (!Notifications || !Notifications.setNotificationChannelAsync) return;
  try {
    await Notifications.setNotificationChannelAsync('run-tracking', {
      name: 'Rastreamento de corrida',
      importance: Notifications.AndroidImportance?.HIGH ?? 4,
      sound: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: 1,
      lightColor: '#FF6B00',
    });
  } catch {}
}