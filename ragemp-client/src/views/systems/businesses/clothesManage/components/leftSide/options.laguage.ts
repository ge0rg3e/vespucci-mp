import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	SwapGender: {
		EN: 'Change character gender',
		RO: 'Schimbă sexul personajului'
	},
	SaveClothes: {
		EN: 'Save clothes',
		RO: 'Salvează hainele'
	},
	CreateClothing: {
		EN: 'Add clothing (DLC / Addons)',
		RO: 'Adaugă clothing (DLC / Addons)'
	},
	EditingMode: {
		EN: ({ bool }) => (!bool ? `Enable Developer Mode` : `Disable Developer Mode`),
		RO: ({ bool }) => (!bool ? `Activează Developer Mode` : `Dezactivează Developer Mode`)
	},
	Save: {
		EN: 'Save changes',
		RO: 'Salvează schimbările'
	},
	Exit: {
		EN: 'Leave',
		RO: 'Ieși'
	}
};

export default Language;
