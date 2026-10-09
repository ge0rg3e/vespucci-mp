import * as rpc from 'rage-rpc';
import { logError } from '@server/utils/helpers';
import { createWeaponItemMeta } from '../items/functions';
import { InventoryItem } from '@server/legacy/inventory/components/types';
import { getNativeWeapon } from '@server/natives/weapons/components/core';
import { getLanguagePack } from '@vmp/i18n';

// @Event: When the user removes a weapon from Inventory by Right Click.
rpc.on('playerWeapons.inventory@removeEquippedWeapon', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	try {
		const { slot, remoteId } = JSON.parse(args);

		// Get the target.
		const target = mp.players.at(remoteId);
		if (!target) return false;

		// Is there a weapon there?
		const weapon = target.getWeaponFromSlot(slot);
		if (!weapon) return false;

		// Is there a available slot to unequip to?
		const emptySlot = target.findAvailableInventorySlot();
		if (!emptySlot) return player.alert({ type: 'error', message: `There is no space in your inventory to remove the weapon.` });

		// Remove the weapon
		target.removeWeaponFromSlot(slot);

		// Give the weapon to player.
		const shouldKeepInInventory = weapon.meta.destroyOnRemove ? false : true;

		// If he should keep it in inventory.
		if (shouldKeepInInventory) {
			target.giveWeaponItem(weapon.weaponId, createWeaponItemMeta(weapon));
		}

		// Update his inventory
		target.updateInventoryInterface();
	} catch (err) {
		await logError(`playerWeapons.inventory@removeEquippedWeapon`, err, args);
		return false;
	}
});

// @EVent: When we drag an item (weapon) to an occupied weapon slot or empty weapon slot.
// @Reminder: there is also items.functions.onItemUse
rpc.register('playerWeapons.inventory@equipWeaponItemToSlot', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	try {
		const { remoteId, id, slot, action } = JSON.parse(args);

		// Get the target.
		const target = mp.players.at(remoteId);
		if (!target) return false;

		// Check if there is a weapon in that slot.
		const currentWeaponInSlot = target.getWeaponFromSlot(slot);

		// Get item from inventory
		const inventoryItem = target.getInventoryItemMatch({ id });
		if (!inventoryItem) return false;

		// If attempt to drag a non-weapon item.
		if (inventoryItem.itemId !== 25) return false;

		// Check if the player currently has a weapon meant for a mission or system in hand.
		const isUsingWeaponMission = player.getWeaponSlot() === 999 ? true : false;

		// If we want to equip a weapon item from inventory to an empty slot.
		if (!currentWeaponInSlot && action === 'equip') {
			// Set the weapon on player snow.
			player.setWeapon(
				inventoryItem.meta.weaponId,
				slot,
				{
					ammo: inventoryItem.meta.ammo,
					components: inventoryItem.meta.components,
					tint: inventoryItem.meta.tint,
					meta: inventoryItem.meta.meta
				},
				{
					forceInHand: isUsingWeaponMission ? false : true // Ex: If we have petrol hand from gas station in hand.
				}
			);

			// Delete the item now
			player.deleteItem(inventoryItem.id);

			// Refresh inventory
			target.updateInventoryInterface();

			return true;
		}

		// If we are swapping a weapon from inventory with a weapon equipped.
		if (currentWeaponInSlot && action === 'swap') {
			// Remove that weapon from current slot
			target.removeWeaponFromSlot(slot);

			// Delete current weapon from inventory.
			target.deleteItem(inventoryItem.id);

			// Give the weapon item back to the player
			target.giveWeaponItem(currentWeaponInSlot.weaponId, createWeaponItemMeta(currentWeaponInSlot), {
				// Make the item is added to this specific inventory slot.
				destInventory: {
					slot: inventoryItem.slotId,
					page: inventoryItem.pageId
				}
			});

			// Set the weapon on player snow.
			player.setWeapon(
				inventoryItem.meta.weaponId,
				slot,
				{
					ammo: inventoryItem.meta.ammo,
					components: inventoryItem.meta.components,
					tint: inventoryItem.meta.tint,
					meta: inventoryItem.meta.meta
				},
				{
					forceInHand: isUsingWeaponMission ? false : true // Ex: If we have petrol hand from gas station in hand.
				}
			);
		}

		return true;
	} catch (err) {
		await logError(`playerWeapons.inventory@onItemEquipped`, err, args);
		return false;
	}
});

// @Event: When we drag an equipped weapon to an inventory item slot (that is either empty or already occupied by an item)
rpc.register('playerWeapons.inventory@moveWeaponToInventory', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	try {
		const { remoteId, slot, inventoryDestination } = JSON.parse(args);

		// Get the target.
		const target = mp.players.at(remoteId);
		if (!target) return false;

		// Get the inventory item that is in that very slot (In case there's something)
		const inventoryItem: InventoryItem | null = target.getInventoryItemMatch({ slotId: inventoryDestination.slot, pageId: inventoryDestination.page });
		//
		// Get the weapon from that slot
		const equippedWeapon = target.getWeaponFromSlot(slot);
		if (!equippedWeapon) return false; // Failed to get the dragged weapon.

		// Give the weapon to player.
		const shouldKeepInInventory = equippedWeapon.meta.destroyOnRemove ? false : true;

		// If we drag the item to an empty inventory slot.
		if (!inventoryItem) {
			// Remove the weapon from that slot.
			target.removeWeaponFromSlot(slot);

			if (shouldKeepInInventory) {
				// Create an item in that very inventory slot.
				target.giveWeaponItem(equippedWeapon.weaponId, createWeaponItemMeta(equippedWeapon), {
					// Make the item is added to this specific inventory slot.
					destInventory: {
						slot: inventoryDestination.slot,
						page: inventoryDestination.page
					}
				});
			}

			// Refresh
			target.updateInventoryInterface();

			return true;
		}

		// If we drag the item to an occupied inventory slot.
		if (inventoryItem) {
			// Is not a weapon that can be swapped.
			if (inventoryItem.itemId !== 25) return false;

			// Remove the weapon from that slot.
			target.removeWeaponFromSlot(slot);

			// Delete the item from that inventory.
			target.deleteItem(inventoryItem.id);

			if (shouldKeepInInventory) {
				// Create an item in that very inventory slot.
				target.giveWeaponItem(equippedWeapon.weaponId, createWeaponItemMeta(equippedWeapon), {
					// Make the item is added to this specific inventory slot.
					destInventory: {
						slot: inventoryDestination.slot,
						page: inventoryDestination.page
					}
				});
			}

			// Equip the weapon from inventory.
			target.setWeapon(inventoryItem.meta.weaponId, slot, {
				ammo: inventoryItem.meta.ammo,
				components: inventoryItem.meta.components,
				tint: inventoryItem.meta.tint,
				meta: inventoryItem.meta.meta
			});

			// Refresh
			target.updateInventoryInterface();

			return true;
		}
		return true;
	} catch (err) {
		await logError(`playerWeapons.inventory@moveWeaponToInventory`, err, args);
		return false;
	}
});

// @Event: When we drag an item over a weapon slot.
rpc.register('playerWeapons.inventory@draggingItemOverWeaponSlot', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	try {
		const { remoteId, id, slot } = JSON.parse(args);

		// Get the target.
		const target = mp.players.at(remoteId);
		if (!target) return false;

		// Get the inventory item that is in that very slot (In case there's something)
		const inventoryItem: InventoryItem | null = target.getInventoryItemMatch({ id });
		if (!inventoryItem) return false;

		// Get the weapon from that slot
		const equippedWeapon = target.getWeaponFromSlot(slot);
		if (!equippedWeapon) return false; // Failed to get the dragged weapon.

		// If we're dragging ammunition to fill the weapon.
		if (inventoryItem.itemId === 26) {
			// Get the weapon meta.
			const weaponMeta = getNativeWeapon({ id: equippedWeapon.weaponId });
			if (!weaponMeta) return false;

			// If the ammo type is not matching..
			if (weaponMeta.ammoType !== inventoryItem.meta.type) return false;

			// Calculate the new ammo
			const newAmount = equippedWeapon.ammo + inventoryItem.quantity;

			// Add the munition to the weapon
			target.setWeaponSlotBullets(slot, newAmount);

			// Delete the item now.
			target.deleteItem(inventoryItem.id);

			// Refresh inventory to make this affect.
			target.updateInventoryInterface();

			return true;
		}

		return false;
	} catch (err) {
		await logError(`playerWeapons.inventory@draggingItemOverWeaponSlot`, err, args);
		return false;
	}
});

rpc.register('playerWeapons.inventory@draggingItemOverWeaponItem', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	try {
		const { remoteId, draggedItemId, targetItemId } = JSON.parse(args);

		// Get the target.
		const target = mp.players.at(remoteId);
		if (!target) return false;

		// Get the inventory item
		const draggedItem: InventoryItem | null = target.getInventoryItemMatch({ id: draggedItemId });
		if (!draggedItem) return false;

		// Get the inventory item
		const targetItem: InventoryItem | null = target.getInventoryItemMatch({ id: targetItemId });
		if (!targetItem) return false;

		// If we're dragging ammunition over an weapon item.
		if (draggedItem.itemId === 26) {
			// Getting native weapon info about the weapon
			const weaponNative = getNativeWeapon({ id: targetItem.meta.weaponId });
			if (!weaponNative) return false;

			// If ammo is not compatible
			if (draggedItem.meta.type !== weaponNative.ammoType) return false;

			// Delete the ammo item now that is used.
			target.deleteItem(draggedItem.id);

			// Calculate new bullets in the weapon
			let bullets = targetItem.meta.ammo + draggedItem.quantity;

			// Set the weapon item bullets now.
			target.setWeaponItemBullets(targetItemId, bullets);

			// Update inventory now
			target.updateInventoryInterface();

			return true;
		}

		return false;
	} catch (err) {
		await logError(`playerWeapons.inventory@draggingItemOverWeaponItem`, err, args);
		return false;
	}
});

// @Event: When we drag an equipped weapon over another weapon slot (empty or occupied)
rpc.register('playerWeapons.inventory@changeWeaponSlot', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	try {
		const { remoteId, currentSlot, targetSlot } = JSON.parse(args);

		// Get the target.
		const target = mp.players.at(remoteId);
		if (!target) return false;

		// Get the weapon from that slot
		const currentWeaponSlot = target.getWeaponFromSlot(currentSlot);
		if (!currentWeaponSlot) return false; // Failed to get the dragged weapon.

		// Simulate the array
		let weapons = [...player.info.weapons];

		// Get current index
		const currentIndex = weapons.findIndex((c) => c.slot === currentSlot);
		if (currentIndex === -1) return false;

		// Get target index too if it exists.
		const targetIndex = weapons.findIndex((c) => c.slot === targetSlot);

		// Set the slot
		weapons[currentIndex].slot = targetSlot;

		// If there was a weapon in the target slot let's swap it.
		if (targetIndex !== -1) {
			weapons[targetIndex].slot = currentSlot;
		}

		// Save data
		target.updateInfo({ weapons });

		// Refresh inventory
		target.updateInventoryInterface();

		return true;
	} catch (err) {
		await logError(`playerWeapons.inventory@changeWeaponSlot`, err, args);
		return false;
	}
});

// Event: When the player in client-side is pressing a key to change his weapon active.
rpc.on('playerWeapons.onSlotButtonPressed', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	try {
		// Extract arguments
		const { slot: newSlot } = JSON.parse(args);

		// Update variable to inform the server that this player is changing weapons.
		player.updateVars({ changingWeapons: true }); // @Reminder: This changing weapons is also anti spam on client-side.

		// Play this animation.
		player.applyAnimation({
			dict: 'reaction@intimidation@1h',
			name: 'intro',
			flags: 48,
			speed: 8,
			duration: 1110.0,
			speedMultiplier: 0,
			onCallback: (player, stopAnim) => {
				// Set this variable next (not in the same update var above)
				player.updateVars({ changingWeapons: false });
				player.setWeaponSlot(newSlot);

				// Clear animation
				stopAnim();
			}
		});

		return true;
	} catch (err) {
		await logError(`playerWeapons.changeSlot`, err, args);
		return false;
	}
});

// Event: When the player fired a weapon and we need to reduce his ammo.
rpc.on('playerWeapons.onWeaponBulletsFired', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	try {
		// Extract arguments
		const { slot, weapon, bullets } = JSON.parse(args);

		// Get weapon in that slot
		const weaponInSlot = player.getWeaponFromSlot(slot);
		if (!weaponInSlot) return false;

		// Is the weapon in that slot the one that the client-side knew?
		if (weaponInSlot.weaponId !== weapon.weaponId) return false;

		// Calculate new ammo
		const newAmmo = weaponInSlot.ammo - bullets;

		// Get native info
		const native = getNativeWeapon({ id: weaponInSlot.weaponId });
		if (!native) return false;

		// If is a throwable
		if (native.group === 'thrown' && newAmmo < 1) {
			player.removeWeaponFromSlot(slot);
			return true;
		}

		// Update bullets.
		player.setWeaponSlotBullets(slot, newAmmo);

		return true;
	} catch (err) {
		await logError(`playerWeapons.changeSlot`, err, args);
		return false;
	}
});

// Event: When the player trying to shoot with a weapon and he doesn't have license.
rpc.on('playerWeapons.shootingWithoutLicense', (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.

	// Get lang
	const lang = getLanguagePack('playerWeapons.shootingWithoutLicense', player.lang);

	// Notify him
	player.alert({ type: 'error', message: lang.get('ErrorNotification') });
	player.alert({ type: 'info', message: lang.get('InfoNotification') });
});

rpc.on('playerWeapons.setUnarmed', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	player.setWeaponSlot(0); // Set to fist.
});
