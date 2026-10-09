mp.events.add('gamemodeStarted', () => {
	mp.chat.addMessageType({
		id: `diceGame`,
		icon: `fa-solid fa-dice`,
		color: `#0be881`,
		translations: {
			EN: () => `Dice Game`,
			RO: () => `Barbut`
		}
	});
});

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		playingDice: false
	});
});
