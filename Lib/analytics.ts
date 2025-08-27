export type AnalyticsEvent = {
	name: string;
	props?: Record<string, any>;
	ts: number;
};

let userId: string | null = null;

export function identify(id: string) {
	userId = id;
	console.log('[analytics] identify', id);
}

export function track(name: string, props?: Record<string, any>) {
	const evt: AnalyticsEvent = { name, props: { ...(props || {}), userId: userId || undefined }, ts: Date.now() };
	console.log('[analytics] event', evt);
}

export function funnelStep(step: string, props?: Record<string, any>) {
	track(`funnel_${step}`, props);
}