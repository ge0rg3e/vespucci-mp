import { logError } from '@/utils/helpers';

/**
 * This will return you the inventory item image. Ex: item id 25 (weapon) will return a weapon.
 * @param inventoryItem
 */

export const getItemImage = (inventoryItem: ExpectedAny) => {
	try {
		// If is a clothing..
		if (inventoryItem.itemId === 3) {
			return `${__ASSETS__}/clothes/${inventoryItem.meta.clothingId}.png`;
		}

		// If is a weapon
		if (inventoryItem.itemId === 25) {
			return `${__ASSETS__}/weapons/${inventoryItem.meta.weaponId}.png`;
		}

		// Return the default one..

		return `${__ASSETS__}/items/${inventoryItem.itemId}.png`;
	} catch (err) {
		logError(`getItemImage`, err);
		return null;
	}
};
