import { type LanguagePack } from '@vmp/i18n';

// Parts
import Menu from './screens/menu/index.language';
import Information from './screens/information/index.language';
import Renting from './screens/renting/index.language';
import Upgrades from './screens/upgrades/index.language';
import Interiors from './screens/interiors/index.language';

const Language: LanguagePack = {
	LoadingAddress: {
		EN: 'Loading your address...',
		RO: 'Se încarcă adresa...'
	},
	'Navigation:Menu': {
		EN: 'Menu',
		RO: 'Meniu'
	},
	'Navigation:Information': {
		EN: 'Information',
		RO: 'Informații'
	},
	...Menu,
	...Information,
	...Renting,
	...Upgrades,
	...Interiors
};

export default Language;
