import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('LicenseCenter.Notifications', {
	LicenseNotOwned: {
		EN: ({ licenseName }) => `You don't own a ${licenseName} license.`,
		RO: ({ licenseName }) => `Nu detii un permis de ${licenseName}.`
	},
	'LicenseName@driving': {
		EN: 'driving',
		RO: 'conducere'
	}
});
