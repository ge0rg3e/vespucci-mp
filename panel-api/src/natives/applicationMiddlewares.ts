import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import cors from 'cors';

// Dependencies
import formatServerResponse from './formatServerResponse';

const applyApplicationMiddlewares = (express: ExpectedAny, app: FixableAny) => {
	// This is used only to be able to receive JSON.
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	// The cookie configuration..
	app.use(
		cookieSession({
			// General
			name: 'panel_session',
			secret: process.env.SESSION_SECRET,
			keys: process.env.SESSION_KEYS?.split(','),
			domain: process.env.ENVIRONMENT === 'local' ? undefined : '.vespucci.mp', // The cookie will be available across all subdomains.
			path: '/' // The panel is at panel.vespucci.mp/
		})
	);

	// This is used to get rid of that nasty CORS Error and to Make the Cookie pass from Back-end to front-end.
	app.use(cors({ origin: (origin, callback) => callback(null, origin), credentials: true }));

	// This is used for easier returns.
	app.use(formatServerResponse);
};

export default applyApplicationMiddlewares;
