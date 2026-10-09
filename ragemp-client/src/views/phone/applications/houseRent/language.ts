import { type LanguagePack } from '@vmp/i18n';

// Parts
import Menu from './screens/menu/index.language';

const Language: LanguagePack = {
	LoadingAddress: {
		EN: 'Loading your address...',
		RO: 'Se încarcă adresa...'
	},
	...Menu
};

export default Language;
