import { logClientsideError } from '@client/general/errors';
import { getCurrentWeapon } from '../components/functions';
import * as rpc from 'rage-rpc';

let detected = false;
let player = mp.players.local;

const DetectCheats = async () => {
	try {
		// If we don't have any equipped
		if (player.weapon === mp.game.joaat('weapon_unarmed')) return false;
		if (detected) return false; // already kicked.

		// Get the player weapons
		const weapons = player.getVariable(`@playerInfo.weapons`);
		if (!weapons) return null;

		// Get current weapon
		const currentWeapon = await getCurrentWeapon(player, true);

		// If this player has a weapon that hasn't been given by the server.
		if (!currentWeapon || currentWeapon._native.hash !== player.weapon) {
			detected = true;
			rpc.triggerServer(`antiCheat.detected@weapons`, JSON.stringify({ weaponInHand: player.weapon, currentWeapon }));
		}

		return true;
	} catch (err) {
		logClientsideError(`antiCheat.weapons`, err);
		return false;
	}
};

setInterval(DetectCheats, 10000);
