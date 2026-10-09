import * as rpc from 'rage-rpc';
const player = mp.players.local;

let stateActive = false;

rpc.on('vehicle.setPosition:putPassengerBackInVehicle', async (args) => {
	try {
		const { vehicleId, seat, position } = JSON.parse(args);

		// Get the entity..
		const entity: VehicleMp = mp.vehicles.atRemoteId(vehicleId);

		// Format player seat
		const passengerSeat = seat - 1; // server-side uses player.seat, where 1 is passenger 1, but client-side passenger 1 is 0.

		// This is now active for client-side
		stateActive = true;

		// Teleport to player location..
		player.position = new mp.Vector3(position.x, position.y, position.z + 2);

		// Debugging..
		// mp.console.logInfo(`Position: ${JSON.stringify(position)}`);
		// mp.console.logInfo(`player is in vehicle? ${player.vehicle ? 'yes ' : 'no'}`);
		// mp.console.logInfo(`Seat returning.. ${seat}`);

		// Wait for handle to be valid.
		for (let index = 0; index < 500; index++) {
			if (!entity || entity.handle === 0) {
				await mp.game.wait(1);
				continue;
			}
			// mp.console.logInfo(`Loaded handle after ${index} ms.`);
			break; // success.
		}

		if (!entity) throw new Error(`Failed to find entity with handle with remote id ${vehicleId}`);

		// Put player back into vehicle..
		player.setIntoVehicle(entity.handle, passengerSeat);
	} catch (err) {
		mp.console.logError(`[Bugfix error] setPosition failed to put passengers back.`);
	}

	// @Bugfix: "patched:playerEnterVehicle" is called literally right after the variable was updated (too soon)
	await mp.game.wait(500); // todo later: maybe sa facem alea de mai jos sa cheme events din server-side?

	// Mark as finished..
	rpc.triggerServer(`vehicle.setPosition:__tempLeavingVehicle`, JSON.stringify({ boolean: false }));
	stateActive = false; // for client-side only nothing to do with ragemp server-side..
});

// Patching these client-side events..

mp.events.add('playerEnterVehicle', (vehicle, seat) => {
	if (stateActive === true) return;
	mp.events.call(`patched:playerEnterVehicle`, vehicle, seat);
});

mp.events.add('playerLeaveVehicle', (vehicle, seat) => {
	if (stateActive === true) return;
	mp.events.call(`patched:playerLeaveVehicle`, vehicle, seat);
});
