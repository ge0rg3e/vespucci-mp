import { getVehicleVariable } from '@client/utils/helpers';

mp.events.add('entityStreamIn', (entity: VehicleMp) => {
	if (entity.type !== 'vehicle') return;

	let dirtLevel = 0;
	const currentLevel = getVehicleVariable(entity.remoteId, 'dirtLevel');
	if (!currentLevel) {
		dirtLevel = 0; // in case is dealership client-side vehicle.
	} else {
		dirtLevel = currentLevel.dirtLevel;
	}

	entity.setDirtLevel(dirtLevel);
});

// When the variable has been changed server-side
mp.events.addDataHandler('@vehicleVars.dirtLevel', function (entity: VehicleMp, newValue, oldValue) {
	if (entity.type !== 'vehicle') return false;
	if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return false; // Data has not changed but it has been triggered by shitty RAGEMP Triggers.

	entity.setDirtLevel(newValue);
	return true;
});
