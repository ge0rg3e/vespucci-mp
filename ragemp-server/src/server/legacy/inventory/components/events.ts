import { isInRange } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		remoteInventoryId: null,
		separateInventory: null
	});
});

mp.events.add('playerQuit', (player) => {
	if (player.vars && player.vars.loggedIn) {
		mp.players.forEachLoggedIn((entity: PlayerMp) => {
			if (entity.vars.remoteInventoryId !== player.id) return false;

			// Update front-end..
			entity.triggerSocketEvent(`inventory:receivedData`, { disconnected: true });

			// Announce..
			const lang = getLanguagePack('Inventory', entity.info.language);
			entity.toast({ type: 'error', message: lang.get('DisconnectMessage') });
			return true;
		});
	}
});

// Timer to update pickups in inventory interface

mp.events.add('everyMinuteForPlayerTimer', (player) => {
	if (!player.vars.inventoryOpened) return false;

	if (!isInRange(player.position, player.vars.invetoryLastPosition, 5)) {
		const target = player.vars.remoteInventoryId ? mp.players.at(player.vars.remoteInventoryId) : player;

		player.updateVars({
			invetoryLastPosition: target.position
		});

		target.updateInventoryInterface();
	}

	return true;
});

// Timer to expire the items.

mp.events.add('everyMinuteForPlayerTimer', (player) => {
	if (player.vars.inventoryOpened === false) return false;

	const expiredItems = player.removeExpiredItems();

	if (expiredItems === true) {
		// Some stuff expired
		player.updateInventoryInterface();
	}

	return true;
});
