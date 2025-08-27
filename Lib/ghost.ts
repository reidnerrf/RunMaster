export interface GhostRun {
  id: string;
  type: 'famous' | 'friend' | 'self';
  name: string;
  avatarUrl?: string;
  routeId: string;
  splitsSec: number[]; // por km
  totalSec: number;
  date: number;
  visibility: 'public' | 'friends' | 'private';
}

export interface GhostComparison {
  routeId: string;
  userSplitsSec: number[];
  ghostSplitsSec: number[];
  diffPerKmSec: number[];
  totalDiffSec: number;
  aheadKmMarkers: number[];
  behindKmMarkers: number[];
}

export class GhostManager {
  private ghosts: GhostRun[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // Ghost de corredor famoso e self (passado)
    this.ghosts.push({ id: 'bolt-10k', type: 'famous', name: 'Elite 10K', routeId: 'rota-historica', splitsSec: Array.from({length:10}, (_,i)=> 180 + (i%3)*2), totalSec: 1820, date: Date.now()-86400000*90, visibility: 'public' });
  }

  public addGhost(g: GhostRun) { this.ghosts.push(g); }

  public getGhostsForRoute(routeId: string): GhostRun[] {
    return this.ghosts.filter(g => g.routeId === routeId);
  }

  public compareWithGhost(routeId: string, userSplitsSec: number[], ghostId: string): GhostComparison | null {
    const ghost = this.ghosts.find(g => g.id === ghostId && g.routeId === routeId);
    if (!ghost) return null;
    const maxK = Math.min(userSplitsSec.length, ghost.splitsSec.length);
    const diffPerKmSec = Array.from({length: maxK}, (_,i)=> userSplitsSec[i] - ghost.splitsSec[i]);
    const totalDiffSec = diffPerKmSec.reduce((a,b)=> a+b, 0);
    const aheadKmMarkers = diffPerKmSec.map((d,i)=> d < 0 ? i+1 : -1).filter(i=> i>0);
    const behindKmMarkers = diffPerKmSec.map((d,i)=> d > 0 ? i+1 : -1).filter(i=> i>0);
    return { routeId, userSplitsSec, ghostSplitsSec: ghost.splitsSec, diffPerKmSec, totalDiffSec, aheadKmMarkers, behindKmMarkers };
  }
}

export function createGhostManager(): GhostManager { return new GhostManager(); }