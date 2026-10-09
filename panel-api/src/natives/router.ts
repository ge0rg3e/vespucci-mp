// Dependencies
import { hasGroups, isDeveloper, mustBeLoggedIn, notBeLoggedIn, isMatchingAccountIP } from '@routes/authentication/middlewares';
import { logError, validateAgainstSchema } from '@utils/helpers';
import { Router } from 'express';

export const setRoute = (router: Router, url: string, routeValue: RouteEntryParams, routerName: string) => {
	const route: FixableAny = router;

	const methodFormatted = routeValue.method.toString().toLocaleLowerCase();

	const middlewares: Array<ExpectedAny> = [];

	if (routeValue.options && routeValue.options.loggedIn === true) {
		middlewares.push(mustBeLoggedIn);
	}

	if (routeValue.options && routeValue.options.loggedIn === false) {
		middlewares.push(notBeLoggedIn);
	}

	if (routeValue.options && routeValue.options.isDeveloper === true) {
		middlewares.push(isDeveloper);
	}

	if (routeValue.options && routeValue.options.groups) {
		middlewares.push(hasGroups(routeValue.options.groups));
	}

	if (routeValue.options && routeValue.options.isMatchingAccountIP) {
		middlewares.push(isMatchingAccountIP);
	}

	// Figuring out the router func in a nasty way. @FixableAny

	const getRouterFunc = (...params: ExpectedAny) => {
		// @Warning: This must be like this since express.js sucks ass and you can't make it dynamic you must return it right away.

		if (methodFormatted === 'get') {
			return route.get(...params);
		} else if (methodFormatted === 'post') {
			return route.post(...params);
		} else if (methodFormatted === 'put') {
			return route.put(...params);
		} else if (methodFormatted === 'delete') {
			return route.delete(...params);
		} else if (methodFormatted === 'patch') {
			return route.patch(...params);
		}
	};

	getRouterFunc(`${url}`, ...middlewares, async (req: FixableAny, res: FixableAny) => {
		try {
			// A nice shortcut...
			const o = routeValue.options || {};

			// Does it need validations?
			if (o.validateBody || o.validateParams) {
				const error = await checkSchemaValidation(o, req);
				if (error) return res.sendResponse(400, error);
			}

			// @Todo: A cool benchmark here to know what apis are slow?
			await routeValue.handler(req, res);
			return true;
		} catch (err) {
			await logError(`${routerName}${url}`, err, {
				route: `${routerName}${url}`,
				method: routeValue.method,
				req: {
					body: req.body,
					headers: req.headers
				}
			});
			return res.sendResponse(500, 'Internal error');
		}
	});

	return route;
};

export const createRouter = (routerName: string) => {
	const router = Router();

	return {
		name: routerName,
		export: router,
		set: (params: { path: string; method: RouteMethods; handler: (req: ApiRequest, res: ApiResponse) => void; options?: RouteEntryOptions }) => {
			const { path, method, handler, options } = params;

			const newRoute = {
				method,
				handler,
				options
			};
			setRoute(router, path, newRoute, routerName);
		}
	};
};

export type RouteMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const checkSchemaValidation = async (options: ExpectedAny, req: ApiRequest): Promise<ExpectedAny> => {
	// If it has a validation schema set for body..
	if (options.validateBody) {
		const error = await validateAgainstSchema(options.validateBody, req.body);
		if (error) return error;
	}

	// If it has a validation schema set for params..
	if (options.validateParams) {
		const error = await validateAgainstSchema(options.validateParams, req.params);
		if (error) return error;
	}

	return false;
};

type RouteEntryParams = {
	method: RouteMethods;
	handler: (req: ApiRequest, res: ApiResponse) => void;
	options?: RouteEntryOptions;
};

type RouteEntryOptions = {
	groups?: Array<string> /* What group does the user must be part of? */;
	isDeveloper?: boolean /* Is this an Developer only API? */;
	loggedIn?: boolean /* This defines if the user must be logged in or not to use this API. */;
	isStaff?: boolean /* This defines if the user must be part of the staff (admins,helpers,agents) to use this API */;
	validateBody?: ExpectedAny /* Pass a Yup.js schema to validate the request body */;
	validateParams?: ExpectedAny /* Pass a Yup.js schema to validate the request params */;
	isMatchingAccountIP?: boolean /* Checks that the session IP is the same as account IP */;
	environment?: 'local' | 'production';
};
