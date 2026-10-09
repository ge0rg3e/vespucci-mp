import { isDevServer, logError } from '@/utils/helpers';
import moment from 'moment';
import Axios from 'axios';

/**
 *
 * @param id the route id
 * @returns true if this route is supposed to have a closing bar.
 */

export const isNativeRouteClosable = (id: string) => {
	if (id === 'phone') return true;
	if (id === 'messages') return true;
	return false;
};

/**
 * This function tells us what routes are considered "native"
 * Native routes have different treatment thorought the app.
 * @param routeId The id of the phone route
 * @returns boolean
 */

export const isNativePhoneRoute = (routeId: string) => {
	const natives = ['lockscreen', 'home', `notFound`, 'phone', 'messages'];
	return natives.includes(routeId) ? true : false;
};

/**
 *
 * @param arr - Array of phone notifications
 * @returns The array of phone notifications that should be above the phone.
 */

export const sortPopupNotifications = (arr: FixableAny) =>
	arr
		.filter((notify: FixableAny) =>
			moment(notify.date).isAfter(moment().subtract(15, 'seconds'))
		)
		.sort((a: FixableAny, b: FixableAny) => b.date - a.date)
		.slice(0, 3);

/**
 * This checks if we're in development mode for the phone.
 * @returns boolean
 */

export const isPhoneDevelopment = () =>
	window.location.pathname === '/' &&
	window.mp.fake &&
	isDevServer() &&
	window.location.href.includes('?phoneRaised')
		? true
		: false;

/**
 * Checks if the given audio link is valid and exists.
 * @param {string} audioLink - The URL of the audio file.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the audio link is valid and exists, or false otherwise.
 */

export async function validateAudioLink(audioLink: string) {
	try {
		const response = await Axios.head(audioLink); // Send a HEAD request to retrieve audio metadata only

		// Check the response status
		if (response.status === 200) {
			return true; // Audio link is valid and exists
		} else {
			return false; // Audio link is invalid or does not exist
		}
	} catch (error) {
		console.error('Error occurred while validating audio link:', error);
		return false; // An error occurred while fetching the audio link
	}
}

/**
 * This will get the meta data from the game storage.
 * @returns Their data or null.
 */

export const getGameLocalStorage = async (id: string) => {
	try {
		const meta: ExpectedAny = await window.rpc.callClient(
			'getLocalStorage',
			JSON.stringify({ id })
		);
		return meta;
	} catch (err) {
		await logError(`getGameLocalStorage`, err, { id });
		return null;
	}
};

/**
 * This will get the meta data from the game storage.
 * @returns Their data or null.
 */

export const setGameLocalStorage = async (id: string, payload: ExpectedAny) => {
	try {
		// Update player meta..
		window.rpc.triggerClient(
			`updateLocalStorage`,
			JSON.stringify({
				key: id,
				payload
			})
		);

		return true;
	} catch (err) {
		await logError(`setGameLocalStorage`, err, { id, payload });
		return false;
	}
};
