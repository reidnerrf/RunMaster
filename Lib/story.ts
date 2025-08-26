let ImageManipulator: any = null; try { ImageManipulator = require('expo-image-manipulator'); } catch {}

export async function generateStoryCard({ distanceKm, avgPace }: { distanceKm: number; avgPace: string }): Promise<{ uri?: string; prompt?: string }> {
  if (!ImageManipulator?.manipulateAsync) {
    const prompt = `Crie uma imagem quadrada estilo poster esportivo com mapa sutil ao fundo, texto grande "${distanceKm.toFixed(2)} km" e subtítulo "pace ${avgPace}", cores preto e laranja (#FF7E47).`;
    return { prompt };
  }
  // Fallback simples: retornar um background sólido (mock). Em produção, desenharíamos com GL/Canvas.
  const { uri } = await ImageManipulator.manipulateAsync('https://dummyimage.com/800x800/262626/ffffff.png&text=Run', [], { compress: 0.9, format: ImageManipulator.SaveFormat.PNG });
  return { uri };
}