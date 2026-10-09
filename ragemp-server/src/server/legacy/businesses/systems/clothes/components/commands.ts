import { Clothes } from './core';

mp.commands.addCommand({
	name: 'giveclothing',
	aliases: ['giveclothes'],
	permission: 'cmds.giveclothes',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, name }) => `${admin} gave a clothing item ${name} to ${target}.`,
			RO: ({ admin, target, name }) => `${admin} i-a dat item de imbracaminte ${name} lui ${target}.`
		},
		InvalidClothing: {
			EN: () => 'The clothing id is invalid.',
			RO: () => 'Acest clothing id este invalid.'
		},
		NoSpace: {
			EN: () => `The player has no space in his inventory.`,
			RO: () => `Jucătorul nu are spatiu in inventar.`
		}
	},
	args: {
		target: 'player',
		id: 'number'
	},
	handler: (player, { target, id }, lang) => {
		// Check slots
		if (target.getNumberOfAvailableInventorySlots() < 1) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoSpace'), 'system');

		// Get clothing data
		const clothing = Clothes.find((c: Clothes) => c.id === id);
		if (!clothing) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidClothing'), 'system');

		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			name: clothing.name
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:giveclothing',
			messageId: 'Announcement',
			permission: 'cmds.giveclothing',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.giveclothing') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		player.createAmplitudeEvent(`Gave clothing item as Staff`, {
			target: target.info.username,
			clothingName: clothing.name,
			clothingId: clothing.id,
			action: 'giveItem'
		});

		target.createAmplitudeEvent(`Received clothing item from Staff`, {
			actioner: player.info.username,
			clothingName: clothing.name,
			clothingId: clothing.id,
			action: 'giveItem'
		});

		target.giveItem(3, 1, { clothingId: clothing.id }, null);
	}
});

mp.commands.addCommand({
	name: 'clearclothes',
	aliases: ['resetclothes'],
	permission: 'cmds.clearclothes',
	defineLangs: {
		Announcement: {
			EN: ({ admin, player }) => `${admin} reset character clothes for ${player}.`,
			RO: ({ admin, player }) => `${admin} a resetat hainele personajului lui ${player}.`
		},
		RangeError: {
			EN: `The range is not a valid number.`,
			RO: `Range-ul nu este un numar valid.`
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }) => {
		target.resetAllClothingComponents();

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:clearclothes',
			permission: 'cmds.clearclothes',
			messageId: 'Announcement',
			args: () => ({
				admin: player.info.username,
				player: target.info.username
			})
		});

		player.createAmplitudeEvent(`Reseted clothing as Staff`, {
			target: target.info.username
		});

		target.createAmplitudeEvent(`Clothing resetted by Staff`, {
			actioner: player.info.username
		});

		target.updateClothes(target.info.clothes);
		target.saveClothes(target.info.clothes);
	}
});

mp.commands.addCommand({
	name: 'reloadclothes',
	permission: 'cmds.reloadclothes',
	defineLangs: {
		Announcement: {
			EN: ({ admin }) => `${admin} reloaded clothing data from database.`,
			RO: ({ admin }) => `${admin} a reincarcat hainele din baza de date.`
		}
	},
	handler: (player) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:reloadclothes',
			permission: 'cmds.reloadclothes',
			messageId: 'Announcement',
			args: () => ({
				admin: player.info.username
			})
		});

		mp.events.call('refreshClothingDatabase');

		player.createAmplitudeEvent(`Refreshed clothing from database`, {});
	}
});
