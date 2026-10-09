declare global {
	type PlayerEquippedWeapon = {
		slot: number; // Player slot used.

		// Details about the weapon equipped
		weaponId: number;
		ammo: number;

		// Extra
		components: Array<number>;
		tint: number; // tint index

		// Meta
		meta: Record<string, ExpectedAny>;
	};

	interface PlayerInfo {
		weapons: Array<PlayerEquippedWeapon>;
	}

	interface PlayerVariables {
		/**
		 * The weapon slot used by the player at the moment.
		 */
		weaponSlot: number;

		/**
		 * This informs us if the player is currently changing the weapon in hand. (Using the keys)
		 */

		changingWeapons: boolean;
	}
}

export {};
