import Axios from 'axios';
import { red } from 'colorette';

// This will be invoked whenever our code is badly written and it's not catching the rejections.
process.on('unhandledRejection', async (err) => {
	if (process.env.NODE_ENV !== 'development') {
		await logError(`UNHANDLED_REJECTION_FATAL`, err);
	} else {
		console.error(`${red('[UNHANDLED REJECTION]')}`, err);
	}
});

// Logz.io
const parseErrorBody = (err: ExpectedAny) => {
	if (err && err.response && err.request) {
		return JSON.stringify({
			responseData: err.response.data,
			responseStatus: err.response.status,
			requestBody: err.config.data,
			requestMethod: err.config.method,
			requestUrl: err.config.url,
			requestHeaders: err.config.headers
		});
	} else if (err.stack !== undefined) {
		return JSON.stringify({
			internalErrorStack: err.stack
		});
	} else if (err && typeof err === 'string') {
		return err;
	} else return `Error couldn't be parsed.`;
};

/**
 *
 * @param error_code: ERROR_LOGIN
 * @param error : The error object
 * @param payload: A json object you could attach for debugging purposes
 * @description: This sends a log to logz.io
 */
export const logError = async (error_code: string, error: ExpectedAny, payload: Record<string, ExpectedAny> = {}, username = null) => {
	try {
		// Settings
		const environment: string = process.env.ENVIRONMENT!;

		if (!['local', 'staging', 'production'].includes(environment)) {
			throw new Error(`The logz.io environment variable is invalid.`);
		}

		const logBody = {
			error_code: error_code,
			message: `${error_code}${error.message ? ` - ${error.message}` : ``}`,
			payload: payload ? JSON.stringify(payload) : 'None.',
			error: parseErrorBody(error),
			server_version: '__VERSION__',
			environment: environment,
			username: username ? username : 'Not logged in'
		};

		const endpoint = `https://${process.env.LOGZ_HOST}:8071/?token=${process.env.LOGZ_KEY}&type=RAGEMP-SERVER`;
		await Axios.post(`${endpoint}`, `${JSON.stringify(logBody)}`);

		console.info(`Error Logged`, { error_code, raw_error: error, payload });
	} catch (err) {
		console.error('Failed to log error event', err);
	}
};

export const createAmplitudeEvent = async (user_id: string, device_id: string, event_title: string, event_properties = {}, user_properties = {}, amplitude_meta_info = {}) => {
	try {
		await Axios(`https://api.amplitude.com/2/httpapi`, {
			method: `POST`,
			data: {
				api_key: process.env?.AMPLITUDE_KEY,
				events: [
					{
						user_id: user_id,
						device_id: device_id,
						event_type: event_title,
						event_properties: {
							...event_properties,
							server_version: '__VERSION__'
						},
						user_properties: user_properties,
						...amplitude_meta_info
					}
				]
			},
			headers: {
				'Content-Type': 'application/json',
				Accept: '*/*'
			}
		});
	} catch (err) {
		console.error(`[Amplitude error] Failed to save amplitude event`, parseErrorBody(err));
		throw err;
	}
};

export function repeatString(s: string, times: number) {
	// eslint-disable-next-line
	for (var i = 0, r = ''; i < times; i++) {
		r += s;
	}
	return r;
}

export const formatUsernameAmplitude = (name: string) => {
	let username = name;

	if (username.length < 5) {
		const missingLength = 5 - username.length;
		username = `${username}` + repeatString(`*`, missingLength);
	}

	return username;
};

export const formatNumber = (number: number, includeMoneySymbol = false, decalsNumbers = 0) => {
	let str = parseInt(String(number))
		.toFixed(decalsNumbers)
		.replace(/(.)(?=(\d{3})+$)/g, '$1,');
	if (includeMoneySymbol === true) {
		str = `$${str}`;
	}
	return str;
};

export const fakeAwait = async (ms: number) =>
	await new Promise((res) => {
		setTimeout(() => res(true), ms);
	});

export const findPlayerAt = (value: string | number) => {
	let foundEntity: PlayerMp | null = null;
	if (value === undefined || !(typeof value === 'string' || typeof value === 'number')) return null;
	mp.players.forEachLoggedIn((entity: PlayerMp) => {
		if (foundEntity !== null) return;
		const formattedValue = value.toString().toLowerCase();
		const formattedUsername = entity.info.username.toString().toLowerCase();
		if (
			formattedUsername === formattedValue ||
			(typeof value === 'string' && entity.id === parseInt(value)) ||
			(typeof value === 'number' && entity.id === value) ||
			(formattedUsername.includes(formattedValue) && formattedValue.length > 3)
		) {
			foundEntity = entity;
		}
	});

	if (foundEntity !== null) {
		const res: PlayerMp = foundEntity;
		return res;
	}
	return null;
};

export const findPlayerAtAccountId = (value: ExpectedAny) => {
	// If they didn't pass anything to work with.
	if (!value) return null;

	const valueParsed = parseInt(value);

	let clean = (s: string) => s.toString().trim().toLowerCase();

	const match = mp.players.toArray().find((entity: PlayerMp) => {
		if (!entity.vars || !entity.vars.loggedIn || !entity.info) return false;

		// If is a match by id.
		if (!isNaN(valueParsed) && valueParsed === entity.info.id) return true;

		// Let's match by username
		if (clean(value) === clean(entity.info.username) || (clean(entity.info.username).includes(clean(value)) && clean(value).length > 3)) {
			return true;
		}

		return false;
	});

	return match ? match : null;
};

export const isValidIterablePlayer = (entity: PlayerMp) => {
	if (!entity || !mp.players.exists(entity) || !(entity.vars && entity.vars.loggedIn) || !(entity.info && Object.keys(entity.info).length > 0)) {
		return false;
	}
	return true;
};

export const isInRange = function isInRange(pos1: Vector3, pos2: Vector3, range: number) {
	return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) + Math.pow(pos1.z - pos2.z, 2)) <= range;
};

export function isEmoji(str: string) {
	const ranges = [
		'(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
	];
	if (str.match(ranges.join('|'))) {
		return true;
	} else {
		return false;
	}
}

export const getServerTime = () => {
	const date = new Date();

	// console.log(`Date`, date);

	const hour = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	return { hour, minutes, seconds };
};

/**
 *
 * @param arr The array
 * @param chunkSize How many elements to be in one array
 * @returns The array splitted into chunks of the chunkSize of choice
 */

export function sliceIntoChunks(arr: Array<ExpectedAny>, chunkSize: number) {
	const res = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		res.push(chunk);
	}
	return res;
}

export const getIncreasedPriceByLevelAndPercentage = (startPrice: number, percentage: number, level: number) => {
	const arr = [startPrice];

	for (let i = 1; i < level; i++) {
		arr.push(arr[i - 1] * percentage);
	}
	const amount = arr[level - 1];

	return parseFloat(amount.toFixed(0));
};

export const formatPhoneNumber = (number: string) => {
	const str = number.toString();
	const arr = str.split('');
	arr.splice(3, 0, '-');
	return arr.join('');
};

/**
 * Calculates the elapsed time between a given date and the current date,
 * and returns it in the format 'hh:mm:ss'.
 *
 * @param date The start date of the call.
 * @returns The elapsed time in the format 'hh:mm:ss' (if 1 hour passed) if not 'mm:ss'.
 */

export const getTimeElapsed = (date: Date) => {
	// Get the current date and time
	const currentDate = new Date();

	// Calculate the elapsed time in seconds
	// @ts-ignore-next-line
	const elapsedTime = Math.floor((((currentDate as any) - date) as any) / 1000);

	// Calculate the seconds, minutes, and hours from the elapsed time
	const seconds = elapsedTime % 60;
	const minutes = Math.floor((elapsedTime / 60) % 60);
	const hours = Math.floor(elapsedTime / 3600);

	// Format the minutes and seconds as a string in 'mm:ss' format
	let formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

	// If there is an hour passed, prepend it to the formatted time
	if (hours > 0) {
		formattedTime = `${hours.toString().padStart(2, '0')}:${formattedTime}`;
	}

	// Return the formatted time
	return formattedTime;
};

export function truncateString(str: string, maxLength: number) {
	if (str.length <= maxLength) {
		return str;
	} else {
		return str.substring(0, maxLength) + '...';
	}
}

/**
 * Checks if a certain amount of time has passed from a date since then.
 * @param date
 * @param amount
 * @param format
 * @returns
 */

export function hasElapsedTime(date: Date, amount: number, format: 'seconds' | 'minutes') {
	// Get the current time in milliseconds since Jan 1, 1970 (Unix timestamp)
	const currentTime = Date.now();

	// Get the input date in milliseconds since Jan 1, 1970 (Unix timestamp)
	const inputTime = date.getTime();

	// Calculate the difference in milliseconds between current time and input time
	const elapsedMilliseconds = currentTime - inputTime;

	// Convert elapsedMilliseconds to the appropriate unit (seconds or minutes)
	let elapsedUnits;
	switch (format) {
		case 'seconds':
			elapsedUnits = elapsedMilliseconds / 1000;
			break;
		case 'minutes':
			elapsedUnits = elapsedMilliseconds / (1000 * 60);
			break;
		default:
			throw new Error('Invalid format. Supported formats are "seconds" and "minutes".');
	}

	// Compare with the provided amount
	return elapsedUnits >= amount;
}
