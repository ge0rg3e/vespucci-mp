import { isValidIterablePlayer } from '@server/utils/helpers';
import { serverColshapes } from './functions';

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		activeColshapes: []
	});
});

mp.events.add('playerEnterColshape', function (player, colshape) {
	if (!isValidIterablePlayer(player)) return;

	// Get the colshape
	const c = serverColshapes.find((colshapes) => colshapes.entity === colshape);
	if (!c) return;

	// Preparing the return data..
	const data = {
		identifier: c.identifier,
		payload: c.payload,
		origin: 'server'
	};

	// Invoke the server-side event..
	mp.events.call('onPlayerEnterColshape', player, data);

	// Update this also so the player knows his current colshape.
	player.updateVars({ activeColshapes: [...player.vars.activeColshapes, c.identifier] });
	return;
});

mp.events.add('playerExitColshape', (player, colshape) => {
	if (!isValidIterablePlayer(player)) return;

	// Get the colshpae
	const c = serverColshapes.find((colshapes) => colshapes.entity === colshape);
	if (!c) return;

	// Preparing the return data..
	const data = {
		identifier: c.identifier,
		payload: c.payload,
		origin: 'server'
	};

	// Invoke the server-side event..
	mp.events.call('onPlayerExitColshape', player, data);

	// Update..
	player.updateVars({ activeColshapes: [...player.vars.activeColshapes].filter((cc) => cc !== c.identifier) });

	return;
});

// When we receive these events from the client-side..

mp.events.add(`onPlayerEnterColshape_Init`, (player: PlayerMp, colshape: string) => {
	// Parse..
	const data = JSON.parse(colshape);

	// We receive the event from client-side and we had the data sent across as a JSON stringified.
	mp.events.call(`onPlayerEnterColshape`, player, data);

	// Update this also so the player knows his current colshape.
	player.updateVars({ activeColshapes: [...player.vars.activeColshapes, data.identifier] });
});

mp.events.add(`onPlayerExitColshape_Init`, (player: PlayerMp, colshape: string) => {
	// Parse..
	const data = JSON.parse(colshape);

	// We receive the event from client-side and we had the data sent across as a JSON stringified.
	mp.events.call(`onPlayerExitColshape`, player, data);

	// Update..
	player.updateVars({ activeColshapes: [...player.vars.activeColshapes].filter((cc) => cc !== data.identifier) });
});
