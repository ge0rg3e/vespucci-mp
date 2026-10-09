import { Houses, updateHouse } from '@server/legacy/houses/components/core';
import { houseInteriors } from '@server/definitions/houseInteriors';
import { showHouseStorageDialog } from './functions';
import { logError } from '@server/utils/helpers';
import dimensions from '@server/definitions/dimensions';

mp.events.add(`houses:loadDependencies`, async (player, house) => {
	try {
		// Dependencies
		const houseInterior = houseInteriors.find((int) => int.id === house.interiorId);
		if (!houseInterior) return;

		// Creating the blip for the inventory storage
		player.createBlip({
			label: `House - Inventory`,
			identifier: `HouseStorageCloset:${house.id}`,
			type: 568,
			position: new mp.Vector3(houseInterior.dependencies.storageCloset.coords),
			color: 25,
			dimension: dimensions.houses + house.id
		});

		// Colshape for it to work
		player.createColshape({
			identifier: `HouseStorageCloset:${house.id}`,
			position: new mp.Vector3(houseInterior.dependencies.storageCloset.coords),
			range: 2,
			type: 'sphere',
			dimension: dimensions.houses + house.id,
			payload: {
				houseId: house.id
			}
		});

		// Create the marker for the entrance..
		player.createMarker({
			identifier: `HouseStorageCloset:${house.id}`,
			type: 1,
			position: new mp.Vector3(houseInterior.dependencies.storageCloset.coordsMarker),
			scale: 0.7,
			direction: new mp.Vector3(0, 0, 0),
			rotation: new mp.Vector3(0, 0, 0),
			color: [0, 117, 106, 60],
			dimension: dimensions.houses + house.id
		});
	} catch (err) {
		await logError(`houses:loadDependencies`, err, { house: house.id, player: player.info.username });
	}
});

mp.events.add(`houses:removeDependencies`, async (player, house) => {
	try {
		// This will remove the blips and everything else for the house

		// Delete the blip
		player.deleteBlip(`HouseStorageCloset:${house.id}`);

		// Delete the colshape for the entrance
		player.deleteColshape(`HouseStorageCloset:${house.id}`);

		// Delete marker
		player.deleteMarker(`HouseStorageCloset:${house.id}`);
	} catch (err) {
		await logError(`houses:removeDependencies`, err, { house: house.id, player: player.info.username });
	}
});

mp.events.add('onPlayerEnterColshape', function (player, colshape) {
	// Find if the player has entered a colshape that's a house colshape

	if (player.vars.dialogCooldown) return;
	const identifier = colshape.identifier;

	if (identifier.includes('HouseStorageCloset')) {
		showHouseStorageDialog(player);
	}

	return;
});

mp.events.add('onPlayerExitColshape', function (player) {
	const houseDialogs = ['houseStorageCloset'];
	if (player.vars && player.vars.dialogId && houseDialogs.find((x: string) => player.vars.dialogId?.includes(x))) {
		player!.hidePlayerDialog();
		return;
	}
	return;
});

mp.events.add('onSeparateInventoryUpdated', function (_, newInventory) {
	if (newInventory.id === 'houseStorageCloset') {
		const houseIndex = Houses.findIndex((h: House) => h.id === newInventory.payload.houseId);
		const house = Houses.find((h) => h.id === newInventory.payload.houseId);
		if (!house) return false; // Safety check

		const findExistingIndex = house.inventories.findIndex((h: HouseInventory) => h.username === newInventory.payload.ownerUsername);

		if (findExistingIndex !== -1) {
			if (newInventory.items.length < 1) {
				Houses[houseIndex].inventories.splice(findExistingIndex, 1); // There is no harm in deleting it. We don't want empty inventories to show up on 'frisk inventories'
			} else {
				Houses[houseIndex].inventories[findExistingIndex].items = newInventory.items;
			}
		} else {
			Houses[houseIndex].inventories.push({
				username: newInventory.payload.ownerUsername,
				items: newInventory.items
			});
		}

		this.cancel = true;
		return true;
	}
	return false;
});

mp.events.add('onSeparateInventoryClosed', function (_, newInventory) {
	if (newInventory.id === 'houseStorageCloset') {
		const house = Houses.find((h) => h.id === newInventory.payload.houseId);

		if (!house) return false; // Safety check

		updateHouse(newInventory.payload.houseId, {
			inventories: house.inventories
		});

		this.cancel = true;
		return true;
	}
	return false;
});
