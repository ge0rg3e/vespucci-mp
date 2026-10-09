import * as rpc from 'rage-rpc';
import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import { logClientsideError } from '@client/general/errors';

// Variables
let player = mp.players.local;

// Detecting when we press certain keys
const WeaponSlotKeys = [
	{ key: 0x30, value: 0 }, // zero
	{ key: 0x31, value: 1 }, // one
	{ key: 0x32, value: 2 }, // two
	{ key: 0x33, value: 3 }, // three
	{ key: 0x34, value: 4 } // four
];

WeaponSlotKeys.forEach((entry) => {
	mp.keys.bind(entry.key, true, async () => {
		try {
			// Safety checks
			if (interfacesOpened.length > 0) return false;
			if (!loggedIn) return false;

			// Get current weapon slot
			const currentSlot = player.getVariable(`@playerVars.weaponSlot`);
			if (currentSlot === null) return false;

			// If current slot is a weapon slot we don't allow switching.
			if (currentSlot === 999) return false;

			// The slot of weapon 2 does not work in vehicle to not have issues with veh engine key.
			if (entry.value === 2 && player.vehicle) return false;

			// Get the player weapons
			const weapons = player.getVariable(`@playerInfo.weapons`);
			if (!weapons) return false;

			// Variables
			const newSlot = entry.value;
			const weaponInNewSlot = weapons.find((c: ExpectedAny) => c.slot === newSlot);

			// If current slot slot we don't do anything.
			if (currentSlot === newSlot) return false;

			// // If they press the numbers but don't have any weapon in that slot to change to.
			if (newSlot !== 0 && !weaponInNewSlot) return false;

			// Is the player currently switching weapons
			const changingWeapons = player.getVariable(`@playerVars.changingWeapons`);
			if (changingWeapons) return false;

			// Inform the server
			rpc.triggerServer(`playerWeapons.onSlotButtonPressed`, JSON.stringify({ slot: newSlot }));

			return true;
		} catch (err) {
			logClientsideError(`playerWeapons.onSlotButtonPressed`, err);
			return false;
		}
	});
});

// @TODO LATER

// let antiSpamReload = false;

// const R_KEY = 0x52;

// mp.keys.bind(R_KEY, true, async () => {
// 	// Safety checks
// 	if (interfacesOpened.length > 0) return false;
// 	if (!loggedIn) return false;
// 	if (antiSpamReload) return true;

// 	// Get current weapon
// 	const currentWeapon = await getCurrentWeapon(player);
// 	if (!currentWeapon) return false;

// 	// Get native info about this weapon
// 	const native = await getWeaponNativeInfo(currentWeapon.weaponId);
// 	if (!native) return false;

// 	// Is a melee, doesn't has consumables.
// 	if (native.group === 'melee') return false;

// 	// Set anti spam
// 	antiSpamReload = true;
// 	setTimeout(() => {
// 		antiSpamReload = false;
// 	}, 3000);

// UPDATE: Use this -- This will make the ped reload when the weapon has at least one missing.
// mp.game.weapon.makePedReload(mp.players.local.handle);

// 	return true;
// });
