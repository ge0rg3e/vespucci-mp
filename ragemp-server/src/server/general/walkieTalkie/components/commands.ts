mp.commands.addCommand({
	name: 'wt',
	args: {
		frequency: 'number'
	},
	defineLangs: {
		Confirmation: {
			EN: ({ frequency }) => `{f59518}You changed your frequency to WT-${frequency}.`,
			RO: ({ frequency }) => `{f59518}Ti-ai schimbat frecventa pe WT-${frequency}`
		},
		InvalidFrequency: {
			EN: 'That frequency is an invalid number. Try a 4 digit number maximum.',
			RO: 'Aceasta frecventa este un numar invalid. Incearca o frecventa din maxim 4 numere.'
		},
		resetMessage: {
			EN: () => '{f59518}You reset your frequency.',
			RO: () => '{f59518}Ti-ai resetat frecventa.'
		},
		notOwning: {
			EN: "You don't own a walkie talkie. Go to a general store.",
			RO: 'Nu detii un walkie talkie. Du-te la un magazin general.'
		}
	},
	handler: (player, { frequency }, lang) => {
		// Has walkie talkie
		if (!player.vars.walkieTalkie.usable) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'notOwning'), 'walkieTalkie');

		// If they try to be smart and add an invalid frequency
		if (frequency.toString().length > 4) player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidFrequency'), 'walkieTalkie');

		// Change frequency
		player.setWalkieFrequency(frequency === 0 ? null : `WT-${frequency}`);

		// Inform player
		const message = frequency === 0 ? lang(player.lang, 'resetMessage') : lang(player.lang, 'Confirmation', { frequency });
		player.sendClientMessage('Server', 'system', message, 'walkieTalkie');

		// Track
		player.createAmplitudeEvent(`Set Walkie Frequency`, { method: 'command', newFrequency: frequency === 0 ? 'Reset' : `WT-${frequency}` });

		return true;
	}
});
