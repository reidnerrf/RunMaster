import { Run } from './runStore';

export function toGPX(run: Run): string {
  const header = `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="RunMaster"><trk><name>Run ${new Date(run.startedAt).toISOString()}</name><trkseg>`;
  const pts = (run.path || []).map(p => `<trkpt lat="${p.latitude}" lon="${p.longitude}"><time>${new Date(p.timestamp).toISOString()}</time></trkpt>`).join('');
  const footer = `</trkseg></trk></gpx>`;
  return header + pts + footer;
}

export function toTCX(run: Run): string {
  const header = `<?xml version="1.0" encoding="UTF-8"?><TrainingCenterDatabase><Activities><Activity Sport="Running"><Id>${new Date(run.startedAt).toISOString()}</Id><Lap StartTime="${new Date(run.startedAt).toISOString()}"><Track>`;
  const pts = (run.path || []).map(p => `<Trackpoint><Time>${new Date(p.timestamp).toISOString()}</Time><Position><LatitudeDegrees>${p.latitude}</LatitudeDegrees><LongitudeDegrees>${p.longitude}</LongitudeDegrees></Position></Trackpoint>`).join('');
  const footer = `</Track></Lap></Activity></Activities></TrainingCenterDatabase>`;
  return header + pts + footer;
}

export async function shareText(name: string, data: string) {
  try {
    const Share = require('react-native').Share;
    await Share.share({ title: name, message: data.slice(0, 5000) });
  } catch {}
}