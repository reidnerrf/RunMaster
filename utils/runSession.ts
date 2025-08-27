export type RunPhase = 'idle' | 'running' | 'paused' | 'stopped';

export type RunState = {
	phase: RunPhase;
	startTs?: number;
	pausedAccumulatedMs: number;
	lastPauseTs?: number;
};

type Listener = (state: RunState) => void;

const state: RunState = {
	phase: 'idle',
	pausedAccumulatedMs: 0,
};

const listeners = new Set<Listener>();

function notify() {
	for (const l of listeners) l({ ...state });
}

export function subscribe(listener: Listener): () => void {
	listeners.add(listener);
	listener({ ...state });
	return () => listeners.delete(listener);
}

export function startRun(): void {
	if (state.phase === 'running') return;
	state.phase = 'running';
	state.startTs = Date.now();
	state.pausedAccumulatedMs = 0;
	state.lastPauseTs = undefined;
	notify();
}

export function pauseRun(): void {
	if (state.phase !== 'running') return;
	state.phase = 'paused';
	state.lastPauseTs = Date.now();
	notify();
}

export function resumeRun(): void {
	if (state.phase !== 'paused') return;
	const now = Date.now();
	if (state.lastPauseTs) state.pausedAccumulatedMs += now - state.lastPauseTs;
	state.lastPauseTs = undefined;
	state.phase = 'running';
	notify();
}

export function stopRun(): void {
	if (state.phase === 'idle') return;
	state.phase = 'stopped';
	notify();
}

export function getState(): RunState {
	return { ...state };
}

