import { getGroupById } from './functions';

mp.commands.addCommand({
	name: 'groupadd',
	aliases: ['gadd'],
	permission: 'cmds.groupadd',
	defineLangs: {
		Announcement: {
			EN: ({ player, target, group }) => `${player} added ${target} to group id ${group}`,
			RO: ({ player, target, group }) => `${player} l-a adaugat pe ${target} in group id ${group}`
		},
		InvalidGroup: {
			EN: ({ group }) => `Group id ${group} doesn't exist.`,
			RO: ({ group }) => `Grupul cu id-ul ${group} nu există.`
		},
		AlreadyPart: {
			EN: () => `The player is already being part of that group.`,
			RO: () => `Jucătorul face deja parte din acel grup.`
		}
	},
	args: {
		target: 'player',
		group: 'string'
	},
	handler: (player, { target, group }, lang) => {
		if (!getGroupById(group)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidGroup', { group }), 'system');
		if (player.info.groups.split(',').includes(group)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'AlreadyPart'), 'system');

		const langArgs = {
			player: player.info.username,
			target: target.info.username,
			group
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:groupadd',
			messageId: 'Announcement',
			permission: 'cmds.groupadd',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.groupadd') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		const newGroups = target.info.groups.split(',');
		newGroups.push(group);

		player.createAmplitudeEvent(`Added someone to group`, { target: target.info.username, group });
		target.createAmplitudeEvent(`Added to group`, { actioner: player.info.username, group });

		target.saveInfo({ groups: newGroups.join(',') });
	}
});

mp.commands.addCommand({
	name: 'groupremove',
	aliases: ['gremove', 'gdel'],
	permission: 'cmds.groupremove',
	defineLangs: {
		Announcement: {
			EN: ({ player, target, group }) => `${player} removed ${target} from group id ${group}`,
			RO: ({ player, target, group }) => `${player} l-a scos pe ${target} din group id ${group}`
		},
		NotPart: {
			EN: () => `The player is not being a part of that group.`,
			RO: () => `Jucătorul ny face parte din acel grup.`
		}
	},
	args: {
		target: 'player',
		group: 'string'
	},
	handler: (player, { target, group }, lang) => {
		if (!player.info.groups.includes(group)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NotPart'), 'system');

		const langArgs = {
			player: player.info.username,
			target: target.info.username,
			group
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:groupremove',
			messageId: 'Announcement',
			permission: 'cmds.groupremove',
			args: () => ({ ...langArgs })
		});

		const newGroups = target.info.groups.split(',');
		const index = newGroups.findIndex((i: string) => i === group);
		newGroups.splice(index, 1);

		player.createAmplitudeEvent(`Removed someone from group`, { target: target.info.username, group });
		target.createAmplitudeEvent(`Removed from group`, { actioner: player.info.username, group });

		target.saveInfo({ groups: newGroups.join(',') });
	}
});

mp.commands.addCommand({
	name: 'groupcheck',
	aliases: ['gcheck'],
	permission: 'cmds.groupcheck',
	defineLangs: {
		Listing: {
			EN: ({ player, groups, isDeveloper }) =>
				`GROUPS: ${player} is part of the following groups: {BR}-  ${groups.map((g: ExpectedAny) => `${isDeveloper ? `{b9b9b9}(${g.id}) ` : ``}{FFFFFF} ${g.label}`).join(', ')}`,
			RO: ({ player, groups, isDeveloper }) =>
				`GROUPS: ${player} face parte din următoarele grupuri: {BR}-  ${groups.map((g: ExpectedAny) => `${isDeveloper ? `{b9b9b9}(${g.id}) ` : ``}{FFFFFF} ${g.label}`).join(', ')}`
		},
		NotPart: {
			EN: ({ target }) => `${target} is not part of any groups.`,
			RO: ({ target }) => `${target} nu face parte dintr-un grup.`
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }, lang) => {
		if (target.info.groups.length < 1) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NotPart', { target: target.info.username }), 'system');

		const groupsFormatted: ExpectedAny = [];

		target.info.groups.split(',').forEach((g: string) => {
			const gMatch = getGroupById(g);
			if (!gMatch) {
				groupsFormatted.push({ label: `Invalid group`, id: g });
			} else {
				groupsFormatted.push({ label: gMatch.getTitle({ scope: 'groupName', meta: { includeLevel: true } }), id: gMatch.id });
			}
		});

		player.sendServerMessage('Server', 'system', lang(player.lang, 'Listing', { player: target.info.username, groups: groupsFormatted, isDeveloper: player.isDeveloper() }), 'system');
		player.createAmplitudeEvent(`Checked someone's groups`, { target: target.info.username, groups: target.info.groups });
		target.createAmplitudeEvent(`Groups checked`, { actioner: player.info.username, groups: target.info.groups });
	}
});

mp.commands.addCommand({
	name: 'permissioncheck',
	aliases: ['pcheck'],
	permission: 'cmds.permcheck',
	args: {
		target: 'player',
		permission: 'string'
	},
	handler: (player, { target, permission }) => {
		player.sendServerMessage(
			'Server',
			'staff',
			`Permission check for ${target.info.username} on permission [${permission}] - Result: ${target.checkPermission(permission) ? `Granted` : `Not granted`}`,
			'system'
		);
	}
});
