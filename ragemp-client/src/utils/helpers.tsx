import Axios from 'axios';
import amplitude from 'amplitude-js';
import moment from 'moment';
import { useState, useRef, useEffect } from 'react';

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

export async function copyStringToClipboard(text: string) {
	// Create a temporary textarea element
	const textarea = document.createElement('textarea');
	// Set the value of the textarea to the text to be copied
	textarea.value = text;
	// Append the textarea to the document
	document.body.appendChild(textarea);
	// Select the text in the textarea
	textarea.select();
	// Copy the selected text to the clipboard
	document.execCommand('copy');
	// Remove the temporary textarea
	document.body.removeChild(textarea);
}

export async function createAmplitudeEvent(event_title: string, event_properties = {}) {
	try {
		if (window.mp.fake === true) {
			console.info(`AMPLITUDE EVENT - "${event_title}"`, event_properties);
			return false;
		}
		const userId = window.account.username;

		if (!userId) {
			throw new Error(`The username is not set for amplitude-js.`);
		}

		const project = amplitude.getInstance();
		project.init(__AMPLITUDE_KEY__);

		amplitude.getInstance().setUserId(formatUsernameAmplitude(userId));

		await project.logEvent(event_title, {
			...event_properties,
			client_version: __CLIENT_VERSION__,
			language: window.language
		});

		if (isDevServer()) {
			console.info(`AMPLITUDE EVENT - "${event_title}"`, event_properties);
		}
	} catch (err) {
		console.error(err);
	}
}

// Logz.io

export const parseErrorBody = (err: UndefinedAny) => {
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

export const logError = async (error_code: string, error: FixableAny, payload: FixableAny = {}) => {
	try {
		// Settings
		const environment = __ENVIRONMENT__;

		if (!['local', 'staging', 'production'].includes(environment)) {
			throw new Error(`The logz.io environment variable is invalid.`);
		}

		// Preparing the log body

		const logBody = {
			error_code: error_code,
			message: `${error_code}${error.message ? ` - ${error.message}` : ``}`,
			payload: payload ? JSON.stringify(payload) : 'None.',
			error: parseErrorBody(error),
			cef_version: __CLIENT_VERSION__,
			environment: environment,
			username: window.account ? window.account.username : `Not logged in`
		};

		// Uploading the log

		const endpoint = `https://${__LOGZ__HOST__}:8071/?token=${__LOGZ__KEY__}&type=RAGEMP-CLIENT`;
		await Axios.post(`${endpoint}`, `${JSON.stringify(logBody)}`);

		if (isDevServer()) {
			console.info(`Error Logged`, {
				error_code,
				raw_error: error,
				error_transformed: parseErrorBody(error),
				payload
			});
		}
	} catch (err) {
		console.info('Failed to log error event', err);
	}
};

export const fakeAwait = async (seconds: number) =>
	await new Promise((res) => {
		setTimeout(() => res(true), seconds);
	});

// Fake responses to help debugging and building interfaces
const fakedRpcResponses: ExpectedAny = {
	Server: {},
	Client: {}
};

export const fakeRPCEventResponse = async (
	target: 'Server' | 'Client',
	eventName: string,
	responseTime: number,
	response: ExpectedAny
) => {
	if (window.mp.fake !== true) return false;
	fakedRpcResponses[target][eventName] = { payload: response, responseTime };
};

// Example:
// fakeRPCEventResponse('Server', 'getHouseAppData', 1200, {
// 	id: 'house-id-here',
// 	houseAddress: `95 Grove Street, Vespucci Beach`
// });

/**
 * This is an optional function that helps me interpet a RPC response as if it was a real web response.
 */
export const interpetingRPCEvent = async (target: 'Server' | 'Client', eventName: string, ...data: ExpectedAny) => {
	try {
		// If there is a pre-fake response set up
		if (fakedRpcResponses[target][eventName]) {
			const res = fakedRpcResponses[target][eventName];
			fakedRpcResponses[target][eventName] = undefined;
			await fakeAwait(res.responseTime);
			return res.payload;
		}
		if (window.mp.fake) return false; // IF there is no fake response then we don't respond
		const func = target === 'Server' ? window.rpc.callServer : window.rpc.callClient;
		const res = await func(eventName, ...data);
		// Any error code more than 299 is usually an error status code.
		// eslint-disable-next-line
		if (res.statusCode && res.statusCode > 299) throw { ...res };
		return res.payload ? res.payload : res;
	} catch (err) {
		throw err;
	}
};

export const getDeviceInfo = async () => {
	try {
		const { data: dd } = await Axios(`https://api.db-ip.com/v2/free/self`);
		return {
			city: dd.city,
			country: dd.countryName,
			region: dd.continentName,
			ip: dd.ipAddress
		};
	} catch (err) {
		await logError(`GET_DEVICE_INFO`, err);
		return {
			city: '',
			country: '',
			region: '',
			ip: 'API Error - N/A'
		};
	}
};

export const getBrowserDeviceInfo = async () => {
	const client_location = await getDeviceInfo();
	const cef_version = __CLIENT_VERSION__;

	return {
		client_location,
		cef_version
	};
};

export const conditionalClassNames = (className: string, conditionals: Array<{ class: string; if: boolean }>) => {
	let str = `${className}`;
	conditionals.forEach((cond: ExpectedAny) => {
		if (cond.if === true) {
			str = `${str} ${cond.class}`;
		}
	});
	return str;
};

// This function gets the time in romania.

const formatRomanianDate = (t: FixableAny) => {
	const { day, month, year, hours, minutes, seconds } = t;

	const date = moment({
		hours: hours,
		day: day,
		month: month - 1, // in coding the year starts at 0
		year: year,
		minutes: minutes,
		seconds: seconds
	});
	return date.toDate();
};

export const getLocalRomaniaDateTime = () => {
	const dateRequested = new Date();

	const options: UndefinedAny = {
		hour: 'numeric',
		minute: 'numeric',
		year: 'numeric',
		month: 'numeric',
		second: 'numeric',
		day: 'numeric',
		timeZone: 'Europe/Bucharest'
	};

	const ds = dateRequested.toLocaleString('en-GB', options);

	const stringValues = {
		day: ds.substr(0, 2),
		month: ds.substr(3, 2),
		year: ds.substr(6, 4),
		hours: ds.substr(12, 2),
		minutes: ds.substr(15, 2),
		seconds: ds.substr(18, 2)
	};

	return {
		...stringValues,
		date: formatRomanianDate(stringValues)
	};
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

export const formatNumber = (number: number, includeMoneySymbol = false, decalsNumbers = 0) => {
	let str = parseInt(String(number))
		.toFixed(decalsNumbers)
		.replace(/(.)(?=(\d{3})+$)/g, '$1,');
	if (includeMoneySymbol === true) {
		str = `$${str}`;
	}
	return str;
};

/**
 * Will turn the seconds into this youtube-like format: 01:00:30
 * @param seconds
 * @returns
 */

export function formatSecondsToTimeElapsed(seconds: number) {
	seconds = Math.round(seconds); // Round to the nearest second

	// If video player returns no value.
	if (isNaN(seconds)) return '00:00';

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	const formattedHours = hours < 10 ? `0${hours}` : hours;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

	if (hours > 0) {
		return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
	} else {
		return `${formattedMinutes}:${formattedSeconds}`;
	}
}

export const formatPhoneNumber = (number: string) => {
	const str = number.toString();
	const arr = str.split('');
	arr.splice(3, 0, '-');
	return arr.join('');
};

export const isObject = (args: UndefinedAny) => (typeof args === 'object' && args !== null ? true : false);

export const generateEmptyArray = (number: number) => new Array(number).fill(0).map((_, index) => index);

declare global {
	interface Window {
		interceptEventRequest: FixableAny;
		callBrowserEvent: FixableAny;
	}
}

window.callBrowserEvent = (eventName: string, payload: ExpectedAny, autoStringify = true) => {
	if (!isDevServer()) {
		console.warn(`This function is available only on localhost.`);
		return true;
	}

	const formattedPayload = autoStringify ? JSON.stringify(payload) : payload;

	if (window.mp.fake === true) {
		document.dispatchEvent(
			new CustomEvent(eventName, {
				detail: formattedPayload
			})
		);
	} else {
		window.rpc.triggerBrowsers(eventName, formattedPayload);
	}
};

export function percentage(partialValue: number, totalValue: number) {
	return (100 * partialValue) / totalValue;
}

export function isElementVisible(el: HTMLElement, holder: UndefinedAny) {
	holder = holder || document.body;
	const elmRect = el.getBoundingClientRect();
	const holderRect = holder.getBoundingClientRect();

	return elmRect.top < holderRect.top && elmRect.bottom < holderRect.bottom ? true : false;
}
// window.callBrowserEvent('onEventReceiveInventoryData', { data: true });

// eslint-disable-next-line
export const MapComponent = (Component: FixableAny) => (props: ExpectedAny) => <Component {...props} />;

export const isDevServer = () => (import.meta.env.MODE === 'development' ? true : false);

export function isValidDate(d: Date) {
	// @ts-ignore
	return d instanceof Date && !isNaN(d);
}

export const isValidColor = (color: string) => {
	const el = document.createElement('div');
	el.style.backgroundColor = color;
	return el.style.backgroundColor ? true : false;
};

export function hexToRgb(hex: string, array = false) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? array
			? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
			: { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
		: null;
}

export function isRGBFormat(value: string) {
	if (typeof value !== 'string') {
		return false;
	}

	return (
		value.match(
			new RegExp(
				'^rgb\\((25[0-5]|2[0-4][0-9]|1[0-9]?[0-9]?|[1-9][0-9]?|[0-9]), ?(25[0-5]|2[0-4][0-9]|1[0-9]?[0-9]?|[1-9][0-9]?|[0-9]), ?(25[0-5]|2[0-4][0-9]|1[0-9]?[0-9]?|[1-9][0-9]?|[0-9])\\)$'
			)
		) !== null
	);
}

export function sliceIntoChunks(arr: Array<ExpectedAny>, chunkSize: number) {
	const res = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		res.push(chunk);
	}
	return res;
}

export const validateAgainstSchema = (schema: FixableAny, payload: ExpectedAny) =>
	new Promise((resolve, reject) => {
		schema
			.validate(payload)
			.then(() => resolve(true))
			.catch((e: ExpectedAny) => reject(e.message));
	});
export const updateStateObjectDeep = (setFunc: ExpectedAny, key: string, val: ExpectedAny) => {
	setFunc((currentState: ExpectedAny) => {
		const newState = { ...currentState };
		newState[key] = val;
		return newState;
	});
};

export function useStateRef(initialValue: ExpectedAny) {
	const [value, setValue] = useState(initialValue);

	const ref = useRef(value);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return [value, setValue, ref];
}

export const getIncreasedPriceByLevelAndPercentage = (startPrice: number, percentage: number, level: number) => {
	const arr = [startPrice];

	for (let i = 1; i < level; i++) {
		arr.push(arr[i - 1] * percentage);
	}

	const amount = arr[level - 1];

	return parseFloat(amount.toFixed(0));
};

// Temporary solution..
export function removeDiacritics(text: string) {
	const diacriticsMap: ExpectedAny = {
		ă: 'a',
		â: 'a',
		î: 'i',
		ș: 's',
		ț: 't',
		Ă: 'A',
		Â: 'A',
		Î: 'I',
		Ș: 'S',
		Ț: 'T'
	};
	return text.replace(/[ăâîșțĂÂÎȘȚ]/g, function (match) {
		return diacriticsMap[match];
	});
}

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
	const elapsedTime = Math.floor((((currentDate as Exclude) - date) as ExpectedAny) / 1000);

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

export function truncateString(str: string, maxLength: number, addElipsis = true) {
	try {
		if (str.length <= maxLength) {
			return str;
		} else {
			return str.substring(0, maxLength) + (addElipsis ? '...' : '');
		}
	} catch (err) {
		logError(`truncateString`, err, { str, maxLength, addElipsis });
		return str;
	}
}

type panelRequest = {
	method: 'POST' | 'GET';
	path: string;
	payload?: Record<string, ExpectedAny>;
};

export const makePanelRequest = async (params: panelRequest) => {
	try {
		// @ts-ignore
		const { data } = await Axios({
			method: params.method,
			data: params.payload || {},
			url: `${__PANEL_API__}${params.path}`,
			headers: {}
		});

		return data;
	} catch (err) {
		await logError(`makePanelRequest`, err, { params });
		throw err;
	}
};

export const makeVespifyRequest = async (params: panelRequest) => {
	try {
		// @ts-ignore
		const { data } = await Axios({
			method: params.method,
			data: params.payload || {},
			url: `${__VESPIFY_API__}${params.path}`,
			headers: {
				'X-API-Key': `${__VESPIFY_KEY__}`
			}
		});

		return data;
	} catch (err) {
		await logError(`makeVespifyRequest`, err, { params });
		throw err;
	}
};

/**
 *
 * @param number
 * @returns Numbers formatted like this: 1K , 1M etc.
 */

export function formatNumberShort(number: number) {
	if (number >= 1000000) {
		return (number / 1000000).toFixed(1) + 'M';
	} else if (number >= 1000) {
		return (number / 1000).toFixed(0) + 'K';
	} else {
		return number.toString();
	}
}
