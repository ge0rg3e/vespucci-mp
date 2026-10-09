mp.events.add('loadPlayerDefaults', (player) => {
	// Make sure is syncable and read by the clientside.
	player.addClientsideVariables('animations');

	// Set this to default..
	player.updateVars({ animations: [] });
});
