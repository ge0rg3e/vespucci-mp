import { getItemName } from '@server/natives/items/components/utils';

mp.commands.addCommand({
	name: 'giveitem',
	permission: 'cmds.giveitem',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, itemId, quantity }) => `${admin} gave an item ${getItemName(itemId, 'EN')} (x${quantity}) to ${target}.`,
			RO: ({ admin, target, itemId, quantity }) => `${admin} i-a dat item-ul ${getItemName(itemId, 'RO')} (x${quantity}) lui ${target}.`
		},
		InvalidItem: {
			EN: () => 'The item id is invalid.',
			RO: () => 'Acest item id este invalid.'
		},
		NoSpace: {
			EN: () => `The player has no space in his inventory.`,
			RO: () => `Jucătorul nu are spatiu in inventar.`
		}
	},
	args: {
		target: 'player',
		itemId: 'number',
		quantity: 'number'
	},
	handler: (player, { target, itemId, quantity }, lang) => {
		if (!mp.items.getItem(itemId)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidItem'), 'system');
		if (target.getNumberOfAvailableInventorySlots() < 1) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoSpace'), 'system');
		const item: ExpectedAny = mp.items.getItem(itemId);
		quantity = quantity > item.limit ? item.limit : quantity;

		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			itemId,
			quantity
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:giveitem',
			messageId: 'Announcement',
			permission: 'cmds.giveitem',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.giveitem') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		player.createAmplitudeEvent(`Gave item as Staff`, {
			target: target.info.username,
			itemId,
			quantity,
			action: 'giveItem'
		});

		target.createAmplitudeEvent(`Received item from Staff`, {
			actioner: player.info.username,
			itemId,
			quantity,
			action: 'giveItem'
		});

		target.giveItem(itemId, quantity, {}, null);
	}
});

mp.commands.addCommand({
	name: 'checkinventory',
	aliases: ['ci', 'checkinv'],
	permission: 'cmds.checkinventory',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target }) => `${admin} checks ${target}'s inventory.`,
			RO: ({ admin, target }) => `${admin} verifica inventarul lui ${target}`
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:checkinventory',
			permission: 'cmds.checkinventory',
			messageId: 'Announcement',
			args: () => ({
				admin: player.info.username,
				target: target.info.username
			})
		});

		// Starting the inventory ...
		player.updateVars({ remoteInventoryId: target.id });
		player.triggerClientEvent('setInventoryOpened', { boolean: true, remoteId: target.id });

		// Logging the action..
		target.createAmplitudeEvent('Inventory checked', { actioner: player.info.username });
		player.createAmplitudeEvent('Checks inventory', { target: target.info.username });
	}
});

mp.commands.addCommand({
	name: 'clearitems',
	aliases: ['citems'],
	permission: 'cmds.clearitems',
	defineLangs: {
		Announcement: {
			EN: ({ admin, range, amount }) => `${admin} deleted ${amount} items dropped on the ground${range !== 999 ? ` in range ${range}` : ``}.`,
			RO: ({ admin, range, amount }) => `${admin} a sters ${amount} itemele de pe jos${range !== 999 ? ` in range ${range}` : ``}.`
		},
		RangeError: {
			EN: `The range is not a valid number.`,
			RO: `Range-ul nu este un numar valid.`
		}
	},
	args: {
		range: 'number'
	},
	handler: (player, { range }, lang) => {
		if (range !== 999 && !(range >= 0 && range <= 100)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'RangeError'), 'system');

		const totalItems = mp.items.deleteNearbyDrops(player.position, range);

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:clearitems',
			permission: 'cmds.clearitems',
			messageId: 'Announcement',
			args: () => ({
				admin: player.info.username,
				range,
				amount: totalItems.length
			})
		});

		player.createAmplitudeEvent(range === 999 ? 'Deleted all dropped items' : 'Deleted dropped items in range', { range, itemsDeleted: totalItems.length });
	}
});
