import { getVehicleNativeInfo } from '@client/natives/nativeInformation';
import { getRaycastLookingAtEntity } from '@client/natives/raycast';
import { loggedIn } from '@client/natives/interfaces';
import { getVehicleVariable } from '@client/utils/helpers';

const player = mp.players.local;

// @Reminder: this can be disabled with this:
// 	mp.game.controls.disableControlAction(0, 47, true); // G - Veh Passenger

const enterVehicleAsPasssenger = async () => {
	if (!loggedIn || player.vehicle) return false;

	// Use a raycast to check if the player is looking at a vehicle
	const result = getRaycastLookingAtEntity({ distance: 5, flags: { vehicles: true } });

	// Initialize a variable to store the vehicle ID
	let vehicleId: number | null = null;

	// If there is no result from the raycast or the result is not a vehicle, find the nearest vehicle
	if (!result || typeof result.entity === 'number' || result.entity.type !== 'vehicle') {
		mp.vehicles.forEachInRange(player.position, 5, (entity) => {
			if (vehicleId !== null) return;

			// Set the vehicleId to the ID of the nearest vehicle
			vehicleId = entity.id;
		});
	} else {
		// Set the vehicleId to the ID of the vehicle found by the raycast
		vehicleId = result.entity.id;
	}

	// If no valid vehicle ID was found, return false
	if (vehicleId === null) return false;

	// Retrieve the vehicle object using the vehicle ID
	const veh = mp.vehicles.at(vehicleId);
	if (!veh) return false;

	// Get vehicle model
	const vehicleModel = getVehicleVariable(veh.remoteId, 'model');
	if (!vehicleModel) return false;

	// Get native info..
	const vehInfo = await getVehicleNativeInfo(vehicleModel);
	if (!vehInfo) return false;

	for (let i = 0; i < vehInfo.seats - 1; i++) {
		if (veh.getPedInSeat(i)) return;
		player.taskEnterVehicle(veh.handle, 10000, i, 1, 1, 0);
	}

	return true;
};

mp.events.add('render', () => {
	// Whey just pressed down the KEY G
	if (mp.game.controls.isControlJustPressed(0, 47)) {
		enterVehicleAsPasssenger();
	}
});
