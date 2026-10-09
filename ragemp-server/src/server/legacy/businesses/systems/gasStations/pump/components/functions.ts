import { isInRange } from '@server/utils/helpers';
import { GasStations } from '../../business/components/functions';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';

/**
 *
 * @param position
 * @returns The closest gas station pump
 */

export const getNearbyPumpStation = (position: Vector3, range: number): { pumpId: number; gasStationId: number } | null => {
	let res = null;

	GasStations.forEach((gasStation) => {
		gasStation.pumps.forEach((pump) => {
			if (isInRange(position, new mp.Vector3(pump.coords.x, pump.coords.y, pump.coords.z), range)) {
				res = {
					pumpId: pump.id,
					gasStationId: gasStation.id
				};
			}
		});
	});

	return res;
};

/**
 *
 * @param position
 * @param range
 * @returns The closest vehicle with a petrol tank.
 */

export const getNearbyVehiclesWithPetrolTanks = (position: Vector3, range: number): VehicleMp | null => {
	let res = null;

	mp.vehicles.forEach((vehicle) => {
		if (!vehicle.vars) return;

		// Get native info
		const nativeInfo = getVehicleNativeInfo({ model: vehicle.vars.model });
		if (!nativeInfo) return;

		// If not a match
		if (!nativeInfo.carTank) return;

		if (isInRange(position, vehicle.position, range)) {
			res = vehicle;
		}
	});

	return res;
};
