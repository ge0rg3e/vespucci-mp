import { getVehicleVariable } from '@client/utils/helpers';

let dlActive = false;

mp.events.add('consoleCommand', (command) => {
	if (command === 'dl') {
		dlActive = !dlActive;
		mp.console.logInfo(`[DL COMMAND] - Is now: ${dlActive ? true : false}`, true, true);
	}
});

mp.events.add('render', () => {
	if (dlActive === false) return false;

	mp.vehicles.forEachInStreamRange((veh: VehicleMp) => {
		const pVehicle = getVehicleVariable(veh.remoteId, 'pVehicle');
		const temporaryVehicle = getVehicleVariable(veh.remoteId, 'temporary');

		const pos = veh.position;
		const pPos = mp.players.local.position;

		const distance = mp.game.gameplay.getDistanceBetweenCoords(pos.x, pos.y, pos.z, pPos.x, pPos.y, pPos.z, true);

		if (distance > 5) return false;

		let vehicleText = ``;

		let type = `General vehicle`;

		if (pVehicle) {
			type = `Personal vehicle`;
		}

		if (temporaryVehicle) {
			type = `Temporary vehicle`;
		}

		vehicleText = vehicleText + `~o~${type}`;

		vehicleText += `\n~w~Entity ID: ${veh.remoteId}`;

		if (pVehicle) {
			vehicleText = vehicleText += `\nDatabase ID: ${pVehicle}`;
		}

		const classVehicle = veh.getClass();

		let zDistance = 1.8;

		//Motorcycles
		if (classVehicle == 8) {
			zDistance = 1.4;
		}

		// Cycles

		if (classVehicle === 13) {
			zDistance = 1.2;
		}

		mp.game.graphics.drawText(vehicleText, [veh.position.x, veh.position.y, veh.position.z + zDistance], {
			font: 0,
			color: [255, 255, 255, 185],
			scale: [0.26, 0.26],
			outline: true
		});

		return true;
	});
	return true;
});
