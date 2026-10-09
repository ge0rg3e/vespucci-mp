mp.commands.addCommand({
	name: 'setbloodalcohol',
	aliases: ['setalcohol'],
	permission: 'cmds.setbloodalcohol',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} set ${target}'s blood alcohol level to ${value}%`,
			RO: ({ admin, target, value }) => `${admin} i-a setat nivelul de alcohol din sange lui ${target} la ${value}%`
		},
		errorMessage: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		if (value < 0 || value > 100) return player.sendErrorMessage('Server', 'system', lang(player.lang, `errorMessage`), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setbloodalcohol',
			messageId: 'Announcement',
			permission: 'cmds.setbloodalcohol',
			args: () => ({ ...langArgs })
		});

		target.setAlcoholLevel(value);

		player.createAmplitudeEvent(`Changed blood alcohol level as staff`, { target: target.info.username, value });
		target.createAmplitudeEvent(`Blood alcohol level changed by staff`, { actioner: player.info.username, value });
	}
});
