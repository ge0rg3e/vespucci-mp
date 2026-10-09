import { MAX_ECONOMY_VALUE } from '@server/general/paycheck';
import { formatNumber, isInRange } from '@server/utils/helpers';
import { businessTypes } from '@server/definitions/businessTypes';
import { Businesses, createBusiness, deleteBusiness, reloadBusinessData, updateBusiness } from './core';

mp.commands.addCommand({
	name: 'btypes',
	permission: 'cmds.businesstype',
	aliases: ['businesstypes', 'bizztypes'],
	defineLangs: {
		Message: {
			EN: `Business Types: {BR} - ${businessTypes
				.map((type, ix) => `{b9b9b9}(${type.id}){FFFFFF} ${type.name}${[2, 5, 8, 11, 14].includes(ix) ? `{BR}-  ` : ix === businessTypes.length - 1 ? '' : ', '}`)
				.join('')}`,
			RO: `Tipuri de business: {BR} - ${businessTypes
				.map((type, ix) => `{b9b9b9}(${type.id}){FFFFFF} ${type.name}${[2, 5, 8, 11, 14].includes(ix) ? `{BR}-  ` : ix === businessTypes.length - 1 ? '' : ', '}`)
				.join('')}`
		}
	},
	handler: (player, _, lang) => player.sendServerMessage('Server', 'staff', lang(player.lang, 'Message'), 'system')
});

mp.commands.addCommand({
	name: 'createbusiness',
	aliases: ['cbusiness', 'cbizz', 'createbizz'],
	permission: `cmds.createbusiness`,
	defineLangs: {
		TypeError: {
			EN: `Invalid business type.`,
			RO: `Id-ul interiorului este invalid.`
		},
		InvalidMoney: {
			EN: `The business's price must be a number between $1 and $999.999.999`,
			RO: `Pretul uni business trebuie să fie un număr între $1 și $999.999.999.`
		},
		Announcement: {
			EN: ({ admin, type, level, price, id }) => `${admin} created a new business with id ${id}, Type: ${type}, level ${level} for ${formatNumber(price, true)}.`,
			RO: ({ admin, type, level, price, id }) => `${admin} a creat un nou business cu id ${id}, Type: ${type}, level ${level} pentru ${formatNumber(price, true)}.`
		}
	},
	args: {
		type: 'number',
		level: 'number',
		price: 'number'
	},
	handler: async (player, { type, level, price }, lang) => {
		const bType = businessTypes.find((bType) => bType.id === type);
		if (!bType) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'TypeError'), 'system');
		if (price > MAX_ECONOMY_VALUE) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidMoney'), 'system');
		const b = await createBusiness(type, level, price, {
			buyPoint: player.position,
			callToActions: []
		});

		if (!b) return false;

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:createbusiness',
			permission: 'cmds.createbusiness',
			messageId: 'Announcement',
			args: () => ({
				admin: player.info.username,
				type: bType.name,
				level,
				price,
				id: b.id
			})
		});

		player.createAmplitudeEvent(`Created business`, {
			type: bType.name,
			level,
			price,
			id: b.id
		});
	}
});

mp.commands.addCommand({
	name: 'deletebusiness',
	aliases: ['dbusiness', 'dbizz'],
	permission: 'cmds.deletebusiness',
	defineLangs: {
		BusinessInvalid: {
			EN: `The business id is not valid.`,
			RO: `Acest id de business nu este valid.`
		},
		Announcement: {
			EN: ({ admin, businessId, reason }) => `${admin} deleted a business with id ${businessId} for ${reason}.`,
			RO: ({ admin, businessId, reason }) => `${admin} a sters un business cu id ${businessId} pe motiv ${reason}.`
		}
	},
	args: {
		businessId: 'number',
		reason: 'fullText'
	},
	handler: async (player, { businessId, reason }, lang) => {
		if (!Businesses.find((b) => b.id === businessId)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'BusinessInvalid'), 'system');
		deleteBusiness(businessId);
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:deletebusiness',
			messageId: 'Announcement',
			permission: 'cmds.deletebusiness',
			args: () => ({
				admin: player.info.username,
				businessId,
				reason
			})
		});
		player.createAmplitudeEvent(`Deleted business`, {
			businessId,
			reason
		});
	}
});

mp.commands.addCommand({
	name: 'reloadbusiness',
	aliases: ['breload', 'bizzreload', `reloadbizz`],
	permission: 'cmds.reloadbusiness',
	defineLangs: {
		BusinessInvalid: {
			EN: `The business id is not valid.`,
			RO: `Acest id de business nu este valid.`
		},
		Announcement: {
			EN: ({ admin, businessId, reason }) => `${admin} reloaded data of business with id ${businessId} for ${reason}.`,
			RO: ({ admin, businessId, reason }) => `${admin} a dat reload la datele de la business cu id ${businessId} pe motiv ${reason}.`
		}
	},
	args: {
		businessId: 'number',
		reason: 'fullText'
	},
	handler: async (player, { businessId, reason }, lang) => {
		if (!Businesses.find((b) => b.id === businessId)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'BusinessInvalid'), 'system');
		reloadBusinessData(businessId);
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:reloadbusiness',
			messageId: 'Announcement',
			permission: 'cmds.reloadbusiness',
			args: () => ({
				admin: player.info.username,
				businessId,
				reason
			})
		});
		player.createAmplitudeEvent(`Reloaded business data`, {
			businessId,
			reason
		});
	}
});

mp.commands.addCommand({
	name: 'gotobusiness',
	aliases: ['abizz', 'bizz', 'bizzid'],
	permission: `cmds.abusiness`,
	defineLangs: {
		InvalidId: {
			EN: `Invalid Business id.`,
			RO: `Id-ul business-ului este invalid.`
		},
		TeleportedTo: {
			EN: ({ id }) => `Teleported to the entrance of business id ${id} `,
			RO: ({ id }) => `Ai fost teleportat la intrarea business-ului cu id-ul ${id} `
		}
	},
	args: {
		id: 'number'
	},
	handler: async (player, { id }, lang) => {
		const Business = Businesses.find((h) => h.id === id);
		if (!Business) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidId'), 'system');
		player.sendAdminMessage('Server', 'staff', lang(player.lang, 'TeleportedTo', { id: id }), 'system');
		player.resetInteriorVarsOnTeleport();
		player.dimension = 0;
		player.position = Business.locations.buyPoint;
	}
});

mp.commands.addCommand({
	name: 'buybusiness',
	aliases: ['buybizz'],
	defineLangs: {
		NoBusinessNearby: {
			EN: `You're not near a business that can be buyed.`,
			RO: `Nu ești lângă nici un business ce poate fi cumpărată.`
		},
		NotEnoughMoney: {
			EN: ({ amount }) => `You don't have ${formatNumber(amount, true)} to buy this business.`,
			RO: ({ amount }) => `Nu ai ${formatNumber(amount, true)} pentru a cumpăra aceast business.`
		},
		NotEnoughLevel: {
			EN: () => `Your level is too low to buy this business.`,
			RO: () => `Nivelul tau este prea scazut pentru a cumpăra aceast business.`
		},
		AlreadyOwnHouse: {
			EN: () => `You already own a business.`,
			RO: () => `Deja deții un business.`
		},
		BusinessNotForSale: {
			EN: () => `This business is not for sale.`,
			RO: () => `Aceast business nu este de vânzare.`
		},
		BusinessBought: {
			EN: ({ amount }) => `You bought this business successfully for ${formatNumber(amount, true)}.`,
			RO: ({ amount }) => `Ai cumpărat aceast business cu success pentru ${formatNumber(amount, true)}.`
		}
	},
	handler: async (player, _, lang) => {
		const closeBusiness = Businesses.find((b) => isInRange(player.position, new mp.Vector3(b.locations.buyPoint), 4));
		if (!closeBusiness) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoBusinessNearby'), 'system');
		if (player.info.money < closeBusiness.price) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NotEnoughMoney', { amount: closeBusiness.price }), 'system');
		if (player.info.level < closeBusiness.level) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NotEnoughLevel'), 'system');
		if (player.info.business !== 0) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'AlreadyOwnBusiness'), 'system');
		if (closeBusiness.owned === true) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'BusinessNotForSale'), 'system');
		player.takeMoney(closeBusiness.price);
		updateBusiness(
			closeBusiness.id,
			{
				owned: true,
				ownerName: player.info.username
			},
			true
		);
		player.saveInfo({
			business: closeBusiness.id
		});
		player.createAmplitudeEvent(`Bought business`, {
			businessId: closeBusiness.id
		});
		player.sendServerMessage('Server', 'system', lang(player.lang, 'BusinessBought', { amount: closeBusiness.price }), 'system');
	}
});

mp.commands.addCommand({
	name: 'sellbusiness',
	aliases: ['sellbizz'],
	defineLangs: {
		DontOwnBusiness: {
			EN: () => `You don't own a business.`,
			RO: () => `Nu deții un business.`
		},
		BusinessSold: {
			EN: ({ amount }) => `You sold your business successfully for ${formatNumber(amount, true)}.`,
			RO: ({ amount }) => `Ti-ai vândut business-ul cu success pentru ${formatNumber(amount, true)}.`
		}
	},
	handler: async (player, _, lang) => {
		const closeBusiness = Businesses.find((b) => b.id === player.info.business);
		if (!closeBusiness) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'DontOwnBusiness'), 'system');
		const price = closeBusiness.price / 2;
		player.giveMoney(price);
		updateBusiness(
			closeBusiness.id,
			{
				owned: false,
				ownerName: `The State`
			},
			true
		);
		player.saveInfo({
			business: 0
		});
		player.createAmplitudeEvent(`Sold his business`, {
			previousBusiness: closeBusiness.id
		});
		player.sendServerMessage('Server', 'system', lang(player.lang, 'BusinessSold', { amount: price }), 'system');
	}
});

const validBEditValues = ['price', 'level', 'owner', 'owned', 'buyPoint'];

mp.commands.addCommand({
	name: 'editbizz',
	aliases: 'editbusiness',
	permission: `cmds.bedit`,
	args: {
		businessId: 'number',
		valueName: 'string',
		value: 'string'
	},
	argsRequired: {
		// eslint-disable-next-line
		value: ([_, valueName]) => (valueName === 'buyPoint' ? false : true)
	},
	defineLangs: {
		Announcement: {
			EN: ({ admin, businessId }) => `${admin} changed business ${businessId}.`,
			RO: ({ admin, businessId }) => `${admin} a modificat business ${businessId}.`
		},

		SyntaxExampleMessage: {
			EN: `Values: ${validBEditValues.join(', ')}`,
			RO: `Valori: ${validBEditValues.join(', ')}`
		},

		BusinessInvalid: {
			EN: `The business id is not valid.`,
			RO: `Acest id de business nu este valid.`
		}
	},
	handler: (player, { businessId, valueName, value }, lang) => {
		if (!validBEditValues.includes(valueName)) return player.sendErrorMessage('Server', 'system', lang(player.lang, `SyntaxExampleMessage`), 'system');

		if (!Businesses.find((b) => b.id === businessId)) return player.sendErrorMessage('Server', 'system', lang(player.lang, `BusinessInvalid`), 'system');

		if (valueName === 'price') {
			if (isNaN(value)) return false;

			updateBusiness(
				businessId,
				{
					price: Number(value)
				},
				true
			);
		}

		if (valueName === 'level') {
			if (isNaN(value)) return false;

			updateBusiness(
				businessId,
				{
					level: Number(value)
				},
				true
			);
		}

		if (valueName === 'owned') {
			if (!['true', 'false'].includes(value)) return false;

			updateBusiness(
				businessId,
				{
					owned: Boolean(value)
				},
				true
			);
		}

		if (valueName === 'owner') {
			updateBusiness(
				businessId,
				{
					ownerName: String(value)
				},
				true
			);
		}

		if (valueName === 'buyPoint') {
			const bizzData = Businesses.find((b) => b.id === businessId);
			if (!bizzData) throw Error('Failed to find business.');

			bizzData.locations.buyPoint = player.position;

			updateBusiness(
				businessId,
				{
					locations: bizzData.locations
				},
				true
			);
		}

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:editbizz',
			messageId: 'Announcement',
			permission: 'cmds.bedit',
			args: () => ({
				admin: player.info.username,
				businessId
			})
		});

		player.createAmplitudeEvent(`Edited business`, {
			businessId,
			valueName,
			value: valueName === 'buyPoint' ? player.position : value
		});
	}
});
