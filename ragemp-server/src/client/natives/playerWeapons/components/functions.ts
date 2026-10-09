import { logClientsideError } from '@client/general/errors';
import { getWeaponNativeInfo } from '@client/natives/nativeInformation';
import * as rpc from 'rage-rpc';

/**
 * This function will set the player current weapon according to
 * @param player - The player.
 * @param slot - The weapon slot to equip.
 * @param weapons - All his weapons.
 */

export const setPlayerWeapon = async (target: PlayerMp, slot: number, weapons: Array<PlayerEquippedWeapon>) => {
	try {
		// Get the weapon that slot (if slot is zero (punch)) it won't be anything.
		const weaponSlot: PlayerEquippedWeapon | undefined = weapons.find((c) => c.slot === slot);

		if (!weaponSlot) {
			// Remove all current weapons to ensure that now he won't have leftover weapons.
			target.removeAllWeapons();

			return false; // Is either slot zero or there's no weapon equipped there.
		}

		// Get the native info of the new weapon
		const native = await getWeaponNativeInfo(weaponSlot.weaponId);
		if (!native) return false;

		// Check if this is already the current weapon
		const isCurrentWeapon = mp.players.local.weapon === native.hash ? true : false;

		if (!isCurrentWeapon) {
			// Remove the current weapon
			target.removeAllWeapons();

			// Give the weapon to the player
			giveWeaponToPed(target, native.hash, weaponSlot.ammo, true);
		} else {
			// Set the current weapon ammo according to server-side.
			mp.game.invoke(`0x14E56BC5B5DB6A19`, target.handle, native.hash, weaponSlot.ammo);
		}

		// Set dependencies now
		setPlayerWeaponDependencies(target, weaponSlot, native);

		return true;
	} catch (err) {
		await logClientsideError(`playerWeapons.setPlayerWeapon`, err);
		return false;
	}
};

/**
 * This function will set the weapon's components and tint according to the weapon meta.
 */

export const setPlayerWeaponDependencies = async (target: PlayerMp, weapon: PlayerEquippedWeapon, native: ExpectedAny) => {
	try {
		// Get the tint set
		const tintAllocated = weapon.tint === 0 ? null : native.tints.find((c: ExpectedAny) => c.id === weapon.tint);
		const currentTint = getWeaponTint(target, native.hash);
		const defaultTint = native.tints.find((c: ExpectedAny) => c.isDefault === true);
		const defaultTintVariant = defaultTint ? defaultTint.variant : 0;

		// Setting the tint color.
		if (tintAllocated && currentTint !== tintAllocated.variant) {
			setWeaponTint(target, native.hash, tintAllocated.variant);
		} else if (!weapon.tint && currentTint !== defaultTintVariant) {
			setWeaponTint(target, native.hash, defaultTintVariant);
		}

		// Let's iterate through the weapon components
		for (const component of native.components) {
			// Get the compoennt hash
			const componentHash = mp.game.joaat(component.hashKey);

			// Is this component compatible?
			const compatibleComponent = doesWeaponTakeWeaponComponent(native.hash, componentHash);
			if (!compatibleComponent) continue; // This most likely is a bug from the developers. This mod is not compatible.

			// Do we have this component already?
			const hasComponent = hasWeaponComponentEquipped(target, native.hash, componentHash);

			// This weapon component is not part of our weapon current component id.
			if (!weapon.components.includes(component.id)) {
				// Is this component currently loaded and is not a default one? (We don't want to remove default ones)
				if (hasComponent && !component.isDefault) {
					// We remove it.
					removeWeaponComponent(target, native.hash, componentHash);
				}
				continue;
			}

			if (hasComponent) continue; // We already have it.

			// We now give the component.
			giveWeaponComponent(target, native.hash, componentHash);
		}

		return true;
	} catch (err) {
		await logClientsideError(`playerWeapons.setPlayerWeaponDependencies`, err);
		return false;
	}
};

/**
 * A simple wrapper for the native to give the ped a weapon.
 * @param player
 * @param hashModel
 * @param ammo
 * @param autoEquip
 */
export const giveWeaponToPed = (player: PlayerMp, hashModel: number, ammo: number, autoEquip: boolean) => {
	// Native: GiveWeaponToPed
	mp.game.invoke(
		'0xBF0FD6E56C964FCB',
		player.handle,

		// @Bugfix: This fixed a weird bug where snspistol wasn't working. Do not touch.
		hashModel >> 0,
		// Ammo and the rest..
		ammo,
		false,
		autoEquip
	);
};

// Only for this function.
type ExtendedPlayerEquippedWeapon = PlayerEquippedWeapon & {
	// optional _native property
	_native?: ExpectedAny;
};

/**
 * Get the current weapon in hand from the player.
 * @returns The weapon
 */

export const getCurrentWeapon = async (target: PlayerMp, includeNative?: boolean): Promise<ExtendedPlayerEquippedWeapon | null> => {
	// Get the player weapons
	const weapons = target.getVariable(`@playerInfo.weapons`);
	if (!weapons) return null;

	// Get the player current equipped weapon slot
	const equippedSlot = target.getVariable(`@playerVars.weaponSlot`);
	if (equippedSlot === undefined) return null;

	// Get a match.
	const match = weapons.find((c: PlayerEquippedWeapon) => c.slot === equippedSlot);
	if (!match) return null;

	// If we also want the native information
	if (includeNative) {
		const native = await getWeaponNativeInfo(match.weaponId);

		return { ...match, _native: native };
	}
	return match;
};

export const getCurrentWeaponSlot = (target: PlayerMp) => {
	// Get the player current equipped weapon slot
	const equippedSlot = target.getVariable(`@playerVars.weaponSlot`);
	if (equippedSlot === undefined) return 0;

	return equippedSlot;
};

/**
 * This will allow us to set the tint for a weapon.
 * @param target
 */

export const setWeaponTint = (target: PlayerMp, weaponHash: number, tintIndex: number) => {
	mp.game.weapon.setPedTintIndex(target.handle, weaponHash >> 0, tintIndex);
};

export const getWeaponTint = (target: PlayerMp, weaponHash: number) => mp.game.weapon.getPedTintIndex(target.handle, weaponHash >> 0);
/**
 * We will now give the weapon component accordingly.
 */

export const giveWeaponComponent = (target: PlayerMp, weaponHash: number, componentHash: number) => {
	mp.game.weapon.giveComponentToPed(target.handle, weaponHash >> 0, componentHash >> 0);
};

/**
 * A simple function to remove any weapon component.
 */

export const removeWeaponComponent = (target: PlayerMp, weaponHash: number, componentHash: number) => {
	mp.game.weapon.removeComponentFromPed(target.handle, weaponHash >> 0, componentHash >> 0);
};

/**
 * A simple function that informs us if a certain component is present.
 */

export const hasWeaponComponentEquipped = (target: PlayerMp, weaponHash: number, componentHash: number) => {
	const result = mp.game.weapon.hasPedGotComponent(target.handle, weaponHash >> 0, componentHash >> 0);
	return result;
};

/**
 * This will tell you if the component you try to attach is valid with that weapon.
 */

export const doesWeaponTakeWeaponComponent = (weaponHash: number, componentHash: number) => {
	const result = mp.game.weapon.doesWeaponTakeWeaponComponent(weaponHash >> 0, componentHash >> 0);
	return result;
};

/**
 * A simple way to change the slot quickly to fist.
 * @param slot
 */

export const setLocalPlayerUnarmed = () => {
	// Inform the server
	rpc.triggerServer(`playerWeapons.setUnarmed`);
};

/**
 * A simple function to check on client-side if we have a certain license.
 * @param target
 * @param id
 * @returns
 */

export const doesPlayerHaveValidLicense = (target: PlayerMp, id: string) => {
	// Get licenses
	const licenses = target.getVariable(`@playerInfo.licenses`);
	if (!licenses) return;

	return licenses.find((c: ExpectedAny) => c.id === id && c.hours > 0) ? true : false;
};

export const isTakingLicenseTest = (target: PlayerMp, id: string) => {
	// Get licenses
	const licenseTest = target.getVariable(`@playerVars.licenseTest`);

	if (!licenseTest) return false;

	if (licenseTest.id === id && licenseTest.enabled === true) return true;

	return false;
};
