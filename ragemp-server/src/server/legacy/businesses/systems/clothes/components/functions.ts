import { Configurations } from '@server/legacy/configurations/components/core';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { Clothes } from './core';

export const showOptionsDialog = (player: PlayerMp, businessId: number, actionId: string) => {
	const lang = getLanguagePack(`BusinessClothes:OptionsDialog`, player.info.language);

	const buttons = [
		{
			text: lang.get('Use'),
			key: 'F'
		}
	];

	if (player.checkPermission('feature.useClothesManagement')) {
		buttons.push({
			text: lang.get('Manage'),
			key: 'G'
		});
	}

	player.showPlayerDialog({
		dialogId: `clothesShopDialog`,
		icon: 'information',
		hideInSeconds: null,
		appearInSeconds: 1,
		type: 'message',
		buttons,
		title: lang.get('DialogTitle'),
		footer: player.getAdminLevel() !== 0 ? lang.get('DialogFooter', { id: businessId }) : undefined,
		content: lang.get('DialogContent'),
		payload: {
			businessId,
			actionId
		}
	});
};

export const getLastDrawableIdByGTA = (category: string, gender: string) => {
	const lastIds: ExpectedAny = Configurations.lastDefaultGameClothingIds;
	const value: ExpectedAny = lastIds[gender][category];
	return value;
};

export const mapClothesSingularToPlural = (key: string) => {
	const correctCategoryMappings: ExpectedAny = {
		top: 'tops',
		accessory: 'accessories',
		hat: 'hats',
		mask: 'masks',
		torso: 'torsos',
		backpack: 'backpacks',
		undershirt: 'undershirts'
	};

	return correctCategoryMappings[key] ? correctCategoryMappings[key] : key;
};

export const mapClothesPluralToSingular = (key: string) => {
	const correctCategoryMappings: ExpectedAny = {
		tops: 'top',
		accessories: 'accessory',
		hats: 'hat',
		masks: 'mask',
		torsos: 'torso',
		backpacks: 'backpack',
		undershirts: 'undershirt'
	};

	return correctCategoryMappings[key] ? correctCategoryMappings[key] : key;
};

// The number of inventory slots he needs to equip this clothing in case we have to swap clothes places.

export const getSlotsRequiredForClothing = (player: PlayerMp, clothing: Clothes) => {
	// Variables
	const emptySlots = player.getNumberOfAvailableInventorySlots();
	const singularClothingType = mapClothesPluralToSingular(clothing.type);

	// Dependencies
	const clothingSlotUsed = player.isClothingComponentUsed(singularClothingType);
	const undershitSlotUsed = player.isClothingComponentUsed('undershirt');

	// Does he have space for undershirt that we need to remove?
	if (clothing.type === 'tops' && clothing.meta.undershirtCompatible === false && emptySlots < 2 && undershitSlotUsed) {
		return 2;
	}

	if (clothingSlotUsed && emptySlots < 1) return 1;

	return 0;
};

export const equipClothing = async (player: PlayerMp, clothing: Clothes, preferredDestination: DestinationInventory | null = null) => {
	try {
		// Variables
		const type = mapClothesPluralToSingular(clothing.type);
		const clothingSlotUsed = player.isClothingComponentUsed(type);
		const undershitSlotUsed = player.isClothingComponentUsed('undershirt');

		// Getting the old data..
		const oldClothing = player.getCurrentClothingComponentData(type);
		const oldUndershirt = player.getCurrentClothingComponentData('undershirt');

		// Updating character clothing..
		const updatedClothes: ExpectedAny = { ...player.info.clothes };
		updatedClothes[type] = { drawableId: clothing.drawableId, textureId: clothing.textureId, isAddon: clothing.isAddon };

		// We need to also apply the right torso...
		if (type === 'top') {
			const torsoRecommended = clothing.meta.torsoRecommended;
			const torso = Clothes.find((c: Clothes) => c.id === torsoRecommended);

			// Making sure..
			if (!torso) throw new Error(`Clothing ID: ${clothing.id} had invalid torso recommendation: ${torsoRecommended}`);

			updatedClothes['torso'] = {
				drawableId: torso.drawableId,
				textureId: torso.textureId,
				isAddon: torso.isAddon
			};
		}

		// Update clothes data
		player.info.clothes = updatedClothes;

		// If current slot is already used we need to move existing clothing to inventory
		if (clothingSlotUsed && oldClothing) {
			player.giveItem(3, 1, { clothingId: oldClothing.id }, null, preferredDestination ? { page: preferredDestination.page, slot: preferredDestination.slot } : null);
		}

		// If his new top does not support undershirts we need to take off the undershirt and put in the inventory
		if (undershitSlotUsed && oldUndershirt && clothing.meta.undershirtCompatible === false) {
			// Removing the undershirt
			player.resetClothingComponentData('undershirt');

			// Add it to inventory
			player.giveItem(3, 1, { clothingId: oldUndershirt.id }, null, preferredDestination ? { page: preferredDestination.page, slot: preferredDestination.slot + 1 } : null);
		}

		// Updating the appearance
		player.updateClothes(player.info.clothes);

		return true;
	} catch (err) {
		await logError(`EQUIP_CLOTHING_ITEM`, err, { clothing, player: player.info.username });
		return false;
	}
};
