import { setVehicleModifications } from './functions';

import * as rpc from 'rage-rpc';

const player = mp.players.local;

mp.events.addDataHandler('@vehicleVars.modifications', function (entity: VehicleMp, newValue, oldValue) {
	if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return false; // Data has not changed but it has been triggered by shitty RAGEMP Triggers.
	try {
		if (entity.type !== 'vehicle') return false;
		// When the vehicle modifications are updated by the server-side we will resync the tunning to all nearby players..
		setVehicleModifications(entity, newValue);
		return true;
	} catch (err) {
		mp.console.logError(`addDataHandler:vehicleModifications - ${err}`);
		return true;
	}
});

mp.events.add('entityStreamIn', (entity: VehicleMp) => {
	if (entity.type !== 'vehicle') return;
	try {
		const modifications = entity.getVariable('@vehicleVars.modifications');
		if (!modifications) return false;
		setVehicleModifications(entity, modifications);
		return true;
	} catch (err) {
		mp.console.logError(`entityStreamIn:vehicleModiifications - ${err}`);
		return false;
	}
});

mp.events.add('sync:fixPlayerVehicle', () => {
	if (!player.vehicle) return false;
	player.vehicle.setFixed(); // Fixes the vehicle for this controller that will be synced down to all the other players.
	return true;
});

// For previewing..
rpc.on('tunning:setVehicleModifications', async (args) => {
	if (!player.vehicle) return;

	const vehicle = player.vehicle;

	// Re-usable by the sync..
	setVehicleModifications(vehicle, JSON.parse(args));
});
