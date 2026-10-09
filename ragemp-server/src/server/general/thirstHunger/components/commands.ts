mp.commands.addCommand({
	name: 'sethunger',
	permission: 'cmds.sethunger',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} set ${target}'s hunger level to ${value}%`,
			RO: ({ admin, target, value }) => `${admin} i-a setat nivelul de hunger lui ${target} la ${value}%`
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
			systemId: 'cmdLangs:sethunger',
			messageId: 'Announcement',
			permission: 'cmds.sethunger',
			args: () => ({ ...langArgs })
		});

		target.setHungerPoints(value);

		player.createAmplitudeEvent(`Changed hunger points as staff`, { target: target.info.username, value });
		target.createAmplitudeEvent(`Hunger points changed by staff`, { actioner: player.info.username, value });
	}
});

mp.commands.addCommand({
	name: 'setthirst',
	permission: 'cmds.setthirst',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} set ${target}'s thirst level to ${value}%`,
			RO: ({ admin, target, value }) => `${admin} i-a setat nivelul de thirst lui ${target} la ${value}%`
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
			systemId: 'cmdLangs:setthirst',
			messageId: 'Announcement',
			permission: 'cmds.setthirst',
			args: () => ({ ...langArgs })
		});

		target.setThirstPoints(value);

		player.createAmplitudeEvent(`Changed thirst points as staff`, { target: target.info.username, value });
		target.createAmplitudeEvent(`Thirst points changed by staff`, { actioner: player.info.username, value });
	}
});
