import { MAX_ECONOMY_VALUE } from '@server/general/paycheck';
import { formatNumber } from '@server/utils/helpers';
import { HouseInterior, houseInteriors } from '@server/definitions/houseInteriors';
import { deleteGarage, Garages } from '@server/legacy/garages/components/core';
import { createHouse, deleteHouse, Houses, updateHouse } from './core';
const spawnTypes = ['normal', 'house', 'faction'];

mp.commands.addCommand({
	name: 'houseinteriors',
	permission: 'cmds.hinteriors',
	aliases: ['hinteriors', 'hints'],
	args: {
		size: 'number'
	},
	defineLangs: {
		Message: {
			EN: ({ interiors }) =>
				`House interiors: {BR} - ${interiors
					.map(
						(int: HouseInterior, ix: number) =>
							`{b9b9b9}(${int.id}){FFFFFF} ${int.name}${[2, 5, 8, 11, 14, 17, 20].includes(ix) ? `{BR}-  ` : ix === houseInteriors.length - 1 ? '' : ', '}`
					)
					.join('')}`,
			RO: ({ interiors }) =>
				`Interioare de case: {BR} - ${interiors
					.map(
						(int: HouseInterior, ix: number) =>
							`{b9b9b9}(${int.id}){FFFFFF} ${int.name}${[2, 5, 8, 11, 14, 17, 20].includes(ix) ? `{BR}-  ` : ix === houseInteriors.length - 1 ? '' : ', '}`
					)
					.join('')}`
		},
		InvalidSize: {
			EN: () => `House size can be (1) Small, (2) Medium or (3) Large`,
			RO: () => `Marimea unei case poate fi (1) Mica, (2) Medie sau (3) Mare`
		}
	},
	handler: (player, { size }, lang) => {
		if (size < 1 || size > 3) return player.sendErrorMessage('Server', 'system', `InvalidSize`, 'system');
		player.sendServerMessage('Server', 'staff', lang(player.lang, 'Message', { interiors: houseInteriors.filter((h: HouseInterior) => h.size === size) }), 'system');
	}
});

mp.commands.addCommand({
	name: 'houseid',
	aliases: ['hid', 'gotohouse'],
	permission: `cmds.houseid`,
	defineLangs: {
		InvalidId: {
			EN: `Invalid house id.`,
			RO: `Id-ul casei este invalid.`
		},
		TeleportedTo: {
			EN: ({ id }) => `Teleported to the entrance of house id ${id} `,
			RO: ({ id }) => `Ai fost teleportat la intrarea casei cu id-ul ${id} `
		}
	},
	args: {
		id: 'number'
	},
	handler: async (player, { id }, lang) => {
		const House = Houses.find((h) => h.id === id);
		if (!House) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidId'), 'system');
		player.sendAdminMessage('Server', 'system', lang(player.lang, 'TeleportedTo', { id: id }), 'system');
		player.resetInteriorVarsOnTeleport();
		player.dimension = 0;
		player.position = House.coords;
	}
});

mp.commands.addCommand({
	name: 'createhouse',
	aliases: ['chouse'],
	permission: `cmds.createhouse`,
	defineLangs: {
		InteriorError: {
			EN: `Invalid house interior.`,
			RO: `Id-ul interiorului este invalid.`
		},
		InvalidMoney: {
			EN: `The house's price must be a number between $1 and $999.999.999`,
			RO: `Pretul unei case trebuie să fie un număr între $1 și $999.999.999.`
		},
		Announcement: {
			EN: ({ admin, interior, size, level, price, id }) => {
				const sizeText = size === 1 ? 'small' : size === 2 ? 'medium' : 'large';
				return `${admin} created a new house with id ${id}, size ${sizeText}, interior: ${interior}, level ${level} for ${formatNumber(price, true)}.`;
			},
			RO: ({ admin, interior, size, level, price, id }) => {
				const sizeText = size === 1 ? 'mica' : size === 2 ? 'medie' : 'mare';
				return `${admin} a creat a casă nouă cu id ${id}, marime ${sizeText}, interior: ${interior}, level ${level} pentru ${formatNumber(price, true)}.`;
			}
		},
		InvalidSize: {
			EN: () => `House size can be (1) Small, (2) Medium or (3) Large`,
			RO: () => `Marimea unei case poate fi (1) Mica, (2) Medie sau (3) Mare`
		}
	},
	args: {
		size: 'number',
		interior: 'number',
		level: 'number',
		price: 'number'
	},
	handler: async (player, { interior, size, level, price }, lang) => {
		if (size < 1 || size > 3) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidSize'), 'system');
		const hInterior = houseInteriors.find((int) => int.id === interior && int.size === size);
		if (!hInterior) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InteriorError'), 'system');
		if (price > MAX_ECONOMY_VALUE) return player.sendErrorMessage('System', 'system', lang(player.lang, 'InvalidMoney'), 'system');

		const location: CoordsStreetName = await player.invokeClientEvent(`getCoordsStreetAndZoneName`, { position: player.position })!;
		const h = await createHouse(level, price, interior, player.position, location.street);

		if (!h) return false; // Safety check

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:createhouse',
			permission: 'cmds.createhouse',
			messageId: 'Announcement',
			args: () => ({
				admin: player.info.username,
				interior: hInterior.name,
				level,
				size,
				price,
				id: h.id
			})
		});

		player.createAmplitudeEvent(`Created house`, {
			level,
			size,
			price,
			idCreated: h.id,
			interior: hInterior.name,
			coords: player.position
		});
	}
});

mp.commands.addCommand({
	name: 'deletehouse',
	aliases: ['dhouse'],
	permission: 'cmds.deletehouse',
	defineLangs: {
		HouseInvalid: {
			EN: `The house id is not valid.`,
			RO: `Acest id de casă nu este valid.`
		},
		Announcement: {
			EN: ({ admin, houseId, reason }) => `${admin} deleted a house with id ${houseId} for ${reason}.`,
			RO: ({ admin, houseId, reason }) => `${admin} a sters casa cu id ${houseId} pe motiv ${reason}.`
		}
	},
	args: {
		houseId: 'number',
		reason: 'fullText'
	},
	handler: async (player, { houseId, reason }, lang) => {
		if (!Houses.find((h) => h.id === houseId)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'HouseInvalid'), 'system');

		// Deleting the house..
		deleteHouse(houseId);

		// Deleting the garages owned by that house.
		Garages.filter((g: Garage) => g.ownerId === houseId && g.type === 1).forEach((g: Garage) => deleteGarage(g.id));

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:deletehouse',
			messageId: 'Announcement',
			permission: 'cmds.deletehouse',
			args: () => ({
				admin: player.info.username,
				houseId,
				reason
			})
		});
		player.createAmplitudeEvent(`Deleted house`, {
			houseId,
			reason
		});
	}
});

mp.commands.addCommand({
	name: 'sleep',
	defineLangs: {
		NoHouseEntered: {
			EN: `You are not in house.`,
			RO: `Nu esti intr-o casa.`
		}
	},
	handler: (player, _, lang) => {
		if (!player.vars.houseEntered) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoHouseEntered'), 'system');
		player.vars.sleeping ? player.stopAnimation() : player.playAnimation('timetable@tracy@sleep@', 'idle_c', 1, 1);
		player.updateVars({
			sleeping: player.vars.sleeping ? false : true
		});
	}
});

mp.commands.addCommand({
	name: 'spawnchange',
	aliases: ['changespawn'],
	defineLangs: {
		NoHouse: {
			EN: `You don't have a house.`,
			RO: `Nu ai o casa.`
		},
		NoFaction: {
			EN: `You are not in a faction.`,
			RO: `Nu esti intr-o factiune.`
		},
		Message: {
			EN: ({ spawn }) => `Your new spawn is: ${spawn}`,
			RO: ({ spawn }) => `Noul tau spawn este: ${spawn}`
		},
		SyntaxExampleMessage: {
			EN: `Spawns available: ${spawnTypes.join(', ')}`,
			RO: `Spawn-uri disponibile: ${spawnTypes.join(', ')}`
		}
	},
	args: {
		type: 'string'
	},
	handler: (player, { type }, lang) => {
		if (!spawnTypes.includes(type)) return false;
		if (type === 'house' && !(player.info.house || player.info.houseRent)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoHouse'), 'system');
		if (type === 'faction') return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoFaction'), 'system'); // - Cand vom avea sistemul de factiuni va trebuii sa schimbam aici.
		player.sendServerMessage('Server', 'system', lang(player.lang, 'Message', { spawn: type }), 'system');
		player.info.spawnMethod = type;
		player.saveInfo({
			spawnMethod: type
		});
	}
});

const validHEditValues = ['price', 'level', 'renting', 'owner', 'owned', 'entrance', 'size', 'interiorId'];

mp.commands.addCommand({
	name: 'hedit',
	aliases: 'edithouse',
	permission: `cmds.hedit`,
	args: {
		houseId: 'number',
		valueName: 'string',
		value: 'string'
	},
	argsRequired: {
		// eslint-disable-next-line
		value: ([_, valueName]) => (valueName === 'entrance' ? false : true)
	},
	defineLangs: {
		Announcement: {
			EN: ({ admin, houseId, valueName }) => `${admin} changed house ${houseId}'s ${valueName}.`,
			RO: ({ admin, houseId, valueName }) => `${admin} a modificat ${valueName} la casa ${houseId}.`
		},
		SyntaxExampleMessage: {
			EN: `Values: ${validHEditValues.join(', ')}`,
			RO: `Valori: ${validHEditValues.join(', ')}`
		},
		HouseInvalid: {
			EN: `The house id is not valid.`,
			RO: `Acest id de casă nu este valid.`
		}
	},
	handler: async (player, { houseId, valueName, value }, lang) => {
		if (!validHEditValues.includes(valueName)) return player.sendErrorMessage('Server', 'system', lang(player.lang, `SyntaxExampleMessage`), 'system');

		if (!Houses.find((h) => h.id === houseId)) return player.sendErrorMessage(`Server`, `system`, lang(player.lang, `HouseInvalid`), `system`);

		let updateData = {};

		if (valueName === 'price') {
			if (isNaN(value)) return false;
			updateData = {
				price: Number(value)
			};
		}

		if (valueName === 'level') {
			if (isNaN(value)) return false;
			updateData = {
				level: Number(value)
			};
		}

		if (valueName === 'size') {
			if (isNaN(value)) return false;

			const val = Number(value);
			if (val < 1 || val > 3) return false;

			updateData = {
				size: Number(value)
			};
		}

		if (valueName === 'renting') {
			if (!['true', 'false'].includes(value)) return false;
			updateData = {
				isRenting: Boolean(value)
			};
		}

		if (valueName === 'owned') {
			if (!['true', 'false'].includes(value)) return false;
			updateData = {
				owned: Boolean(value)
			};
		}

		if (valueName === 'owner') {
			updateData = {
				ownerName: String(value)
			};
		}

		if (valueName === 'entrance') {
			// Update position..
			updateData = {
				coords: player.position
			};
		}

		if (valueName === 'interiorId') {
			updateData = {
				interiorId: parseInt(value)
			};
		}

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:hedit',
			messageId: 'Announcement',
			permission: 'cmds.hedit',
			args: () => ({
				admin: player.info.username,
				houseId,
				valueName
			})
		});

		player.createAmplitudeEvent(`Edited house`, {
			houseId,
			valueName,
			value: valueName === 'entrance' ? 'N/A' : value
		});

		// Update the house now..
		updateHouse(houseId, updateData, true);
	}
});
