import { LicenseTypes } from '@modules/database/game/accounts/model/types';

// Array of valid license types
const validLicenses: LicenseTypes[] = ['driving', 'flight', 'boat', 'weapon', 'material', 'fishing'];

// Function to check if the license is valid
export const isValidLicense = (license: string): boolean => {
	// Check if the specified license is included in the array of valid licenses
	return validLicenses.includes(license as LicenseTypes);
};

export const getLicenseTypes = () => validLicenses;
