import { logClientsideError } from '@client/general/errors';
import { loggedIn } from '@client/natives/interfaces';

const player = mp.players.local;

// Variable to cache in their last known health.
let cachedData: ExpectedAny = {};

const checkHealth = () => {
	try {
		// If current player is not logged in we don't check.
		if (!loggedIn) return false;

		// Iterate through all peds.
		mp.peds.forEach((ped) => {
			// Is not a server-side ped.
			if (ped.remoteId === 65535) return;

			// If we're not the controller we should not be the one to check to avoid spamming death event.
			if (ped?.controller !== player) return;

			// Variables
			const currentHealth = ped.getHealth();
			const lastHealth = cachedData[ped.remoteId] || currentHealth;

			// It has just died.
			if (currentHealth !== lastHealth && currentHealth < 1) {
				// We inform the server-side..
				mp.events.callRemote(`onActorDeath:Init`, ped.remoteId);
			}

			// Update the health last known..
			cachedData[ped.remoteId] = currentHealth;
		});

		return true;
	} catch (err) {
		logClientsideError(`peds:events:death.checkHealth`, err);
		return false;
	}
};

const clearCache = () => {
	try {
		// Clean the object array of cached no longer used peds.
		const invalidPeds: ExpectedAny = Object.keys(cachedData);

		invalidPeds.forEach((id: number) => {
			// Does the ped exists anymore?
			const ped = mp.peds.atRemoteId(id);

			// Variable to decide..
			let isInvalid = false;

			// If it does not exist..
			if (!ped) {
				isInvalid = true;
			}

			// Are we still the controller?
			if (ped?.controller !== player) {
				isInvalid = true;
			}

			if (isInvalid) {
				// If it does not exist..
				delete cachedData[id];
			}

			return false;
		});

		return true;
	} catch (err) {
		logClientsideError(`peds:events:death.clearCache`, err);
		return false;
	}
};

/**
 * Perform this check every 200 ms to make sure that we sync their health right to know when they're dead.
 */

setInterval(checkHealth, 200);

/**
 * Clear the cache to not pile up the health data.
 */

setInterval(clearCache, 1000);
