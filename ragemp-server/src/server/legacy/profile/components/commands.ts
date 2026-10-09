mp.commands.addCommand({
	name: 'check',
	permission: 'cmds.check',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target }) => `${admin} checks the profile of ${target}.`,
			RO: ({ admin, target }) => `${admin} verifică profilul lui ${target}.`
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:check',
			messageId: 'Announcement',
			permission: 'cmds.check',
			args: () => ({
				admin: player.info.username,
				target: target.info.username
			})
		});
		player.createAmplitudeEvent(`Checked profile`, { target: target.info.username });
		target.createAmplitudeEvent(`Profile checked`, { actioner: player.info.username });
		player.triggerClientEvent(`setProfileOpened`, { boolean: true, playerId: target.id });
		player.updateVars({
			checkingProfileId: target.id
		});
	}
});
