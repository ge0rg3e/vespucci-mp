import { logClientsideError } from '@client/general/errors';
import * as rpc from 'rage-rpc';

// Variables
const player = mp.players.local;

// This is not currently used.
// Also is bugged, if you are currently aiming the animation doesn't take place.

rpc.on('playerWeapons.reloadClip', async (args) => {
	try {
		const { remoteId } = JSON.parse(args);

		// Get the player
		const target = mp.players.atRemoteId(remoteId);
		if (!target) return false;

		// If he doesn't have an equipped weapon
		if (!target.weapon) return false;

		// Execute reload animation.
		mp.game.invoke('0x20AE33F3AC9C0033', target.handle);

		return true;
	} catch (err) {
		logClientsideError(`playerWeapons.reloadWeapon`, err);
		return false;
	}
});
