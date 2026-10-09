import { useLayoutEffect, useState } from 'react';
import PackageJSON from '../../package.json';
import { AppContext } from './context';
import lodash from 'lodash';
import Axios from 'axios';

// Languages
import { createLanguagePack, getLanguagePack as _getLanguagePack, LanguagePack } from '@vmp/i18n';

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
		const environment = process.env.NEXT_PUBLIC_ENVIRONMENT!;

		if (!['local', 'staging', 'production'].includes(environment)) {
			throw new Error(`The logz.io environment variable is invalid.`);
		}

		// Preparing the log body

		const logBody = {
			error_code: error_code,
			message: `${error_code}${error.message ? ` - ${error.message}` : ``}`,
			payload: payload ? JSON.stringify(payload) : 'None.',
			error: parseErrorBody(error),
			api_version: PackageJSON.version,
			environment: environment
		};

		// Uploading the log

		const endpoint = `https://${process.env.NEXT_PUBLIC_LOGZ_HOST}:8071/?token=${process.env.NEXT_PUBLIC_LOGZ_KEY}&type=PANEL-CLIENT`;

		await Axios.post(`${endpoint}`, `${JSON.stringify(logBody)}`);

		if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
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

export const makeEndpointRequest = async (path: string, method: 'GET' | 'POST' | 'PATCH', headers?: { Cookie?: string }, data?: ExpectedAny) => {
	try {
		const { data: res } = await Axios({
			url: `${process.env.NEXT_PUBLIC_PANEL_API}/${path}`,
			method,
			data: data || {},
			withCredentials: true,
			headers
		});
		return res;
	} catch (err: ExpectedAny) {
		throw err;
	}
};

export const checkRouteIsAuthenticated = async (ctx: UndefinedAny) => {
	try {
		await makeEndpointRequest('auth/getSession', 'GET', {
			// This must be here otherwise the Session is not passed to the getSession.
			Cookie: ctx.req.headers.cookie
		});

		return {
			redirect: {
				destination: '/',
				permanent: true
			},

			props: {}
		};
	} catch {
		return {
			props: {}
		};
	}
};

export const checkRouteIsNotAuthenticated = async (ctx: UndefinedAny) => {
	try {
		await Axios(`${process.env.NEXT_PUBLIC_PANEL_API}/auth/getSession`, {
			headers: {
				cookie: ctx.req.headers.cookie
			}
		});

		return {
			props: {}
		};
	} catch {
		return {
			props: {},
			redirect: {
				destination: `/authentication?required=true&callback_url=${ctx.resolvedUrl}`,
				permanent: true
			}
		};
	}
};

export const getUserDefaultSessionData = async (cookie: ExpectedAny) => {
	try {
		const { data } = await Axios(`${process.env.NEXT_PUBLIC_PANEL_API}/auth/getSession`, {
			headers: {
				cookie
			}
		});
		return data;
	} catch (err: ExpectedAny) {
		// If is something bad we log this error.
		if (err && err.response && err.response.status === 500) {
			await logError('GET_USER_DEFAULT_SESSION_DATA', err);
		}

		return null;
	}
};

export const validateAgainstSchema = (schemaGiven: FixableAny, payload: Record<string, ExpectedAny>) =>
	// eslint-disable-next-line no-async-promise-executor
	new Promise<void>(async (resolve, reject) => {
		try {
			await schemaGiven.validate(payload, {
				abortEarly: false
			});

			resolve();
		} catch (err: ExpectedAny) {
			try {
				const errorObject: Record<string, string> = {};

				err.inner.forEach((elm: ExpectedAny) => {
					errorObject[elm.path] = elm.message;
				});
				reject(errorObject);
			} catch (_) {
				resolve();
				console.error(`Yup.js validation parser error`, err);
			}
		}
	});

export const isServerSide = () => (typeof window !== 'undefined' ? false : true);

export function useWindowSize() {
	// We can't use uselayout effect on server-side.
	if (isServerSide()) return [0, 0];

	// eslint-disable-next-line
	const [size, setSize] = useState([0, 0]);

	// eslint-disable-next-line
	useLayoutEffect(() => {
		function updateSize() {
			setSize([window.innerWidth, window.innerHeight]);
		}
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	return size;
}

export const formatNumber = (number: number, includeMoneySymbol = false) => {
	let str = String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
	if (includeMoneySymbol === true) {
		str = `$${str}`;
	}
	return str;
};

// These two are simple wrappers.

/**
 * A simple shortcut to avoid importing vmp every time.
 * @param path
 * @param translations
 * @returns
 */

export const createComponentLanguage = (path: string, translations: LanguagePack) => {
	// Create language pack..
	createLanguagePack(`${path}`, translations, true);
	return path;
};

/**
 * A simple wrapper made to get the app context easier.
 * @param path
 * @param languageCode
 * @returns
 */

export const getComponentLanguage = (path: ExpectedAny, languageCode?: 'RO' | 'EN' | undefined) => {
	const { language: contextLanguageCode } = AppContext();

	// If there is no language code we will use the contextLanguageCode.
	if (!languageCode) {
		languageCode = contextLanguageCode;
	}

	return _getLanguagePack(path, languageCode);
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

export const getValidationPropFields = (validationFields: FixableAny, conditionToDisplay: boolean = true, label: string) => {
	const val = lodash.get(validationFields, label);

	if (val !== undefined && conditionToDisplay === true) {
		return {
			error: true,
			helperText: val
		};
	} else return {};
};

/* A simple wrapper to fight the next.js issue against window not being present on server-side */

export const getAlerts = (listenerId: string): ReturnType<Window['alerts']> => {
	// @ts-ignore:next-line
	if (typeof window === 'undefined') return {};
	// @ts-ignore:next-line - Another next.js issue.
	if (!window.alerts) return {};

	return window.alerts(listenerId);
};
