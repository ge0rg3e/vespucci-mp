mp.events.add('onActorStreamIn', (_, actor, isController) => {
	// Is not for the controller to taks the ped..
	if (!isController) return false;

	// Is not a pedestrian actor
	if (!actor.identifier.includes('pedestrians:')) return false;

	// Is a driver and still has his vehicle
	if (actor.info.role === 'driver' && actor.info.vehicleId !== undefined) {
		// Get his vehicle..
		const veh = mp.vehicles.at(actor.info.vehicleId);
		if (!veh) return;

		// Start the task of driving
		// @TBD: to teleport vehicle to player's position.
		actor.taskVehicleDriveWander(veh, 10, 262144);
		return true;
	}

	// Is an actor but someone stole his vehicle :(
	if (actor.info.role === 'driver' && actor.info.vehicleId === undefined) {
		actor.taskWanderStandard(true);
	}

	// Is a wanderer that needs to wander around his spawn range..
	if (actor.info.role === 'wanderer') {
		// if is the kind that wanders anywhere
		actor.taskWanderStandard(true);
	}

	return true;
});

mp.events.add('onActorDeath', (actor) => {
	// Is not a pedestrian actor
	if (!actor.identifier.includes('pedestrians:')) return;

	// In case someone shoots at him from afar and kils him.
	if (actor.info.role == 'driver') {
		unlinkActorFromVehicle(actor);
	}
	// Respawn the ped..
	actor.respawn();
});

/**
 * O varianta mai buna aici ar fi asta:
 * - daca un ped iese din masina lui, sa asteptam 5 minute.
 * - daca au trecut 5 minute si nu mai intra in masina lui, inseamna ca cineva i-a furat-o.
 * avem events onActorEnterVehicle & onActorExitVehicle
 */

mp.events.add('playerEnterVehicle', (_, vehicle: VehicleMp) => {
	// Is this vehicle owned by a pedestrian?
	const actor = mp.actors.getAll().find((a) => a.info.vehicleId === vehicle.id && a.identifier.includes('pedestrians:'));
	if (!actor) return false;

	// Let's un-link the ped from that vehicle if we just stole this ped's vehicle.
	unlinkActorFromVehicle(actor);
	return true;
});

function unlinkActorFromVehicle(actor: ExpectedAny) {
	const vehicle = mp.vehicles.at(actor.info.vehicleId);

	// Get need to mark his vehicle as temporary now. So if the player no longer uses  - is gonna be fine.
	if (vehicle) {
		vehicle.updateVars({
			temporary: true // we'll consider it a normal veh that gets destroyed after a few minutes of being unused.
		});
	}

	actor.updateInfo({
		vehicleId: undefined
	});
}
