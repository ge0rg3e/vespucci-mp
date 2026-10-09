import { isInRange, logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';
import { InventoryItem } from './types';
import { MAX_PICKUP_ITEM_RANGE, updateInventoryInterfaceData } from './utils';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { getItemName } from '@server/natives/items/components/utils';
import { DroppedItem } from '@server/natives/items/components/types';
import { getLanguagePack } from '@vmp/i18n';

rpc.on('requestInventoryData', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	updateInventoryInterfaceData(player, args.remoteId);
	if (player.id === args.remoteId) {
		// if he opens his own profile
		player.createAmplitudeEvent(`Opened inventory`);
	}
});

rpc.on(`openInventory`, async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error;

	let playerPosition = player.position;

	if (player.vars.remoteInventoryId) {
		// If I'm in Los Santos but I'm looking at someone's inventory from across the map, it's about him not me.
		const target = mp.players.at(player.vars.remoteInventoryId);
		playerPosition = target.position;
	}

	player.updateVars({
		invetoryLastPosition: playerPosition,
		inventoryOpened: true
	});
});

rpc.on(`closedInventory`, async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error;

	player.createAmplitudeEvent(`Closed inventory`);

	if (player.vars.separateInventory && player.vars.remoteInventoryId === null) {
		mp.events.call('onSeparateInventoryClosed', player, player.vars.separateInventory);
	}

	player.updateVars({
		remoteInventoryId: null,
		separateInventory: null,
		inventoryOpened: false
	});
});

rpc.register('onInventoryItemMoved', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	const { remoteId, id, slot, action, page }: { remoteId: number; id: string; slot: number; page: number; action: string } = JSON.parse(args);
	const target = mp.players.at(remoteId);
	if (!target) return false;
	try {
		const inventory = target.info.inventory;

		if (action === 'move') {
			const oldIndex: number = inventory.findIndex((i: InventoryItem) => i.id === id);
			if (oldIndex === -1) return false; // Outdated inventory
			target.info.inventory[oldIndex].slotId = slot;
			target.info.inventory[oldIndex].pageId = page;
		} else {
			const oldIndex: number = inventory.findIndex((i: InventoryItem) => i.id === id);
			const newIndex: number = inventory.findIndex((i: InventoryItem) => i.slotId === slot);
			const oldSlot = inventory[oldIndex].slotId;
			const oldPage = inventory[oldIndex].pageId;
			const newPage = inventory[newIndex].pageId;

			if (oldIndex === -1 || newIndex == -1) return false; // outdated inventory.

			// Are the two items the same ?
			const itemsSame = inventory[newIndex].itemId === inventory[oldIndex].itemId;

			// Is the new allowing stacking ?
			const canStack = mp.items.getItem(inventory[newIndex].itemId)!.stackable;

			// What is the max amount of items stacked?
			const itemLimit: number = mp.items.getItem(inventory[newIndex].itemId)!.limit!;

			// If we stack them, would it break the limit of items stacked ?
			const passLimit = inventory[oldIndex].quantity + inventory[newIndex].quantity > itemLimit;

			if (itemsSame && canStack && !passLimit) {
				target.info.inventory[newIndex].quantity += target.info.inventory[oldIndex].quantity;
				target.info.inventory.splice(oldIndex, 1);
			} else {
				target.info.inventory[oldIndex].slotId = slot;
				target.info.inventory[oldIndex].pageId = newPage;
				target.info.inventory[newIndex].slotId = oldSlot;
				target.info.inventory[newIndex].pageId = oldPage;
			}
		}
		target.updateInventoryInterface();
		return true;
	} catch (err) {
		target.sendErrorMessage(`Server`, `system`, `Internal item processor error. Please contact our administrators.`, `system`);
		target.updateInventoryInterface();
		await logError(`ITEM_MOVING_ERROR`, err);
		return false;
	}
});

rpc.register('onDroppedItemPicked', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	const { remoteId, id, slot, page }: { remoteId: number; page: number; slot: number; id: string } = JSON.parse(args);
	const target = mp.players.at(remoteId);
	if (!target) return false;
	try {
		const droppedItem = mp.items.getDropById(id);

		if (!droppedItem) {
			player.updateInventoryInterface(); // refreshing ui
			return false;
		}

		if (!isInRange(droppedItem.position, target.position, MAX_PICKUP_ITEM_RANGE)) {
			player.updateInventoryInterface(); // refreshing ui
			return false;
		}

		if (droppedItem.expiresAt) {
			const diff = moment(new Date()).diff(new Date(droppedItem.expiresAt), 'minutes');

			if (diff >= 0) {
				player.updateInventoryInterface();

				return false;
			}
		}

		const pickedItem: DroppedItem = { ...droppedItem };
		const inv = target.info.inventory;

		const slotOccupied = inv.find((i: InventoryItem) => i.slotId === slot && i.pageId === page);
		const noDestination = page === undefined && slot === undefined;
		const emptyDestinationAvailable = !noDestination && !slotOccupied;
		let itemAddedToInventory = false;

		// If the player drags the item to a specific slot id and page id and is empty
		if (emptyDestinationAvailable) {
			const inventoryEntry: InventoryItem = {
				id: uuidv4(),
				itemId: pickedItem.itemId,
				meta: pickedItem.meta,
				expiresAt: pickedItem.expiresAt,
				quantity: pickedItem.quantity,
				pageId: page,
				slotId: slot
			};
			target.info.inventory.push(inventoryEntry);
			itemAddedToInventory = true;
		}

		// If the player drags the dropped item over an existing item

		if (slotOccupied && itemAddedToInventory === false) {
			// Are the two items the same ?
			const itemsSame = pickedItem.itemId === slotOccupied.itemId;

			// Is the new allowing stacking ?
			const canStack = mp.items.getItem(slotOccupied.itemId)!.stackable;

			// What is the max amount of items stacked?
			const itemLimit: number = mp.items.getItem(slotOccupied.itemId)!.limit!;

			// If we stack them, would it break the limit of items stacked ?
			const passLimit = slotOccupied.quantity + pickedItem.quantity > itemLimit;

			const slotOccupiedIndex = target.info.inventory.findIndex((i: InventoryItem) => i.slotId === slot && i.pageId === page);

			if (itemsSame && canStack && !passLimit && slotOccupiedIndex !== -1) {
				target.info.inventory[slotOccupiedIndex].quantity += droppedItem.quantity;
				itemAddedToInventory = true;
			}
		}

		// If the player just rights clicks to pick it up NOR  the 'slotOcuppied' isn't a match.
		if (itemAddedToInventory === false) {
			const itemAdded: ExpectedAny = target.giveItem(pickedItem.itemId, pickedItem.quantity, pickedItem.meta, pickedItem.expiresAt);
			itemAddedToInventory = itemAdded;
		}

		if (itemAddedToInventory === false) return false; // If it failed to pick it up there's no reason to delete the dropped item.

		target.createAmplitudeEvent(`Picked dropped item`, {
			itemId: pickedItem.itemId,
			itemName: getItemName(pickedItem.itemId, 'EN'),
			quantity: pickedItem.quantity,
			meta: pickedItem.meta,
			expiresAt: pickedItem.expiresAt,
			previouslyDroppedBy: pickedItem.droppedBy
		});

		// On inventory item change
		mp.events.call(`onInventoryUpdate`, target, 'pickedItem');

		mp.items.deleteDroppedItemById(id); // deleting it

		mp.players.forEachLoggedIn((p: PlayerMp) => {
			if (!isInRange(p.position, pickedItem.position, MAX_PICKUP_ITEM_RANGE) && !(p === player || p === target)) return;
			p.updateInventoryInterface();
		});

		return true;
	} catch (err) {
		target.sendErrorMessage(`Server`, `system`, `Internal item processor error. Please contact our administrators.`, `system`);
		target.updateInventoryInterface();
		await logError(`PICKUP_ITEM_ERROR`, err);
		return false;
	}
});

rpc.register('addItemToSeparateInventory', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	const { remoteId, id, slot }: { remoteId: number; id: string; slot: number } = JSON.parse(args);
	const target = mp.players.at(remoteId);
	if (!target) return false;
	if (!target.vars.separateInventory) return false;

	const lang = getLanguagePack('Inventory', target.lang);

	try {
		const extInventory = target.vars.separateInventory?.items;
		const itemDragged = target.info.inventory.find((i: InventoryItem) => i.id === id);
		if (!itemDragged) return false; // Inventory out of sync
		let itemAddedToInventory = false;

		// Get more item information and check if it is not depositable
		const itemInfo = mp.items.getItem(itemDragged.itemId);
		if (!itemInfo) return false;

		if (itemInfo.notDepositable === true) {
			target.toast({ type: 'error', message: lang.get('NotDepositableItem') });
			target.updateInventoryInterface();
			return false;
		}

		// Is the destination slot empty?
		const slotOccupied = extInventory?.find((i: ExpectedAny) => i.slotId === slot);

		// The slot is empty
		if (!slotOccupied) {
			const item: ExpectedAny = { ...itemDragged, slotId: slot };
			delete item.pageId; // This won't be needed.

			// Add it to the separated inventory
			extInventory?.push(item);

			// Removing it from the player
			const itemDraggedIndex = target.info.inventory.findIndex((i: InventoryItem) => i.id === id);
			if (itemDraggedIndex === -1) return false;
			target.info.inventory.splice(itemDraggedIndex, 1);

			// Marking it as a success
			itemAddedToInventory = true;
		}

		// The slot is not empty

		if (slotOccupied && itemAddedToInventory !== true) {
			// Are the two items the same ?
			const itemsSame = itemDragged.itemId === slotOccupied.itemId;

			// Is the new allowing stacking ?
			const canStack = mp.items.getItem(slotOccupied.itemId)!.stackable;

			// What is the max amount of items stacked?
			const itemLimit: number = mp.items.getItem(slotOccupied.itemId)!.limit!;

			// If we stack them, would it break the limit of items stacked ?
			const passLimit = slotOccupied.quantity + itemDragged.quantity > itemLimit;

			const slotOccupiedIndex = extInventory.findIndex((i: ExpectedAny) => i.slotId === slot);

			if (itemsSame && canStack && !passLimit && slotOccupiedIndex !== -1) {
				// Updating the quantity
				extInventory[slotOccupiedIndex].quantity += itemDragged.quantity;

				// Removing it from the player
				const itemDraggedIndex = target.info.inventory.findIndex((i: InventoryItem) => i.id === id);
				if (itemDraggedIndex === -1) return false; // out of sync
				target.info.inventory.splice(itemDraggedIndex, 1);

				itemAddedToInventory = true;
			}
		}

		if (itemAddedToInventory === false) return false; // Failed to add it to their inventory

		target.createAmplitudeEvent(`Added item to separate inventory`, {
			itemId: itemDragged.itemId,
			itemName: getItemName(itemDragged.itemId, 'EN'),
			quantity: itemDragged.quantity,
			meta: itemDragged.meta,
			expiresAt: itemDragged.expiresAt,
			separateInventoryId: target.vars.separateInventory.id,
			separateInventoryPayload: target.vars.separateInventory.payload || '-'
		});

		const newSeparateInventory = {
			...target.vars.separateInventory!,
			items: [...extInventory]
		};

		target.updateVars({
			separateInventory: newSeparateInventory
		});

		// On inventory item change
		mp.events.call(`onInventoryUpdate`, target, 'addedItemToSeparateInventory');

		target.updateInventoryInterface();

		mp.events.call('onSeparateInventoryUpdated', target, newSeparateInventory);

		return true;
	} catch (err) {
		target.sendErrorMessage(`Server`, `system`, `Separate inventory processing error. Please contact our administrators.`, `system`);
		target.updateInventoryInterface();
		await logError(`ADD_ITEM_TO_SEPARATE_INVENTORY`, err);
		return false;
	}
});

rpc.on('reorderInventoryPage', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	const { remoteId, page } = JSON.parse(args);

	const target = mp.players.at(remoteId);
	if (!target) return false;

	const originalInventory = [...target.info.inventory];
	const inventory: Array<InventoryItem> = [...originalInventory];
	const itemsInPage: Array<InventoryItem> = [];

	inventory.forEach((item: InventoryItem) => {
		if (item.pageId !== page) return;
		itemsInPage.push(item);
	});

	itemsInPage.forEach((item: InventoryItem, index: number) => {
		const itemIndex = originalInventory.findIndex((i: ExpectedAny) => i.id === item.id);
		if (itemIndex === -1) return;
		inventory[itemIndex].slotId = index;
	});

	// Update with the results

	target.info.inventory = [...inventory];
	target.updateInventoryInterface();

	return true;
});

rpc.on('inventory:refreshInterfaceData', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	player.updateInventoryInterface();
	return true;
});

rpc.register('pickItemFromSeparateInventory', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	const { remoteId, id, slot, page }: { remoteId: number; slot: number; id: string; page: number } = JSON.parse(args);
	const target = mp.players.at(remoteId);
	if (!target) return false;
	if (!target.vars.separateInventory) return false;

	try {
		const extInventory = target.vars.separateInventory?.items;
		const itemPicked = extInventory!.find((i: ExpectedAny) => i.id === id);
		if (!itemPicked) return false; // Inventory out of sync
		let itemAddedToInventory = false;

		// Is the destination slot empty?
		const slotOccupied = player.info.inventory?.find((i: InventoryItem) => i.slotId === slot && i.pageId === page);

		// The user used right click to quickly pick the item
		if (!slotOccupied && !slot) {
			const itemAdded: ExpectedAny = target.giveItem(itemPicked.itemId, itemPicked.quantity, itemPicked.meta, itemPicked.expiresAt);

			if (itemAdded) {
				// Removing it from the external inventory
				const itemPickedIndex = extInventory!.findIndex((i: ExpectedAny) => i.id === id);
				if (itemPickedIndex === -1) return false;
				extInventory!.splice(itemPickedIndex, 1);
			}

			itemAddedToInventory = itemAdded;
		}

		// The user is dragging to specific empty slot
		if (!slotOccupied && itemAddedToInventory === false) {
			const item: ExpectedAny = { ...itemPicked, pageId: page, slotId: slot };

			// Add it to the player inventory

			player.info.inventory.push(item);

			// Removing it from the external inventory
			const itemPickedIndex = extInventory!.findIndex((i: ExpectedAny) => i.id === id);
			if (itemPickedIndex === -1) return false;
			extInventory!.splice(itemPickedIndex, 1);

			// Marking it as a success
			itemAddedToInventory = true;
		}

		// The slot is not empty
		if (slotOccupied && itemAddedToInventory !== true) {
			// Are the two items the same ?
			const itemsSame = itemPicked.itemId === slotOccupied.itemId;

			// Is the new allowing stacking ?
			const canStack = mp.items.getItem(slotOccupied.itemId)!.stackable;

			// What is the max amount of items stacked?
			const itemLimit: number = mp.items.getItem(slotOccupied.itemId)!.limit!;

			// If we stack them, would it break the limit of items stacked ?
			const passLimit = slotOccupied.quantity + itemPicked.quantity > itemLimit;

			const slotOccupiedIndex = player.info.inventory.findIndex((i: ExpectedAny) => i.slotId === slot && i.pageId === page);

			if (itemsSame && canStack && !passLimit && slotOccupiedIndex !== -1) {
				// Updating quantity
				player.info.inventory[slotOccupiedIndex].quantity += itemPicked.quantity;
				const itemPickedIndex = extInventory?.findIndex((i: ExpectedAny) => i.id === id);
				if (itemPickedIndex === -1) return false;

				// Removing it from separate inventory
				extInventory!.splice(itemPickedIndex!, 1);
				itemAddedToInventory = true;
			}
		}

		if (itemAddedToInventory === false) return false; // Failed to add it to their inventory

		target.createAmplitudeEvent(`Picked item from separate inventory`, {
			itemId: itemPicked.itemId,
			itemName: getItemName(itemPicked.itemId, 'EN'),
			quantity: itemPicked.quantity,
			meta: itemPicked.meta,
			expiresAt: itemPicked.expiresAt,
			separateInventoryId: target.vars.separateInventory.id,
			separateInventoryPayload: target.vars.separateInventory.payload || '-'
		});

		// On inventory item change
		mp.events.call(`onInventoryUpdate`, target, 'pickedItemToSeparateInventory');

		const newSeparateInventory = {
			...target.vars.separateInventory!,
			items: [...extInventory]
		};

		target.updateVars({
			separateInventory: newSeparateInventory
		});

		target.updateInventoryInterface();

		mp.events.call('onSeparateInventoryUpdated', target, newSeparateInventory);

		return true;
	} catch (err) {
		target.sendErrorMessage(`Server`, `system`, `Separate inventory processing error. Please contact our administrators.`, `system`);
		target.updateInventoryInterface();
		await logError(`PICK_ITEM_TO_SEPARATE_INVENTORY`, err);
		return false;
	}
});

rpc.register('moveItemToSeparateInventory', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	const { remoteId, id, slot, action }: { remoteId: number; id: string; slot: number; action: string } = JSON.parse(args);
	const target = mp.players.at(remoteId);
	if (!target) return false;
	if (!target.vars.separateInventory) return false;

	try {
		const extInventory = target.vars.separateInventory?.items;
		const itemDragged = extInventory.find((i: ExpectedAny) => i.id === id);
		const itemDraggedIndex: number = extInventory.findIndex((i: ExpectedAny) => i.id === id);
		if (!itemDragged || itemDraggedIndex == -1) return false; // Inventory out of sync

		if (action === 'move') {
			extInventory[itemDraggedIndex!].slotId = slot;
		} else {
			const oldIndex: number = extInventory.findIndex((i: ExpectedAny) => i.id === id);
			const newIndex: number = extInventory.findIndex((i: ExpectedAny) => i.slotId === slot);

			const oldSlot = extInventory[oldIndex].slotId;

			if (oldIndex === -1 || newIndex == -1) return false; // outdated inventory.

			// Are the two items the same ?
			const itemsSame = extInventory[newIndex].itemId === extInventory[oldIndex].itemId;

			// Is the new allowing stacking ?
			const canStack = mp.items.getItem(extInventory[newIndex].itemId)!.stackable;

			// What is the max amount of items stacked?
			const itemLimit: number = mp.items.getItem(extInventory[newIndex].itemId)!.limit!;

			// If we stack them, would it break the limit of items stacked ?
			const passLimit = extInventory[oldIndex].quantity + extInventory[newIndex].quantity > itemLimit;

			if (itemsSame && canStack && !passLimit) {
				extInventory[newIndex].quantity += extInventory[oldIndex].quantity;
				extInventory.splice(oldIndex, 1);
			} else {
				extInventory[oldIndex].slotId = slot;
				extInventory[newIndex].slotId = oldSlot;
			}
		}

		const newSeparateInventory = {
			...target.vars.separateInventory!,
			items: [...extInventory]
		};

		target.updateVars({
			separateInventory: newSeparateInventory
		});

		target.updateInventoryInterface();

		mp.events.call('onSeparateInventoryUpdated', target, newSeparateInventory);

		return true;
	} catch (err) {
		target.sendErrorMessage(`Server`, `system`, `Separate inventory processing error. Please contact our administrators.`, `system`);
		target.updateInventoryInterface();
		await logError(`MOVE_ITEM_TO_SEPARATE_INVENTORY`, err);
	}
	return false;
});
