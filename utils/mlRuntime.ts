// Optional ONNX runtime loader. Falls back to null if the native module isn't installed.

type OnnxSession = {
	run: (feeds: Record<string, any>) => Promise<Record<string, any>>;
};

let session: OnnxSession | null = null;
let modelName = 'nav_suggester';
let modelVersion = '0.0.1';

export function isModelLoaded(): boolean {
	return session !== null;
}

export function getModelInfo(): { name: string; version: string } | null {
	return session ? { name: modelName, version: modelVersion } : null;
}

export async function loadLocalModel(_uri?: string): Promise<boolean> {
	try {
		// Dynamically import to avoid runtime errors if module is missing
		const ort = await import('onnxruntime-react-native');
		if (!_uri) {
			// No model path provided; keep null
			session = null;
			return false;
		}
		const resp = await fetch(_uri);
		const buffer = await resp.arrayBuffer();
		// @ts-ignore
		session = await (ort as any).InferenceSession.create(buffer);
		return true;
	} catch {
		session = null;
		return false;
	}
}

export async function scoreWithLocalModel(
	candidates: string[],
	features: number[][]
): Promise<number[] | null> {
	if (!session) return null;
	try {
		// Example feed structure; adapt when a real model is integrated
		const feeds = { X: features };
		const outputs = await session.run(feeds);
		const scores: number[] = outputs['scores'] as any;
		if (Array.isArray(scores) && scores.length === candidates.length) return scores;
		return null;
	} catch {
		return null;
	}
}

