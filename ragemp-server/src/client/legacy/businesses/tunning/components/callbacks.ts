import * as rpc from 'rage-rpc';

rpc.register('tunning:getNumberOfWheelsCompatible', (args: string) => {
	const { wheelType } = JSON.parse(args);
	const vehicle = mp.players.local.vehicle;
	if (!vehicle) return 0;

	// Saving the old one to revert back..
	const oldWheelType = vehicle.getWheelType();

	vehicle.setWheelType(wheelType);
	const num = vehicle.getNumMods(23);
	vehicle.setWheelType(oldWheelType);

	return num;
});

rpc.register('tunning:getModsCompatibleForVehicle', (args: string) => {
	const { vehicleId, vehicleModsIds } = JSON.parse(args);
	const vehicle = mp.vehicles.atRemoteId(vehicleId);
	if (!vehicle) return {};

	const response: ExpectedAny = {};

	Object.keys(vehicleModsIds).forEach((key) => {
		const res = vehicle.getNumMods(vehicleModsIds[key]);
		response[key] = res;
	});

	return response;
});
