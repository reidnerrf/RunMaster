export type CreativeChallengeType = 'map_drawing' | 'place_initials';

export interface CreativeChallenge {
  id: string;
  type: CreativeChallengeType;
  name: string;
  description: string;
  rules: string[];
  target?: any;
  reward: string;
  expiresAt?: number;
}

export interface RunPathPoint { lat: number; lng: number }

export class CreativeChallengesManager {
  private challenges: CreativeChallenge[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    this.challenges = [
      { id: 'draw-heart', type: 'map_drawing', name: 'Desenhe um coração', description: 'Crie um desenho de coração com sua rota', rules: ['Distância mínima 3km'], target: 'heart', reward: 'Badge Coração' },
      { id: 'places-A', type: 'place_initials', name: 'A de Aventura', description: 'Passe por 3 lugares que começam com A', rules: ['Mínimo 3 pontos'], target: 'A', reward: 'Badge Alfabeto' },
    ];
  }

  public getActive(): CreativeChallenge[] { return this.challenges; }

  public evaluateMapDrawing(path: RunPathPoint[], target: string): boolean {
    // Heurística simplificada: usa bounding box aspect ratio/curvatura
    if (target === 'heart') {
      const bbox = boundingBox(path);
      const ratio = bbox.width/bbox.height;
      return ratio > 0.8 && ratio < 1.2 && path.length > 50;
    }
    return false;
  }

  public evaluatePlaceInitials(places: string[], initial: string): boolean {
    const count = places.filter(p => p.toUpperCase().startsWith(initial.toUpperCase())).length;
    return count >= 3;
  }
}

function boundingBox(path: RunPathPoint[]) {
  const lats = path.map(p => p.lat); const lngs = path.map(p => p.lng);
  const minLat = Math.min(...lats); const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs); const maxLng = Math.max(...lngs);
  return { width: distance({lat:minLat,lng:minLng},{lat:minLat,lng:maxLng}), height: distance({lat:minLat,lng:minLng},{lat:maxLat,lng:minLng}) };
}

function distance(a: { lat:number; lng:number }, b: { lat:number; lng:number }): number {
  const R=6371; const dLat=(b.lat-a.lat)*Math.PI/180; const dLng=(b.lng-a.lng)*Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}

export function createCreativeChallengesManager(): CreativeChallengesManager { return new CreativeChallengesManager(); }