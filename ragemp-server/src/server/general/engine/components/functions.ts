import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { PersonalVehicles } from '@server/legacy/vehicles/components/core';
import { getLanguagePack } from '@vmp/i18n';

mp.events.add('everyMinuteForVehicleTimer', (vehicle) => {
	if (vehicle.vars.fuel <= 0) return;
	const driver = vehicle.getOccupant(0);
	if (!driver) return;
	if (vehicle.vars.lastPosition === vehicle.position) return;

	// Check if vehicle have engine
	const nativeInfo = getVehicleNativeInfo({ model: vehicle.vars.model });
	if (!nativeInfo || nativeInfo.hasEngine === false) return;
	if (vehicle.vars.engine === false) return;

	// Calculate distance between coordonats

	const distance = new mp.Vector3(vehicle.vars.lastPosition).subtract(new mp.Vector3(vehicle.position)).length();

	// Fuel decreases depending on the distance
	if (distance >= 350) {
		vehicle.reduceFuel(1.5);
	} else if (distance >= 250 || distance < 350) {
		vehicle.reduceFuel(1);
	} else if (distance < 250) {
		vehicle.reduceFuel(0.5);
	}

	// Verify if vehicle is out of fuel
	if (vehicle.vars.fuel === 0) {
		const lang = getLanguagePack(`vehiclesEngine`, driver.info.language);

		driver.showPlayerDialog({
			dialogId: `vehicleEntranceMessage`,
			icon: 'warning',
			type: 'message',
			title: lang.get(`NoFuelHeading`),
			content: lang.get(`NoFuel`),
			hideInSeconds: 30
		});

		vehicle.updateVars({
			engine: false
		});
	}
});

const TIME_FOR_VEHICLE_PER_MINUTE = 1 * 60 * 1000;

setInterval(() => {
	mp.vehicles.forEachValid(async (vehicle: VehicleMp) => {
		if (!vehicle.vars) return; // Something weird. Usually vehicles should always have vars.

		mp.events.call('everyMinuteForVehicleTimer', vehicle);

		// Update last position

		if (vehicle.vars.pVehicle) {
			const veh = PersonalVehicles.find((v) => v.id === vehicle.vars.pVehicle);
			if (!veh) return;
			if (veh.status === 2) return;
		}

		vehicle.updateVars({ lastPosition: vehicle.position });
	});
}, TIME_FOR_VEHICLE_PER_MINUTE);
