import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	breadcrumb: {
		EN: ({ player }) => `${player}'s profile`,
		RO: ({ player }) => `Profilul lui ${player}`
	},
	seoTitle: {
		EN: ({ player }) => `${player}'s profile`,
		RO: ({ player }) => `Profilul lui ${player}`
	}
};

export default Language;
