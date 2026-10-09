mp.events.add('everyMinuteForPlayerTimer', (player: PlayerMp) => {
	if (!player.vars.loggedIn) return false;

	player.updateVars({ sessionTime: player.vars.sessionTime + 1 });

	return true;
});

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		sessionTime: 0
	});
});

declare global {
	interface PlayerVariables {
		sessionTime: number;
	}
}

export {};
