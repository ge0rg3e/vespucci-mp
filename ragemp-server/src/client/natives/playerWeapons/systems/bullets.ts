import * as rpc from 'rage-rpc';

// Dependencies
import { logClientsideError } from '@client/general/errors';
import { getCurrentWeapon, getCurrentWeaponSlot } from '../components/functions';

// Variables
let player = mp.players.local;
let ammoSyncing: ExpectedAny = {};

// @Events: This is the event that helps us sync the bullets.
mp.events.add('playerWeaponShot', async () => {
	try {
		// Get current weapon in hand
		const weapon = await getCurrentWeapon(player, true);
		if (!weapon || (weapon && !weapon._native)) return false;

		// Get the player current equipped weapon slot
		const slot = getCurrentWeaponSlot(player);

		// Unique ID for this timer
		const id = `weapon:${slot}`;

		// Figure out how many shots has been fired from this weapon
		let shotsFired = ammoSyncing[id] ? ammoSyncing[id].shotsFired + 1 : 1;

		// Let's stop the current setTimeout if there's any to avoid spam on server-side.
		if (ammoSyncing[id] !== undefined) {
			// Clear timeout
			clearTimeout(ammoSyncing[id].timer);

			// Delete it
			delete ammoSyncing[id];
		}

		// Set the timer that will update this weapon's ammo.
		ammoSyncing[id] = {
			timer: setTimeout(() => {
				// Sync the bullets into the server.
				rpc.triggerServer(`playerWeapons.onWeaponBulletsFired`, JSON.stringify({ slot, weapon, bullets: shotsFired }));

				// Clear timer
				delete ammoSyncing[id];
			}, 1000),
			shotsFired
		};

		return true;
	} catch (err) {
		await logClientsideError(`playerWeapons.onWeaponBulletsFired`, err);
		return false;
	}
});
