import { loggedIn } from '@client/natives/interfaces';
import { getPlayerVariable } from '@client/utils/helpers';

const player = mp.players.local;

// Blocking the vehicle controls so they can't drive cycles in garage or do nasty stuff
mp.events.add('render', () => {
	if (loggedIn === false) return false;

	// Get variable
	const garageEntered = getPlayerVariable(player.remoteId, `garageEntered`);
	if (!garageEntered) return false;

	if (garageEntered !== null && player.vehicle) {
		mp.game.controls.disableControlAction(1, 0, true); // V Change camera

		// Vehicle wasd
		mp.game.controls.disableControlAction(2, 71, true); // W
		mp.game.controls.disableControlAction(2, 72, true); // S
		mp.game.controls.disableControlAction(2, 63, true); // A
		mp.game.controls.disableControlAction(2, 64, true); // D

		// Cycle wasd
		mp.game.controls.disableControlAction(2, 136, true); // W
		mp.game.controls.disableControlAction(2, 139, true); // S

		// Others
		mp.game.controls.disableControlAction(2, 69, true); // Veh Attack - left click
		mp.game.controls.disableControlAction(2, 70, true); // Veh Attack - right click
		mp.game.controls.disableControlAction(2, 74, true); // H - Headlight
		mp.game.controls.disableControlAction(2, 101, true); // H - roof?
		mp.game.controls.disableControlAction(2, 79, true); // C - look behind
		mp.game.controls.disableControlAction(2, 80, true); // R Key to change veh camera.
		mp.game.controls.disableControlAction(2, 86, true); // E- Horn
		// Airplanes
		mp.game.controls.disableControlAction(2, 87, true); // fly up
		mp.game.controls.disableControlAction(2, 88, true); // fly down
		mp.game.controls.disableControlAction(2, 89, true); // fly left
		mp.game.controls.disableControlAction(2, 90, true); // fly right

		// Others..
		mp.game.controls.disableControlAction(2, 91, true); // INPUT_VEH_PASSENGER_AIM
		mp.game.controls.disableControlAction(2, 92, true); // INPUT_VEH_PASSENGER_ATTACK
		// Vehicle jump (Bmx)
		mp.game.controls.disableControlAction(2, 102, true); // Space
	}
	return true;
});

mp.events.add('patched:playerLeaveVehicle', async (vehicle) => {
	if (loggedIn === false) return false;

	// Get variable
	const garageEntered = getPlayerVariable(player.remoteId, `garageEntered`);
	if (!garageEntered) return false;

	// After the player leaves the vehicle we close all the doors again after 2 seconds
	await mp.game.waitAsync(2000);
	if (!vehicle) return false;
	vehicle.setDoorShut(0, true);
	vehicle.setDoorShut(1, true);
	vehicle.setDoorShut(2, true);
	vehicle.setDoorShut(3, true);
	return true;
});

const fixInteriors = () => {
	// Interior ID 1 - blocking the hall door
	mp.game.object.doorControl(mp.game.joaat('v_ilev_rc_door2'), 179.6684, -1004.762, -98.85, true, 0.0, 50.0, 0.0); // lock the door.

	// Interior ID 2- blocking the hall door
	mp.game.object.doorControl(mp.game.joaat('v_ilev_rc_door2'), 207.7825, -999.6905, -98.85, true, 0.0, 50.0, 0.0); // lock the door.
};

// Fixing the interiors
fixInteriors();
