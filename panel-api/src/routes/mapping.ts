// Imports
import Authentication from './authentication';
import Homepage from './homepage';
import Accounts from './accounts';
import Languages from './languages';
import Settings from './settings';
import Profiles from './profiles';
import Players from './players';

// Mappings..
const mappedRouters = [
	// Global
	Authentication,
	Accounts,
	Languages,

	// Pages
	Homepage,
	Settings,
	Profiles,
	Players
];

export default async (app: FixableAny) => mappedRouters.forEach((route: ExpectedAny) => app.use(`/${route.name}`, route.export));
