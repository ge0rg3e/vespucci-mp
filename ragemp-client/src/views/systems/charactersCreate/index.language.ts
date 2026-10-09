import { type LanguagePack } from '@vmp/i18n';
import GlobalLanguagePack from '@/utils/global.languages';

const Language: LanguagePack = {
	PreferencesReset: {
		EN: `All selections have been undone`,
		RO: 'Toate setările au fost resetate'
	},
	ResetButton: {
		EN: 'Reset',
		RO: 'Resetează'
	},
	SubmitButton: {
		EN: 'Create character',
		RO: 'Crează caracter'
	},
	// Standard default language packs that may be needed
	...GlobalLanguagePack
};

export default Language;
