import { logClientsideError } from '@client/general/errors';
import { loggedIn } from '@client/natives/interfaces';
import { doesPlayerHaveValidLicense, isTakingLicenseTest, setPlayerWeapon } from './functions';
import * as rpc from 'rage-rpc';

// Variables
let player = mp.players.local;
let antiSpam = false;
let pressedLeftClick = false;

mp.events.addDataHandler('@playerInfo.weapons', async (entity: PlayerMp, currentWeapons: Array<PlayerEquippedWeapon>, oldWeapons: Array<PlayerEquippedWeapon>) => {
	try {
		if (!loggedIn) return; // Not yet.

		if (entity.type !== 'player') return; // If is not a player we skip...
		if (entity.handle === 0) return; // Not streamed in.
		if (JSON.stringify(currentWeapons) === JSON.stringify(oldWeapons)) return false; // ragemp old bug.

		// Get the player current equipped weapon slot
		const equippedSlot = entity.getVariable(`@playerVars.weaponSlot`);
		if (equippedSlot === undefined) return false; // It means the player just joined the server and we set up his variable.

		// Set the weapon
		setPlayerWeapon(entity, equippedSlot, currentWeapons);

		return true;
	} catch (err) {
		await logClientsideError(`playerWeapons.dataHandler.@playerInfo.weapons`, err);
		return err;
	}
});

mp.events.addDataHandler('@playerVars.weaponSlot', async (entity: PlayerMp, newSlot: number, oldSlot: number) => {
	try {
		if (!loggedIn) return; // Not yet.

		if (entity.type !== 'player') return; // If is not a player we skip...
		if (entity.handle === 0) return; // Not streamed in.
		if (newSlot === oldSlot) return false; // ragemp bug.

		// Get the player weapons
		const weapons = entity.getVariable(`@playerInfo.weapons`);
		if (!weapons) return false;

		// Set the weapon
		setPlayerWeapon(entity, newSlot, weapons);

		return true;
	} catch (err) {
		await logClientsideError(`playerWeapons.dataHandler.@playerVars.weaponSlot`, err);
		return err;
	}
});

mp.events.add('entityStreamIn', async (entity: PlayerMp) => {
	try {
		if (!loggedIn) return; // Not yet.
		if (entity.type !== 'player') return; // Not of interest.

		// Get the player weapons
		const weapons = entity.getVariable(`@playerInfo.weapons`);
		if (!weapons) return;

		// Get the player current equipped weapon slot
		const equippedSlot = entity.getVariable(`@playerVars.weaponSlot`);
		if (equippedSlot === undefined) return; // It means the player just joined the server and we set up his variable.

		// Set the weapon
		setPlayerWeapon(entity, equippedSlot, weapons);
	} catch (err) {
		await logClientsideError(`entityStreamIn.playerWeapons`, err, {});
	}
});

mp.events.add('render', () => {
	// Disable weapon wheel permanently.
	mp.game.controls.disableControlAction(0, 37, true); // Disable weapon wheel
	mp.game.controls.disableControlAction(0, 45, true); // Disable weapon reload on R.

	// Disable mouse weapon wheel in vehicle
	mp.game.controls.disableControlAction(0, 99, true);
	mp.game.controls.disableControlAction(0, 100, true);

	// Disable meele attacks while holding a weapon
	mp.game.controls.disableControlAction(0, 140, true);
	mp.game.controls.disableControlAction(0, 141, true);

	// Disable headhsot.
	mp.game.invoke('0xEBD76F2359F190AC', mp.players.local.handle, false);
});

// Hide Reticle if you don't have a license.
mp.events.add('render', () => {
	if (!loggedIn) return false;

	// Check if we have a weapon license
	const hasWeaponLicense = doesPlayerHaveValidLicense(player, 'weapon');
	const isTakingWeaponLicenseTest = isTakingLicenseTest(player, 'weapon');

	if (!hasWeaponLicense && !isTakingWeaponLicenseTest) {
		// Hide HUD
		mp.game.ui.hideHudComponentThisFrame(14);

		// If they hold a weapon that has bullets.
		if (player.weapon && mp.game.weapon.getWeaponDamageType(player.weapon) === 3) {
			// If they are shooting.
			if (pressedLeftClick && !antiSpam) {
				antiSpam = true;

				// Notify the server.
				rpc.triggerServer('playerWeapons.shootingWithoutLicense');

				setTimeout(() => {
					antiSpam = false;
				}, 30_000);
			}

			// Disable shooting.
			mp.game.invoke('0x5E6CC07646BBEAB8', player.handle, true);
		}
	}
	return true;
});

mp.events.add('click', (_absoluteX, _absoluteY, upOrDown, leftOrRight, _relativeX, _relativeY, _worldPosition, _hitEntity) => {
	if (!loggedIn) return false;

	if (leftOrRight !== 'left') return;

	pressedLeftClick = upOrDown === 'down';
});
