import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('inventory@weapon.tooltip', {
	Ammunition: {
		EN: 'Ammunition',
		RO: 'Muniție'
	},
	Bullets: {
		EN: 'Bullets',
		RO: 'Gloanțe'
	},
	Quantity: {
		EN: 'Quantity',
		RO: 'Cantitate'
	},
	Units: {
		EN: 'Units',
		RO: `Bucăți`
	},
	Class: {
		EN: 'Weapon Class',
		RO: 'Clasă de Armă'
	},
	AmmoType: {
		EN: 'Compatible Ammo',
		RO: 'Muniție Compatibilă'
	}
});

createLanguagePack('inventory@weapon.ammoTypes', {
	pistol: { EN: 'Pistol' },
	stungun: { EN: 'Stun Gun' },
	smg: { EN: 'Submachine Gun' },
	mg: { EN: 'Machine Gun' },
	shotgun: { EN: 'Shotgun' },
	rifle: { EN: 'Rifle' },
	sniper: { EN: 'Sniper Rifle' },
	rpg: { EN: 'RPG' },
	grenadeLauncher: { EN: 'Grenade Launcher' },
	grenadeLauncherSmoke: { EN: 'Smoke Grenade Launcher' },
	minigun: { EN: 'Minigun' },
	firework: { EN: 'Firework Launcher' },
	railgun: { EN: 'Railgun' },
	homingLauncher: { EN: 'Homing Launcher' },
	empLauncher: { EN: 'EMP Launcher' },
	grenade: { EN: 'Grenade' },
	gzgas: { EN: 'Gas Grenade' },
	molotov: { EN: 'Molotov Cocktail' },
	stickyBomb: { EN: 'Sticky Bomb' },
	proxMine: { EN: 'Proximity Mine' },
	snowBall: { EN: 'Snowball' },
	pipeBomb: { EN: 'Pipe Bomb' },
	ball: { EN: 'Ball' },
	smokeGrenade: { EN: 'Smoke Grenade' }
});

createLanguagePack(`inventory@weapon.groups`, {
	melee: {
		EN: 'Melee'
	},
	pistol: {
		EN: 'Pistol'
	},
	stungun: {
		EN: 'Stun Gun'
	},
	smg: {
		EN: 'SMG'
	},
	mg: {
		EN: 'Machine Gun'
	},
	shotgun: {
		EN: 'Shotgun'
	},
	rifle: {
		EN: 'Rifle'
	},
	sniper: {
		EN: 'Sniper'
	},
	heavy: {
		EN: 'Heavy'
	},
	thrown: {
		EN: 'Throwable'
	}
});

createLanguagePack(`inventory@weapons.interface`, {
	WeaponsHeading: {
		EN: 'Weapons',
		RO: 'Arme'
	}
});
