import { EventEmitter } from 'events';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

type BridgeEvent =
	| { type: 'run_control'; action: 'start' | 'pause' | 'resume' | 'stop' }
	| { type: 'metrics'; payload: Record<string, unknown> };

const emitter = new EventEmitter();
const Native = (NativeModules as any)?.WatchConnectivity as
	| { connect: () => void; disconnect: () => void; send: (type: string, payload: string) => void }
	| undefined;
const NativeEmitter = Native ? new NativeEventEmitter(NativeModules.WatchConnectivity) : null;

export const watchNative = {
	connect() {
		if (Platform.OS !== 'android') return;
		if (Native) {
			NativeEmitter?.addListener('message', (event) => {
				try {
					const parsed = JSON.parse(event?.payload ?? '{}');
					emitter.emit('message', parsed);
				} catch {}
			});
			Native.connect();
		}
	},
	disconnect() {
		if (Platform.OS !== 'android') return;
		Native?.disconnect();
	},
	send(event: BridgeEvent) {
		if (Platform.OS !== 'android') return;
		if (Native) {
			Native.send(event.type, JSON.stringify(event));
		} else {
			console.log('[watchNative.android] send (js)', event);
		}
	},
	onMessage(cb: (event: BridgeEvent) => void) {
		emitter.on('message', cb);
		return () => emitter.off('message', cb);
	},
	// test helper
	__emit(event: BridgeEvent) {
		emitter.emit('message', event);
	},
};

