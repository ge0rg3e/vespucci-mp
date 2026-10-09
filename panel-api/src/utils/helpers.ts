import PackageJSON from '../../package.json';
import sendGrid from '@sendgrid/mail';
import { yellow } from 'colorette';
import Axios from 'axios';

const removeSensitiveKeys = (data: ExpectedAny) => {
	const newData = { ...data };
	['password'].forEach((key) => delete newData[key]);
	return newData;
};

const parseErrorBody = (err: ExpectedAny) => {
	if (err && err.response && err.request) {
		return JSON.stringify({
			responseData: err.response.data,
			responseStatus: err.response.status,
			requestBody: removeSensitiveKeys(err.config.data),
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

export const logError = async (error_code: string, error: FixableAny, payload = {}) => {
	try {
		// Settings
		const environment: string = process.env.ENVIRONMENT!;
		if (!['local', 'staging', 'production'].includes(environment)) throw new Error(`The logz.io environment variable is invalid.`);

		// Preparing the log body

		const logBody = {
			error_code: error_code,
			message: `${error_code}${error.message ? ` - ${error.message}` : ``}`,
			payload: payload ? JSON.stringify(payload) : 'None.',
			error: parseErrorBody(error),
			api_version: PackageJSON.version,
			environment: environment,
			dev_key: ''
		};

		// Helps to identify who's logs are on localhost development
		if (process.env.LOGZ_DEV_USERNAME && environment == 'local') {
			logBody.dev_key = process.env.LOGZ_DEV_USERNAME;
		}

		// Uploading the log

		const endpoint = `https://${process.env.LOGZ_HOST}:8071/?token=${process.env.LOGZ_KEY}&type=PANEL-API`;
		await Axios.post(`${endpoint}`, `${JSON.stringify(logBody)}`);

		console.info(`${yellow('[LOGZ]')}`, { error_code, raw_error: error, payload });
	} catch (err) {
		console.error('Failed to log error event', err);
	}
};

export const validateAgainstSchema = async (schema: FixableAny, payload: ExpectedAny, throwIfInvalid?: boolean): Promise<ExpectedAny> => {
	try {
		await new Promise((resolve, reject) => {
			schema
				.validate(payload)
				.then(() => resolve(true))
				.catch((e: ExpectedAny) => reject(e.message));
		});
		return false;
	} catch (err) {
		if (throwIfInvalid) throw err;
		return err;
	}
};

export const sendEmail = async (params: { templateId: string; payload: Record<string, ExpectedAny>; bcc?: string | Array<string>; subject: string; recipient: string; sender: string }) => {
	try {
		// Emailing the user
		const msg: sendGrid.MailDataRequired = {
			to: params.recipient,
			from: params.sender,
			subject: params.subject,
			bcc: params.bcc || undefined,
			templateId: params.templateId,
			dynamicTemplateData: {
				...(params.payload ? params.payload : {}),
				meta: {
					subject: params.subject,
					sender: params.sender
				}
			},
			hideWarnings: true
		};

		await sendGrid.send(msg);
	} catch (err: ExpectedAny) {
		await logError(`SEND_SENDGRID_EMAIL`, err, { params });
		throw err;
	}
};

export const createSessionObject = (account: Record<string, ExpectedAny>, params: Record<string, ExpectedAny>) =>
	({
		id: account.id,
		username: account.username,
		email: account.email,
		language: account.language,

		// For knowing access levels..
		groups: account.groups,
		factionId: account.factionId,
		factionRank: account.factionRank,
		donorTier: account.donorTier,

		// For the application itself
		loggedInDate: new Date(),
		rememberMeUntil: params.rememberMeUntil
	} as SessionAccount);

/**
 *
 * @param type - code or token
 * @returns - an 6 digit unique code or 40 chars token.
 */

export const generateUniqueIdentifier = (type: 'code' | 'token'): string => {
	const length = type === 'code' ? 6 : 40;
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const result = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
	return type === 'code' ? `${result.slice(0, 3)}-${result.slice(3)}`.toLowerCase() : result;
};

export const mapClothesPlurals: ExpectedAny = {
	tops: 'top',
	accessories: 'accessory',
	hats: 'hat',
	masks: 'mask',
	torsos: 'torso',
	backpacks: 'backpack',
	undershirts: 'undershirt'
};
