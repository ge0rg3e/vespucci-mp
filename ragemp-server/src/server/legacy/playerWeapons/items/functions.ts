import { itemCallbackMeta } from '@server/natives/items/components/types';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

export const onItemUse = async (player: PlayerMp, inventoryItem: itemCallbackMeta) => {
	try {
		// Get lang
		const lang = getLanguagePack(`Weapons@onItemUse`, player.lang);

		// Check if have free weapon slots
		const slot = player.getAvailableWeaponSlot();
		if (!slot) return player.toast({ type: 'error', message: lang.get('NoSlotAvailable') });

		// Check if the player currently has a weapon meant for a mission or system in hand.
		const isUsingWeaponMission = player.getWeaponSlot() === 999 ? true : false;

		// Set the weapon on player snow.
		player.setWeapon(
			inventoryItem.data.meta.weaponId,
			slot,
			{
				ammo: inventoryItem.data.meta.ammo,
				components: inventoryItem.data.meta.components,
				tint: inventoryItem.data.meta.tint,
				meta: inventoryItem.data.meta.meta
			},
			{
				forceInHand: isUsingWeaponMission ? false : true // Example: If we have petrol can from gas station in hand we don't switch to that slot.
			}
		);

		// Delete the item now
		player.deleteItem(inventoryItem.data.id);

		// Refresh the inventory.
		player.updateInventoryInterface();

		return true;
	} catch (err) {
		await logError(`item.weapons.onItemUse`, err);
		return false;
	}
};

/**
 * This function will help us set the meta structure for the weapon items.
 * It's used to make sure we don't write invalid meta data to the weapons.
 *
 * @param weaponData - Weapon Data
 */
type CustomItemData = Omit<PlayerEquippedWeapon, 'slot'>;

export const createWeaponItemMeta = (weaponData: CustomItemData) => ({
	weaponId: weaponData.weaponId,
	ammo: weaponData.ammo,
	tint: weaponData.tint,
	components: weaponData.components,
	meta: weaponData.meta ? weaponData.meta : {}
});
