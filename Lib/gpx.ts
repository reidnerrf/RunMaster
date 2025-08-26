import { addRoute } from './routeStore';

function parseGpx(xml: string) {
  // Minimal GPX parser (lat,lon points). Not robust, but fine for demo.
  const trkptRegex = /<trkpt[^>]*lat="([\d\.-]+)"[^>]*lon="([\d\.-]+)"[^>]*>/g;
  const points: { latitude: number; longitude: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = trkptRegex.exec(xml))) {
    points.push({ latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) });
  }
  return points;
}

function computeDistanceKm(points: { latitude: number; longitude: number }[]) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  let d = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const c = 2 * Math.asin(Math.sqrt(Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2));
    d += R * c;
  }
  return d;
}

export async function importGpxFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha ao baixar GPX');
  const xml = await res.text();
  const pts = parseGpx(xml);
  if (pts.length < 2) throw new Error('GPX sem pontos suficientes');
  const distance_km = computeDistanceKm(pts);
  await addRoute({ name: `GPX ${new Date().toLocaleDateString()}`, distance_km, notes: 'Importado de GPX', points: pts });
}

