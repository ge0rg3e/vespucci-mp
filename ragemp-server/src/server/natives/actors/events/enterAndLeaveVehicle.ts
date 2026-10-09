mp.events.add('onActorExitVehicle:Init', (player: PlayerMp, id: number, lastVehicleId: number) => {
	const entity = mp.peds.at(id);
	if (!entity) return false;

	// Check again
	if (entity.controller !== player) return false;

	const actor = mp.actors.getById(id);
	if (!actor) return false;

	// Get their vehicle if is server-sided.
	const vehicle = mp.vehicles.at(lastVehicleId);

	// Resets vehicle id.
	actor.updateVariables({ vehicleId: null });

	// Found the actor let's call this event.
	// @reminder: player is controller.
	mp.events.call('onActorExitVehicle', player, actor, vehicle || null);

	return true;
});

mp.events.add('onActorEnterVehicle:Init', (player: PlayerMp, id: number, lastVehicleId: number) => {
	const entity = mp.peds.at(id);
	if (!entity) return false;

	// Check again
	if (entity.controller !== player) return false;

	const actor = mp.actors.getById(id);
	if (!actor) return false;

	// Get their vehicle if is server-sided.
	const vehicle = mp.vehicles.at(lastVehicleId);

	// Update vehicle id
	actor.updateVariables({ vehicleId: vehicle.id });

	// Found the actor let's call this event.
	// @reminder: player is controller.
	mp.events.call('onActorEnterVehicle', player, actor, vehicle || null);

	return true;
});
