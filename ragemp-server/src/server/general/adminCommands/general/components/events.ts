mp.events.add('loadPlayerDefaults', (player) => {
	// Mark this variable to be available in client-side.
	player.addClientsideVariables(['godmode', 'isInGhostmode']);

	// Update variables
	player.updateVars({
		godmode: false,
		ownTimeOfDay: null,
		isInGhostmode: false
	});

	if (player.meta.marks === undefined) {
		player.updateMeta({ marks: {} });
	}
});
