import { setSettings } from './settings';

let AppleHealth: any = null; try { AppleHealth = require('@kingstinct/react-native-healthkit'); } catch {}
let GoogleFit: any = null; try { GoogleFit = require('react-native-google-fit'); } catch {}

export async function connectHealth() {
  try {
    if (AppleHealth && AppleHealth.requestAuthorization) {
      await AppleHealth.requestAuthorization(['ActiveEnergyBurned', 'HeartRate']);
    }
    if (GoogleFit && GoogleFit.checkIsAuthorized) {
      GoogleFit.checkIsAuthorized();
    }
  } catch {}
  await setSettings({ healthConnected: true });
}

export async function writeWorkoutStub() {
  // Apenas stub — produção exigirá schemas específicos
  try { if (AppleHealth?.saveWorkout) await AppleHealth.saveWorkout({}); } catch {}
}