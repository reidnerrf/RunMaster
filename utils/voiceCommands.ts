import * as Linking from 'expo-linking';
import { startRun, stopRun, pauseRun, resumeRun } from './runSession';
import { Router } from 'expo-router';
import { track } from './analyticsClient';

export async function handleIncomingUrl(url: string | null, router: Router) {
	if (!url) return;
	try {
		const parsed = Linking.parse(url);
		// Support: pulse://run/start or pulse://command?name=start_run
		const path = parsed.path ?? '';
		const name = (parsed.queryParams?.name as string | undefined) ?? '';
		if (path.startsWith('run/')) {
			const action = path.split('/')[1];
			await handleAction(action, router);
			track('deeplink_open', { url, route: '/run', source: 'external' }).catch(() => {});
			return;
		}
		if (name) {
			await handleAction(name.replace('_run', ''), router);
		}
	} catch (e) {
		console.warn('Failed to handle url', url, e);
	}
}

async function handleAction(action: string, router: Router) {
	switch (action) {
		case 'start':
		case 'start_run':
			startRun();
			router.push('/run');
			break;
		case 'pause':
		case 'pause_run':
			pauseRun();
			router.push('/run');
			break;
		case 'resume':
		case 'resume_run':
			resumeRun();
			router.push('/run');
			break;
		case 'stop':
		case 'stop_run':
			stopRun();
			router.push('/run');
			break;
		default:
			break;
	}
}

