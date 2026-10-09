import * as rpc from 'rage-rpc';

let scriptedDriving = false;
const player = mp.players.local;

rpc.on('tunning:driveVehicleToScene', async (args: string) => {
	const { coords, startPosition, id } = JSON.parse(args);

	if (!player.vehicle) return false;

	// Stop vehicle speed instantly..
	await player.vehicle.freezePosition(true);
	await mp.game.waitAsync(10);
	await player.vehicle.freezePosition(false);

	// Set the right position and heading for this scene start
	player.vehicle.position = new mp.Vector3(startPosition.x, startPosition.y, startPosition.z);
	player.vehicle.setHeading(startPosition.heading);

	// Preparing the car..
	player.vehicle.setOnGroundProperly();
	player.vehicle.setLights(2); // set lights on to view.
	mp.game.invoke('0xBC2042F090AF6AD3', player.vehicle, true); // SET_VEHICLE_INTERIORLIGHT

	// @Bugfix: Cycles can't use task drive to coord, they never stop.
	const isCycle = player.vehicle.getClass() === 13 ? true : false;

	// Drive to stage..
	if (isCycle) {
		player.taskVehiclePark(player.vehicle.handle, coords.x, coords.y, coords.z, coords.heading, 1, 3.0, false);
	} else {
		// Reminder: Last 3 params au fost inspriate din amp_mp_biker_warehouse.c din gta v decompiled si pare sa functioneze foarte ok.
		player.taskVehicleDriveToCoord(player.vehicle.handle, coords.x, coords.y, coords.z, 3.4, 1, player.vehicle.model, 262144, id === 'entrance' ? 0.3 : 0.5, 100.0);
	}

	// @Bugfix: Prevent player from leaving the car while doing the scripted task.
	scriptedDriving = true;
	await waitForArrivingAtLocation({ coords, id: `tunning:${id}` });
	scriptedDriving = false;

	return true;
});

export const waitForArrivingAtLocation = async (params: { coords: ExpectedAny; id?: string }) => {
	if (!player.vehicle) return;

	const { coords, id = null } = params;

	// eslint-disable-next-line
	return await new Promise((resolve) => {
		// Checking when the vehicle arrives there or within 10 seconds the animation stops..
		let intervalTimerId: ExpectedAny;
		let timeoutTimerId: ExpectedAny;

		// Required to calculate when to stop near the ending position.
		const dimensions = mp.game.gameplay.getModelDimensions(player.vehicle.model);
		const vehicleLength = dimensions.maximum.y;
		const parkingDistance = vehicleLength > 2.5 ? 2.1 : 1.7;

		// Safety: If they don't arrive in few seconds we will stop it.
		timeoutTimerId = setTimeout(() => {
			const isCycle = player.vehicle.getClass() === 13 ? true : false;
			const taskActive = player.getScriptTaskStatus(isCycle === false ? 0x93a5526e : 0xefc8537e); // TASK_VEHICLE_DRIVE_TO_COORD or SCRIPT_TASK_VEHICLE_PARK

			if (taskActive === 1) {
				player.clearTasks(); // Anti being stuck in that loop.
			}

			// Reset timer id
			timeoutTimerId = null;

			// Clear interval timeout
			if (intervalTimerId !== null) {
				clearInterval(intervalTimerId);
				intervalTimerId = null;
			}

			// Resolve
			resolve(true);
		}, 30000);

		intervalTimerId = setInterval(async () => {
			if (!player.vehicle) return;

			// Check if the player arrived already in the distance needed..
			const vPos = player.vehicle.position;
			const pos = new mp.Vector3(coords.x, coords.y, coords.z);
			const dist = mp.game.gameplay.getDistanceBetweenCoords(vPos.x, vPos.y, vPos.z, pos.x, pos.y, pos.z, false);

			if (dist < parkingDistance) {
				// @Bugfix: Drift vehicles don't stop easily.
				if (id === `tunning:entrance`) {
					// mp.console.logInfo('Reached!!');
					await player.taskVehicleTempAction(player.vehicle.handle, 24, 1500);
				}

				// Clear interval timer
				clearInterval(intervalTimerId);

				// Reset variable
				intervalTimerId = null;

				// If the timeout is there..
				if (timeoutTimerId !== null) {
					clearTimeout(timeoutTimerId);
					timeoutTimerId = null;
				}

				// Solve
				resolve(true);
			}
		}, 1000);
	});
};
// @Bugfix: While doing certain  tasks you may end up bypassing the cursor disableControls

mp.events.add('render', () => {
	if (scriptedDriving) {
		mp.game.controls.disableAllControlActions(0);
		mp.game.controls.disableAllControlActions(1);
		mp.game.controls.disableAllControlActions(2);
	}
});
