import { AccountLanguage } from '@modules/database/game/accounts/model/types';
import { defaultValues } from '@server/definitions/clothes/defaults';
import { Clothes } from '@server/legacy/businesses/systems/clothes/components/core';
import { DroppedItem } from '@server/natives/items/components/types';
import { getItemDescription, getItemName } from '@server/natives/items/components/utils';
import { findPlayerAt, logError } from '@server/utils/helpers';
import { InventoryItem } from './types';
import { getLanguagePack } from '@vmp/i18n';
import { getNativeWeapon } from '@server/natives/weapons/components/core';

export const MAX_PICKUP_ITEM_RANGE = 3;

export const getInventoryDataForPlayer = (from: number) => {
	const target = findPlayerAt(from);
	if (!target) return null;

	// Cleaning up the inventory
	target.removeExpiredItems();
	target.removeInvalidItems();

	return {
		remoteInfo: target.info,
		remotePages: target.getInventoryPages(),
		remoteSeparateInventory: target.vars.separateInventory,
		remoteExtras: {
			developer: target.isDeveloper(),
			admin: target.getAdminLevel()
		},
		remoteClothes: getClothesFormatted(target),
		remoteId: target.id
	};
};

export const getItemMetaBulk = (langId: AccountLanguage, data: ExpectedAny, pickups: Array<DroppedItem>) => {
	const localMeta: ExpectedAny = {};
	const fetchItemMetaForIds: Array<number> = [];

	// We get meta for all items in the player's inventory.
	data.remoteInfo.inventory.forEach((i: InventoryItem) => {
		if (fetchItemMetaForIds.includes(i.itemId)) return;
		fetchItemMetaForIds.push(i.itemId);
	});

	// We need to get the meta for all items in our remote inventory (aka the house inventory)
	if (data.remoteSeparateInventory) {
		data.remoteSeparateInventory.items.forEach((i: SeparatedItem) => {
			if (fetchItemMetaForIds.includes(i.itemId)) return;
			fetchItemMetaForIds.push(i.itemId);
		});
	}

	// Also let's fetch meta for items that are on the ground.
	pickups.forEach((i: DroppedItem) => {
		if (fetchItemMetaForIds.includes(i.itemId)) return;
		fetchItemMetaForIds.push(i.itemId);
	});

	// Now let's do the magic..
	fetchItemMetaForIds.forEach((i: number) => {
		// This item has already been fetched.
		if (localMeta[`item:${i}`]) return;

		// Get the item object from our gamemode.
		const item: ExpectedAny = { ...mp.items.getItem(i) };

		// Delete the callbacks so we don't pass them over.
		delete item!.callbacks;

		// Now let's return the meta..
		localMeta[`item:${i}`] = {
			...item,
			// We got the item name and description
			name: getItemName(i, langId),
			description: getItemDescription(i, langId)
		};
	});

	return localMeta;
};

export const getClothesMeta = (player: PlayerMp, data: ExpectedAny, pickups: Array<DroppedItem>) => {
	const ids: Array<number> = [];
	const meta: ExpectedAny = {};

	const separatedInventory = data.remoteSeparateInventory ? data.remoteSeparateInventory.items : [];

	// Iterating each clothing item from the inventory and getting the possible meta
	[...player.info.inventory, ...pickups, ...separatedInventory].forEach((item: ExpectedAny) => {
		if (item.itemId !== 3) return; // Not an clothing item.
		const id = item.meta.clothingId; // the clothing id.
		if (ids.includes(id)) return;
		ids.push(id);
	});

	// Iterate each clothing component on the player and getthing the meta
	const clothings: ExpectedAny = defaultValues[player.info.clothes.gender === 'male' ? 'male' : 'female'];
	Object.keys(clothings).forEach((cloth: ExpectedAny) => {
		// Check if is used..
		const isUsed = player.isClothingComponentUsed(cloth);
		if (!isUsed) return;

		// Get current clothing
		const data = player.getCurrentClothingComponentData(cloth);
		if (!data) return;

		// Add it if not used
		const id = data?.id;
		if (ids.includes(id)) return;
		ids.push(id);
	});

	ids.forEach((id: number) => {
		const data = Clothes.find((c: Clothes) => c.id === id);
		if (!data) return;

		if (meta[`clothes:${data.id}`]) return; // already exists somehow.

		meta[`clothes:${data.id}`] = {
			type: data.type,
			name: data.name,
			category: data.category,
			dlcName: data.dlcName,
			meta: data.meta,
			drawableId: data.drawableId,
			textureId: data.textureId,
			isAddon: data.isAddon,
			gender: data.gender
		};
	});

	return meta;
};

export const getWeaponsMeta = (player: PlayerMp, data: ExpectedAny, pickups: Array<DroppedItem>) => {
	const ids: Array<number> = [];
	const meta: ExpectedAny = {};

	// Format the separated inventory...
	const separatedInventory = data.remoteSeparateInventory ? data.remoteSeparateInventory.items : [];

	// Iterating each clothing item from the inventory and getting the possible meta
	[...player.info.inventory, ...pickups, ...separatedInventory].forEach((item: ExpectedAny) => {
		if (item.itemId !== 25) return; // Not a weapon item.

		const id = item.meta.weaponId; // the weapon id.
		if (ids.includes(id)) return;
		ids.push(id);
	});

	// Get the weapons off the player too.
	player.info.weapons.forEach((weapon) => {
		if (ids.includes(weapon.weaponId)) return;

		// Add it.
		ids.push(weapon.weaponId);
	});

	ids.forEach((id: number) => {
		const data = getNativeWeapon({ id });
		if (!data) return;

		if (meta[`weapons:${data.id}`]) return; // already exists.

		meta[`weapons:${data.id}`] = {
			displayName: data.displayName,
			description: data.description,
			group: data.group,
			ammoType: data.ammoType
		};
	});

	return meta;
};

export const getClothesFormatted = (player: PlayerMp) => {
	const clothes: ExpectedAny = {};

	// Iterate each clothing component on the player and getthing the meta
	const clothings: ExpectedAny = defaultValues[player.info.clothes.gender === 'male' ? 'male' : 'female'];
	Object.keys(clothings).forEach((cloth: ExpectedAny) => {
		// Check if is used..
		const isUsed = player.isClothingComponentUsed(cloth);

		// Get current clothing
		const data = isUsed ? player.getCurrentClothingComponentData(cloth) : null;

		clothes[cloth] = isUsed && data ? data.id : null;
	});

	return clothes;
};

const formatItemProperties = async (actioner: PlayerMp, itemId: number, meta: ExpectedAny) => {
	try {
		// Get the item data..
		const item = mp.items.getItem(itemId);

		// If item does not exist
		if (!item) return null;

		// There's no properties to get
		if (!item?.getProperties) return null;

		// Language...
		const lang = getLanguagePack(`item:${item.id}`, actioner.lang);

		// Get the properties formatted by item itself.
		const properties = await item.getProperties({ player: actioner, meta, shopId: null, lang, itemData: item });

		return properties;
	} catch (err) {
		await logError(`inventory.formatItemProperties`, err, { itemId, meta });
		return [];
	}
};

export const getPropertiesBulk = async (actioner: PlayerMp, data: ExpectedAny, pickups: Array<DroppedItem>) => {
	let meta: ExpectedAny = {}; // We will format it: "properties:type:id" => example: properties:pickup:1

	// We get the properties for all items in current inventory.
	for (let i = 0; i < data.remoteInfo.inventory.length; i++) {
		const currentItem = data.remoteInfo.inventory[i];
		// Get properties..
		const properties: ExpectedAny = await formatItemProperties(actioner, currentItem.itemId, currentItem.meta);

		// There's no properties returned
		if (!properties) continue;

		// console.log('inventory item', currentItem);
		meta[`properties:inventory:${currentItem.id}`] = properties;
	}

	// We get properties for remote inventory.
	if (data.remoteSeparateInventory) {
		for (let i = 0; i < data.remoteSeparateInventory.items.length; i++) {
			const currentItem = data.remoteSeparateInventory.items[i];
			// Get properties..
			const properties: ExpectedAny = await formatItemProperties(actioner, currentItem.itemId, currentItem.meta);

			// There's no properties returned
			if (!properties) continue;

			meta[`properties:remoteInventory:${currentItem.id}`] = properties;
		}
	}

	// Also the pickups.
	for (let i = 0; i < pickups.length; i++) {
		const currentItem = pickups[i];
		// Get properties..
		const properties: ExpectedAny = await formatItemProperties(actioner, currentItem.itemId, currentItem.meta);

		// There's no properties returned
		if (!properties) continue;

		// console.log('dropped item', currentItem);
		meta[`properties:pickup:${currentItem.id}`] = properties;
	}

	return meta;
};

export const updateInventoryInterfaceData = async (player: PlayerMp, remoteId: number) => {
	const data = getInventoryDataForPlayer(remoteId);
	const target = findPlayerAt(remoteId);

	if (!data || !target) return; // No matching data, the user will see an infinte loading.

	const nearbyPickups = mp.items.getNearbyDrops(target.position, MAX_PICKUP_ITEM_RANGE).slice(0, 40);

	// Get the meta (name, description) for items and clothes.
	const itemsMeta: ExpectedAny = getItemMetaBulk(player.info.language, data, nearbyPickups);
	const clothesMeta: ExpectedAny = getClothesMeta(target, data, nearbyPickups);
	const weaponsMeta: ExpectedAny = getWeaponsMeta(target, data, nearbyPickups);

	// Format their properties now..
	const properties = await getPropertiesBulk(player, data, nearbyPickups);

	// Local info formatted
	const localInfo: ExpectedAny = { ...player.info };

	// This should not be sent over the the game interface
	delete localInfo.inventory;
	delete localInfo.clothes;

	// console.log(data.remoteInfo.inventory);

	player.triggerSocketEvent(`inventory:receivedData`, {
		...data,
		nearbyPickups,
		localId: player.id,
		disconnected: false,
		localInfo,
		// Meta: Information for the displays. Example: Item names, clothes name, etc.
		meta: {
			...itemsMeta,
			...clothesMeta,
			...properties,
			...weaponsMeta
		}
	});
};
