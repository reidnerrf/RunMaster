import NetInfo from '@react-native-community/netinfo';
import { flushOfflineQueue } from './navigationInsights';

export function startOfflineOrchestrator(userId?: string, sender?: (op: any) => Promise<boolean>) {
	const unsubscribe = NetInfo.addEventListener(async (state) => {
		if (state.isConnected) {
			await flushOfflineQueue(userId, sender ?? (async () => true));
		}
	});
	return () => unsubscribe();
}

