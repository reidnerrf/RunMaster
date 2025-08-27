import { EventEmitter } from 'events';

type BridgeEvent =
	| { type: 'run_control'; action: 'start' | 'pause' | 'resume' | 'stop' }
	| { type: 'metrics'; payload: Record<string, unknown> };

const emitter = new EventEmitter();

export const watchNative = {
	connect() {
		// TODO: integrate WCSession here
	},
	disconnect() {
		// TODO
	},
	send(event: BridgeEvent) {
		// TODO: WCSession send
		console.log('[watchNative.ios] send', event);
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

