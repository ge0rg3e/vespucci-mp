import { logError } from '@server/utils/helpers';
import { defaultClothes } from './maps';

mp.events.add('charCreator:Start', async (player) => {
	try {
		// Set the default face features, skin..
		player.resetAllAppearancesComponents();

		// Set the default clothing components..
		player.resetAllClothingComponents();

		// Set the default clothes for good apperances..
		player.info.clothes = { ...player.info.clothes, ...defaultClothes['male'] };
		player.updateClothes(player.info.clothes);

		// Set the camera
		player.triggerClientEvent('charCreator:SetInitialScene');
	} catch (err) {
		await logError(`CREATE_CHARACTER`, err);
	}
});
