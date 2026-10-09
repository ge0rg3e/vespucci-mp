import { AccountAttributes, LicenseTypes } from '@modules/database/game/accounts/model/types';
import { getLanguagePack } from '@vmp/i18n';

const lang = getLanguagePack('licenseLang');

mp.Player.prototype.getLicense = function (id: LicenseTypes) {
	const match = this.info.licenses.find((c) => c.id === id);
	return match || null;
};

mp.Player.prototype.hasValidLicense = function (id: LicenseTypes) {
	const match = this.info.licenses.find((c) => c.id === id && c.hours > 0);
	return match ? true : false;
};

mp.Player.prototype.giveLicense = function (id: LicenseTypes, hours: number): void {
	const indexLicense = this.info.licenses.findIndex((c) => c.id === id);
	const updatedLicenses = [...this.info.licenses];

	if (indexLicense === -1) {
		updatedLicenses.push({ id, hours });
	} else {
		updatedLicenses[indexLicense].hours = hours;
	}

	this.updateInfo({
		licenses: updatedLicenses
	});
};

mp.Player.prototype.removeLicense = function (id: LicenseTypes) {
	// Get the index
	const indexLicense = this.info.licenses.findIndex((c) => c.id === id);

	// Is not in his array of licenses.
	if (indexLicense === -1) return false;

	// Prepare an array
	const updatedLicenses = [...this.info.licenses];

	updatedLicenses[indexLicense].hours = 0;

	// Save it.
	this.updateInfo({
		licenses: updatedLicenses
	});
	return true;
};

mp.Player.prototype.reduceLicense = function (id: LicenseTypes, hours: number) {
	// Get the index
	const indexLicense = this.info.licenses.findIndex((c) => c.id === id);

	// Is not in his array of licenses.
	if (indexLicense === -1) return false;

	// Prepare an array
	const updatedLicenses = [...this.info.licenses];

	// Reduce hours
	if (updatedLicenses[indexLicense].hours > 0) {
		updatedLicenses[indexLicense].hours -= hours;
	}

	// Save it.
	this.updateInfo({
		licenses: updatedLicenses
	});
	return true;
};

mp.Player.prototype.reduceAllLicenses = function () {
	for (const license of this.info.licenses) {
		if (license.hours < 1) continue;
		this.reduceLicense(license.id, 1);

		// Here we check if a license has expired, if it has expired I give it a notify
		if (license.hours < 1) {
			this.toast({
				message: lang.get('LicenseExpired', { licenseId: license.id }),
				seconds: 7,
				type: 'warning'
			});
		}
	}
};

// Declare global for PlayerMp interface for top prototypes
declare global {
	// PlayerMp interface
	interface PlayerMp {
		/**
		 * Get player license by name
		 */
		getLicense(id: LicenseTypes): AccountAttributes['licenses'][0] | null;

		/**
		 * Check if the player has a valid license.
		 */
		hasValidLicense(id: LicenseTypes): boolean;

		/**
		 * Give player license by name and hours
		 */

		giveLicense(id: LicenseTypes, hours: number): void;

		/**
		 * Remove player license by name
		 */

		removeLicense(id: LicenseTypes): boolean;

		/**
		 * Reduce player license by name and hours [driving, flight, boat, navigation, weapon]
		 */

		reduceLicense(id: LicenseTypes, hours: number): boolean;

		/**
		 * Decrease by one hour all existing licenses.
		 */

		reduceAllLicenses(): void;
	}
}

export {};
