export type RunnerProfileType = 'speedster' | 'endurance' | 'trail' | 'social';

export interface RitualPreset {
  id: string;
  name: string;
  profile: RunnerProfileType;
  warmup: string[];
  cooldown: string[];
  mobility: string[];
  durationMin: number;
}

export class RitualsManager {
  private presets: RitualPreset[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    this.presets = [
      { id: 'speedster-basic', name: 'Explosão Rápida', profile: 'speedster', durationMin: 15, warmup: ['10min trot','3x30s strides','A/B skips'], cooldown: ['5min walk','hamstrings stretch','hips mobility'], mobility: ['ankle mobility','hip openers'] },
      { id: 'endurance-base', name: 'Base Consistente', profile: 'endurance', durationMin: 12, warmup: ['8min easy','drills form'], cooldown: ['8min easy','quads stretch'], mobility: ['thoracic rotation'] },
      { id: 'trail-flow', name: 'Flow na Trilha', profile: 'trail', durationMin: 18, warmup: ['hike 5min','ankle hops','glute activation'], cooldown: ['downhill walk','calves stretch'], mobility: ['ankle/hip combo'] },
      { id: 'social-fun', name: 'Social Leve', profile: 'social', durationMin: 10, warmup: ['chat jog','dynamic stretch'], cooldown: ['group walk','photos'], mobility: ['neck/shoulder relax'] },
    ];
  }

  public getPresets(profile: RunnerProfileType): RitualPreset[] {
    return this.presets.filter(p => p.profile === profile);
  }

  public getPresetById(id: string): RitualPreset | undefined {
    return this.presets.find(p => p.id === id);
  }
}

export function createRitualsManager(): RitualsManager { return new RitualsManager(); }