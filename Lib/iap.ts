let Purchases: any = null;
try { Purchases = require('react-native-purchases'); } catch {}

export type IapPurchaseResult = { success: boolean; receipt?: string; productId?: string; error?: string };

export async function iapSetup(apiKey?: string) {
	if (!Purchases || !apiKey) return;
	try {
		await Purchases.configure({ apiKey });
	} catch (e: any) {
		console.warn('[iap] setup failed', e?.message || e);
	}
}

export async function iapPurchase(productId: string): Promise<IapPurchaseResult> {
	if (!Purchases) {
		console.log('[iap] fallback purchase for', productId);
		return { success: true, productId, receipt: 'mock_receipt_' + Date.now() };
	}
	try {
		const res = await Purchases.purchasePackage(productId as any);
		// The actual SDK returns a purchaserInfo / customerInfo; simplify for demo
		return { success: true, productId, receipt: JSON.stringify(res) };
	} catch (e: any) {
		return { success: false, error: e?.message || 'purchase_failed' };
	}
}

export async function iapRestore(): Promise<IapPurchaseResult> {
	if (!Purchases) return { success: false, error: 'not_available' };
	try {
		const res = await Purchases.restorePurchases();
		return { success: true, receipt: JSON.stringify(res) };
	} catch (e: any) {
		return { success: false, error: e?.message || 'restore_failed' };
	}
}