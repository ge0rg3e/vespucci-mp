import { InventoryItem } from '@server/legacy/inventory/components/types';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

export const onTimeoutRefillPetrolCan = async (accountId: number, newPetrolCanLitres: number, inventoryItem: InventoryItem) => {
	try {
		// Get the player entity after timeout (which now maybe he left the game)
		const player = mp.players.atAccountId(accountId);
		if (!player) return;

		// Give him the fuel he paid for...
		player.updateItem(inventoryItem.id, {
			meta: {
				...inventoryItem.meta,
				litres: newPetrolCanLitres
			}
		});

		// Inform server.
		mp.events.call(`pump:cancelHoldingNozzle`, player, `Finished filling the petrol can`);

		// Get language pack
		const lang = getLanguagePack(`petrolCan:fillDialog@onResponse`, player.lang);

		player.alert({ system: 'petrolCan', type: 'success', message: lang.get(`SuccessFill`, { litres: newPetrolCanLitres }), seconds: 15 });
	} catch (err) {
		await logError(`onTimeoutRefillPetrolCan`, err);
	}
};
