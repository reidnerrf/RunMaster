import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

export async function downloadModel(uri: string, expectedSha256?: string): Promise<string> {
	const fileName = `model_${hash(uri)}.onnx`;
	const target = FileSystem.cacheDirectory + fileName;
	const res = await FileSystem.downloadAsync(uri, target);
	if (expectedSha256) {
		const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, await FileSystem.readAsStringAsync(res.uri, { encoding: FileSystem.EncodingType.Base64 }));
		if (!equalsIgnoreCase(digest, expectedSha256)) {
			await FileSystem.deleteAsync(res.uri, { idempotent: true });
			throw new Error('Checksum mismatch');
		}
	}
	return res.uri;
}

function hash(s: string): string {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
	return Math.abs(h).toString(16);
}

function equalsIgnoreCase(a: string, b: string): boolean {
	return a?.toLowerCase() === b?.toLowerCase();
}

