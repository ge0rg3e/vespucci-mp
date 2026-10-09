import { nativeVehicles } from '@server/natives/vehicles/components/core';
import { LICENSE_BLIPS } from './definitions';
import { LicenseTypes } from '@modules/database/game/accounts/model/types';

/**
 * Check the player's license center blips
 */
export const checkPlayerLicenseCenterBlips = async (player: PlayerMp) => {
	// Get the player's blips
	const activePlayerBlips = await player.getBlips();

	player.getActiveColshapes();

	Object.entries(LICENSE_BLIPS).forEach(([licenseName, { position, label }]) => {
		// If the player has a valid license and the blip is active, remove it
		if (player.hasValidLicense(licenseName as any) && activePlayerBlips.includes(`licenseCenter@${licenseName}`)) {
			player.deleteBlip(`licenseCenter@${licenseName}`);
		}

		// If the player does not have a valid license and the blip is not active, create it
		if (!player.hasValidLicense(licenseName as any) && !activePlayerBlips.includes(`licenseCenter@${licenseName}`)) {
			player.createBlip({
				identifier: `licenseCenter@${licenseName}`,
				type: 782,
				position: position,
				label: label,
				color: 0,
				shortRange: true
			});
		}
	});
};

/**
 * Get the license required by the vehicle
 */
export const getLicenseRequiredByVehicle = (vehicle: VehicleMp): LicenseTypes | null => {
	// Get the vehicle from the native vehicles
	const foundVehicle = nativeVehicles.find((veh) => veh.hash === vehicle.model);

	// If the vehicle is not found, return null
	if (!foundVehicle) return null;

	// Now let's return the license required by the vehicle
	if (foundVehicle.type === 'car') return 'driving';

	// Return null if the vehicle type is not found
	return null;
};
