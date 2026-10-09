import { getNativeWeapon } from '@server/natives/weapons/components/core';
import { getLanguagePack } from '@vmp/i18n';
import { onItemUse } from './functions';

mp.items.create({
	id: 25,
	name: { EN: 'Placeholder for Weapon' },
	description: {
		EN: 'This item is a weapon that can be equipped in your weapon slots',
		RO: 'Acest item este o armă și poate fi echipat în weapon slots.'
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: true,
	callbacks: { use: onItemUse },
	getProperties({ player, meta }) {
		// Get the weapons data
		const weaponData = getNativeWeapon({ id: meta.weaponId });
		if (!weaponData) return [];

		// Get language pack for the groups
		const langGroups = getLanguagePack('Weapons:Groups', player.lang);
		const langAmmoTypes = getLanguagePack('Weapons:AmmoTypes', player.lang);
		const lang = getLanguagePack('Weapons:ItemProperties', player.lang);

		// Format the properties..
		let properties = [
			{
				label: lang.get('Class'),
				value: langGroups.get(weaponData.group)
			}
		];

		const hasBullets = ['melee', 'thrown'].includes(weaponData.group) ? false : true;

		if (hasBullets) {
			properties.push({
				label: lang.get('Ammunition'),
				value: `${meta.ammo} ${lang.get('Bullets')}`
			});

			properties.push({
				label: lang.get('AmmoType'),
				value: langAmmoTypes.get(weaponData.ammoType)
			});
		}

		// If they don't have bullets but is not a melee either.
		if (!hasBullets && weaponData.group !== 'melee') {
			properties.push({
				label: lang.get('Quantity'),
				value: `${meta.ammo} ${lang.get('Units')}`
			});
		}

		return properties;
	}
});

mp.items.create({
	id: 26,
	name: {
		EN: 'Ammunition',
		RO: 'Muniție'
	},
	description: {
		EN: 'Drag this onto a compatible, equipped weapon to automatically load bullets into the magazine.',
		RO: 'Trageți acest obiect peste o armă compatibilă, echipată deja, pentru a încărca automat gloanțele în magazie.'
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: false,
	callbacks: {},
	getProperties({ player, meta, shopId }) {
		const langAmmoTypes = getLanguagePack('Weapons:AmmoTypes', player.lang);
		const lang = getLanguagePack('Weapons:ItemProperties', player.lang);

		return [
			{
				label: lang.get('TypeOfAmmo'),
				value: langAmmoTypes.get(meta.type)
			}
		];
	}
});

// @TODO: In the future, for now we don't bother.

mp.items.create({
	id: 27,
	name: {
		EN: 'Weapon Component',
		RO: 'Componenta de Arma'
	},
	description: {
		EN: 'Drag this onto a compatible, equipped weapon to automatically load this component onto it.',
		RO: 'Trageți acest item peste o armă compatibilă, echipată deja, pentru a încărca componenta peste arma.'
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: false,
	callbacks: {}
});
