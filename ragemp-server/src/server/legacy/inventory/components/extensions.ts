import { isInRange, logError } from '@server/utils/helpers';
import { InventoryItem, InventoryPage } from './types';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { MAX_PICKUP_ITEM_RANGE, updateInventoryInterfaceData } from './utils';
import { DroppedItem, itemObject } from '@server/natives/items/components/types';
import { getLanguagePack } from '@vmp/i18n';

// Definitions

export const MAX_INVENTORY_SLOTS_PER_PAGE = 36;

const checkDestinationIsAvailable = (inventory: Array<InventoryItem>, page: number, slot: number) => {
	const maxSlotId = MAX_INVENTORY_SLOTS_PER_PAGE - 1; // the slots are 0-10. so id 0 is also a slot.

	// Sometimes I will send two items in the same slot but with a + 1. Just in case they drag it to slot 36 and the +1 is 37.
	if (slot > maxSlotId) {
		slot = maxSlotId;
	} else if (slot < 0) {
		slot = 0;
	}

	return inventory.find((i) => i.pageId === page && i.slotId === slot) ? false : true;
};

mp.Player.prototype.giveItem = async function (itemId, quantity = 1, meta = {}, expiresAt = null, destinationPreferred = null) {
	try {
		// Getting the required dependencies
		const emptySlot = this.findAvailableInventorySlot();
		const stackableSlot: ExpectedAny = this.findStackableInventorySlot(itemId, quantity);
		const item = mp.items.getItem(itemId);
		const isPreferredSlotAvailable = destinationPreferred ? checkDestinationIsAvailable(this.info.inventory, destinationPreferred.page, destinationPreferred.slot) : false;

		// If they have a preferred slot and is available
		if (destinationPreferred && isPreferredSlotAvailable) {
			const inventoryEntry: InventoryItem = { id: uuidv4(), itemId, meta, expiresAt, quantity, pageId: destinationPreferred.page, slotId: destinationPreferred.slot };
			this.info.inventory = [...this.info.inventory, { ...inventoryEntry }];
			return inventoryEntry;
		}

		// The item couldn't be found nor there wasn't a place for it
		if ((emptySlot == null && stackableSlot === null) || item === undefined) return null;

		// There's no stackable slot, but there's an empty place.
		if (stackableSlot === null && emptySlot !== null) {
			const inventoryEntry: InventoryItem = { id: uuidv4(), itemId, meta, expiresAt, quantity, pageId: emptySlot.page, slotId: emptySlot.slot };
			this.info.inventory = [...this.info.inventory, { ...inventoryEntry }];
			return inventoryEntry;
		}

		// There's a stackable place so let's find the index
		const indexNo = this.info.inventory.findIndex((i: InventoryItem) => i.slotId === stackableSlot.slot && i.pageId === stackableSlot.page);
		if (indexNo == -1) return null;

		// Now we just update the quantity of the existing item
		const inventory = [...this.info.inventory];
		const slot = inventory[indexNo];
		inventory[indexNo].quantity = slot.quantity + (quantity || 1);
		this.info.inventory = inventory;

		// On inventory item change
		mp.events.call(`onInventoryUpdate`, this, 'receivedItem');
		return slot;
	} catch (err) {
		await logError(`GIVE_ITEM`, err, { itemId, quantity, meta, expiresAt, actioner: this.info.username });
		return null;
	}
};

mp.Player.prototype.updateItem = function (id, object: InventoryItem) {
	const index = this.info.inventory.findIndex((i: InventoryItem) => i.id === id);
	if (index === -1) return;
	this.info.inventory[index] = {
		...this.info.inventory[index],
		...object
	};
	return this.info.inventory[index];
};

mp.Player.prototype.reduceItem = function (id, quantity = 1) {
	const index = this.info.inventory.findIndex((i: InventoryItem) => i.id == id);
	if (index === -1) return;
	const item: InventoryItem = this.info.inventory[index];

	if (item.quantity - quantity > 0) {
		this.updateItem(id, {
			quantity: item.quantity - quantity
		});
	} else if (item.quantity - 1 < 1) {
		this.deleteItem(id);
	}

	// Update inventory interface to reflect this change.
	this.updateInventoryInterface();
};

mp.Player.prototype.deleteItem = function (id) {
	const index = this.info.inventory.findIndex((i: InventoryItem) => i.id === id);
	if (index === -1) return;

	// Get more item information and check if it is unDestroyable
	const itemInfo = mp.items.getItem(this.info.inventory[index].itemId);
	if (!itemInfo) return false;

	const lang = getLanguagePack('Inventory', this.lang);

	if (itemInfo.unDestroyable === true) {
		this.toast({ type: 'error', message: lang.get('UnDestroyableItem') });
		this.updateInventoryInterface();
		return false;
	}

	this.info.inventory.splice(index, 1);

	// Update inventory interface to reflect this change.
	this.updateInventoryInterface();
	return true;
};

mp.Player.prototype.getInventoryItemMatch = function ({ id, itemId, pageId, slotId }) {
	// If none of the criteria are provided, return null
	if (id === undefined && itemId === undefined && pageId === undefined) {
		return null;
	}

	// Find the index of the inventory item that matches the specified criteria
	const index = this.info.inventory.findIndex((item) => {
		// Initialize match acceptance as true
		let matchAcceptance = true;

		// Check if id is provided and matches
		if (id !== undefined && item.id !== id) {
			matchAcceptance = false;
		}

		// Check if itemId is provided and matches
		if (itemId !== undefined && item.itemId !== itemId) {
			matchAcceptance = false;
		}

		// Check if slotId is provided and matches
		if (slotId !== undefined && item.slotId !== slotId) {
			matchAcceptance = false;
		}

		// Check if pageId is provided and matches
		if (pageId !== undefined && item.pageId !== pageId) {
			matchAcceptance = false;
		}

		// Return the final match result
		return matchAcceptance;
	});

	// If no match is found, return null
	if (index === -1) {
		return null;
	}

	// Return the matched inventory item
	return this.info.inventory[index];
};

mp.Player.prototype.getInventoryPages = function () {
	const arr: Array<InventoryPage> = [
		{
			id: 0,
			available: true
		},
		{
			id: 1,
			available: this.info.level >= 10
		},
		{
			id: 2,
			available: false
		},
		{
			id: 3,
			available: false
		}
	];
	return arr;
};

const getArrSlots = (number: number) => new Array(number).fill(0).map((_, index) => index);

mp.Player.prototype.findAvailableInventorySlot = function () {
	let result: ExpectedAny | null = null;

	this.getInventoryPages().forEach((page: InventoryPage) => {
		if (page.available === false) return;
		getArrSlots(MAX_INVENTORY_SLOTS_PER_PAGE).forEach((slot: number) => {
			const slotOccupied = this.info.inventory.find((item: InventoryItem) => item.slotId === slot && item.pageId === page.id);
			if (slotOccupied || result !== null) return;
			result = {
				slot,
				page: page.id
			};
		});
	});

	return result;
};

mp.Player.prototype.getNumberOfAvailableInventorySlots = function () {
	let result = 0;

	this.getInventoryPages().forEach((page: InventoryPage) => {
		if (page.available === false) return;
		getArrSlots(MAX_INVENTORY_SLOTS_PER_PAGE).forEach((slot: number) => {
			const slotOccupied = this.info.inventory.find((item: InventoryItem) => item.slotId === slot && item.pageId === page.id);
			if (slotOccupied) return;
			result++;
		});
	});

	return result;
};

mp.Player.prototype.checkEnoughSpaceForItem = function (itemId: number, quantity: number) {
	const availableSlot = this.findAvailableInventorySlot();
	const stackableSlot = this.findStackableInventorySlot(itemId, quantity);

	// We have space enough space.
	if (stackableSlot !== null || availableSlot) return true;

	return false;
};

export const findStackableSlot = (items: Array<InventoryItem>, itemId: number, quantity: number) => {
	let slotMatch: number | null = null;

	getArrSlots(MAX_INVENTORY_SLOTS_PER_PAGE).forEach((slot: number) => {
		if (slotMatch !== null) return;
		const slotOccupied = items.find((item: InventoryItem) => item.slotId === slot);
		if (!slotOccupied) return;
		const item: itemObject = mp.items.getItem(slotOccupied.itemId)!;
		if (!item) return;

		const limitOverdone = item.limit && slotOccupied.quantity + quantity > item.limit ? true : false;
		if (slotOccupied.itemId !== itemId || item.stackable !== true || limitOverdone === true) return;
		slotMatch = slot;
	});

	return slotMatch;
};

mp.Player.prototype.findStackableInventorySlot = function (itemId, quantity) {
	let result: ExpectedAny | null = null;

	this.getInventoryPages().forEach((page: InventoryPage) => {
		if (page.available === false) return false; // The player hasn't unlocked this inventory.

		const items = this.info.inventory.filter((i: InventoryItem) => i.pageId === page.id);
		const slot = findStackableSlot(items, itemId, quantity);
		if (slot === null || result) return;

		result = {
			slot,
			page: page.id
		};

		return true;
	});

	return result;
};

mp.Player.prototype.updateInventoryInterface = function () {
	mp.players.forEachLoggedIn((entity: PlayerMp) => {
		if ((entity === this && entity.vars.inventoryOpened === true) || (entity.vars.remoteInventoryId === this.id && entity.vars.inventoryOpened === true)) {
			updateInventoryInterfaceData(entity, this.id);
		}
	});
};

mp.Player.prototype.dropItem = async function (id) {
	const itemToBeDropped = this.info.inventory.find((i: InventoryItem) => i.id === id);
	const indexItem = this.info.inventory.findIndex((i: InventoryItem) => i.id === id);

	if (!itemToBeDropped) return false;

	const droppedItemSource: ExpectedAny = { ...itemToBeDropped };

	// deleting oldies
	delete droppedItemSource.id;

	// get grounded position
	const groundPosition = await this.invokeClientEvent(`getGroundZPosition`, { position: this.position })!;

	// Creating the new drop item
	const droppedItem: DroppedItem = {
		...droppedItemSource,
		droppedBy: this.info.username,
		droppedAt: new Date(),
		dimension: this.dimension,
		position: new mp.Vector3(this.position.x, this.position.y, groundPosition)
	};

	// adding new
	droppedItem.droppedBy = this.info.username;
	droppedItem.position = new mp.Vector3(this.position.x, this.position.y, groundPosition);
	droppedItem.dimension = this.dimension;

	// removing from current inventory
	this.info.inventory.splice(indexItem, 1);

	// finally..
	const droppedMarker = mp.items.drop(droppedItem);

	mp.players.forEachLoggedIn((p: PlayerMp) => {
		if (!isInRange(p.position, droppedMarker!.position, MAX_PICKUP_ITEM_RANGE)) return;
		p.updateInventoryInterface();
		p.triggerClientEvent('disableNearbyObjectCollisions');
	});

	return true;
};

const itemIsExpired = (date: Date) => {
	const diff = moment(new Date()).diff(new Date(date), 'minutes');

	if (diff >= 0) {
		return true;
	}

	return false;
};

mp.Player.prototype.removeExpiredItems = function () {
	try {
		let updateInventoryInterface = false;

		// Removing expired items from the player's inventory.

		const clonedInventory = [...this.info.inventory];

		clonedInventory.forEach((item: InventoryItem) => {
			if (!item.expiresAt) return;
			if (itemIsExpired(item.expiresAt)) {
				const index = clonedInventory.findIndex((i) => i.id === item.id);

				if (index == -1) return;

				clonedInventory.splice(index, 1);

				const itemMeta = mp.items.getItem(item.itemId);

				if (!itemMeta) return;
				if (!itemMeta.callbacks) return;
				if (!itemMeta.callbacks.expired) return;

				// Calling the callback
				itemMeta.callbacks.expired!(this, 'inventory', {
					data: item,
					separated: false,
					item: itemMeta,
					actioner: this,
					target: this
				})!;
			}
		});

		if (clonedInventory.length !== this.info.inventory.length) {
			// if something changed
			this.info.inventory = clonedInventory;
			updateInventoryInterface = true;
		}

		// Removing expired items from the player's separated inventory

		if (this.vars.separateInventory && this.vars.separateInventory.items) {
			const clonedSeparatedInventory = [...this.vars.separateInventory.items];

			clonedSeparatedInventory.forEach((item: SeparatedItem) => {
				if (!item.expiresAt) return;
				if (itemIsExpired(item.expiresAt)) {
					const index = clonedSeparatedInventory.findIndex((i) => i.id === item.id);

					if (index == -1) return;

					clonedSeparatedInventory.splice(index, 1);

					const itemMeta = mp.items.getItem(item.itemId);

					if (!itemMeta) return;
					if (!itemMeta.callbacks) return;
					if (!itemMeta.callbacks.expired) return;

					// Calling the callback
					itemMeta.callbacks.expired!(this, 'separated', {
						data: item,
						separated: true,
						item: itemMeta,
						actioner: this,
						target: this
					})!;
				}
			});

			if (clonedSeparatedInventory.length !== this.vars.separateInventory.items.length) {
				this.vars.separateInventory.items = clonedSeparatedInventory;
				mp.events.call('onSeparateInventoryUpdated', this, this.vars.separateInventory);
				updateInventoryInterface = true;
			}
		}

		return updateInventoryInterface;
	} catch (err) {
		logError('REMOVE_EXPIRED_ITEMS', err);
		return false;
	}
};

mp.Player.prototype.removeInvalidItems = function () {
	try {
		// Removing invalid items from the player's inventory.

		const clonedInventory = [...this.info.inventory];

		clonedInventory.forEach((item: InventoryItem) => {
			if (!mp.items.getItem(item.itemId)) {
				const index = clonedInventory.findIndex((i) => i.id === item.id);

				if (index == -1) return;

				clonedInventory.splice(index, 1);
			}
		});

		if (clonedInventory.length !== this.info.inventory.length) {
			// if something changed
			this.info.inventory = clonedInventory;
		}

		// Removing invalid items from the player's separated inventory

		if (this.vars.separateInventory !== null) {
			const clonedSeparatedInventory = [...this.vars.separateInventory.items];

			clonedSeparatedInventory.forEach((item: SeparatedItem) => {
				if (!mp.items.getItem(item.itemId)) {
					const index = clonedSeparatedInventory.findIndex((i) => i.id === item.id);

					if (index == -1) return;

					clonedSeparatedInventory.splice(index, 1);
				}
			});

			if (clonedSeparatedInventory.length !== this.vars.separateInventory.items.length) {
				this.vars.separateInventory.items = clonedSeparatedInventory;
				mp.events.call('onSeparateInventoryUpdated', this, this.vars.separateInventory);
			}
		}

		return true;
	} catch (err) {
		logError('REMOVE_INVALID_ITEMS', err);
		return false;
	}
};

mp.Player.prototype.closeInventory = function () {
	this.triggerClientEvent('setInventoryOpened', { boolean: false });
};

declare global {
	type paramsgetItemByMatch = {
		itemId?: number;
		id?: string;
		pageId?: number;
		slotId?: number;
	};

	type DestinationInventory = {
		page: number;
		slot: number;
	};

	interface PlayerMp {
		giveItem(itemId: number, quantity: number, meta: Record<string, ExpectedAny>, expiresAt?: Date | null, destination?: DestinationInventory | null): Promise<InventoryItem | null>;
		getInventoryItemMatch(params: paramsgetItemByMatch): InventoryItem | null;
		updateItem(id: string, object: Partial<InventoryItem>): void;
		reduceItem(id: string, quantity: number): void;
		deleteItem(id: string): void;
		dropItem(id: string): void;
		getInventoryPages(): Array<InventoryPage>;
		getNumberOfAvailableInventorySlots(): number;
		findAvailableInventorySlot(): { slot: number; page: number } | null;
		checkEnoughSpaceForItem(itemId: number, quantity: number): boolean;
		findStackableInventorySlot(itemId: number, quantity: number): { slot: number; store: string } | null;
		updateInventoryInterface(): void;
		closeInventory(): void;
		removeExpiredItems(): boolean;
		removeInvalidItems(): boolean;
	}
}

export {};
