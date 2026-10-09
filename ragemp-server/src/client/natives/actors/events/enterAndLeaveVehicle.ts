import { logClientsideError } from '@client/general/errors';
import { loggedIn } from '@client/natives/interfaces';
import { getActorVehicle } from '../components/functions';

const player = mp.players.local;

// Variable to cache in their last known vehicle ids.
let cachedLastVehicleIds: ExpectedAny = {};

const checkVehicle = () => {
	try {
		// If current player is not logged in we don't check.
		if (!loggedIn) return false;

		// mp.console.logInfo(`Iteratation`);

		// Iterate through all peds.
		mp.peds.forEach((ped: PedMp) => {
			// Is not a server-side ped.
			if (ped.remoteId === 65535) return;

			// If we're not the controller we should not be the one to check to avoid spamming death event.
			if (ped?.controller !== player) return;

			// Getting last vehicle
			const lastVehicleId = cachedLastVehicleIds[ped.remoteId] ? cachedLastVehicleIds[ped.remoteId] : null;
			const lastVehicle = lastVehicleId !== null ? mp.vehicles.atRemoteId(lastVehicleId) : null;

			// Getting current vehicle
			const currentVehicle = getActorVehicle(ped);

			// Nothing changed state wise
			if (lastVehicle === currentVehicle) return false;

			// They entered a vehicle for first time or was teleported from a vehicle to another.
			if (currentVehicle) {
				mp.events.callRemote(`onActorEnterVehicle:Init`, ped.remoteId, currentVehicle!.remoteId);
			}

			// They don't have a vehicle anymore but had one.
			if (!currentVehicle && lastVehicle) {
				// mp.console.logInfo(`Current vehicle: ${JSON.stringify(currentVehicle)} Last vehicle: ${JSON.stringify(lastVehicle)}`);
				mp.events.callRemote(`onActorExitVehicle:Init`, ped.remoteId, lastVehicle.remoteId);
			}

			// Update cache
			if (!currentVehicle) {
				delete cachedLastVehicleIds[ped.remoteId];
			} else {
				cachedLastVehicleIds[ped.remoteId] = currentVehicle.remoteId;
			}

			return true;
		});

		return true;
	} catch (err) {
		logClientsideError(`peds:events:enterAndLeaveVehicle.checkVehicle`, err);
		return false;
	}
};

const clearCache = () => {
	try {
		// Clean the object array of cached no longer used peds.
		const invalidPeds: ExpectedAny = Object.keys(cachedLastVehicleIds);

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
				delete cachedLastVehicleIds[id];
			}

			return false;
		});

		return true;
	} catch (err) {
		logClientsideError(`peds:events:enterAndLeaveVehicle.clearCache`, err);
		return false;
	}
};

/**
 * Perform this check every 1 seconds to make sure that we sync their health right to know when they're dead.
 */

setInterval(checkVehicle, 500);

/**
 * Clear the cache to not pile up the health data.
 */

setInterval(clearCache, 1000);
