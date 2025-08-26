export interface LocalEvent {
  id: string;
  name: string;
  description: string;
  start: number;
  end: number;
  location: { lat: number; lng: number };
  radiusKm: number;
  type: 'festival' | 'market' | 'concert' | 'sports' | 'fair';
}

const eventsDb: LocalEvent[] = [
  { id: 'event_1', name: 'Feira da Liberdade', description: 'Culinária e cultura japonesa', start: Date.now()-86400000, end: Date.now()+86400000*3, location: { lat: -23.5560, lng: -46.6350 }, radiusKm: 0.5, type: 'market' },
  { id: 'event_2', name: 'Festival no Ibirapuera', description: 'Música ao vivo e esporte', start: Date.now()+86400000*5, end: Date.now()+86400000*7, location: { lat: -23.5882, lng: -46.6564 }, radiusKm: 1.0, type: 'festival' },
];

export function getNearbyEvents(userLocation: { lat: number; lng: number }, withinKm: number = 10): LocalEvent[] {
  return eventsDb.filter(e => distance(userLocation, e.location) <= withinKm);
}

export function enrichRoutesWithEvents<T extends { coordinates: { lat:number; lng:number }[]; name?: string }>(routes: T[], events: LocalEvent[]): T[] {
  return routes.map(r => {
    const hit = events.find(e => r.coordinates.some(c => distance(c, e.location) <= e.radiusKm));
    if (hit) {
      return Object.assign({}, r, { name: r.name ? `${r.name} • ${hit.name}` : `Rota • ${hit.name}` });
    }
    return r;
  });
}

function distance(a: { lat:number; lng:number }, b: { lat:number; lng:number }): number {
  const R=6371; const dLat=(b.lat-a.lat)*Math.PI/180; const dLng=(b.lng-a.lng)*Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}