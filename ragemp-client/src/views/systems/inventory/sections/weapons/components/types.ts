declare global {
	type PlayerWeapon = {
		slot: number; // Player slot used.

		// Details about the weapon equipped
		weaponId: number;
		ammo: number;

		// Extra
		components: Array<number>;
		tint: number; // tint index

		// Meta - It can be anything we want. Future proof.
		meta: Record<string, ExpectedAny>;
	};
}

export {};
