import { createRouter } from '@natives/router';
import { Op } from 'sequelize';
import moment from 'moment';

// Database
import confirmationCodes from '@modules/database/panel/confirmationCodes/repository';
import accounts from '@modules/database/game/accounts/repository';

// Dependencies
import { loginSchema, requsetResetPasstSchema, validateResetPassTokenSchema, confirmResetPassSchema } from './validation';
import { createSessionObject, generateUniqueIdentifier, sendEmail } from '@utils/helpers';

// Language
import Language from './language';
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import sha256 from 'sha256';
createLanguagePack('auth', Language, true);

const route = createRouter('auth');

route.set({
	path: '/getSession',
	method: 'GET',
	options: {
		loggedIn: true
	},
	handler: (req, res) => res.sendResponse(200, req.session)
});

route.set({
	path: '/login',
	method: 'POST',
	options: {
		loggedIn: false,
		validateBody: loginSchema
	},
	handler: async (req, res) => {
		// Get an account using the username and that password..
		const account = await accounts.getAccount({ username: req.body.username, password: req.body.password, rememberMeCredentials: null });

		// If there is no match..
		if (account === null) return res.sendResponse(404, 'Username or password is invalid');

		// They want to be remembered?
		const rememberMeUntil = req.body.rememberMe ? null : moment().add(7, 'days').toDate();

		// Creating the session object..
		const session = createSessionObject(account, { rememberMeUntil, sessionStartedAt: new Date() });

		req.session = session;

		// Return response..
		return res.sendResponse(200, req.session);
	}
});

route.set({
	path: '/reset-password',
	method: 'POST',
	options: {
		validateBody: requsetResetPasstSchema,
		loggedIn: false
	},
	handler: async (req, res) => {
		// Get their account by username or email..
		const account = await accounts.findOne({ where: { [Op.or]: [{ username: req.body.credential }, { email: req.body.credential }] } });

		// There's no account like that..
		if (!account) return res.sendResponse(404, 'Username or email not found');

		// Get the language and generate the token..
		const lang = getLanguagePack('auth', account.language);
		const token = generateUniqueIdentifier('token');
		const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

		// Create the confirmation code in our database..
		await confirmationCodes.create({
			expiresAt: moment().add(24, 'hours').toDate(),
			destination: account.email,
			method: 'email',
			value: token
		});

		// Send the email to the person..

		await sendEmail({
			templateId: 'd-2fd6d421cd694d688bd79cec3f669e6a',
			sender: 'valentinvatto@gmail.com',
			recipient: account.email,
			subject: lang.get('resetPass:subject'),
			payload: {
				heading: lang.get('resetPass:heading'),
				content: lang.get('resetPass:content', { ipAddress, username: account.username }),
				button: { content: lang.get('resetPass:buttonText'), href: `${process.env.CORS_ORIGIN}/reset-password?token=${token}` }
			}
		});

		// Return response..
		res.sendResponse(201, 'Success');
	}
});

route.set({
	path: '/reset-password/:token',
	method: 'GET',
	options: {
		validateParams: validateResetPassTokenSchema,
		loggedIn: false
	},
	handler: async (req, res) => {
		// Find any right confirmation code?
		const confirmation = await confirmationCodes.findOne({
			where: {
				value: req.params.token
			}
		});

		// There is no confirmation code..
		if (!confirmation) return res.sendResponse(404, 'Token not found');

		// Return response..
		res.sendResponse(200, 'Success');
	}
});

route.set({
	path: '/reset-password',
	method: 'PATCH',
	options: {
		validateBody: confirmResetPassSchema,
		loggedIn: false
	},
	handler: async (req, res) => {
		// Get the confirmation code..
		const confirmation = await confirmationCodes.findOne({
			where: {
				value: req.body.token
			}
		});

		// Is invalid or not right.
		if (!confirmation) return res.sendResponse(404, 'Token not found');

		// Get their account by username or email..
		const account = await accounts.findOne({ where: { email: confirmation.destination } });

		// Make sure the accoutn exists..
		if (!account) throw new Error(`The account is not existing.`);

		// Update the account accordingly..
		await accounts.update({ password: sha256(req.body.newPassword) }, { where: { email: confirmation.destination } });

		// Get the language and generate the token..
		const lang = getLanguagePack('auth', account.language);

		// Send an email
		await sendEmail({
			templateId: 'd-2fd6d421cd694d688bd79cec3f669e6a',
			sender: 'valentinvatto@gmail.com',
			recipient: confirmation.destination,
			subject: lang.get('resetPassSuccessful:subject'),
			payload: {
				heading: lang.get('resetPassSuccessful:heading'),
				content: lang.get('resetPassSuccessful:content')
			}
		});

		// Delete the token..
		await confirmation.destroy();

		// Return response..
		res.sendResponse(200, 'Success');
	}
});

route.set({
	path: '/logout',
	method: 'GET',
	options: {
		loggedIn: true
	},
	handler: (req, res) => {
		// Clearing the session
		req.session = {};

		// Deleting cookies..
		res.clearCookie('panel_session.sig', {
			domain: process.env.ENVIRONMENT === 'local' ? undefined : '.vespucci.mp'
		});
		res.clearCookie('panel_session', {
			domain: process.env.ENVIRONMENT === 'local' ? undefined : '.vespucci.mp'
		});

		// Informing the response..
		res.sendResponse(200, 'Logged out.');
	}
});

export default route;
