import { loggedIn } from '@client/natives/interfaces';
import { logClientsideError } from '@client/general/errors';

// Dependencies
import { deleteDependencies, executePumpSync } from './functions';

mp.events.addDataHandler('@playerVars.gasStationPump', async (entity: PlayerMp, newState: ExpectedAny, oldState: ExpectedAny) => {
	try {
		// You are not logged in.
		if (!loggedIn) return;

		// Isnot a player. (Bug)
		if (entity.type !== 'player') return;

		// Is not streamed in.
		if (entity.handle === 0) return;

		// RAGE:MP Prevention
		if (JSON.stringify(newState) === JSON.stringify(oldState)) return; // Anti SPAM by RAGE:MP that sometimes triggers this event with same data.

		// Execute the sync manager
		executePumpSync(entity, oldState, newState);
	} catch (err) {
		await logClientsideError(`gasStation.sync.pump.addDataHandler`, err, {
			newState,
			oldState
		});
	}
});

mp.events.add('entityStreamIn', async (entity: PlayerMp) => {
	try {
		if (!loggedIn) return; // Not yet.
		if (entity.type !== 'player') return; // Not of interest.

		// Is he usign he gas station pump?
		const vars = entity.getVariable(`@playerVars.gasStationPump`);
		if (!vars) return;

		// Is not using the gas station pump..
		if (!vars.pumpId) return false;

		// Execute the sync
		executePumpSync(entity, null, vars);

		return true;
	} catch (err) {
		await logClientsideError(`gasStation.sync.pump.entityStreamIn`, err, {});
		return false;
	}
});

mp.events.add('entityStreamOut', async (entity: PlayerMp) => {
	try {
		// You are not logged in yet.
		if (!loggedIn) return;

		// Not a player (bug)
		if (entity.type !== 'player') return;

		// This user is not using the gas station.
		if (!entity.gsNozzle) return;

		// Execute the sync
		executePumpSync(entity, null, { gasStationId: null, pumpId: null, vehicleId: null });
	} catch (err) {
		await logClientsideError(`gasStation.sync.pump.entityStreamOut`, err, {});
	}
});

// @Bugfix: RAGE:MP is not deleting the rope on disconnect.We will delete the rope from their hand whenever someone leaves the game.
mp.events.add('playerQuit', (p) => deleteDependencies(p));

// @Bugfix: On reconnect we will delete all the ropes from the game.
mp.events.add('playerQuit', (player) => {
	if (player === mp.players.local) {
		// We delete the rope from any player.
		mp.players.forEach((p) => deleteDependencies(p));
	}
});
