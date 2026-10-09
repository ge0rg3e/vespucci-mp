import { logError, sliceIntoChunks } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

// Getting the list of data..
import { Clothes } from './core';

// Dependencies
import { defaultValues } from '@server/definitions/clothes/defaults';
import clothes from '@modules/database/natives/clothes/repository';
import { Configurations } from '@server/legacy/configurations/components/core';
import { ClothesAttributes } from '@modules/database/natives/clothes/model/types';
import { CharacterClothes } from '@modules/database/game/accounts/model/types';
import { getLanguagePack } from '@vmp/i18n';
import { InventoryItem } from '@server/legacy/inventory/components/types';
import { equipClothing, getSlotsRequiredForClothing, mapClothesSingularToPlural } from './functions';
import { onClothingItemUsed } from './items';

rpc.register('clothing:getDefaultValues', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { gender } = JSON.parse(args);

		const defaultVals = defaultValues[gender === 'male' ? 'male' : 'female'];

		const newClothes = {
			top: defaultVals.top,
			torso: defaultVals.torso,
			undershirt: defaultVals.undershirt,
			pants: defaultVals.pants,
			shoes: defaultVals.shoes,
			hat: defaultVals.hat,
			glasses: defaultVals.glasses,
			mask: defaultVals.mask,
			accessory: defaultVals.accessory,
			earings: defaultVals.earings,
			watches: defaultVals.watches,
			bracelets: defaultVals.bracelets,
			backpack: defaultVals.backpack
		};

		return newClothes;
	} catch (err) {
		await logError('GET_DEFAULTS_CLOTHING', err, { player: player && player.info && player.info.username ? player.info.username : 'Not logged in' });
		return {};
	}
});

rpc.on('clothing:applyPedClothing', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.

	try {
		const { clothes } = JSON.parse(args);

		player.updateClothes(clothes);

		return true;
	} catch (err) {
		await logError('PREVIEW_CLOTHING', err, { player: player.info.username });
		return false;
	}
});

rpc.on('manageClothes:requestData', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (!player.checkPermission('feature.useClothesManagement')) return false;

		const initialClothesArr = [...Clothes].slice(0, 100);
		const clothesLeft = [...Clothes].slice(100, Clothes.length);

		player.triggerSocketEvent('manageClothes:receiveInitialData', {
			clothes: initialClothesArr,
			clothing: player.info.clothes,
			permissions: {
				use: player.checkPermission('feature.useClothesManagement'),
				update: player.checkPermission('feature.updateClothes'),
				delete: player.checkPermission('feature.deleteClothes'),
				create: player.checkPermission('feature.createClothes')
			},
			lastDefaultGameClothingIds: Configurations.lastDefaultGameClothingIds
		});

		// Sending the chunks left..
		const chunks = sliceIntoChunks(clothesLeft, 2000);
		chunks.forEach((chunk: ExpectedAny) => player.triggerSocketEvent('manageClothes:receiveChunkClothesData', chunk));

		return true;
	} catch (err) {
		await logError('MANAGE_CLOTHING_REQUEST_DATA', err, { player: player?.info.username });
		return false;
	}
});

rpc.on('manageClothes:saveCurrentOutfit', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	if (!player.checkPermission('feature.useClothesManagement')) return false;

	try {
		const { clothes } = JSON.parse(args);
		player.updateClothes(clothes);
		player.saveClothes(clothes);
		player.createAmplitudeEvent(`Saved clothing outfit`, {
			from: 'clothesManagement'
		});
		return true;
	} catch (err) {
		await logError('SAVE_CLOTHES', err, { player: player.info.username });
		return false;
	}
});

rpc.on('manageClothes:leaveSystem', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	if (!player.checkPermission('feature.useClothesManagement')) return false;
	try {
		const { clothesUpdated } = JSON.parse(args);
		player.triggerClientEvent('clothesBusines:DestroyScene');
		player.model = mp.joaat(player.info.clothes.model);
		player.updateClothes(player.info.clothes);
		player.createAmplitudeEvent(`Closed clothes management`, {
			clothesUpdated: clothesUpdated > 0 ? clothesUpdated : 'None'
		});
		player.dimension = 0;
		player.setDialogCooldown(3000);

		// Reset the business used..
		player.updateVars({
			businessUsed: null
		});

		return true;
	} catch (err) {
		await logError('CLOTHES_MANAGEMENT_LEAVE_SYSTEM', err, { player: player.info.username });
		return false;
	}
});

rpc.on('manageClothes:deleteClothing', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	if (!player.checkPermission('feature.useClothesManagement')) return false;
	if (!player.checkPermission('feature.updateClothes')) return false;
	if (!player.checkPermission('feature.deleteClothes')) return false;

	try {
		const { clothesToDelete } = JSON.parse(args);

		player.createAmplitudeEvent(`Deleted clothing from clothes management`, {
			clothesToDelete: clothesToDelete.map((c: ClothesAttributes) => ({
				drawableId: c.drawableId,
				textureId: c.textureId,
				isAddon: c.isAddon,
				id: c.id
			}))
		});

		for (let index = 0; index < clothesToDelete.length; index++) {
			const c = clothesToDelete[index];
			await clothes.destroy({
				where: {
					id: c.id
				}
			});
		}

		clothesToDelete.forEach((clothing: ExpectedAny) => {
			const index = Clothes.findIndex((c) => c.id === clothing.id);
			if (index === -1) return false;
			Clothes.splice(index, 1);
			return true;
		});

		return true;
	} catch (err) {
		await logError('DELETE_CLOTHING_FROM_CLOTHES_MANAGEMENT', err, { player: player.info.username });
		return false;
	}
});

rpc.on('manageClothes:createClothing', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	if (!player.checkPermission('feature.useClothesManagement')) return false;
	if (!player.checkPermission('feature.updateClothes')) return false;
	if (!player.checkPermission('feature.createClothes')) return false;

	try {
		const { clothesToCreate } = JSON.parse(args);

		const bulkCreate: ExpectedAny = [];

		for (let cIndex = 0; cIndex < clothesToCreate.length; cIndex++) {
			const c = clothesToCreate[cIndex];

			for (let index = 0; index < c.textures; index++) {
				const textureId = index;

				const defaultMeta: ExpectedAny = {};

				if (c.type === 'tops') {
					defaultMeta.torsoRecommended = c.gender === 'female' ? 26255 : 26258; // these are IDs.
					defaultMeta.undershirtCompatible = false;
				}

				bulkCreate.push({
					drawableId: c.drawableId,
					textureId,
					type: c.type,
					gender: c.gender,
					isAddon: c.isAddon,
					dlcName: c.dlcName,
					meta: JSON.stringify(defaultMeta)
				});
			}
		}

		// Create the new clothes..
		const result = await clothes.createBulkClothes(bulkCreate);

		// Preparing the clothes array
		const newClothes = result.map((c: ExpectedAny) => {
			const d = c.dataValues;
			return {
				...d,
				meta: JSON.parse(d.meta)
			};
		});

		// Add them to the global array
		newClothes.forEach((c) => Clothes.push(c));

		// Add them to the interface of the user
		const chunks = sliceIntoChunks(newClothes, 2000);
		chunks.forEach((chunk: ExpectedAny) => player.triggerSocketEvent('manageClothes:receiveChunkClothesData', chunk));

		// Show success notify
		player.toast({
			message: 'Clothes created successfully',
			type: 'success'
		});

		// Amplitude
		player.createAmplitudeEvent(`Created clothing using clothes management`, {
			clothesToCreate
		});

		return true;
	} catch (err) {
		await logError('CREATE_DLC_CLOTHING', err, { player: player.info.username });
		player.toast({ type: 'error', message: 'Failed to create new clothes due to server error' });
		return false;
	}
});

rpc.register(`buyClothes:getClothingTopDetails`, async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false;
		let { id } = JSON.parse(args);

		if (id === 'current') {
			const top = player.getCurrentClothingComponentData('top');
			if (!top) throw new Error(`Failed to find current top.`);
			id = top.id;
		}

		const data = Clothes.find((c: Clothes) => c.id === id);
		if (!data) return null;

		const torso = Clothes.find((c: Clothes) => c.id === data.meta.torsoRecommended);
		if (!torso) return null;

		return {
			undershirtCompatible: data.meta.undershirtCompatible,
			torsoRecommended: torso
		};
	} catch (err) {
		return null;
	}
});

rpc.on('buyClothes:requestData', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (!player.vars.businessUsed) return false;

		player.triggerSocketEvent('buyClothes:receivePlayerData', {
			clothes: [],
			clothing: player.info.clothes,
			balance: {
				cash: player.info.money,
				beachCoins: player.info.beachCoins
			},
			lastDefaultGameClothingIds: Configurations.lastDefaultGameClothingIds
		});

		// Sending the chunks
		const clothesForSale = Clothes.filter((c) => c.isAvailable === true && c.type !== 'torsos');

		const chunks = sliceIntoChunks(clothesForSale, 2000);
		chunks.forEach((chunk: ExpectedAny) => player.triggerSocketEvent('buyClothes:receiveChunkClothesData', chunk));

		return true;
	} catch (err) {
		await logError('BUY_CLOTHES_REQUEST_DATA', err, { player: player?.info.username });
		return false;
	}
});

rpc.on('buyClothes:leaveSystem', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		player.triggerClientEvent('clothesBusines:DestroyScene');
		player.updateClothes(player.info.clothes);
		player.createAmplitudeEvent(`Stopped buying clothes`);
		player.dimension = 0;
		player.setDialogCooldown(3000);
		player.updateVars({
			businessUsed: null
		});

		return true;
	} catch (err) {
		await logError('CLOTHES_LEAVE_SYSTEM', err, { player: player.info.username });
		return false;
	}
});

rpc.on('buyClothes:buyItem', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const { id, currency }: { id: number; currency: string } = JSON.parse(args); // { id: 4, currency: "cash", clothingType: "top" }

		// Get the language..
		const lang = getLanguagePack(`BusinessClothes:BuyCallback`, player.info.language);

		// Get the clothing
		const newClothing = Clothes.find((i: Clothes) => i.id === id);
		if (!newClothing) throw new Error(`Failed to find clothing ID ${id}`);

		// If is not for sale anymore due to an admin change
		if (newClothing.isAvailable === false) return player.toast({ type: 'error', message: lang.get('NotForSale') });

		// Does he have enough money?
		if (currency === 'cash' && player.info.money < newClothing.price) return player.toast({ message: lang.get('NotEnoughMoney'), type: 'error' });
		if (currency === 'bc' && player.info.beachCoins < newClothing.bcPrice) return player.toast({ message: lang.get('NotEnoughBC'), type: 'error' });

		// Does he have enough space in his inventory in case of clothes swap?
		const slotsRequired = getSlotsRequiredForClothing(player, newClothing);
		if (slotsRequired !== 0) return player.toast({ message: lang.get('NoSpaceToMoveCurrentClothes', { slotsNeeded: slotsRequired }), type: 'error' });

		// Take his money or bc
		if (currency === 'cash') {
			player.takeMoney(newClothing.price);
		} else if (currency === 'bc') {
			player.takeBeachCoins(newClothing.bcPrice);
		}

		// Give the new clothing to the player and also move old clothing to his inventory
		await equipClothing(player, newClothing, null);

		// Update currency of player
		player.triggerBrowserEvent('buyClothes:receiveNewBalance', { cash: player.info.money, beachCoins: player.info.beachCoins });

		// Update clothing of player
		player.triggerBrowserEvent('buyClothes:receiveNewClothing', { ...player.info.clothes });

		// Log it
		player.createAmplitudeEvent('Bought clothing', {
			type: newClothing.type,
			id: newClothing.id,
			drawableId: newClothing.drawableId,
			textureId: newClothing.textureId,
			name: newClothing.name,
			isAddon: newClothing.isAddon,
			price: newClothing.price,
			bcPrice: newClothing.bcPrice,
			currency
		});

		// Toast
		player.toast({ message: lang.get('SuccessBought'), type: 'success' });
		return true;
	} catch (err) {
		await logError('BUY_CLOTHING_COMPONENT', err, { player: player.info.username });
		return false;
	}
});

// Action: Player drags clothing from his inventory onto himself

rpc.register('clothing:equipClothingItem', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		const { id, remoteId, draggedClothingType }: { remoteId: number; id: string; draggedClothingType: string } = JSON.parse(args);

		// Get the target player
		const target = mp.players.at(remoteId);
		if (!target) return false;

		// Getting the item..
		const itemUsed = target.info.inventory.find((i: InventoryItem) => i.id === id);
		if (!itemUsed) return false;

		// Item is not item id 3 by mistake??.
		if (itemUsed.itemId !== 3) return false;

		// Getting the clothes data
		const clothing = Clothes.find((c: Clothes) => c.id === itemUsed.meta.clothingId);
		if (!clothing) return false;

		// Converting the type..
		const clothingType = mapClothesSingularToPlural(draggedClothingType);

		// He dragged tops to the pants.
		if (clothing.type !== clothingType) return false;

		// Use the clothing..
		onClothingItemUsed(target, { data: itemUsed });

		return true;
	} catch (err) {
		await logError(`EQUIP_CLOTHING_ITEM`, err, { player: player?.info.username });
		return false;
	}
});

// Action: Player removes by right click the clothing from his chharacter

rpc.on('clothing:removePedClothing', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { type, remoteId }: { remoteId: number; type: keyof CharacterClothes } = JSON.parse(args);

		// Get the target player
		const target = mp.players.at(remoteId);
		if (!target) return false;

		// Get the language..
		const lang = getLanguagePack(`Clothes:EquipClothingCallback`, player.info.language);

		// Getting data
		const clothingData = target.getCurrentClothingComponentData(type);
		if (!clothingData) return false;

		const oldUndershirt = player.getCurrentClothingComponentData('undershirt');

		// Make sure he has enough spaces to do so..
		const spacesRequired = type === 'top' && oldUndershirt ? 2 : 1;
		const emptySlots = target.getNumberOfAvailableInventorySlots();
		if (emptySlots < spacesRequired) return player.toast({ type: 'error', message: lang.get('NoSpaceToMoveCurrentClothes', { slotsNeeded: spacesRequired }) });

		// Give the old item back
		target.giveItem(3, 1, { clothingId: clothingData.id });

		// Remove the component clothing
		target.resetClothingComponentData(type);

		// If is removing the top and he has an undershirt..
		if (oldUndershirt && type === 'top') {
			// Giving the old undershirt back
			target.giveItem(3, 1, { clothingId: oldUndershirt.id });

			// Resetting the component
			target.resetClothingComponentData('undershirt');
		}

		// Update clothing to make appearance happen
		target.updateClothes(target.info.clothes);

		// Refresh interface
		target.updateInventoryInterface();

		return true;
	} catch (err) {
		await logError('REMOVE_PED_CLOTHING', err, { player: player?.info.username });
		return false;
	}
});

// Action: Player drags the clothing from himself to inventory

rpc.register('clothing:draggedClothingToInventory', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	// {  remoteId, id, slot , page } - id is "Accessory"
	try {
		if (!player) return false; // Avoiding TS Error.

		const { remoteId, id, slot, page }: { remoteId: number; id: keyof CharacterClothes; slot: number; page: number } = JSON.parse(args);

		// Get the target player
		const target = mp.players.at(remoteId);
		if (!target) return false;

		// Get the language..
		const lang = getLanguagePack(`Clothes:EquipClothingCallback`, player.info.language);

		// Get current clothing
		const currentClothing = target.getCurrentClothingComponentData(id);
		if (!currentClothing) return false;

		// Variables
		const undershirtUsed = target.getCurrentClothingComponentData('undershirt');
		const emptySlots = target.getNumberOfAvailableInventorySlots();

		// Make sure he has enough spaces to do so..
		const spacesRequired = currentClothing.type === 'tops' && undershirtUsed ? 2 : 1;
		if (emptySlots < spacesRequired) return player.toast({ type: 'error', message: lang.get('NoSpaceToMoveCurrentClothes', { slotsNeeded: spacesRequired }) });

		// Remove current clothing
		target.resetClothingComponentData(id);

		// Move it to his inventory..
		target.giveItem(3, 1, { clothingId: currentClothing.id }, null, { slot, page });

		// Move undershirt also if he removes the top.
		if (currentClothing.type === 'tops' && undershirtUsed) {
			// Remove it from his clothing
			target.resetClothingComponentData('undershirt');

			// Give it to his inventory
			target.giveItem(3, 1, { clothingId: undershirtUsed.id }, null, {
				slot: slot + 1,
				page
			});
		}

		// Refresh interface
		player.updateInventoryInterface();

		// Update apperance
		target.updateClothes(target.info.clothes);

		return true;
	} catch (err) {
		await logError(`DRAG_CLOTHING_TO_INVENTORY`, err, { player: player?.info.username });
		return false;
	}
});
