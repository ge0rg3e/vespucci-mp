mp.commands.addCommand({
	name: `gotoactor`,
	permission: `cmds.gotoactor`,
	defineLangs: {
		Announcement: {
			EN: ({ actioner, actorId }) => `${actioner} has teleported to actor id ${actorId}`,
			RO: ({ actioner, actorId }) => `${actioner} s-a teleportat la un actor cu id ${actorId}`
		},
		InvalidId: {
			EN: ({ actorId }) => `There is no actor entity with id ${actorId}`,
			RO: ({ actorId }) => `Nu există nici un actor cu id ${actorId}`
		}
	},
	args: {
		actorId: 'number'
	},
	handler: (player, { actorId }, lang) => {
		const actor = mp.actors.getById(actorId);
		if (!actor) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidId', { actorId }), 'system');

		player.resetInteriorVarsOnTeleport();

		player.position = actor.getPosition();
		player.dimension = actor.entity.dimension;

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:gotoactor',
			messageId: 'Announcement',
			permission: 'cmds.gotoactor',
			args: () => ({
				actioner: player.info.username,
				actorId
			})
		});

		player.createAmplitudeEvent(`Teleported to actor id`, { actorId });
	}
});

mp.commands.addCommand({
	name: `gotoped`,
	permission: `cmds.gotoactor`,
	defineLangs: {
		Announcement: {
			EN: ({ actioner, pedId }) => `${actioner} has teleported to pedestrian id ${pedId}`,
			RO: ({ actioner, pedId }) => `${actioner} s-a teleportat la un pedestrian cu id ${pedId}`
		},
		InvalidId: {
			EN: ({ pedId }) => `There is no ped entity with id ${pedId}`,
			RO: ({ pedId }) => `Nu există nici un ped cu id ${pedId}`
		}
	},
	args: {
		pedId: 'number'
	},
	handler: (player, { pedId }, lang) => {
		const actor = mp.actors.getAll().find((c) => c.identifier == `pedestrians:${pedId}`);
		if (!actor) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidId', { pedId }), 'system');

		player.resetInteriorVarsOnTeleport();

		player.position = actor.getPosition();
		player.dimension = actor.entity.dimension;

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:gotoped',
			messageId: 'Announcement',
			permission: 'cmds.gotoactor',
			args: () => ({
				actioner: player.info.username,
				pedId
			})
		});

		player.createAmplitudeEvent(`Teleported to ped id`, { pedId, entityPedId: actor.entity.id });
	}
});
