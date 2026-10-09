import accounts from '@modules/database/game/accounts/repository';
import moment from 'moment';

export const mustBeLoggedIn = (req: ApiRequest, res: ApiResponse, next: ApiNext) => {
	try {
		if (!req.session || Object.keys(req.session).length < 1) return res.sendResponse(401, 'Not logged in.');

		const rememberMeExp = moment().diff(moment(req.session.rememberMeUntil), 'days').toString().includes('-') ? false : true;

		if (req.session.rememberMeUntil !== null && rememberMeExp) {
			req.session = {};

			res.clearCookie('panel_session.sig', {
				domain: process.env.ENVIRONMENT === 'local' ? undefined : '.vespucci.mp'
			});
			res.clearCookie('panel_session', {
				domain: process.env.ENVIRONMENT === 'local' ? undefined : '.vespucci.mp'
			});

			return res.sendResponse(401, 'Not logged in.');
		}

		next();
	} catch {
		res.sendResponse(500, 'Internal Server Error');
	}
};

export const notBeLoggedIn = (req: ApiRequest, res: ApiResponse, next: ApiNext) => {
	if (req.session && Object.keys(req.session).length > 0) {
		return res.sendResponse(401, 'Unauthorised to logged in.');
	}

	next();
};

export const isDeveloper = (req: ApiRequest, res: ApiResponse, next: ApiNext) => {
	try {
		if (req.session.groups && !req.session.groups.split(',').find((g) => g === 'developers')) return res.sendResponse(401, 'Permission denied.');

		next();
	} catch {
		res.sendResponse(500, 'Internal Server Error');
	}
};

export const hasGroups = (input: Array<string>) => (req: ApiRequest, res: ApiResponse, next: ApiNext) => {
	try {
		if (req.session.groups && input.filter((x) => !req.session.groups.split(',').includes(x)).length < 1 ? false : true) return res.sendResponse(401, 'Permission denied.');

		next();
	} catch {
		res.sendResponse(500, 'Internal Server Error');
	}
};

export const isStaff = (req: ApiRequest, res: ApiResponse, next: ApiNext) => {
	try {
		if (req.session.groups && ['developers', 'admins', 'testers'].filter((x) => !req.session.groups.split(',').includes(x)).length < 1 ? false : true)
			return res.sendResponse(401, 'Permission denied.');

		next();
	} catch {
		res.sendResponse(500, 'Internal Server Error');
	}
};

export const isMatchingAccountIP = async (req: ApiRequest, res: ApiResponse, next: ApiNext) => {
	try {
		if (!req.session || Object.keys(req.session).length < 1) return res.sendResponse(401, 'Not logged in.');

		const acc = await accounts.findOne({
			where: {
				id: req.session.id
			}
		});

		if (!acc) throw new Error('Account does not exist');

		if (acc && acc.ipAddress !== req.ip) return res.sendResponse(403, 'Forbidden');

		next();
	} catch {
		res.sendResponse(500, 'Internal Server Error');
	}
};
