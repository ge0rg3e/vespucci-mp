mp.events.add('onPlayerSaveData', (player) => {
	player.saveInfo({
		licenses: player.info.licenses
	});
});

mp.events.add('loadPlayerDefaults', (player) => {
	player.addClientsideInformation('licenses');
});
