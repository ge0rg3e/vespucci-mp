mp.events.add('patched:playerEnterVehicle', (player) => {
	if (player.vehicle && player.vehicle.vars && player.vehicle.vars.radio) {
		player.playCarRadio(player.vehicle.vars.radio);
	}
});

mp.events.add('patched:playerExitVehicle', (player: PlayerMp) => {
	if (!player.vars.carRadio) return false;
	player.stopCarRadio();
	return true;
});

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		carRadio: 0
	});
});
