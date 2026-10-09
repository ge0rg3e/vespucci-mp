import * as rpc from 'rage-rpc';

// Dependencies
import { getVehicleVariable } from '@client/utils/helpers';
import { logClientsideError } from '../errors';

// Variables
const player = mp.players.local;
let autoLockTimeout: ExpectedAny = null;

rpc.on('startAutoLockTimer', (args) => {
	const { remoteId } = JSON.parse(args);

	try {
		// Get the vehicle entity based on the remoteId.
		const entity = mp.vehicles.atRemoteId(remoteId);

		// Check if the entity is valid
		if (!entity) return false;

		// Get vehicle variables using the remoteId.
		const vehicleLocked = getVehicleVariable(remoteId, 'locked');
		if (autoLockTimeout) return false; // Return false if timer are active

		autoLockTimeout = setTimeout(() => {
			// Format the speed in km
			const vehSpeed = entity.getSpeed() * 3.6;

			// Check if the car is not locked, if you are the driver and the speed is over 20 km
			if (!vehicleLocked && entity.getPedInSeat(-1) === player.handle && vehSpeed > 20) {
				// Call a remote event to lock the vehicle.
				mp.events.callRemote('onPlayerPressedVehicleLockKey', entity.remoteId, true);
			}

			// Reset variable
			autoLockTimeout = null;
		}, 30000);
		return true;
	} catch (error) {
		logClientsideError('startAutoLockTimer', error);
		return false;
	}
});

mp.events.add('patched:playerLeaveVehicle', () => {
	// Timeout was about to happen..
	if (autoLockTimeout !== null) {
		// Clear timeout
		clearTimeout(autoLockTimeout); // Clear the timeout.

		// Reset variable
		autoLockTimeout = null; // Reset the timeout reference.
	}
});
