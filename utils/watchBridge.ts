import { EventEmitter } from 'events';
import { pauseRun, resumeRun, startRun, stopRun } from './runSession';

type BridgeEvent =
	| { type: 'run_control'; action: 'start' | 'pause' | 'resume' | 'stop' }
	| { type: 'metrics'; payload: Record<string, unknown> };

class WatchBridgeImpl {
	private paired = false;
	private emitter = new EventEmitter();

	connect() {
		this.paired = true;
	}

	disconnect() {
		this.paired = false;
	}

	isPaired() {
		return this.paired;
	}

	onMessage(cb: (event: BridgeEvent) => void) {
		this.emitter.on('message', cb);
		return () => this.emitter.off('message', cb);
	}

	// Simula recebimento do relógio
	receive(event: BridgeEvent) {
		if (!this.paired) return;
		this.emitter.emit('message', event);
		if (event.type === 'run_control') {
			if (event.action === 'start') startRun();
			if (event.action === 'pause') pauseRun();
			if (event.action === 'resume') resumeRun();
			if (event.action === 'stop') stopRun();
		}
	}

	send(event: BridgeEvent) {
		// Em produção, enviar via WCSession/Data Layer
		console.log('[WatchBridge] send', event);
	}
}

export const WatchBridge = new WatchBridgeImpl();

