import clothes from '@modules/database/natives/clothes/repository';
import { formatNumber, logError } from '@server/utils/helpers';
import { green } from 'colorette';

export let Clothes: Array<Clothes> = [];

export const loadClothes = async () => {
	try {
		const res = await clothes.getClothes();
		const numberOfClothesUnique = res.filter((c) => c.textureId === 0);
		const numberOfAddons = numberOfClothesUnique.filter((c) => c.isAddon === true);
		console.info(`${green('[DONE]')} Loaded ${formatNumber(numberOfClothesUnique.length)} clothes (${formatNumber(numberOfAddons.length)} Addons) native information`);
		Clothes = res;
	} catch (err) {
		await logError(`LOAD_CLOTHES`, err);
	}
};

export const reloadClothes = async () => {
	try {
		const res = await clothes.getClothes();
		Clothes = res;
	} catch (err) {
		await logError(`RELOAD_CLOTHES`, err);
	}
};

export const updateClothes = async (id: number, fields?: Partial<Clothes>, updateDatabase = false) => {
	try {
		const args: ExpectedAny = { ...fields };

		// const fieldMustBeStringified = [];

		// Object.keys(args).forEach((key: string) => {
		// 	if (fieldMustBeStringified.includes(key)) {
		// 		args[key] = JSON.stringify(args[key]);
		// 	}
		// });

		if (updateDatabase === true) {
			clothes.update(args, { where: { id: id } });
		}

		const indexOf = Clothes.findIndex((elm) => elm.id === id);

		Clothes[indexOf] = {
			...Clothes[indexOf],
			...fields
		};
	} catch (err) {
		await logError(`UPDATE_CLOTHES`, err, {
			id,
			fields
		});
	}
};
