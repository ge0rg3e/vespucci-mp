mp.Player.prototype.setWeapon = function (weaponId, slot, weaponOptions = {}, systemOptions = {}) {
	// Preparing a new set of weapons.
	let currentWeapons = [...this.info.weapons];

	// Add the new weapon to the slot
	currentWeapons.push({
		// Weapon details
		slot,
		weaponId,
		ammo: weaponOptions.ammo !== undefined ? weaponOptions.ammo : 1,
		// Attachments
		components: weaponOptions.components ? weaponOptions.components : [],
		tint: weaponOptions.tint !== undefined ? weaponOptions.tint : 0,
		meta: weaponOptions.meta ? weaponOptions.meta : {}
	});

	// If we want to switch to this weapon instanly.
	if (systemOptions.forceInHand) {
		this.setWeaponSlot(slot);
	}

	// Save the info..
	this.updateInfo({ weapons: currentWeapons });

	// Update inventory interface.
	this.updateInventoryInterface();

	return true;
};

mp.Player.prototype.removeWeaponFromSlot = function (slot) {
	// Is there a weapon in that slot?
	const weaponIndex = this.info.weapons.findIndex((c) => c.slot === slot);
	if (weaponIndex === -1) return false;

	// Format the new arr
	let newArr = [...this.info.weapons];

	// Remove it
	newArr.splice(weaponIndex, 1);

	// Update weapons
	this.updateInfo({ weapons: newArr });

	// If the weapon removed is the slot currently equipped we'll switch to fist.
	if (slot === this.vars.weaponSlot) {
		this.updateVars({ weaponSlot: 0 });
	}

	return true;
};

mp.Player.prototype.removeWeapons = function () {
	for (let index = 0; index < this.getNumberOfWeaponSlots(); index++) {
		const slotNumber = index + 1;
		if (this.getWeaponFromSlot(slotNumber)) {
			this.removeWeaponFromSlot(slotNumber);
		}
	}
};

mp.Player.prototype.getWeaponFromSlot = function (slot) {
	// Get it from the server-side fast without any DB queries.
	const match = this.info.weapons.find((c) => c.slot === slot);
	return match ? match : null;
};

mp.Player.prototype.setWeaponSlotBullets = function (slot, value) {
	const index = this.info.weapons.findIndex((c) => c.slot === slot);

	if (index === -1) return false;

	// The amount of maximum bullets is 250. Is because that's how GTA works.
	const newAmount = value >= 250 ? 250 : value;

	// Change ammo
	let newWeapons = [...this.info.weapons];
	newWeapons[index].ammo = newAmount;

	this.updateInfo({ weapons: newWeapons });

	return true;
};

mp.Player.prototype.setWeaponItemBullets = function (id, value) {
	const index = this.info.inventory.findIndex((c) => c.id === id);

	if (index === -1) return false;

	// The amount of maximum bullets is 250. Is because that's how GTA works.
	const newAmount = value >= 250 ? 250 : value;

	// Change ammo
	let newInventory = [...this.info.inventory];
	newInventory[index].meta.ammo = newAmount;

	this.updateInfo({ inventory: newInventory });

	return true;
};

mp.Player.prototype.getWeaponSlot = function () {
	return this.vars.weaponSlot;
};

mp.Player.prototype.getAvailableWeaponSlot = function () {
	for (let index = 0; index < this.getNumberOfWeaponSlots(); index++) {
		const slotNumber = index + 1;
		if (!this.getWeaponFromSlot(slotNumber)) {
			return slotNumber;
		}
	}
	return null;
};

mp.Player.prototype.getNumberOfWeaponSlots = function () {
	return 4; // Returns how many weapon slots there can be. Let it be 4 for now.
};

mp.Player.prototype.setWeaponSlot = function (slot) {
	this.updateVars({ weaponSlot: slot });
};

declare global {
	interface PlayerMp {
		/**
		 * Sets a weapon as an equipped weapon.
		 * @param weaponId Weapon ID from DB.
		 * @param ammo Number of ammo.
		 * @param slot It can be a number slot specific or it can be left null to be automatically picked.
		 * @param options - Additional options
		 */

		setWeapon(
			weaponId: number,
			slot: number,
			weaponOptions?: {
				ammo?: number;
				components?: PlayerEquippedWeapon['components'];
				tint?: PlayerEquippedWeapon['tint'];
				meta?: Record<string, ExpectedAny>;
			},
			systemOptions?: {
				/**
				 * If the weapon slot should be changed instantly to this one.
				 */
				forceInHand?: boolean;
			}
		): boolean;

		/**
		 * Removes the weapon equipped by the player from a specific slot.
		 */

		removeWeaponFromSlot(slot: number): void;

		/**
		 * Removes all the weapons equipped from a player.
		 */

		removeWeapons(): void;

		/**
		 * Sets the weapon bullets amount for an equipped weapon
		 * @param slot - The slot of the weapon
		 * @param value - Ammo to set
		 */

		setWeaponSlotBullets(slot: number, value: number): void;

		/**
		 * Sets the weapon bullets amount for an weapon item
		 * @param id - The id of the item.
		 * @param value - Ammo to set
		 */

		setWeaponItemBullets(id: string, value: number): void;

		/**
		 * Gets the weapon from a specific slot.
		 * @param slot
		 */

		getWeaponFromSlot(slot: number): PlayerEquippedWeapon | null;

		/**
		 * Returns the next available weapon slot that the player has available to equip a weapon in.
		 */

		getAvailableWeaponSlot(): number | null;

		/**
		 * This function will return the number of available weapons slots possible.
		 */

		getNumberOfWeaponSlots(): number;

		/**
		 * Set what weapon slot to be in hand of the player.
		 */

		setWeaponSlot(slot: number): void;

		/**
		 * Get what weapon slot is active.
		 */

		getWeaponSlot(): number;
	}
}

export {};
