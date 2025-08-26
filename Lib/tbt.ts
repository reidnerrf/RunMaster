export type TbtStep = {
  lat: number;
  lon: number;
  instruction: string; // e.g., 'Vire à esquerda', 'Siga em frente'
  distanceToNextM?: number;
};

export type TbtState = {
  currentIndex: number;
  nextInstruction?: string;
  distanceToNextM?: number;
};

export function computeBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  const brng = Math.atan2(y, x);
  return (toDeg(brng) + 360) % 360;
}

export function haversineM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function buildMockRoute(center: { lat: number; lon: number }): TbtStep[] {
  return [
    { lat: center.lat, lon: center.lon, instruction: 'Siga em frente 300 m' },
    { lat: center.lat + 0.001, lon: center.lon, instruction: 'Vire à direita' },
    { lat: center.lat + 0.001, lon: center.lon + 0.002, instruction: 'Vire à esquerda' },
    { lat: center.lat, lon: center.lon + 0.002, instruction: 'Chegada' },
  ];
}

export function nextTbt(current: { lat: number; lon: number }, steps: TbtStep[], prevIndex: number = 0): TbtState {
  if (steps.length === 0) return { currentIndex: 0 };
  let idx = prevIndex;
  let dist = haversineM(current.lat, current.lon, steps[idx].lat, steps[idx].lon);
  while (idx < steps.length - 1 && dist < 30) {
    idx += 1;
    dist = haversineM(current.lat, current.lon, steps[idx].lat, steps[idx].lon);
  }
  return { currentIndex: idx, nextInstruction: steps[idx].instruction, distanceToNextM: Math.round(dist) };
}