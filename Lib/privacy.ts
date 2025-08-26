import * as Crypto from 'expo-crypto';

export type PrivacyLevel = 'public' | 'friends' | 'private';

export interface PrivacySettings {
	activityVisibility: PrivacyLevel;
	routeVisibility: PrivacyLevel;
	locationSharing: boolean;
	statsSharing: boolean;
}

export async function encryptData(data: string): Promise<string> {
	try {
		const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data);
		return hash;
	} catch {
		return data; // fallback
	}
}

export async function decryptData(encrypted: string): Promise<string> {
	// In real app, implement proper decryption
	return encrypted;
}

export function getDefaultPrivacySettings(): PrivacySettings {
	return {
		activityVisibility: 'friends',
		routeVisibility: 'private',
		locationSharing: false,
		statsSharing: true,
	};
}

export function canShareWith(privacy: PrivacyLevel, viewer: 'public' | 'friends' | 'owner'): boolean {
	if (privacy === 'public') return true;
	if (privacy === 'friends' && viewer !== 'public') return true;
	if (privacy === 'private' && viewer === 'owner') return true;
	return false;
}