let Sentry: any = null;
let Amplitude: any = null;

try { Sentry = require('@sentry/react-native'); } catch {}
try { Amplitude = require('@amplitude/analytics-react-native'); } catch {}

export type ObservabilityConfig = {
	SENTRY_DSN?: string;
	AMPLITUDE_API_KEY?: string;
};

let amplitudeClient: any = null;

export async function initObservability(cfg: ObservabilityConfig) {
	if (Sentry && cfg.SENTRY_DSN) {
		Sentry.init({ dsn: cfg.SENTRY_DSN });
	}
	if (Amplitude && cfg.AMPLITUDE_API_KEY) {
		amplitudeClient = await Amplitude.init(cfg.AMPLITUDE_API_KEY);
	}
}

export function captureException(err: any) {
	if (Sentry) {
		Sentry.captureException(err);
	} else {
		console.error('[sentry]', err);
	}
}

export function trackEvent(name: string, props?: Record<string, any>) {
	if (amplitudeClient) amplitudeClient.track(name, props || {});
	else console.log('[amplitude]', name, props || {});
}