import { getNativeWeapon } from '@server/natives/weapons/components/core';
import Whitelist from '@modules/database/game/whitelist/repository';
import { logError } from '@server/utils/helpers';
import { playerModels } from '@server/definitions/models';
import { warps } from '@server/definitions/warps';
import * as rpc from 'rage-rpc';
import { yellow } from 'colorette';

// Commands

mp.commands.addCommand({
	name: 'a',
	permission: 'cmds.adminchat',
	aliases: ['adminchat', 'ac'],
	args: {
		text: 'fullText'
	},
	flags: [`NotMuted`],
	handler: (player, { text }) => {
		const groupTitle = player.getPrimaryGroupTitle({ scope: 'chatTitle', meta: { includeLevel: true } });

		mp.chat.sendChatMessageToAll({
			channel: `staff`,
			type: (target: PlayerMp) => {
				// Get the message type
				const messageType = mp.chat.getMessageType('adminsChat', target.lang);
				if (!messageType) throw Error(`Failed to get message type.`);

				// Return..
				return messageType;
			},
			sender: () => `${groupTitle} ${player.info.username}`,
			content: () => {
				// Return..
				return {
					type: 'text',
					data: `{FC427B}${text}`
				};
			},
			// Check the player..
			checkPlayer: (target: PlayerMp) => target.checkPermission(`cmds.adminchat`) && target.vars.settings.chats.admin !== false
		});
	}
});

mp.commands.addCommand({
	name: 'gotoxyz',
	permission: 'cmds.gotoxyz',
	args: {
		x: 'float',
		y: 'float',
		z: 'float'
	},
	defineLangs: {
		successMessage: {
			EN: ({ x, y, z }) => `You've teleported to coords: ${x}, ${y}, ${z}.`,
			RO: ({ x, y, z }) => `Te-ai teleportat la pozitia: ${x}, ${y}, ${z}.`
		}
	},
	handler: (player, { x, y, z }, lang) => {
		player.updateVars({ lastRecoverablePosition: player.position });
		if (player.vars.spectating) return;

		if (player.vehicle) {
			player.vehicle.setPositionPatched(new mp.Vector3(x, y, z));
		} else {
			player.position = new mp.Vector3(x, y, z);
		}

		if (player.vars.isInGhostmode) {
			player.triggerClientEvent('setGhostCameraPos', { x, y, z });
		}

		player.createAmplitudeEvent('Teleported to coords', { coords: { x, y, z } });
		player.sendAdminMessage('Server', 'staff', lang(player.lang, 'successMessage', { x, y, z }), 'system');
	}
});

mp.commands.addCommand({
	name: 'savepos',
	permission: 'cmds.savepos',
	defineLangs: {
		Message: {
			EN: ({ name, x, y, z }) => `The coords for "${name}": ${x}, ${y}, ${z}.`,
			RO: ({ name, x, y, z }) => `Pozitia pentru "${name}": ${x},${y},${z}.`
		},
		SyntaxExampleMessage: {
			EN: `Argument GroundZ options: "true" or "false".`,
			RO: `Argument GroundZ optiuni: "true" sau "false".`
		}
	},
	args: {
		name: 'string',
		groundZ: 'string'
	},
	handler: async (player, { name, groundZ }, lang) => {
		const entity = player.vehicle ? player.vehicle : player;

		const coords = {
			x: entity.position.x.toFixed(3),
			y: entity.position.y.toFixed(3),
			z: entity.position.z.toFixed(3)
		};

		if (groundZ === 'true') {
			const groundPosition: number = await player.invokeClientEvent(`getGroundZPosition`, { position: entity.position })!;
			coords.z = groundPosition.toFixed(3);
		}

		const heading = entity.heading.toFixed(3);
		player.sendClientMessage('Server', 'staff', lang(player.lang, 'Message', { ...coords, name }), 'system');
		player.createAmplitudeEvent('Logged a position', { coords, name });

		console.info(`${yellow(`LOG - ${name}`)}`);
		console.info(`${yellow(`"x": ${coords.x}`)},`);
		console.info(`${yellow(`"y": ${coords.y}`)},`);
		console.info(`${yellow(`"z": ${coords.z}`)}`);
		console.info(`${yellow(`"heading": ${heading}`)}`);
	}
});

mp.commands.addCommand({
	name: 'savevehpos',
	permission: 'cmds.savepos',
	defineLangs: {
		Message: {
			EN: ({ name, x, y, z }) => `Vehicle coords for "${name}": ${x}, ${y}, ${z}.`,
			RO: ({ name, x, y, z }) => `Pozitie vehicul pentru "${name}": ${x},${y},${z}.`
		},
		SyntaxExampleMessage: {
			EN: `Argument GroundZ options: "true" or "false".`,
			RO: `Argument GroundZ optiuni: "true" sau "false".`
		},
		NoVehicle: {
			EN: 'You must be inside a vehicle to use this command.',
			RO: 'Trebuie să fi intr-un vehicul pentru a folosii această comandă.'
		}
	},
	args: {
		name: 'string'
	},
	handler: async (player, { name }, lang) => {
		if (!player.vehicle) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoVehicle'), 'system');

		const veh = player.vehicle;

		const coords = {
			x: veh.position.x.toFixed(3),
			y: veh.position.y.toFixed(3),
			z: veh.position.z.toFixed(3)
		};

		const rotation = veh.rotation;

		player.sendAdminMessage('Server', 'staff', lang(player.lang, 'Message', { ...coords, name }), 'system');
		player.createAmplitudeEvent('Logged a vehicle position', { coords, name, rotation });
		console.info(`Logged Vehicle position [${name}]`, {
			location: veh.position,
			arr: `[${coords.x}, ${coords.y}, ${coords.z}]`,
			locationFixed: {
				x: coords.x,
				y: coords.y,
				z: coords.z
			},
			rotation
		});
	}
});

mp.commands.addCommand({
	name: 'respawn',
	permission: 'cmds.respawn',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target }) => `${admin} has respawned ${target}.`,
			RO: ({ admin, target }) => `${admin} i-a dat respawn lui ${target}.`
		},
		InformingMessage: {
			EN: ({ player }) => `${player} have respawned you.`,
			RO: ({ player }) => `${player} ti-a dat respawn.`
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }, lang) => {
		target.updateVars({ lastRecoverablePosition: target.position });

		mp.events.call('onPlayerSpawn', target);
		target.createAmplitudeEvent('Respawned', { respawnedBy: player.info.username });
		player.createAmplitudeEvent('Respawned player', { respawned: target.info.username });
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:respawn',
			messageId: 'Announcement',
			permission: 'cmds.respawn',
			args: () => ({ admin: player.info.username, target: target.info.username })
		});
		if (target.checkPermission('cmds.respawn') === false) {
			target.sendAdminMessage('Server', 'staff', lang(target.lang, 'InformingMessage', { player: player.info.username }), 'system');
		}
	}
});

mp.commands.addCommand({
	name: 'goto',
	permission: 'cmds.goto',
	defineLangs: {
		Message: {
			EN: ({ target }) => `You have been teleported to ${target}.`,
			RO: ({ target }) => `Ai fost teleportat la ${target}.`
		},
		TargetMessage: {
			EN: ({ admin }) => `${admin} has teleported to you.`,
			RO: ({ admin }) => `${admin} s-a teleportat la tine.`
		},
		errorMessage: {
			EN: () => "You can't use this command on yourself.",
			RO: () => 'Nu poti folosii aceasta comanda pe tine.'
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }, lang) => {
		if (target === player) return player.sendErrorMessage('Server', 'system', lang(player.lang, `errorMessage`), 'system');
		if (player.vars.spectating || target.vars.spectating) return;

		player.resetInteriorVarsOnTeleport();

		if (player.vehicle) {
			player.vehicle.setPositionPatched(target.vehicle ? target.vehicle.position : target.position);
		} else {
			// store in this variable if the player is in a vehicle and if the vehicle has a free seat
			const canPutAsPassenger = Boolean(target.vehicle) && !Boolean(target.vehicle.getOccupant(1));

			// if the player is in a vehicle and the vehicle has a free seat, put the player as passenger
			if (canPutAsPassenger) {
				player.position = target.vehicle.position;
				target.vehicle.setOccupant(1, player);
			} else {
				player.position = target.position;
			}
		}

		if (player.vars.isInGhostmode) {
			player.triggerClientEvent('setGhostCameraPos', { x: target.position.x, y: target.position.y, z: target.position.z });
		}

		player.dimension = target.dimension;
		player.updateVars({
			lastRecoverablePosition: player.position,
			houseEntered: target.vars.houseEntered,
			garageEntered: target.vars.garageEntered
		});

		if (target.vars.garageEntered) {
			player.triggerClientEvent(`setUnableToDoDamage`, { bool: true });
		}

		target.createAmplitudeEvent('Staff teleported to him', { actioner: player.info.username });
		player.createAmplitudeEvent('Teleported to player', { target: target.info.username });
		player.sendAdminMessage('Server', 'staff', lang(player.lang, `Message`, { target: target.info.username }), 'system');
		target.sendAdminMessage('Server', 'staff', lang(target.lang, `TargetMessage`, { admin: player.info.username }), 'system');
	}
});

mp.commands.addCommand({
	name: 'gethere',
	permission: 'cmds.gethere',
	defineLangs: {
		Message: {
			EN: ({ target }) => `You've teleported ${target} to you. Use /sendback to send him back to his last position.`,
			RO: ({ target }) => `Ai teleportat jucatorul ${target} la tine. Foloseste /sendback pentru a-l trimite inapoi.`
		},
		TargetMessage: {
			EN: ({ player }) => `You have been teleported to ${player}.`,
			RO: ({ player }) => `Ai fost teleportat la ${player}.`
		},
		errorMessage: {
			EN: () => "You can't use this command on yourself.",
			RO: () => 'Nu poti folosii aceasta comanda pe tine.'
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }, lang) => {
		if (target === player) return player.sendErrorMessage('Server', 'system', lang(player.lang, `errorMessage`), 'system');
		if (player.vars.spectating || target.vars.spectating) return;

		target.resetInteriorVarsOnTeleport();

		if (target.vehicle) {
			target.vehicle.setPositionPatched(player.vehicle ? player.vehicle.position : player.position);
		} else {
			target.position = player.position;
		}

		if (target.vars.isInGhostmode) {
			target.triggerClientEvent('setGhostCameraPos', { x: player.position.x, y: player.position.y, z: player.position.z });
		}

		target.dimension = player.dimension;

		target.updateVars({
			lastRecoverablePosition: target.position,
			houseEntered: player.vars.houseEntered,
			garageEntered: player.vars.garageEntered
		});

		if (player.vars.garageEntered) {
			target.triggerClientEvent(`setUnableToDoDamage`, { bool: true });
		}

		player.createAmplitudeEvent('Staff teleported to him', { target: target.info.username });
		target.createAmplitudeEvent('Teleported to player', { actioner: player.info.username });

		player.sendAdminMessage('Server', 'staff', lang(player.lang, `Message`, { target: target.info.username }), 'system');
		target.sendAdminMessage('Server', 'staff', lang(target.lang, `TargetMessage`, { player: player.info.username, target: target.info.username }), 'system');
	}
});

mp.commands.addCommand({
	name: 'mark',
	permission: 'cmds.mark',
	defineLangs: {
		Message: {
			EN: () => `You've marked your current position and then use /marks to see all existing positions.`,
			RO: () => `Ai marcat această pozitie, acum poti folosi comanda /marks pentru a vedea toate pozitiile existente.`
		},
		AlreadyMark: {
			EN: ({ name }) => `Mark ${name} already exist.`,
			RO: ({ name }) => `Mark-ul ${name} exista deja.`
		}
	},
	args: {
		name: 'string'
	},
	handler: (player, { name }, lang) => {
		const currentMarks = player.meta.marks;
		const newMarks = { ...currentMarks, [name]: player.position };

		player.updateMeta({ marks: newMarks });
		player.sendAdminMessage('Server', 'staff', lang(player.lang, `Message`), 'system');
		player.createAmplitudeEvent('Marked position', { metaMark: name, position: player.position });
	}
});

mp.commands.addCommand({
	name: 'marks',
	permission: 'cmds.mark',
	defineLangs: {
		AllMarkers: {
			EN: ({ name }) => `Your existing marks: ${name}.`,
			RO: ({ name }) => `Toate pozitiile tale marcate: ${name}.`
		},
		NoMarkers: {
			EN: () => `You don't have saved marks. Use [/mark] to create one.`,
			RO: () => `Nu ai nicio pozitie salvata. Foloseste [/mark] pentru a salva una.`
		}
	},
	handler: (player, _, lang) => {
		const playerMarks = Object.keys(player.meta.marks).join(', ');
		const marksLength = Object.keys(player.meta.marks).length;
		player.sendAdminMessage('Server', 'staff', marksLength < 1 ? lang(player.lang, `NoMarkers`) : lang(player.lang, `AllMarkers`, { name: playerMarks }), 'system');
	}
});

mp.commands.addCommand({
	name: 'gotomark',
	permission: 'cmds.mark',
	defineLangs: {
		ErrorMessage: {
			EN: () => `You don't have a marked position to return to.`,
			RO: () => `Nu ai o poziție marcată la care să te întorci.`
		},
		SuccessMessage: {
			EN: ({ mark }) => `You've teleported to your marked position ${mark}.`,
			RO: ({ mark }) => `Te-ai teleportat la punctul tau marked ${mark}`
		},
		MarkErrorMessage: {
			EN: ({ mark }) => `Mark ${mark} dosen't exist. Use /marks to see all your marks.`,
			RO: ({ mark }) => `Mark-ul ${mark} nu există. Folosește comanda /marks pentru a-ți vedea toate pozitiile marcate.`
		},
		SyntaxExampleMessage: {
			EN: ({ player }) => `Marks: ${Object.keys(player.meta.marks).join(', ')}`,
			RO: ({ player }) => `Marks: ${Object.keys(player.meta.marks).join(', ')}`
		}
	},
	args: {
		mark: 'string'
	},
	handler: (player, { mark }, lang) => {
		if (player.meta.marks === null) return player.sendErrorMessage('Server', 'system', lang(player.lang, `ErrorMessage`), 'system');
		if (!player.meta.marks[mark]) return player.sendErrorMessage('Server', 'system', lang(player.lang, `MarkErrorMessage`, { mark }), 'system');

		player.resetInteriorVarsOnTeleport();

		if (player.vehicle) {
			player.vehicle.setPositionPatched(new mp.Vector3(player.meta.marks[mark]));
			player.vehicle.setDimension(0);
		} else {
			player.position = new mp.Vector3(player.meta.marks[mark]);
		}
		player.dimension = 0; // in the future maybe we should save the dimension too.
		player.sendAdminMessage('Server', 'staff', lang(player.lang, 'SuccessMessage', { mark }), 'system');
		player.createAmplitudeEvent('Teleported to marked position', { metaMark: player.meta.marks[mark] });
	}
});

mp.commands.addCommand({
	name: 'deletemark',
	aliases: ['delmark'],
	permission: 'cmds.mark',
	defineLangs: {
		SuccessMessage: {
			EN: ({ mark }) => `You've been deleted ${mark} mark.`,
			RO: ({ mark }) => `Ai sters markul ${mark}.`
		},
		ErrorMessage: {
			EN: ({ mark }) => `Mark ${mark} dosen't exist. Use /marks to see all your marks.`,
			RO: ({ mark }) => `Mark-ul ${mark} nu există. Folosește comanda /marks pentru a-ți vedea toate pozitiile marcate.`
		},
		SyntaxExampleMessage: {
			EN: ({ player }) => `Marks: ${Object.keys(player.meta.marks).join(', ')}`,
			RO: ({ player }) => `Marks: ${Object.keys(player.meta.marks).join(', ')}`
		}
	},
	args: {
		mark: 'string'
	},
	handler: (player, { mark }, lang) => {
		if (!player.meta.marks[mark]) return player.sendErrorMessage('Server', 'system', lang(player.lang, `ErrorMessage`, { mark }), 'system');
		if (player.vars.spectating) return;
		const currentMarks = player.meta.marks;
		delete currentMarks[mark];

		player.updateMeta({ marks: currentMarks });
		player.sendAdminMessage('Server', 'staff', lang(player.lang, 'SuccessMessage', { mark }), 'system');
		player.createAmplitudeEvent('Deleted marked position', { metaMark: mark });
	}
});

rpc.on('playerCreateWaypoint', async (args, { player }: rpc.ProcedureInfo) => {
	const { position, manuallyCreated } = JSON.parse(args);

	if (player?.checkPermission('cmds.mark')) {
		player?.updateMeta({ waypointMarked: position });
	}

	// Waypoint teleportation automatically if enabled
	if (player?.meta.waypointTeleportation === true && player?.checkPermission('cmds.mark') && manuallyCreated) {
		if (!position.z) {
			const z: ExpectedAny = await player.invokeClientEvent('GetGroundZForNotRenderedArea', { position });
			if (z) {
				position.z = z;
			} else {
				player.triggerClientEvent(`onWaypointTeleportationFailed`);
				return false;
			}
		}

		player.resetInteriorVarsOnTeleport();

		if (player.vehicle && player.seat === 0) {
			player.vehicle.setPositionPatched(new mp.Vector3(position));
		} else {
			player.position = new mp.Vector3(position);
		}

		player.createAmplitudeEvent('Teleported to waypoint', { waypointMarked: player.meta.waypointMarked });
		player.triggerClientEvent(`deleteWaypoint`);
	}

	return true;
});

mp.commands.addCommand({
	name: 'wptp',
	permission: 'cmds.wptp',
	aliases: ['waypointteleport'],
	defineLangs: {
		SuccessMessage: {
			EN: ({ bool }) => `You've ${bool === true ? `enabled` : `disabled`} waypoint teleportation.`,
			RO: ({ bool }) => `Ai ${bool === true ? `activat` : `dezactivat`} teleportarea automată la waypoint.`
		}
	},
	handler: (player, _, lang) => {
		player.sendAdminMessage('Server', 'staff', lang(player.lang, `SuccessMessage`, { bool: !player.meta.waypointTeleportation }), 'system');
		player.updateMeta({ waypointTeleportation: !player.meta.waypointTeleportation });
		player.createAmplitudeEvent('Toggled waypoint teleportation', { waypointTeleportation: player.meta.waypointTeleportation });
	}
});

mp.commands.addCommand({
	name: 'setadmin',
	aliases: ['makeadmin'],
	permission: 'cmds.setadmin',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} has set ${target} to Admin level ${value}.`,
			RO: ({ admin, target, value }) => `${admin} l-a setat pe ${target} la Admin de level ${value}.`
		},
		InvalidValue: {
			EN: () => `The admin level specified wasn't a valid one.`,
			RO: () => `Nivelul administrativ specificat nu este valid.`
		},
		PermissionDenied: {
			EN: () => `You don't have the permission required to use the command on that person.`,
			RO: () => `Nu ai permisiunea necesară să execuți comandă pe acea persoană.`
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (![0, 1, 2, 3, 4, 5, 6, 7].includes(value)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidValue'), 'system');
		if (value === 7 && player.checkPermission('adminCmds.makeAdminLv7') === false) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidValue'), 'system');
		if (player.getAdminLevel() <= target.getAdminLevel() && player !== target) return player.sendErrorMessage('Server', 'system', lang(player.lang, `PermissionDenied`), 'system');

		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setadmin',
			messageId: 'Announcement',
			permission: 'cmds.setadmin',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.setadmin') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		const currentAdminGroup = target.info.groups.split(',').find((g: string) => g.includes('admins'));

		if (currentAdminGroup) {
			target.removeFromGroup(currentAdminGroup);
		}

		if (value !== 0) {
			const isPrimary = target.info.groups.includes(`developers`) ? false : true;
			target.addToGroup(`admins:${value}`, isPrimary);
		}

		player.createAmplitudeEvent(`Set an administrator level`, { target: target.info.username, value });
		target.createAmplitudeEvent(`Staff level changed`, { actioner: player.info.username, value });
		player.logAction({
			name: 'cmd_setadmin',
			type: 'staff',
			variables: {
				admin: player.info.username,
				taget: target.info.username,
				value
			}
		});
		target.saveInfo({ groups: target.info.groups });
	}
});

mp.commands.addCommand({
	//de rezolvat bug nu se sterg gradele cand dai alt grad de agent sau de helper
	name: 'sethelper',
	aliases: ['makehelper'],
	permission: 'cmds.sethelper',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} has set ${target} to Helper level ${value}.`,
			RO: ({ admin, target, value }) => `${admin} l-a setat pe ${target} la Helper de level ${value}.`
		},
		InvalidValue: {
			EN: () => `The helper level specified wasn't a valid one.`,
			RO: () => `Nivelul de helper specificat nu este valid.`
		},
		PermissionDenied: {
			EN: () => `You don't have the permission required to use the command on that person.`,
			RO: () => `Nu ai permisiunea necesară să execuți comandă pe acea persoană.`
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (![0, 1, 2, 3].includes(value)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidValue'), 'system');
		if (player.getAdminLevel() <= target.getAdminLevel() && player !== target) return player.sendErrorMessage('Server', 'system', lang(player.lang, `PermissionDenied`), 'system');

		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:sethelper',
			messageId: 'Announcement',
			permission: 'cmds.sethelper',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.sethelper') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		const currentHelperGroup = target.info.groups.split(',').find((g: string) => g.includes('helpers'));

		if (currentHelperGroup) {
			target.removeFromGroup(currentHelperGroup);
		}

		if (value !== 0) {
			const isPrimary = target.info.groups.includes(`admins`) ? false : true;
			target.addToGroup(`helpers:${value}`, isPrimary);
		}
		player.createAmplitudeEvent(`Set an helper level`, { target: target.info.username, value });
		target.createAmplitudeEvent(`Helper level changed`, { actioner: player.info.username, value });
		player.logAction({
			name: 'cmd_sethelper',
			type: 'staff',
			variables: {
				admin: player.info.username,
				taget: target.info.username,
				value
			}
		});
		target.saveInfo({ groups: target.info.groups });
	}
});

mp.commands.addCommand({
	name: 'setagent',
	aliases: ['makeagent'],
	permission: 'cmds.setagent',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} has set ${target} to Agent level ${value}.`,
			RO: ({ admin, target, value }) => `${admin} l-a setat pe ${target} la Agent de level ${value}.`
		},
		InvalidValue: {
			EN: () => `The agent level specified wasn't a valid one.`,
			RO: () => `Nivelul de agent specificat nu este valid.`
		},
		PermissionDenied: {
			EN: () => `You don't have the permission required to use the command on that person.`,
			RO: () => `Nu ai permisiunea necesară să execuți comandă pe acea persoană.`
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (![0, 1, 2, 3].includes(value)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidValue'), 'system');
		if (player.getAdminLevel() <= target.getAdminLevel() && player !== target) return player.sendErrorMessage('Server', 'system', lang(player.lang, `PermissionDenied`), 'system');

		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setagent',
			messageId: 'Announcement',
			permission: 'cmds.setagent',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.setagent') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		const currentAgentGroup = target.info.groups.split(',').find((g: string) => g.includes('agents'));

		if (currentAgentGroup) {
			target.removeFromGroup(currentAgentGroup);
		}

		if (value !== 0) {
			const isPrimary = target.info.groups.includes(`helpers`) ? false : true;
			target.addToGroup(`agents:${value}`, isPrimary);
		}
		player.createAmplitudeEvent(`Set an agent level`, { target: target.info.username, value });
		target.createAmplitudeEvent(`Agent level changed`, { actioner: player.info.username, value });
		player.logAction({
			name: 'cmd_setagent',
			type: 'staff',
			variables: {
				admin: player.info.username,
				taget: target.info.username,
				value
			}
		});
		target.saveInfo({ groups: target.info.groups });
	}
});

mp.commands.addCommand({
	name: 'settester',
	aliases: ['maketester'],
	permission: 'cmds.settester',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} has set ${target} to Tester level ${value}.`,
			RO: ({ admin, target, value }) => `${admin} l-a setat pe ${target} la Tester de level ${value}.`
		},
		InvalidValue: {
			EN: () => `The tester level specified wasn't a valid one.`,
			RO: () => `Nivelul de tester specificat nu este valid.`
		},
		PermissionDenied: {
			EN: () => `You don't have the permission required to use the command on that person.`,
			RO: () => `Nu ai permisiunea necesară să execuți comandă pe acea persoană.`
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (![0, 1].includes(value)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidValue'), 'system');
		if (player.getAdminLevel() <= target.getAdminLevel() && player !== target) return player.sendErrorMessage('Server', 'system', lang(player.lang, `PermissionDenied`), 'system');

		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:settester',
			messageId: 'Announcement',
			permission: 'cmds.settester',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.settester') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		const currentTesterGroup = target.info.groups.split(',').find((g: string) => g.includes('testers'));

		if (currentTesterGroup) {
			target.removeFromGroup(currentTesterGroup);
		}

		if (value !== 0) {
			const isPrimary = target.info.groups.includes(`agents`) ? false : true;
			target.addToGroup(`testers:${value}`, isPrimary);
		}

		player.createAmplitudeEvent(`Set a tester level`, { target: target.info.username, value });
		target.createAmplitudeEvent(`Tester level changed`, { actioner: player.info.username, value });
		player.logAction({
			name: 'cmd_setester',
			type: 'staff',
			variables: {
				admin: player.info.username,
				taget: target.info.username,
				value
			}
		});
		target.saveInfo({ groups: target.info.groups });
	}
});

mp.commands.addCommand({
	name: 'adminhelp',
	aliases: 'ah',
	permission: 'cmds.adminhelp',
	handler: (player) => {
		const adminLevel = player.getAdminLevel();
		if (adminLevel >= 1) {
			player.sendClientMessage(
				'Server',
				'staff',
				`{b9b9b9}[ADMIN LEVEL 1]{BR}{FFFFFF}\
					/adminhelp /adminchat /goto /hid /gotoxyz /mark /gotomark /deletemark{BR}\
					/mute /unmute /mytod /freeze /unfreeze /setskin /mywod /cmc /wptp{BR}\
					/setdimension /warp /gotorent /dealershipid /givelicense /removelicense, /checklicense
			`,
				'system'
			);
		}

		if (adminLevel >= 2) {
			player.sendClientMessage(
				'Server',
				'staff',
				`{b9b9b9}[ADMIN LEVEL 2]{FFFFFF}\n{BR}
					/respawn /clearchat /sendto /fv /flip /sethealth /setarmour /check{BR}
					/gotolastpos /sendback /spectate /specoff /gotoveh /sethunger /setthirst
			`,
				'system'
			);
		}

		if (adminLevel >= 3) {
			player.sendClientMessage(
				'Server',
				'staff',
				`{b9b9b9}[ADMIN LEVEL 3]{FFFFFF} /savepos /slap /gethere /aghost /rtc /savecampos /warn /unwarn{BR}\
				/getveh /savevehpos /setvehfuel`,
				'system'
			);
		}

		if (adminLevel >= 4) {
			player.sendClientMessage(
				'Server',
				'staff',
				`{b9b9b9}[ADMIN LEVEL 4]{FFFFFF} /kick /tod /veh /fav /giveweapon /takeweapons /ban /ftc /fac{BR}\
				/checkpveh /checkveh /resetclothes`,
				'system'
			);
		}

		if (adminLevel >= 5) {
			player.sendClientMessage('Server', 'staff', `{b9b9b9}[ADMIN LEVEL 5]{FFFFFF} /createveh /serverannounce /wod /godmode /checkinventory /aevent /givetoall`, 'system');
		}

		if (adminLevel >= 6) {
			player.sendClientMessage(
				'Server',
				'staff',
				`{b9b9b9}[ADMIN LEVEL 6]{FFFFFF} /setadmin /sethelper /setagent /settester /setlevel /setmoney /takemoney{BR}\
				/givemoney /setexp /setpaycheck /givepaycheck /wladd /wlremove`,
				'system'
			);
		}

		if (adminLevel >= 7) {
			player.sendClientMessage(
				'Server',
				'staff',
				`{b9b9b9}[ADMIN LEVEL 7]{FFFFFF} /groupcheck /hinteriors /createhouse /edithouse /deletehouse /gotohouse{BR}\
				/createbusiness /editbusiness /deletebusiness /businesstype /gotobusiness{BR}\
				/creategarage /gints /deletegarage /rac /savedata{BR}\
				/createdealership /deletedealership /updatedealership /reloaddealership`,
				'system'
			);
		}
	}
});

mp.commands.addCommand({
	name: 'helperhelp',
	aliases: 'hh',
	permission: 'cmds.helperhelp',
	handler: (player) => {
		const helperLevel = player.getHelperLevel();

		if (helperLevel >= 1) {
			player.sendClientMessage('Server', 'staff', '{b9b9b9}[HELPER LEVEL 1]{FFFFFF} /helperhelp /a /mytod /clearmychat /respawn /goto /sethealth /spectate', 'system');
		}

		if (helperLevel >= 2) {
			player.sendClientMessage('Server', 'staff', '{b9b9b9}[HELPER LEVEL 2]{FFFFFF} /mywod /warp /gethere /sendback /slap', 'system');
		}

		if (helperLevel >= 3) {
			player.sendClientMessage('Server', 'staff', '{b9b9b9}[HELPER LEVEL 3]{FFFFFF} /freeze /wptp /mute /houseid', 'system');
		}
	}
});

mp.commands.addCommand({
	name: 'agenthelp',
	aliases: 'aghelp',
	permission: 'cmds.agenthelp',
	handler: (player) => {
		const agentLevel = player.getAgentLevel();

		if (agentLevel >= 1) {
			player.sendClientMessage('Server', 'staff', '{b9b9b9}[AGENT LEVEL 1]{FFFFFF} /aghelp /a /clearmychat', 'system');
		}

		if (agentLevel >= 2) {
			player.sendClientMessage('Server', 'staff', '{b9b9b9}[AGENT LEVEL 2]{FFFFFF} /mytod', 'system');
		}

		if (agentLevel >= 3) {
			player.sendClientMessage('Server', 'staff', '{b9b9b9}[AGENT LEVEL 3]{FFFFFF} /spectate /goto /sethealth', 'system');
		}
	}
});

mp.commands.addCommand({
	name: 'testerhelp',
	aliases: 'thelp',
	permission: 'cmds.testerhelp',
	handler: (player) => {
		const testerLevel = player.info.groups.includes('testers');

		if (testerLevel) {
			player.sendServerMessage('Server', 'staff', '{b9b9b9}[TESTER COMMANDS]{FFFFFF} /tc /clearmychat /testerhelp', 'system');
		}
	}
});

mp.commands.addCommand({
	name: 'developerhelp',
	aliases: 'dh',
	permission: 'cmds.dhelp',
	handler: (player) => {
		player.sendServerMessage('Server', 'staff', '{b9b9b9}[DEVELOPERS]{FFFFFF} /gadd /gdel /gcheck /pcheck /giveitem', 'system');
	}
});

mp.commands.addCommand({
	name: 'freeze',
	permission: 'cmds.freeze',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target }) => `${admin} froze ${target}.`,
			RO: ({ admin, target }) => `${admin} l-a înghețat pe ${target}.`
		},
		TargetMessage: {
			EN: ({ admin }) => `You were frozen by ${admin}.`,
			RO: ({ admin }) => `Ai primit freeze de la ${admin}.`
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }, lang) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:freeze',
			messageId: 'Announcement',
			permission: 'cmds.freeze',
			args: () => ({ admin: player.info.username, target: target.info.username })
		});

		if (target.checkPermission('cmds.freeeze') === false) {
			target.sendAdminMessage('Server', 'system', lang(target.lang, 'TargetMessage', { admin: player.info.username }), 'system');
		}

		target.freeze({ systemId: 'cmdLangs:freeze', toggle: true });

		target.createAmplitudeEvent('Frozen', { actioner: player.info.username });
		player.createAmplitudeEvent('Froze player', { target: target.info.username });
	}
});

mp.commands.addCommand({
	name: 'unfreeze',
	permission: 'cmds.freeze',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target }) => `${admin} unfrozen ${target}.`,
			RO: ({ admin, target }) => `${admin} l-a dezghețat pe ${target}.`
		},
		TargetMessage: {
			EN: ({ admin }) => `You were unfrozen by ${admin}.`,
			RO: ({ admin }) => `Ai primit unfreeze de la ${admin}.`
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }, lang) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:unfreeze',
			messageId: 'Announcement',
			permission: 'cmds.freeze',
			args: () => ({ admin: player.info.username, target: target.info.username })
		});

		if (target.checkPermission('cmds.freeze') === false) {
			target.sendAdminMessage('Server', 'staff', lang(target.lang, 'TargetMessage', { admin: player.info.username }), 'system');
		}

		target.freeze({ systemId: 'cmdLangs:freeze', toggle: false });

		target.createAmplitudeEvent('Unfroze', { actioner: player.info.username });
		player.createAmplitudeEvent('Unfroze player', { target: target.info.username });
	}
});

mp.commands.addCommand({
	name: 'sendto',
	permission: 'cmds.sendto',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, target2 }) => `${admin} sent ${target} to ${target2}.`,
			RO: ({ admin, target, target2 }) => `${admin} l-a trimis pe ${target} la ${target2}.`
		},
		TargetMessage0: {
			EN: ({ admin, target2 }) => `${admin} sent you to ${target2}.`,
			RO: ({ admin, target2 }) => `${admin} te-a trimis la ${target2}.`
		},
		TargetMessage1: {
			EN: ({ admin, target }) => `Player ${target} has been sent to you by ${admin}.`,
			RO: ({ admin, target }) => `Jucatorul ${target} a fost trimis la tine de catre ${admin}.`
		},
		ErrorMessage: {
			EN: () => "You can't use this command on yourself.",
			RO: () => 'Nu poti folosii aceasta comanda pe tine.'
		}
	},
	args: {
		target: 'player',
		target2: 'player'
	},
	handler: (player, { target, target2 }, lang) => {
		if (target === player) return player.sendErrorMessage('Server', 'system', lang(player.lang, `ErrorMessage`), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:sendto',
			messageId: 'Announcement',
			permission: 'cmds.sendto',
			args: () => ({ admin: player.info.username, target: target.info.username, target2: target2.info.username })
		});

		if (target.checkPermission('cmds.sendto') === false) {
			target.sendAdminMessage('Server', 'staff', lang(target.lang, 'TargetMessage0', { admin: player.info.username, target2: target2.info.username }), 'system');
		}

		if (target2.checkPermission('cmds.sendto') === false) {
			target2.sendAdminMessage('Server', 'staff', lang(target2.lang, 'TargetMessage1', { admin: player.info.username, target: target.info.username }), 'system');
		}

		if (target.vars.spectating || target2.vars.spectating) return;

		target.resetInteriorVarsOnTeleport();

		target.position = target2.position;

		target2.updateVars({
			houseEntered: target.vars.houseEntered
		});

		target.createAmplitudeEvent('Sent by teleportation from staff', { actioner: player.info.username });
		player.createAmplitudeEvent('Sent player by teleportation', { target: target.info.username });
	}
});

mp.commands.addCommand({
	name: 'sethealth',
	aliases: ['sethp'],
	permission: 'cmds.sethealth',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} set ${target} health ${value}.`,
			RO: ({ admin, target, value }) => `${admin} i-a setat health ${value} lui ${target}.`
		},
		TargetMessage: {
			EN: ({ admin, value }) => `${admin} has set your health ${value}.`,
			RO: ({ admin, value }) => `${admin} ti-a setat health la ${value}.`
		},
		InvalidMessage: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (value < 1 || value > 100) return player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidMessage`), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:sethealth',
			messageId: 'Announcement',
			permission: 'cmds.sethealth',
			args: () => ({ admin: player.info.username, target: target.info.username, value })
		});

		if (target.checkPermission('cmds.sethealth') === false) {
			target.sendAdminMessage('Server', 'staff', lang(target.lang, 'TargetMessage', { admin: player.info.username, value }), 'system');
		}

		target.health = value;

		target.createAmplitudeEvent('Health updated', { actioner: player.info.username });
		player.createAmplitudeEvent('Updated health', { target: target.info.username, healthSet: value });
	}
});

mp.commands.addCommand({
	name: 'setarmour',
	permission: 'cmds.setarmour',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} set ${target}'s armour to ${value}.`,
			RO: ({ admin, target, value }) => `${admin} i-a setat armură ${value} lui ${target}.`
		},
		TargetMessage: {
			EN: ({ admin, value }) => `${admin} has set your armour ${value}.`,
			RO: ({ admin, value }) => `${admin} ti-a setat armură ${value}.`
		},
		InvalidMessage: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (value < 0 || value > 100) return player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidMessage`), 'system');

		if (target.checkPermission('cmds.setarmour') === false) {
			target.sendAdminMessage('Server', 'staff', lang(target.lang, 'TargetMessage', { admin: player.info.username, value }), 'system');
		}

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setarmour',
			messageId: 'Announcement',
			permission: 'cmds.setarmour',
			args: () => ({ admin: player.info.username, target: target.info.username, value })
		});

		target.armour = value;

		target.createAmplitudeEvent('Armoured by staff', { actioner: player.info.username });
		player.createAmplitudeEvent('Armoured player', { target: target.info.username });
	}
});

mp.commands.addCommand({
	name: 'setdimension',
	aliases: ['setdim', 'setvw'],
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} set ${target} dimenstion to ${value}.`,
			RO: ({ admin, target, value }) => `${admin} i-a setat dimensiunea ${value} lui ${target}.`
		},
		TargetMessage: {
			EN: ({ admin, value }) => `${admin} changed your dimenstion to ${value}.`,
			RO: ({ admin, value }) => `${admin} ti-a schimbat dimensiunea in ${value}.`
		},
		InvalidMessage: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (value < 0 || value > 999999) return player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidMessage`), 'system');

		if (target.checkPermission('cmds.setdimension') === false) {
			target.sendAdminMessage('Server', 'staff', lang(target.lang, 'TargetMessage', { admin: player.info.username, value }), 'system');
		}

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setdimension',
			permission: 'cmds.setdimension',
			messageId: 'Announcement',
			args: () => ({ admin: player.info.username, target: target.info.username, value })
		});

		target.dimension = value;
		if (target.vehicle) {
			target.vehicle.setDimension(value);
		}

		target.createAmplitudeEvent('Changed dimension by staff', { actioner: player.info.username });
		player.createAmplitudeEvent('Changed dimension', { target: target.info.username });
	}
});

mp.commands.addCommand({
	name: 'godmode',
	aliases: ['agm', 'setgodmode'],
	permission: 'cmds.godmode',
	args: {
		target: 'player'
	},
	defineLangs: {
		Announcement: {
			EN: ({ admin, toggle, target }) => `${admin} turned ${toggle ? 'off' : 'on'} ${target}'s god mode.`,
			RO: ({ admin, toggle, target }) => `${admin} a ${toggle ? 'dezactivat' : 'activat'} godmode-ul jucatorului ${target}.`
		},
		safeZoneMessage: {
			EN: 'The target is in safezone.',
			RO: 'Target-ul este in safezone.'
		}
	},
	handler: (player, { target }, lang) => {
		if (target.vars.isInSafezone) return player.sendErrorMessage('Server', 'system', lang(target.lang, `safeZoneMessage`), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:godmode',
			messageId: 'Announcement',
			permission: 'cmds.godmode',
			args: () => ({ admin: player.info.username, toggle: target.vars.godmode, target: target.info.username })
		});

		target.updateVars({
			godmode: !target.vars.godmode
		});

		target.triggerClientEvent('setGodmode', { toggle: target.vars.godmode }); //aici inca n am facut
		target.createAmplitudeEvent('Godmode', { actioner: player.info.username, toggle: target.vars.godmode });
		target.createAmplitudeEvent('Updated godmode', { actioner: player.info.username, target: target.info.username, toggle: target.vars.godmode });

		return false;
	}
});

mp.commands.addCommand({
	name: 'aghost',
	aliases: [`agh`],
	permission: 'cmds.aghost',
	defineLangs: {
		Enabled: {
			EN: ({ admin }) => `${admin} activated ghost mode.`,
			RO: ({ admin }) => `${admin} a activat ghost mode.`
		},
		Disabled: {
			EN: ({ admin }) => `${admin} deactivated ghost mode.`,
			RO: ({ admin }) => `${admin} a dezactivat ghost mode.`
		}
	},
	handler: (player) => {
		player.updateVars({
			isInGhostmode: !player.vars.isInGhostmode
		});

		const langArgs = { admin: player.info.username };
		player.alpha = player.vars.isInGhostmode ? 0 : 255;

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:aghost',
			permission: 'cmds.aghost',
			messageId: player.vars.isInGhostmode ? 'Enabled' : 'Disabled',
			args: () => ({ ...langArgs })
		});

		player.triggerClientEvent('setGhostmode', { ghostmode: player.vars.isInGhostmode });
		player.createAmplitudeEvent(`Ghost Mode`, { ghostmode: player.vars.isInGhostmode });
	}
});

mp.commands.addCommand({
	name: 'savecampos',
	aliases: [`scp`],
	permission: 'cmds.savecampos',
	defineLangs: {
		Message: {
			EN: ({ name, coords }) => `The coords for camera "${name}": Direction - ${coords[0].x},${coords[0].y},${coords[0].z} - Coords: ${coords[1].x},${coords[1].y},${coords[1].z}.`,
			RO: ({ name, coords }) => `Coordonatele pentru camera "${name}": Directie - ${coords[0].x},${coords[0].y},${coords[0].z} - Coordonate: ${coords[1].x},${coords[1].y},${coords[1].z}.`
		},
		Error: {
			EN: () => `You need to be in ghostmode to use this command.`,
			RO: () => `Trebuie sa fii in modul de ghost pentru a putea folosi această comandă.`
		}
	},
	args: {
		name: 'string'
	},
	handler: async (player, { name }, lang) => {
		if (!player.vars.isInGhostmode) return player.sendClientMessage('Server', 'system', lang(player.lang, 'Error'), 'system');
		const coords: Array<Vector3> = await player.invokeClientEvent('getCamPos')!;

		player.sendServerMessage('Server', 'staff', lang(player.lang, 'Message', { name, coords }), 'system');
		player.createAmplitudeEvent('Logged a camera position', { direction: coords[0], coords: coords[1] });

		// prettier-ignore
		// eslint-disable-next-line
		console.log(`camera logged ${name}`, JSON.stringify( {
			"rot": {
				"x": coords[0].x,
				"y": coords[0].y,
				"z": coords[0].z
			},
			"coords": {
				"x": coords[1].x,
				"y": coords[1].y,
				"z": coords[1].z
			}
		}, null, 4))
	}
});

mp.commands.addCommand({
	name: 'setcampos',
	permission: 'cmds.savecampos',
	defineLangs: {
		Message: {
			EN: () => `The coords for camera has been set.`,
			RO: () => `Coordonatele pentru camera au fost setate.`
		},
		Error: {
			EN: () => `You need to be in ghostmode to use this command.`,
			RO: () => `Trebuie sa fii in modul de ghost pentru a putea folosi această comandă.`
		}
	},
	args: {
		x: 'string',
		y: 'string',
		z: 'string',
		rotX: 'string',
		rotY: 'string',
		rotZ: 'string'
	},
	handler: async (player, { x, y, z, rotX, rotY, rotZ }, lang) => {
		if (!player.vars.isInGhostmode) return player.sendClientMessage('Server', 'system', lang(player.lang, 'Error'), 'system');

		player.sendServerMessage('Server', 'staff', lang(player.lang, 'Message'), 'system');

		player.triggerClientEvent(`ghost:setCamPos`, {
			direction: { x: parseFloat(rotX), y: parseFloat(rotY), z: parseFloat(rotZ) },
			coords: { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) }
		});

		console.info('camera set for debugging agh', {
			direction: { x: parseFloat(rotX), y: parseFloat(rotY), z: parseFloat(rotZ) },
			coords: { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) }
		});
	}
});

mp.commands.addCommand({
	name: 'setskin',
	permission: 'cmds.setskin',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, model }) => `${admin} set skin model of ${target} to ${model}.`,
			RO: ({ admin, target, model }) => `${admin} i-a setat skin-ul lui ${target} la ${model}.`
		},
		InvalidModel: {
			EN: () => `Invalid skin model.`,
			RO: () => `Nu există modelul.`
		},
		TargetMessage: {
			EN: ({ admin, model }) => `${admin} changed your skin model to ${model}.`,
			RO: ({ admin, model }) => `${admin} ti-a schimbat skin-ul in ${model}`
		}
	},
	args: {
		target: 'player',
		model: 'string'
	},
	handler: (player, { target, model }, lang) => {
		const baseOnlineModel = target.info.clothes.gender === 'male' ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
		const modelEntered = model === 'reset' ? baseOnlineModel : model;
		const modelFound = playerModels.find((entry) => (entry.includes(modelEntered) ? true : false));
		if (!modelFound) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidModel'), 'system');

		target.model = mp.joaat(modelFound);

		if (model === 'reset' || model === baseOnlineModel) {
			player.updateClothes(player.info.clothes);
		}

		if (target.checkPermission('cmds.setskin') === false) {
			target.sendAdminMessage('Server', 'staff', lang(target.lang, 'TargetMessage', { admin: player.info.username, model: modelFound }), 'system');
		}

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setskin',
			messageId: 'Announcement',
			permission: 'cmds.setskin',
			args: () => ({ admin: player.info.username, model: modelFound, target: target.info.username })
		});

		player.createAmplitudeEvent('Changed skin', { target: target.info.username, model: modelFound });
		target.createAmplitudeEvent('Skin changed', { actioner: player.info.username, model: modelFound });
	}
});

mp.commands.addCommand({
	name: 'whitelistadd',
	aliases: [`wladd`],
	permission: 'cmds.whitelistadd',
	defineLangs: {
		Announcement: {
			EN: ({ admin, username }) => `${admin} added ${username} on whitelist.`,
			RO: ({ admin, username }) => `${admin} l-a adaugat pe ${username} în whitelist.`
		},
		AlreadyUser: {
			EN: `Username or rockstarId already exist.`,
			RO: `Username-ul sau rockstarId sunt deja existente.`
		}
	},
	args: {
		rockstarId: 'string',
		username: 'string'
	},
	handler: async (player, { rockstarId, username }, lang) => {
		try {
			const rawData = { rockstarId, username };
			await Whitelist.addWhitelist(rawData);

			mp.chat.sendStaffMessageToAll({
				systemId: 'cmdLangs:whitelistadd',
				messageId: 'Announcement',
				permission: 'cmds.whitelistadd',
				args: () => ({ admin: player.info.username, username })
			});

			player.createAmplitudeEvent(`Added in whitelist`, { rockstarId, username });
		} catch (err: ExpectedAny) {
			if (err && err.parent && err.parent.code && err.parent.code === 'ER_DUP_ENTRY') {
				return player.sendErrorMessage('Server', 'system', lang(player.lang, 'AlreadyUser'), 'system');
			}

			await logError(`WHITELIST_ADD`, err);
		}
	}
});

mp.commands.addCommand({
	name: 'whitelistremove',
	permission: 'cmds.whitelistremove',
	aliases: [`wlremove`],
	defineLangs: {
		Announcement: {
			EN: ({ admin, username }) => `${admin} removed ${username} from whitelist.`,
			RO: ({ admin, username }) => `${admin} a scos ${username} din whitelsit.`
		},
		InvalidUsername: {
			EN: ({ username }) => `Username "${username}" dosen't exist in database`,
			RO: ({ username }) => `Username "${username}" nu există in baza de date.`
		}
	},
	args: {
		username: 'string'
	},
	handler: async (player, { username }, lang) => {
		try {
			const remove = await Whitelist.removeWhitelist({ username });
			if (remove === 0) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidUsername', { username }), 'system');

			mp.chat.sendStaffMessageToAll({
				systemId: 'cmdLangs:whitelistremove',
				messageId: 'Announcement',
				permission: 'cmds.whitelistremove',
				args: () => ({ admin: player.info.username, username })
			});

			player.createAmplitudeEvent(`Removed from whitelist`, { username });
		} catch (err: ExpectedAny) {
			await logError(`WHITELIST_REMOVE`, err);
		}
	}
});

mp.commands.addCommand({
	name: 'warp',
	permission: 'cmds.warp',
	defineLangs: {
		Announcement: {
			EN: ({ admin, name }) => `${admin} teleported to ${name} warp.`,
			RO: ({ admin, name }) => `${admin} s-a teleportat la warp ${name}.`
		},
		SyntaxExampleMessage: {
			EN: () => `SYNTAX: Warps: ${Object.keys(warps).join(', ')}`,
			RO: () => `SYNTAX: Warps: ${Object.keys(warps).join(', ')}`
		},
		ErrorMessage: {
			EN: ({ name }) => `Warp ${name} dosen't exist.`,
			RO: ({ name }) => `Warp-ul ${name} nu există.`
		}
	},
	args: {
		name: 'string'
	},
	handler: (player, { name }, lang) => {
		if (!warps[name]) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'ErrorMessage', { name }), 'system');

		if (player.vars.isInGhostmode) {
			player.triggerClientEvent('setGhostCameraPos', { x: warps[name].x, y: warps[name].y, z: warps[name].z });
		}

		player.resetInteriorVarsOnTeleport();

		if (player.vehicle) {
			player.vehicle.setPositionPatched(new mp.Vector3(warps[name]));
			player.vehicle.setDimension(0);
		} else {
			player.position = new mp.Vector3(warps[name]);
			player.dimension = 0;
		}

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:warp',
			messageId: 'Announcement',
			permission: 'cmds.warp',
			args: () => ({ admin: player.info.username, name })
		});

		player.updateVars({
			houseEntered: null,
			garageEntered: null
		});

		player.createAmplitudeEvent(`Teleported to warp`, { name });
	}
});

mp.commands.addCommand({
	name: 'warps',
	permission: 'cmds.warp',
	defineLangs: {
		WarpLocations: {
			EN: `All existing warps: \n ${Object.keys(warps).join(', ')}`,
			RO: `Zone de teleportare: \n ${Object.keys(warps).join(', ')}`
		}
	},
	handler: (player, _, lang) => {
		player.sendAdminMessage('Server', 'staff', lang(player.lang, 'WarpLocations'), 'system');
	}
});

mp.commands.addCommand({
	name: 'gotolastpos',
	aliases: ['gltp', 'glp'],
	permission: 'cmds.gotolastpos',
	defineLangs: {
		NoPosition: {
			EN: 'You do not have a saved position.',
			RO: 'Nu ai o pozitie salvata.'
		},
		Teleported: {
			EN: 'You were teleported to the last position.',
			RO: 'Ai fost teleportat la ultima pozitie.'
		}
	},
	handler: (player, _, lang) => {
		if (!player.vars.lastRecoverablePosition) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoPosition'), 'system');
		if (player.vars.spectating) return;

		player.resetInteriorVarsOnTeleport();

		if (player.vehicle) {
			player.vehicle.setPositionPatched(player.vars.lastRecoverablePosition);

			player.triggerClientEvent(`putVehicleOnGround`, {
				vehicleId: player.vehicle.id
			});
		} else {
			player.position = player.vars.lastRecoverablePosition;
		}

		player.sendServerMessage('Server', 'staff', lang(player.lang, 'Teleported'), 'system');

		player.createAmplitudeEvent('Sended to last position', { actioner: player.info.username });
	}
});

mp.commands.addCommand({
	name: 'sendback',
	permission: 'cmds.sendback',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target }) => `${admin} has sent ${target} to his last position.`,
			RO: ({ admin, target }) => `${admin} l-a trimis pe ${target} la ultima sa poziție.`
		},
		NoPosition: {
			EN: 'That player does not have a saved position.',
			RO: 'Acel player nu are o pozitie salvata.'
		},
		Target: {
			EN: ({ admin }) => `${admin} has sent you back to your last position.`,
			RO: ({ admin }) => `${admin} te-a trimis la ultima ta pozitie din joc.`
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }, lang) => {
		if (target.vars.spectating) return;

		if (!target.vars.lastRecoverablePosition) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoPosition'), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:sendback',
			messageId: 'Announcement',
			permission: 'cmds.sendback',
			args: () => ({ admin: player.info.username, target: target.info.username })
		});

		target.resetInteriorVarsOnTeleport();

		if (target.vehicle) {
			target.vehicle.setPositionPatched(target.vars.lastRecoverablePosition);

			target.triggerClientEvent(`putVehicleOnGround`, {
				vehicleId: target.vehicle.id
			});
		} else {
			target.position = player.vars.lastRecoverablePosition;
		}

		target.sendAdminMessage('Server', 'staff', lang(target.lang, 'Target', { admin: player.info.username }), 'system');

		player.createAmplitudeEvent('Send to last position', { target: target.info.username });
		target.createAmplitudeEvent('Sended to last position', { actioner: player.info.username });
	}
});

mp.commands.addCommand({
	name: `savedata`,
	aliases: ['saveall'],
	permission: 'cmds.savedata',
	defineLangs: {
		Announcement: {
			EN: ({ admin }) => `${admin} saved the server data.`,
			RO: ({ admin }) => `${admin} a salvat datele serverului.`
		}
	},
	handler: (player) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:savedata',
			messageId: 'Announcement',
			permission: 'cmds.savedata',
			args: () => ({ admin: player.info.username })
		});

		// Save it to all players..
		mp.players.forEachLoggedIn((entry: PlayerMp) => mp.events.call('onPlayerSaveData', entry, false));

		mp.events.call('hourlyDataBackup');
	}
});

mp.commands.addCommand({
	name: 'setvehfuel',
	permission: 'cmds.setvehfuel',
	args: {
		level: 'number'
	},
	defineLangs: {
		Announcement: {
			EN: ({ admin, level }) => `${admin} set the car's fuel level to ${level}%.`,
			RO: ({ admin, level }) => `${admin} a setat nivelul de combustibil al mașinii la ${level}%.`
		},
		NotInVechile: {
			EN: 'You can only do this in a vehicle.',
			RO: 'Poți face asta doar într-un vehicul.'
		}
	},
	handler: (player, { level }, lang) => {
		if (!player.vehicle) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NotInVechile'), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setvehfuel',
			messageId: 'Announcement',
			permission: 'cmds.setvehfuel',
			args: () => ({ admin: player.info.username, level })
		});

		player.vehicle.setFuel(level);

		return true;
	}
});

mp.commands.addCommand({
	name: `q`,
	aliases: ['quit'],
	handler: (player) => {
		player.triggerClientEvent(`pause:quit`);
	}
});
