import { PersonalVehicles, updateVehicle } from '@server/legacy/vehicles/components/core';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';

mp.events.add('everyMinuteForVehicleTimer', (vehicle) => {
	if (!vehicle.vars) return; // Something weird. Usually vehicles should always have vars.
	if (!vehicle.vars.pVehicle) return;

	if (vehicle.vars.lastPosition === vehicle.position) return;

	// Check if vehicle have engine
	const nativeInfo = getVehicleNativeInfo({ model: vehicle.vars.model });
	if (!nativeInfo || nativeInfo.hasEngine === false) return;

	// Calculate distance between coords

	const distance = new mp.Vector3(vehicle.vars.lastPosition).subtract(new mp.Vector3(vehicle.position)).length();

	const kmDistance = parseFloat((distance / 1000).toFixed(2));

	// Updating var...

	const pVehicle = PersonalVehicles.find((v) => v.id === vehicle.vars.pVehicle);

	if (!pVehicle) return;
	if (pVehicle.status === 2) return;

	const odometer = parseFloat((pVehicle.odometer + kmDistance).toFixed(2)); // needs last 4 to be able to increase it ccordingly.

	updateVehicle(vehicle.vars.pVehicle, { odometer }, false);

	vehicle.updateVars({
		odometer: odometer
	});
});
