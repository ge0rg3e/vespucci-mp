import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('licenseLang', {
	LicenseExpired: {
		EN: ({ licenseId }) => `Your ${licenseId} license has expired.`,
		RO: ({ licenseId }) => `Licenta ta de ${licenseId} a expirat.`
	},
	drivingLicense: {
		EN: 'Driving License',
		RO: 'Licență de condus'
	},
	weaponLicense: {
		EN: 'Weapon License',
		RO: 'Licență de arme'
	},
	boatLicense: {
		EN: 'Boat License',
		RO: 'Licență de barca'
	},
	flightLicense: {
		EN: 'Flight License',
		RO: 'Licență de zbor'
	},
	fisingLicense: {
		EN: 'Fishing License',
		RO: 'Licență de pescar'
	}
});
