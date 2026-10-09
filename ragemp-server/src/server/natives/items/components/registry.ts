import { CreateDroppedItem, createItemObject, DroppedItem, DroppedItemMarker, itemObject } from './types';
import { createLanguagePack } from '@vmp/i18n';
import { red, yellow } from 'colorette';
import { v4 as uuidv4 } from 'uuid';
import { isInRange } from '@server/utils/helpers';
import { create3DTextLabel, delete3DTextLabel } from '@server/natives/text3D/components/functions';
import { createObject, deleteObject } from '@server/natives/objects/components/functions';
import { MAX_PICKUP_ITEM_RANGE } from '@server/legacy/inventory/components/utils';

export const SAME_DROP_ITEM_MARKER_RANGE = 4;

export class ItemsRegistry {
	private items: itemObject[] = [];
	private droppedItems: DroppedItem[] = [];
	private droppedItemMarkers: DroppedItemMarker[] = [];

	public create(item: createItemObject) {
		const {
			id,
			name,
			description,
			callbacks,
			type = 1,
			limit = 120,
			usable = true,
			droppable = true,
			dispensable = true,
			tradable = true,
			stackable = true,
			notDepositable = false,
			unDestroyable = false,
			getProperties = null
		} = item;

		if (this.items.find((i) => i.id === id)) {
			console.error(`${red('[ERROR]')} Item id already registered: ${yellow(id)}`);
			process.exit(1);
		}

		const entry: itemObject = {
			id,
			callbacks,
			type,
			limit,
			usable,
			droppable,
			dispensable,
			tradable,
			stackable,
			notDepositable,
			unDestroyable
		};

		if (getProperties) {
			entry.getProperties = getProperties;
		}

		// If they defined any other languages..
		const languages = item.languages ? item.languages : {};

		createLanguagePack(`item:${id}`, {
			name,
			description,
			...languages
		});

		return this.items.push(entry);
	}

	public getAllDroppedItems() {
		return this.droppedItems;
	}

	public getAllDroppedMarkers() {
		return this.droppedItemMarkers;
	}

	public drop(item: CreateDroppedItem) {
		const obj = {
			...item,
			id: uuidv4()
		};

		// Adding the item to the list of dropped items

		this.droppedItems.push(obj);

		// Finding out if there's any other Text 3D in this area.

		let nearbyMarker: DroppedItemMarker | null = null;
		let nearbyMarkerIndex: number | null = null;

		this.droppedItemMarkers.forEach((marker: DroppedItemMarker, ix: number) => {
			if (nearbyMarker !== null) return; // Already found one
			if (marker.dimension !== obj.dimension) return; // Diferent dimension
			if (!isInRange(marker.position, obj.position, SAME_DROP_ITEM_MARKER_RANGE)) return; // Too far away
			nearbyMarker = { ...marker };
			nearbyMarkerIndex = ix;
		});

		if (nearbyMarker === null) {
			// If there is none nearby, let's create it.
			const markerTempObject = {
				id: uuidv4(),
				dimension: obj.dimension,
				position: obj.position,
				items: [obj.id]
			};
			// Adding it to the array
			this.droppedItemMarkers.push(markerTempObject);

			// Updating it locally here
			nearbyMarker = this.droppedItemMarkers.find((m) => m.id === markerTempObject.id)!;
			nearbyMarkerIndex = this.droppedItemMarkers.findIndex((m) => m.id === markerTempObject.id)!;
		} else {
			this.droppedItemMarkers[nearbyMarkerIndex!].items.push(obj.id);
			// Updating the dropped item's position so when fetching for inventory is accurate.
			const itemIndex = this.droppedItems.findIndex((i: DroppedItem) => i.id === obj.id);
			this.droppedItems[itemIndex].position = this.droppedItemMarkers[nearbyMarkerIndex!].position;
		}

		this.createDropMarkerText3D({
			id: nearbyMarker.id,
			position: nearbyMarker.position,
			dimension: nearbyMarker.dimension
		});

		this.createDropMarkerObject({
			id: nearbyMarker.id,
			position: nearbyMarker.position,
			dimension: nearbyMarker.dimension
		});

		return nearbyMarker;
	}

	public createDropMarkerText3D({ position, id, dimension }: { position: Vector3; id: string; dimension: number }) {
		const nearbyMarker = this.droppedItemMarkers.find((entry: DroppedItemMarker) => entry.id === id);
		const quantity = nearbyMarker!.items.length;
		delete3DTextLabel(`ItemDroppedMarker:${id}`); // Deleting any existing ones. If there's none is fine, we just return false.
		const text3D = `~w~${quantity === 1 ? 'One item' : `${quantity} items`} dropped here~n~~c~Press I to pick ${quantity === 1 ? 'it' : 'them'} up`;
		create3DTextLabel({
			identifier: `ItemDroppedMarker:${id}`,
			text: text3D,
			position: new mp.Vector3(position.x, position.y, position.z + 0.6),
			dimension,
			drawDistance: MAX_PICKUP_ITEM_RANGE
		});
	}

	public createDropMarkerObject({ position, id, dimension }: { position: Vector3; id: string; dimension: number }) {
		deleteObject(`ItemDroppedMarker:${id}`); // Deleting any existing ones. If there's none is fine, we just return false.
		createObject({
			identifier: `ItemDroppedMarker:${id}`,
			model: mp.joaat('prop_big_bag_01'),
			position: new mp.Vector3(position.x, position.y, position.z + 0.18),
			rotation: new mp.Vector3(0, 0, 0),
			alpha: 255,
			dimension,
			vars: {
				disableCollision: true
			}
		});
	}

	public getDropById(id: string) {
		return this.droppedItems.find((i: DroppedItem) => i.id === id);
	}

	public deleteDroppedItemById(id: string) {
		// Delete it from the array of dropped items
		const itemIndex = this.droppedItems.findIndex((i: DroppedItem) => i.id == id);
		if (itemIndex == -1) return false; // Couldn't find it.
		const clonedDroppedItem: DroppedItem = { ...this.droppedItems[itemIndex] };
		this.droppedItems.splice(itemIndex, 1);

		// Updating the inventory interface for any players near it so they don't see it avaialble to pick
		mp.players.forEachLoggedInRange(clonedDroppedItem.position, MAX_PICKUP_ITEM_RANGE, (player: PlayerMp) => {
			if (player.vars.inventoryOpened === false) return;
			if (player.dimension !== clonedDroppedItem.dimension) return;
			player.updateInventoryInterface();
		});

		// Remove it from any dropped marker and update the dropper marker accordingly.
		const markerIndex = this.droppedItemMarkers.findIndex((m: DroppedItemMarker) => m.items.includes(id));
		if (markerIndex === -1) return false;
		const itemMarkerIndex = this.droppedItemMarkers[markerIndex].items.findIndex((i: string) => i === id);
		this.droppedItemMarkers[markerIndex].items.splice(itemMarkerIndex, 1); // Removing it from that array.

		// If the dropped item marker now is empty let's delete it or update the 3D Text

		const clonedMarker = { ...this.droppedItemMarkers[markerIndex] };

		if (this.droppedItemMarkers[markerIndex].items.length < 1) {
			delete3DTextLabel(`ItemDroppedMarker:${clonedMarker.id}`);
			deleteObject(`ItemDroppedMarker:${clonedMarker.id}`);
			this.droppedItemMarkers.splice(markerIndex, 1);
		} else {
			this.createDropMarkerText3D({
				id: clonedMarker.id,
				position: clonedMarker.position,
				dimension: clonedMarker.dimension
			});
		}

		return true;
	}

	public getNearbyDrops(pos: Vector3, range = 10) {
		return this.droppedItems.filter((drop: DroppedItem) => isInRange(drop.position, pos, range));
	}

	public deleteNearbyDrops(pos: Vector3, range = 10) {
		const nearbyMarkers = range === 999 ? [...this.droppedItemMarkers] : [...this.droppedItemMarkers].filter((drop: DroppedItemMarker) => isInRange(drop.position, pos, range));
		const itemsDeleted: Array<string> = [];

		// Deleting the items
		nearbyMarkers.forEach((m: DroppedItemMarker) => {
			m.items.forEach((i: string) => {
				const index = this.droppedItems.findIndex((item: DroppedItem) => item.id === i);
				if (index === -1) return;
				this.droppedItems.splice(index, 1);
				itemsDeleted.push(i);
			});
		});

		// Deleting all the markers
		nearbyMarkers.forEach((drop) => {
			const index = this.droppedItemMarkers.findIndex((i: DroppedItemMarker) => i.id == drop.id);
			if (index == -1) return null; // Couldn't find it.
			deleteObject(`ItemDroppedMarker:${drop.id}`); // delete object
			delete3DTextLabel(`ItemDroppedMarker:${drop.id}`); // delete 3d Text
			this.droppedItemMarkers.splice(index, 1); // deleting it from the array.
			if (range !== 999) {
				// We will do a foreach in range only if range is not 999
				mp.players.forEachLoggedInRange(drop.position, MAX_PICKUP_ITEM_RANGE, (entity: PlayerMp) => {
					if (!entity.vars.inventoryOpened) return false;
					entity.updateInventoryInterface();
					return true;
				});
			}
			return;
		});

		if (range === 999) {
			// If range is global then we do a complete foreach.
			mp.players.forEachLoggedIn((entity: PlayerMp) => {
				if (!entity.vars.inventoryOpened) return false;
				entity.updateInventoryInterface();
				return true;
			});
		}

		return itemsDeleted;
	}

	public getItem(id: number) {
		const itemMatch = this.items.find((item: itemObject) => item.id === id);
		return itemMatch;
	}

	public getItems() {
		return this.items;
	}

	public getSize() {
		return this.items.length;
	}
}

mp.items = new ItemsRegistry();

declare global {
	interface Mp {
		items: ItemsRegistry;
	}
}
