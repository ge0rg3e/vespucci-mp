// Getting the list of data..
import { Clothes } from './core';
import { createSocketEvent } from '@server/legacy/socket.io/components/socketEvents';
import clothes from '@modules/database/natives/clothes/repository';
import { logError } from '@server/utils/helpers';

createSocketEvent('manageClothes:saveClothesBulk', async (player, { data }) => {
	if (!player.checkPermission('feature.useClothesManagement')) return false;
	if (!player.checkPermission('feature.updateClothes')) return false;
	// if (!player.checkPermission('feature.createClothes')) return false;

	try {
		// What fields will be inserted or updated..
		const keysToBeUpdated: ExpectedAny = ['name', 'category', 'price', 'bcPrice', 'isAvailable', 'minimumDonorTier', 'isAddon', 'dlcName', 'meta'];

		// Updating the ones existing..
		await clothes.updateBulkClothes(
			data.map((c: ExpectedAny) => ({
				...c,
				meta: JSON.stringify(c.meta) // needs to be stringified.
			})),
			keysToBeUpdated
		);

		data.forEach((clothing: Clothes) => {
			const index = Clothes.findIndex((c) => c.id === clothing.id);
			if (index === -1) return;

			Clothes[index] = {
				...Clothes[index],
				...clothing
			};
		});

		player.createAmplitudeEvent('Updated clothes', data);

		// Inserting new..
	} catch (err) {
		await logError(`SAVE_UPDATED_CLOTHES_BULK`, err);
	}
	return true;
});
