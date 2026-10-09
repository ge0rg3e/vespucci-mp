// Reminder this is also defined on server-side.

declare global {
	type PlayerEquippedWeapon = {
		slot: number; // Player slot used.

		// Details about the weapon equipped
		weaponId: number;
		ammo: number;

		// Extra
		components: Array<number>; // Array of DB Id.
		tint: number; // DB Id of the Tint. Defaults to Zero, meaning no Tint at all.

		// Meta
		meta: Record<string, ExpectedAny>;
	};
}

export {};
