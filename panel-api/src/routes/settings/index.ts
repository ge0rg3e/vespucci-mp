import { changeEmailSchema, changePasswordSchema, requestChangeEmailSchema } from './validation';
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import { generateUniqueIdentifier, sendEmail } from '@src/utils/helpers';
import { createRouter } from '@natives/router';
import { Op } from 'sequelize';
import sha256 from 'sha256';
import moment from 'moment';

// Database
import ConfirmationCodes from '@modules/database/panel/confirmationCodes/repository';
import accounts from '@modules/database/game/accounts/repository';

// Language
import Language from './language';
createLanguagePack('settings', Language, true);

const route = createRouter('settings');

route.set({
	path: '/change-password',
	method: 'POST',
	options: {
		validateBody: changePasswordSchema,
		loggedIn: true,
		isMatchingAccountIP: true
	},
	handler: async (req, res) => {
		const lang = getLanguagePack('settings', req.session.language);

		const acc = await accounts.findOne({
			where: {
				id: req.session.id
			}
		});

		if (sha256(req.body.password) !== acc!.password) {
			return res.sendResponse(404, 'Password is incorrect');
		}

		await accounts.update(
			{
				password: sha256(req.body.newPassword)
			},
			{
				where: {
					id: req.session.id
				}
			}
		);

		await sendEmail({
			templateId: 'd-2fd6d421cd694d688bd79cec3f669e6a',
			sender: 'valentinvatto@gmail.com',
			recipient: req.session.email,
			subject: lang.get('passwordChanged:subject'),
			payload: {
				heading: lang.get('security'),
				content: lang.get('passwordChanged:content')
			}
		});

		res.sendResponse(200, 'Updated');
	}
});

route.set({
	path: '/change-email',
	method: 'POST',
	options: {
		validateBody: requestChangeEmailSchema,
		isMatchingAccountIP: true,
		loggedIn: true
	},
	handler: async (req, res) => {
		const lang = getLanguagePack('settings', req.session.language);

		const findEmail = await accounts.findOne({ where: { email: req.body.newEmail } });

		if (findEmail) return res.sendResponse(302, 'The email is already in use with another account');

		for (let i = 0; i < 2; i++) {
			// Emails that should receive an email with confrimation codes
			const target = i === 0 ? req.session.email : req.body.newEmail;
			const code = generateUniqueIdentifier('code');

			await ConfirmationCodes.create({
				expiresAt: moment().add(10, 'minutes').toDate(),
				destination: target,
				method: 'email',
				value: code
			});

			await sendEmail({
				templateId: 'd-2fd6d421cd694d688bd79cec3f669e6a',
				sender: 'valentinvatto@gmail.com',
				recipient: target,
				subject: lang.get('chageEmail:subject'),
				payload: {
					heading: lang.get('security'),
					content: lang.get('chageEmail:content'),
					button: { content: code, href: 'javascript:void(0)' }
				}
			});
		}

		res.sendResponse(201, 'Created');
	}
});

route.set({
	path: '/confirm-change-email',
	method: 'POST',
	options: {
		validateBody: changeEmailSchema,
		isMatchingAccountIP: true,
		loggedIn: true
	},
	handler: async (req, res) => {
		const lang = getLanguagePack('settings', req.session.language);

		const findCodes = await ConfirmationCodes.findAll({
			where: {
				value: {
					[Op.in]: [req.body.codeOldEmail, req.body.codeNewEmail]
				}
			}
		});

		if (findCodes.length < 2) return res.sendResponse(404, 'One of the two codes is incorrect');

		await accounts.update(
			{
				email: req.body.newEmail
			},
			{
				where: { id: req.session.id }
			}
		);

		for (let i = 0; i < 2; i++) {
			// Emails that should receive an email with confrimation codes
			const target = i === 0 ? req.session.email : req.body.newEmail;

			await sendEmail({
				templateId: 'd-2fd6d421cd694d688bd79cec3f669e6a',
				sender: 'valentinvatto@gmail.com',
				recipient: target,
				subject: lang.get('emailChanged:subject'),
				payload: {
					heading: lang.get('security'),
					content: lang.get('emailChanged:content', { email: req.body.newEmail })
				}
			});

			await findCodes[i].destroy();
		}

		req.session['email'] = req.body.newEmail;

		res.sendResponse(200, 'Updated');
	}
});

export default route;
