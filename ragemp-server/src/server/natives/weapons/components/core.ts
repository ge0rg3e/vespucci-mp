import WeaponsDb from '@modules/database/natives/weapons/repository';
import WeaponComponentsDb from '@modules/database/natives/weaponsComponents/repository';
import WeaponTintsDb from '@modules/database/natives/weaponsTints/repository';

import { logError } from '@server/utils/helpers';
import { green } from 'colorette';
import { NativeWeapon } from './types';

export let nativeWeapons: Array<NativeWeapon> = [];

export const loadNativeWeapons = async () => {
	try {
		const res: ExpectedAny = (await WeaponsDb.findAll()).map((c: ExpectedAny) => c.dataValues);
		const components: ExpectedAny = (await WeaponComponentsDb.findAll()).map((c: ExpectedAny) => c.dataValues);
		const tints: ExpectedAny = (await WeaponTintsDb.findAll()).map((c: ExpectedAny) => c.dataValues);

		// Load the native weapons.
		nativeWeapons = res.map((c: ExpectedAny) => ({
			...c,
			components: components.filter((d: ExpectedAny) => d.weaponId == c.id),
			tints: tints.filter((d: ExpectedAny) => d.weaponId == c.id)
		}));

		console.info(`${green('[DONE]')} Loaded ${res.length} native weapons.`);
	} catch (err) {
		await logError(`LOAD_NATIVE_WEAPONS`, err);
		process.exit(1);
	}
};

const c = (str: string) => str.toString().trim().toLowerCase();

export const getNativeWeapon = ({ model, displayName, id }: { id?: number; model?: string; displayName?: string }) => {
	const match = nativeWeapons.find((entry) => {
		if (model && c(entry.model) === c(model)) return true;
		if (id && id === entry.id) return true;
		if (displayName && c(entry.displayName) === c(displayName)) return true;
		return false;
	});
	if (!match) return null;
	return {
		id: match.id,
		hash: mp.joaat(`weapon_${match.model}`),
		displayName: match.displayName,
		description: match.description,
		model: match.model,
		group: match.group,
		ammoType: match.ammoType,
		components: match.components,
		tints: match.tints
	};
};
