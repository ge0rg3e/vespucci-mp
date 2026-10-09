import { Houses } from '@server/legacy/houses/components/core';
import { showHouseStorageList } from './functions';

mp.events.add('onDialogResponse', function (player, response) {
	if (response.dialogId !== 'houseStorageCloset') return false;

	// Find house
	const house = Houses.find((h) => response.payload.houseId === h.id);

	if (!house) return false; // Safety check

	if (response.responseKey === 'F') {
		// wants to see his own house inventory
		const inventory = house.inventories.find((h: HouseInventory) => h.username === player.info.username);
		player.updateVars({
			separateInventory: {
				title: {
					EN: 'House Inventory',
					RO: 'Inventar casă'
				},
				id: `houseStorageCloset`, // on the callback i'll need to know what of separate inventory was
				items: inventory ? inventory.items : [],
				payload: {
					// used for identifying.
					ownerUsername: player.info.username,
					houseId: house.id
				}
			}
		});

		player.triggerClientEvent('setInventoryOpened', { boolean: true });
		this.cancel = true;
		return;
	} else if (response.responseKey === 'G' && player.checkPermission('feature.friskHouseInventories')) {
		showHouseStorageList(player);
		this.cancel = true;
		return;
	}
	return;
});

mp.events.add('onDialogResponse', function (player, response) {
	if (response.dialogId !== 'houseStorageCloset:FriskList') return false;

	if (response.responseKey === `ENTER` && response.listItemSelected) {
		const ownerName = response.listItemSelected[0];
		const house = Houses.find((h) => response.payload.houseId === h.id);

		if (!house) return false; // Safety check

		const inventory = house.inventories.find((h: HouseInventory) => h.username === ownerName);

		player.updateVars({
			separateInventory: {
				title: {
					EN: 'House Inventory',
					RO: 'Inventar casă'
				},
				id: `houseStorageCloset`, // on the callback i'll need to know what of separate inventory was
				items: inventory ? inventory.items : [],
				payload: {
					// used for identifying.
					ownerUsername: ownerName,
					houseId: house.id
				}
			}
		});

		player.hidePlayerDialog();
		player.triggerClientEvent('setInventoryOpened', { boolean: true });
		this.cancel = true;
		return;
	}

	player.hidePlayerDialog();
	return;
});
