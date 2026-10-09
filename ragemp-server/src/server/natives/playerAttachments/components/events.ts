import { sliceIntoChunks } from '@server/utils/helpers';

mp.events.add('loadPlayerDefaults', (player: PlayerMp) => {
	// Make sure is syncable and read by the clientside.
	player.addClientsideVariables('attachments');

	// Set the defaults
	player.updateVars({ attachments: [] });

	// Send the possible server attachments to the client-side.
	const chunks = sliceIntoChunks(mp.playerAttachments.getAll(), 50);

	// Send all of them
	chunks.forEach((chunk) => player.triggerClientEvent(`attachments.registerAttachments`, { entries: chunk }));
});

mp.events.add('playerQuit', (player) => {
	if (player.vars && player.vars.loggedIn && player.vars.attachments.length > 0) {
		player.updateVars({ attachments: [] }); // To destroy client-side for nearby ones.
	}
});
