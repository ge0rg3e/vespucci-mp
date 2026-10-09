import { getLanguagePack } from '@vmp/i18n';
import { checkPlayerLicenseCenterBlips, getLicenseRequiredByVehicle } from './functions';

mp.events.add('everyMinuteForPlayerTimer', checkPlayerLicenseCenterBlips);

mp.events.add('loadPlayerDefaults', (player) => {
	checkPlayerLicenseCenterBlips(player);

	// Add it to client-side
	player.addClientsideVariables('licenseTest');

	// Set it to default
	player.updateVars({
		licenseTest: {
			enabled: false,
			id: null,
			payload: {}
		}
	});
});

mp.events.add('playerEnterVehicle', (player, vehicle) => {
	// Get the license required by the vehicle
	const licenseRequired = getLicenseRequiredByVehicle(vehicle);

	// If the license is required and the player does not have it, remove the player from the vehicle
	if (licenseRequired && !player.hasValidLicense(licenseRequired)) {
		// If the player is in a test, don't perform this check
		if (player.vars.licenseTest?.enabled && player.vars.licenseTest?.id === licenseRequired) return;

		// Get the language
		const lang = getLanguagePack('LicenseCenter.Notifications', player.lang);

		// Alert the player
		player.alert({
			system: `licenseCenter.notOwned@${licenseRequired}`,
			type: 'error',
			message: lang.get('LicenseNotOwned', { licenseName: lang.get(`LicenseName@${licenseRequired}`) }),
			seconds: 15
		});

		// Remove the player from the vehicle
		player.removeFromVehicle();
	}
});
