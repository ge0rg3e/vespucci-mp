import { Animation } from '@server/definitions/animations';

mp.commands.addCommand({
	name: 'animation',
	aliases: ['anim'],
	defineLangs: {
		SyntaxExampleMessage: {
			EN: `{b9b9b9}Animation list:{FFFFFF} ${Object.keys(Animation).join(', ')}.`,
			RO: `{b9b9b9}Lista de animații:{FFFFFF} ${Object.keys(Animation).join(', ')}.`
		},
		errorMessage: {
			EN: ({ anim }) => `Animation ${anim} dosen't exist.`,
			RO: ({ anim }) => `Animația ${anim} nu există.`
		}
	},
	args: {
		anim: 'string'
	},
	handler: (player, { anim }, lang) => {
		if (anim === 'stop' || anim === 'cancel') return player.clearAnimations();
		if (!Animation[anim]) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'errorMessage', { anim }), 'system');

		player.applyAnimation({
			dict: Animation[anim].dist,
			name: Animation[anim].name,
			speed: 1,
			flags: Animation[anim].flags
		});
	}
});

mp.commands.addCommand({
	name: 'stopanim',
	handler: (player) => {
		player.clearAnimations();
	}
});
