import { showMainDialog, showTrainingDialog } from './functions';
import { LicenseCenterEnum } from './enums';
import dimensions from '@server/definitions/dimensions';
import { isInRange } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

// Variable for the cost of starting the test
export const WEAPON_LICENSE_COST = 5000;
export const WEAPON_LICENSE_MIN_LEVEL = 5;

export const coords = {
	// This is inside the shooting ground.
	inside: {
		position: new mp.Vector3(13.271, -1097.873, 29.797),
		heading: -25.112
	},
	// This is outside the shooting ground right by the door.
	outside: {
		position: new mp.Vector3(7.788, -1100.772, 29.797),
		heading: 16.118
	}
};

// @Event: The player enters the colshape and is allowed to start the license test
mp.events.add('onPlayerEnterColshape', async function (player: PlayerMp, colshape: Colshape) {
	// Shortcuts.
	const identifier = colshape.identifier;
	const payload = colshape.payload;

	// Checks..
	if (!identifier.includes(`BusinessCallAction`) || !payload) return;
	if (payload.businessType !== 6) return;
	if (payload.actionId !== 'getLicense') return; // Is not call to action id getLicense.

	// Show the main dialog that allows him to Press F to take the test.
	showMainDialog(player, { businessId: payload.businessId, actionId: payload.actionId });
});

// @Event: The player exists the colshape above described.
mp.events.add('onPlayerExitColshape', function (player) {
	const dialogs = [`ammuNation.licenseCenter.mainDialog`, 'ammuNation.licenseCenter.confirmDialog'];
	if (player.vars && player.vars.dialogId && dialogs.find((x: string) => player.vars.dialogId?.includes(x))) {
		player!.hidePlayerDialog();
		return;
	}
	return;
});

// @Event: We teleport the player inside and give him the weapon and all.
mp.events.add('testingCenter@weapon.start', async (player: PlayerMp) => {
	// Take the cost of the license
	player.takeMoney(WEAPON_LICENSE_COST);

	// Set their weapon to fist to make sure they won't come pre-equipped with a weapon.
	player.setWeaponSlot(0);

	// Start loading effect.
	await player.startLoadingScreen();

	// Put player to shooting range position
	player.position = coords.inside.position;
	player.heading = coords.inside.heading;

	// Calculate dimension
	const calculatedDimension = player.id + dimensions.weaponLicenseTest;

	// Set player dimension
	player.dimension = calculatedDimension;

	// Freeze the player for now.
	player.freeze({ systemId: 'ammuNation', toggle: true });

	// Set camera behind player
	player.triggerClientEvent('ammuNation.licenseCenter@setCameraBehindPlayer');

	// Mark the testing starts now
	player.updateVars({
		licenseTest: {
			enabled: true,
			id: 'weapon',
			payload: {}
		}
	});

	// We hide the current dialog to avoid a bug where to Spam F and get their money reduced too many times.
	player.hidePlayerDialog();

	// We begin to offer the player's information about weapons / license etc..
	showTrainingDialog(player, 1);

	// Call client event for toggle player controllable and send player dimension to client
	player.triggerClientEvent('ammuNation.licenseCenter@start', {
		step: LicenseCenterEnum.GetInformations
	});

	// Create this colshape so we know when the player leaves the testing area by teleportation.
	player.createColshape({
		identifier: `ammuNation.testingCenter`,
		position: coords.inside.position,
		range: 15,
		dimension: calculatedDimension,
		type: 'sphere'
	});

	await player.stopLoadingScreen();
});

// @Event: To clear out the variables required for this test and also teleport the player.
mp.events.add('testingCenter@weapon.end', async (player: PlayerMp) => {
	// Clear test dependencies: Objects, client variables etc.
	player.triggerClientEvent(`ammuNation.licenseCenter@stopExam`);

	// Update variables
	player.updateVars({
		licenseTest: {
			enabled: false,
			id: null,
			payload: {}
		}
	});

	// Delete colshape
	player.deleteColshape(`ammuNation.testingCenter`);

	// Reset their dimension if is still the ammu nation testing area one
	if (player.dimension === player.id + dimensions.weaponLicenseTest) {
		player.dimension = 0;
	}

	// We will now teleport the player outside if he is still within the range
	if (isInRange(player.position, coords.inside.position, 20)) {
		// Start loading screen.
		await player.startLoadingScreen();

		player.position = coords.outside.position;
		player.heading = coords.outside.heading;

		// Stop loading screen.
		await player.stopLoadingScreen();
	}

	// Unfreeze the player if it was Frozen still.
	player.freeze({ systemId: 'ammuNation', toggle: false });

	// Remove the weapon and set back to fist.
	player.removeWeaponFromSlot(999);
});

// @Event: When the test has failed.
mp.events.add('testingCenter@weapon.failed', async (player: PlayerMp, reason) => {
	// Inform the player of his failure
	const lang = getLanguagePack(`ammuNation.licenseCenter.failureReasons`, player.lang);

	// Send the failure message
	player.sendServerMessage('License Center', 'system', lang.get(reason), 'system');

	// Track in Amplitude
	player.createAmplitudeEvent('Failed the weapon license test', { reason });

	// Call out the event.
	mp.events.call('testingCenter@weapon.end', player, `failure`, reason);
});

mp.events.add('testingCenter@weapon.success', async (player: PlayerMp) => {
	// Clear out the event.
	mp.events.call('testingCenter@weapon.end', player, 'success');

	// Give the license
	player.giveLicense('weapon', 100);

	// Get the language
	const lang = getLanguagePack('ammuNation.licenseCenter.onSuccess', player.lang);

	// Send chat message
	player.sendServerMessage('License Center', 'system', lang.get(lang.get(`NotificationMessage`)), 'system');

	// Track amplitude.
	player.createAmplitudeEvent('Obtained weapon license');
});

mp.events.add('onPlayerExitColshape', function (player, colshape) {
	if (colshape.identifier !== 'ammuNation.testingCenter') return false;

	// If he's not taking the test.
	if (!player.vars.licenseTest.enabled === true || player.vars.licenseTest.id !== 'weapon') return false;

	// They failed the test due to leaving the location
	mp.events.call(`testingCenter@weapon.failed`, player, `Not In Range`);

	return;
});

mp.events.add('playerLoggedInDeath', (player) => {
	// If he's not taking the test.
	if (!player.vars.licenseTest.enabled === true || player.vars.licenseTest.id !== 'weapon') return false;

	mp.events.call(`testingCenter@weapon.failed`, player, `Player Died`);
	return true;
});
