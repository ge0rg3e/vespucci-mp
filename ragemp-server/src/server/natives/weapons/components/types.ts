declare global {
	type WeaponGroups = 'melee' | 'pistol' | 'stungun' | 'smg' | 'mg' | 'shotgun' | 'rifle' | 'sniper' | 'heavy' | 'thrown';

	// @Also defined in db.
	type AmmoType =
		| 'pistol'
		| 'stungun'
		| 'smg'
		| 'mg'
		| 'shotgun'
		| 'rifle'
		| 'sniper'
		| 'rpg'
		| 'grenadeLauncher'
		| 'grenadeLauncherSmoke'
		| 'minigun'
		| 'firework'
		| 'railgun'
		| 'homingLauncher'
		| 'empLauncher'
		| 'grenade'
		| 'gzgas'
		| 'molotov'
		| 'stickyBomb'
		| 'proxMine'
		| 'snowBall'
		| 'pipeBomb'
		| 'ball'
		| 'smokeGrenade';
}

export type NativeWeapon = {
	id: number;
	model: string;
	displayName: string;
	description: string;
	group: WeaponGroups;
	ammoType: AmmoType;
	components: Array<{
		id: number;
		hashKey: string;
		name: string;
		description: string;
		isDefault: boolean;
	}>;
	tints: Array<{
		id: number;
		variant: number;
		name: string;
		isDefault: boolean;
	}>;
};

export {};
