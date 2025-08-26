let Sensors: any = null;
try { Sensors = require('expo-sensors'); } catch {}

export interface BiomechSample {
  t: number; // timestamp
  ax: number; ay: number; az: number; // accel
  gx?: number; gy?: number; gz?: number; // gyro
}

export interface BiomechMetrics {
  cadenceSpm: number;
  groundContactTimeMs: number; // proxy
  verticalOscillationCm: number; // proxy
  impactG: number;
  leftRightBalance: number; // 0-100 (50 ideal)
  symmetryScore: number; // 0-100
  recommendations: string[];
}

export class BiomechanicsAnalyzer {
  private samples: BiomechSample[] = [];

  public addSample(s: BiomechSample) { this.samples.push(s); }

  public analyze(): BiomechMetrics {
    if (!this.samples.length) {
      return { cadenceSpm: 0, groundContactTimeMs: 0, verticalOscillationCm: 0, impactG: 0, leftRightBalance: 50, symmetryScore: 50, recommendations: ['Colete dados em corrida'] };
    }

    // Cadência estimada por pico de aceleração vertical (az)
    const peaks = peakCount(this.samples.map(s=> s.az));
    const durationSec = (this.samples[this.samples.length-1].t - this.samples[0].t)/1000;
    const cadenceSpm = Math.round((peaks / Math.max(1, durationSec)) * 60);

    // Impacto (g)
    const impactG = Math.max(...this.samples.map(s=> Math.abs(s.az))) / 9.81;

    // Contato no solo (proxy): inverso do pico de az médio
    const avgPeak = averagePeak(this.samples.map(s=> s.az));
    const groundContactTimeMs = Math.round(250 - Math.min(100, avgPeak*10));

    // Oscilação vertical (proxy): variação de az
    const variance = varianceOf(this.samples.map(s=> s.az));
    const verticalOscillationCm = Math.round(Math.min(12, Math.max(4, variance * 2)));

    // Balanço L/R (sem dados de perna: estimado via componentes x/y)
    const lr = Math.abs(this.samples.reduce((acc,s)=> acc + s.ax,0));
    const fb = Math.abs(this.samples.reduce((acc,s)=> acc + s.ay,0));
    const leftRightBalance = Math.max(30, Math.min(70, 50 + (lr - fb)));

    // Simetria (proxy)
    const symmetryScore = Math.max(30, Math.min(90, 90 - Math.abs(50-leftRightBalance)));

    const recommendations: string[] = [];
    if (cadenceSpm < 160) recommendations.push('Aumente a cadência gradualmente (+5 spm)');
    if (impactG > 3) recommendations.push('Aterre mais suave; aumente a cadência e inclinação do tronco');
    if (verticalOscillationCm > 10) recommendations.push('Reduza oscilação vertical; foque em passos curtos');

    return { cadenceSpm, groundContactTimeMs, verticalOscillationCm, impactG: Number(impactG.toFixed(2)), leftRightBalance, symmetryScore, recommendations };
  }
}

function peakCount(arr: number[]): number {
  let count = 0;
  for (let i=1;i<arr.length-1;i++) { if (arr[i] > arr[i-1] && arr[i] > arr[i+1] && arr[i] > 1.2*9.81) count++; }
  return count;
}

function averagePeak(arr: number[]): number {
  let sum = 0; let c = 0;
  for (let i=1;i<arr.length-1;i++) { if (arr[i] > arr[i-1] && arr[i] > arr[i+1]) { sum += arr[i]; c++; } }
  return c ? sum/c : 0;
}

function varianceOf(arr: number[]): number {
  const mean = arr.reduce((a,b)=> a+b,0)/arr.length;
  return arr.reduce((a,b)=> a + Math.pow(b-mean,2), 0)/arr.length;
}

export function createBiomechanicsAnalyzer(): BiomechanicsAnalyzer { return new BiomechanicsAnalyzer(); }