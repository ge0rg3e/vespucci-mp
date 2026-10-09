import amplitude from 'amplitude-js';

// Dependencies
import { isServerSide, logError } from './helpers';
import pkg from '../../package.json';
import Axios from 'axios';

export function repeatString(s: string, times: number) {
	// eslint-disable-next-line
	for (var i = 0, r = ''; i < times; i++) {
		r += s;
	}
	return r;
}

export const formatUsernameAmplitude = (name: string) => {
	let username = name;

	if (username && username.length < 5) {
		const missingLength = 5 - username.length;
		username = `${username}` + repeatString(`*`, missingLength);
	}

	return username;
};

const generateDeviceId = async () => {
	try {
		const { data } = await Axios('https://api.ipify.org/?format=json');
		return data.ip.replace(/\./g, '_');
	} catch (err) {
		throw err;
	}
};

const getAmplitudeGuestId = async () => {
	const guestId = localStorage.getItem('amplitude_guest_id');
	if (guestId) return guestId;

	const newId = `Guest#${Math.floor(Math.random() * 99999)}`;
	localStorage.setItem('amplitude_guest_id', newId);
	return newId;
};

export const createAmplitudeEvent = async (title: string, payload?: Record<string, ExpectedAny>) => {
	if (isServerSide()) return;
	if (window.account === undefined) return false; // @Bugfix: is neither logged in or logged out. we must wait 1 second until the api decides.

	try {
		const project = amplitude.getInstance();
		const projectKey: ExpectedAny = window.account ? process.env.NEXT_PUBLIC_AMPLITUDE_USERS : process.env.NEXT_PUBLIC_AMPLITUDE_GUESTS;
		const userId = window.account ? window.account.username : await getAmplitudeGuestId();

		// If there is no project key..
		if (!projectKey) throw new Error(`Missing AMPLITUDE KEY.`);

		// Get device id..
		let deviceId: ExpectedAny = await localStorage.getItem('amplitude_device_id');

		if (!deviceId) {
			const ip = await generateDeviceId();
			await localStorage.setItem(`amplitude_device_id`, ip);
			deviceId = ip;
		}

		project.init(projectKey);
		project.setUserId(formatUsernameAmplitude(userId));
		project.setDeviceId(deviceId);

		await project.logEvent(title, {
			...(payload || {}),
			client_version: pkg.version,
			language: window.language
		});

		if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
			console.info(`[AMPLITUDE] ${title} `, payload || {});
		}
	} catch (err) {
		await logError(`CREATE_AMPLITUDE`, err);
		console.error(err);
	}
};
