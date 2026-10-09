// All of this is a bugfix to ragemp.
// RAGE:MP has a nasty bug right now where, when teleporting with passengers to a non-streamed in location, passengers will be left outside the vehicle.
// To reproduce this bug later: Take a vehicle, have 1 passenger with you, go to any garage and teleport inside the garage by parking, the passengers will be left outside.

import * as rpc from 'rage-rpc';

// Reminder: setPosition is already used by RAGE:MP. Can't use that.

// A few performance tweaks for the future:
// Remove the need of server-side variables by having all the mumbo jumbo on the client-side instead by calling the "patched:playerLeave" etc from client-side.

mp.Vehicle.prototype.setPositionPatched = function (position: Vector3) {
	// Get passengers
	const passengers = this.getOccupantsPatched()
		.map((player: PlayerMp) => ({ player, seat: player.seat }))
		.filter((e) => e.seat !== 0);

	// Distance
	const distance = new mp.Vector3(this.position).subtract(new mp.Vector3(position)).length();

	// Teleport vehicle to new position -- which means the driver will be teleported too.
	this.position = position;

	// If distance is less than 500, means is within streaming range.
	if (distance < 500) return; // Not needed.

	// No passengers..
	if (passengers.length < 1) return; // not needed.

	// Mark all passengers as out of veh.
	passengers.forEach(({ player }) => player.updateVars({ __tempLeavingVehicle: true }));

	// Remove passengers from vehicle
	passengers.forEach(({ player }: ExpectedAny) => player.removeFromVehicle());

	// Now teleport the passengers back into vehicle
	passengers.forEach(({ player, seat }: ExpectedAny) => {
		player.triggerClientEvent('vehicle.setPosition:putPassengerBackInVehicle', {
			vehicleId: this.id,
			position,
			seat
		});
	});
};

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		__tempLeavingVehicle: false
	});
});

mp.events.add('playerExitVehicle', function (player: PlayerMp, vehicle: VehicleMp) {
	// If he's in the middle of teleportation all events like this are not considered.
	if (player.vars.__tempLeavingVehicle === true) return;

	// Calling the patched event which will be accurate and not consider the player being temporary out of veh, as really out of veh.
	mp.events.call(`patched:playerExitVehicle`, player, vehicle);
});

mp.events.add('playerEnterVehicle', function (player: PlayerMp, vehicle: VehicleMp, seat: number) {
	// If he's in the middle of teleportation all events like this are not considered.
	if (player.vars.__tempLeavingVehicle === true) return;

	// Calling the patched event which will be accurate and not consider the player being temporary out of veh, as really out of veh.
	mp.events.call(`patched:playerEnterVehicle`, player, vehicle, seat);
});

rpc.on('vehicle.setPosition:__tempLeavingVehicle', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	const { boolean } = JSON.parse(args);
	player.updateVars({ __tempLeavingVehicle: boolean });
});

declare global {
	interface VehicleMp {
		setPositionPatched(position: Vector3): void;
	}

	interface PlayerVariables {
		__tempLeavingVehicle: boolean /* A variable used to make setPosition work. */;
	}
}

export {};
