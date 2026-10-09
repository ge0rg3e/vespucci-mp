import { createDealership, Dealerships, deleteDealership, updateDealership } from './core';

mp.commands.addCommand({
	name: 'createdealership',
	aliases: ['createds'],
	permission: `cmds.createdealership`,
	defineLangs: {
		Announcement: {
			EN: ({ admin, id, name, blipType }) => `${admin} created a new dealership with id ${id}, name ${name}, blip id ${blipType}.`,
			RO: ({ admin, id, name, blipType }) => `${admin} a creat un nou dealership cu id ${id}, nume ${name}, blip id: ${blipType}.`
		},
		InvalidBlip: {
			EN: () => `Blip types: (1) Vehicles, (2) Motorcycle & Cycles, (3) Helicopters, (4) Boats`,
			RO: () => `Blip types: (1) Vehicule, (2) Motociclete & Biciclete, (3) Elicoptere, (4) Bărci`
		}
	},
	args: {
		blipType: 'number',
		name: 'fullText'
	},
	handler: async (player, { name, blipType }, lang) => {
		if (blipType < 1 || blipType > 4) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidBlip'), 'system');

		const d = await createDealership(name, blipType, player.position);

		if (!d) return false; // Safety check

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:createdealership',
			permission: 'cmds.createdealership',
			messageId: 'Announcement',
			args: () => ({
				admin: player.info.username,
				name,
				blipType,
				id: d.id
			})
		});

		player.createAmplitudeEvent(`Created dealership`, {
			name,
			blipType,
			idCreated: d.id,
			coords: player.position
		});
	}
});

mp.commands.addCommand({
	name: 'deletedealership',
	aliases: ['deleteds'],
	permission: 'cmds.deletedealership',
	defineLangs: {
		DealershipInvalid: {
			EN: `The dealership id is not valid.`,
			RO: `Acest id de dealership nu este valid.`
		},
		Announcement: {
			EN: ({ admin, dealershipId, reason }) => `${admin} deleted a dealership with id ${dealershipId} for ${reason}.`,
			RO: ({ admin, dealershipId, reason }) => `${admin} a sters dealership cu id ${dealershipId} pe motiv ${reason}.`
		}
	},
	args: {
		dealershipId: 'number',
		reason: 'fullText'
	},
	handler: async (player, { dealershipId, reason }, lang) => {
		if (!Dealerships.find((d) => d.id === dealershipId)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'DealershipInvalid'), 'system');

		deleteDealership(dealershipId);

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:deletedealership',
			messageId: 'Announcement',
			permission: 'cmds.deletedealership',
			args: () => ({
				admin: player.info.username,
				dealershipId,
				reason
			})
		});
		player.createAmplitudeEvent(`Deleted dealership`, {
			idDeleted: dealershipId,
			reason
		});
	}
});

mp.commands.addCommand({
	name: 'gotodealership',
	aliases: ['dsid', 'ds'],
	permission: `cmds.gotodealership`,
	defineLangs: {
		InvalidId: {
			EN: `Invalid dealership id.`,
			RO: `Id-ul la dealership este invalid.`
		},
		TeleportedTo: {
			EN: ({ id }) => `Teleported to the dealership id ${id} `,
			RO: ({ id }) => `Ai fost teleportat la dealership-ul cu id ${id} `
		}
	},
	args: {
		id: 'number'
	},
	handler: async (player, { id }, lang) => {
		const Dealership = Dealerships.find((h) => h.id === id);
		if (!Dealership) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidId'), 'system');
		player.sendAdminMessage('Server', 'staff', lang(player.lang, 'TeleportedTo', { id: id }), 'system');
		player.resetInteriorVarsOnTeleport();
		player.position = Dealership.coords;
		player.dimension = 0;
	}
});

mp.commands.addCommand({
	name: 'reloaddsstock',
	aliases: ['rdsstock', 'reloaddealership'],
	permission: `cmds.reloaddsstock`,
	defineLangs: {
		Announcement: {
			EN: ({ admin }) => `${admin} reloaded dealerships stock data.`,
			RO: ({ admin }) => `${admin} a dat reload la dealerships stock data.`
		}
	},

	handler: async (player) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:reloaddsstock',
			messageId: 'Announcement',
			permission: 'cmds.reloaddsstock',
			args: () => ({
				admin: player.info.username
			})
		});
		player.createAmplitudeEvent(`Reloaded dealerships stock data`, {});

		mp.events.call('reloadDealershipsStockData');
	}
});

const validDEditValues = ['disabled', 'coords', 'name', 'blipType'];

mp.commands.addCommand({
	name: 'dsedit',
	aliases: 'editdealership',
	permission: `cmds.updatedealership`,
	args: {
		id: 'number',
		valueName: 'string',
		value: 'string'
	},
	argsRequired: {
		// eslint-disable-next-line
		value: ([_, valueName]) => (valueName === 'coords' ? false : true)
	},
	defineLangs: {
		Announcement: {
			EN: ({ admin, dealershipId, valueName }) => `${admin} changed house ${dealershipId}'s ${valueName}.`,
			RO: ({ admin, dealershipId, valueName }) => `${admin} a modificat ${valueName} la casa ${dealershipId}.`
		},
		SyntaxExampleMessage: {
			EN: `Values: ${validDEditValues.join(', ')}`,
			RO: `Valori: ${validDEditValues.join(', ')}`
		},
		DealershipInvalidId: {
			EN: `The dealership id is not valid.`,
			RO: `Acest id de dealership nu este valid.`
		}
	},
	handler: (player, { id, valueName, value }, lang) => {
		if (!validDEditValues.includes(valueName)) return player.sendErrorMessage('Server', 'system', lang(player.lang, `SyntaxExampleMessage`), 'system');
		if (!Dealerships.find((d) => d.id === id)) return player.sendErrorMessage('Server', 'system', lang(player.lang, `DealershipInvalidId`), 'system');

		let updateData = {};

		if (valueName === 'disabled') {
			if (!['true', 'false'].includes(value)) return false;
			updateData = {
				isDisabled: value === 'true' ? true : false
			};
		}

		if (valueName === 'name') {
			updateData = {
				name: value
			};
		}

		if (valueName === 'coords') {
			updateData = {
				coords: player.position
			};
		}

		if (valueName === 'blipType') {
			if (![1, 2, 3, 4].includes(parseInt(value))) return false;
			updateData = {
				blipType: parseInt(value)
			};
		}

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:dedit',
			messageId: 'Announcement',
			permission: 'cmds.dsedit',
			args: () => ({
				admin: player.info.username,
				dealershipId: id,
				valueName
			})
		});

		player.createAmplitudeEvent(`Edited dealership`, {
			dealershipId: id,
			valueName,
			value: valueName === 'coords' ? player.position : value
		});

		updateDealership(id, updateData, true);
	}
});
