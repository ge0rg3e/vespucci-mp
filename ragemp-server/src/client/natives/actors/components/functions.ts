/**
 *
 * @param actor PedMp
 * @returns This function allows you to get the position of the actor.
 * @WARNING: This works only if the ped is streamed in for you.
 */

export const getActorStreamedInPosition = (ped: PedMp) => {
	if (ped.handle === 0) return null;
	return ped.getCoords(true);
};

/**
 *
 * @param ped Ped entity
 * @param health The amount of health we want to set.
 * @Reminder: On client-side if you want to set 100 HP you must set it to 200. But when you will get its health it will say 100.
 */

export const setActorHealth = (ped: PedMp, health: number) => ped.setHealth(100 + health);

export const getActorVehicle = (ped: PedMp) => {
	let vehicleFound: ExpectedAny = null;

	mp.vehicles.forEach((vehicle) => {
		if (!vehicle.remoteId) return false;
		if (vehicleFound !== null) return false;

		const isIn = ped.isInVehicle(vehicle.handle, false);

		if (isIn) {
			vehicleFound = vehicle;
		}

		return true;
	});

	return vehicleFound;
};
