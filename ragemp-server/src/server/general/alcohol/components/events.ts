mp.events.add('loadPlayerDefaults', (player) => {
	// Add it to client-side..
	player.addClientsideVariables(['bloodAlcoholLevel', 'alcoholResistanceLevel']);

	// We save it in the db but we use the variable instead in-game so we can access it in db.
	player.updateVars({
		bloodAlcoholLevel: player.info.bloodAlcoholLevel,
		alcoholResistanceLevel: 15 // @TBD: To make this a database thing and maybe make it a skill to resist to being drunk more.
	});
});

mp.events.add('everyMinuteForPlayerTimer', (player: PlayerMp) => {
	// Is sober..
	if (player.getAlcoholLevel() < 1) return false;

	const minutesToBeSober = 30; // We want to be sober in 30 minutes..
	const reductionAmount = 100 / minutesToBeSober; // Math..

	// Reduce alcohol level..
	player.reduceAlcoholLevel(reductionAmount);

	// Reduce health too if too intoxicated.
	if (player.vars.bloodAlcoholLevel >= player.vars.alcoholResistanceLevel) {
		player.health -= 3;
	}
	return true;
});

mp.events.add('onPlayerSaveData', (player) => {
	// Now let's save it in the db...
	player.saveInfo({
		bloodAlcoholLevel: player.vars.bloodAlcoholLevel
	});
});
