// This event is called when the actor has health bar below zero and is considered now dead.

mp.events.add('onActorDeath:Init', (player: PlayerMp, id: number) => {
	const entity = mp.peds.at(id);
	if (!entity) return false;

	const actor = mp.actors.getById(id);
	if (!actor) return false;

	// Check again
	if (entity.controller !== player) return false;

	// Found the actor let's call this event.
	mp.events.call('onActorDeath', actor);

	return true;
});
