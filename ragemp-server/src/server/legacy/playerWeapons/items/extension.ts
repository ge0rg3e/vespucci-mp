import { createWeaponItemMeta } from './functions';

mp.Player.prototype.giveWeaponItem = async function (weaponId, options = {}, itemOptions = {}) {
	const availableSlot = this.findAvailableInventorySlot();
	if (!availableSlot) return false;

	// Give the gun as an item in the inventory
	const inventoryItem = await this.giveItem(
		25,
		1,
		createWeaponItemMeta({
			weaponId,
			ammo: options.ammo !== undefined ? options.ammo : 1,
			// Adding the options
			components: options.components ? options.components : [],
			tint: options.tint !== undefined ? options.tint : 0,
			meta: options.meta ? options.meta : {}
		}),
		null,
		{
			page: itemOptions.destInventory ? itemOptions.destInventory.page : availableSlot?.page,
			slot: itemOptions.destInventory ? itemOptions.destInventory.slot : availableSlot?.slot
		}
	);

	// Item hasn't been created.
	if (!inventoryItem) return null;

	return inventoryItem;
};

mp.Player.prototype.giveWeaponAmmoItem = async function (type, quantiy) {
	// Give the gun as an item in the inventory
	const item = await this.giveItem(26, quantiy, { type });

	if (!item) return null;

	return item;
};

declare global {
	interface PlayerMp {
		/**
		 * Gives the player a weapon item and adds it to their inventory automatically.
		 * @param id - Weapon ID
		 * @param options - Options
		 */

		giveWeaponItem(
			id: number,
			options?: {
				ammo?: number;
				components?: PlayerEquippedWeapon['components'];
				tint?: PlayerEquippedWeapon['tint'];
				meta?: Record<string, ExpectedAny>;
			},
			itemOptions?: {
				destInventory?: {
					slot: number;
					page: number;
				};
			}
		): void;

		/**
		 * Gives the player an ammunition item of a specific type.
		 * @param type - Type
		 * @param quantity - Number of bullets
		 */

		giveWeaponAmmoItem(type: AmmoType, quantity: number): void;
	}
}

export {};
