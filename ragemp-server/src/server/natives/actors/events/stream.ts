import { isInRange, logError } from '@server/utils/helpers';

mp.events.add('onActorStreamIn:Init', (player: PlayerMp, id: number) => {
	try {
		// Get the entity..
		const entity = mp.peds.at(id);
		if (!entity) return false;

		// Get the actor..
		const actor = mp.actors.getById(id);
		if (!actor) return false;

		// If there is no controller we will now assign a controller.
		if (!actor.entity.controller && actor.attributes.dynamic === true) {
			actor.entity.controller = player;
			// console.log(`${player.info.username} is the new controller for ${actor.identifier}`);
		} else {
			// console.log(`actor ${actor.identifier} already had controller. his id was ${actor.entity.controller.id}`);
		}

		// Check who's controller.
		const isController = actor.entity.controller === player ? true : false;

		// We emit this event to execute codes.
		mp.events.call('onActorStreamIn', player, actor, isController);

		return true;
	} catch (err) {
		logError(`onActorStreamIn:Init`, err);
		return false;
	}
});

mp.events.add('onActorStreamOut:Init', async (player: PlayerMp, id: number) => {
	try {
		// Find the ped..
		const entity = mp.peds.at(id);
		if (!entity) return false;

		// Get the actor..
		const actor = mp.actors.getById(id);
		if (!actor) return false;

		// Check if we're controller at this point.
		const isController = actor.entity.controller === player ? true : false;

		// Will be updated and send to the event..
		let newController: ExpectedAny = null;

		// Let's re-assign controller.
		if (isController && actor.attributes.dynamic === true) {
			// console.log(`${player.info.username} is no longer the controller for ${actor.identifier}`);

			// Attempt to assign a new controller.
			newController = await assignNewController(actor, player);

			// There was no one fitting the criteria..
			if (newController === null) {
				// console.log(`${actor.identifier} is now controller empty.`);

				// When no one is nearby.
				mp.events.call('onActorStreamEmpty', actor);
			}
		}

		// Let's call this event.
		// @Reminder: Is important to execute the code now before the new controller is executed.
		mp.events.call('onActorStreamOut', player, actor, isController, newController);

		return true;
	} catch (err) {
		await logError(`onActorStreamOut:init`, err);
		return false;
	}
});

mp.events.add('playerQuit', (player: PlayerMp) => {
	if (!player.vars || !player.vars.loggedIn) return false;

	mp.actors.getAll().forEach((actor) => {
		if (!actor.entity) return false;
		if (actor.entity.controller !== player) return false;

		// Re-assign the controller since now we're leaving the game.
		// Is fine to not do an await here. We don't need to. We just want this done.
		assignNewController(actor, player);

		// console.log(`Assiging new controller on disconnect for ${actor.identifier}`);
		return true;
	});

	return true;
});
/**
 *
 * @param oldController The old controller player
 * This function will assign a new controller that is within the streaming range of the actor.
 */

const assignNewController = (actor: ExpectedAny, oldController: PlayerMp) => {
	try {
		// Will be updated and send to the event..
		let newController: ExpectedAny = null;

		mp.players.forEachLoggedIn((player: PlayerMp) => {
			// We can't assig again to him.
			if (player === oldController) return;

			// Already assigned.
			if (newController !== null) return;

			// Is this player in the streaming range of the old controller?
			const isInPlayerStreamingRange = player.isStreamed(oldController);

			// Is in actor distance? Aka is not too far for him. We can't risk being maybe right outside the actor streaming range but well within the player's distance.
			const isInActorDistance = isInRange(player.position, actor.entity.position, 450); // 500 is the server streaming range. but let's use 450 here.

			// Didn't pass the criteria.
			if (!isInActorDistance || !isInPlayerStreamingRange) return false;

			// The player is within the same streaming range like the other player.
			newController = player;

			return true;
		});

		// If we found a new controller
		actor.entity.controller = newController ? newController : undefined;

		return newController;
	} catch (err) {
		logError(`actors.stream.assignNewController`, err);
		return null;
	}
};
