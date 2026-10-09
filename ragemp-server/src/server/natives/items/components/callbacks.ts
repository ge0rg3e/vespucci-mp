import { InventoryItem } from '@server/legacy/inventory/components/types';
import { logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';
import * as i18n from '@vmp/i18n';
import { itemCallbacks, itemObject } from './types';
import { getActionText } from './utils';
import { MAX_PICKUP_ITEM_RANGE } from '@server/legacy/inventory/components/utils';
import { MAX_INVENTORY_SLOTS_PER_PAGE } from '@server/legacy/inventory/components/extensions';

rpc.register('onItemAction', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	const { remoteId, id, action }: { remoteId: number; id: string; action: keyof itemCallbacks } = JSON.parse(args);
	const target = mp.players.at(remoteId);
	if (!target) return false;
	try {
		const globalLang = i18n.getLanguagePack('ItemRegistry', player.info.language);
		const slot: InventoryItem | null = target.getInventoryItemMatch({ id });
		if (slot === null) return false;
		const item: itemObject = mp.items.getItem(slot.itemId)!;

		if (!item) {
			target.sendErrorMessage('Server', 'system', globalLang.get('ITEM_NOT_FOUND'), 'system');
			return false;
		}

		const callback: ExpectedAny = item.callbacks[action];
		const lang = i18n.getLanguagePack(`item:${item.id}`, target.info.language);
		let actionExecuted = false;
		const inventoryItem: InventoryItem = target.info.inventory.find((i: InventoryItem) => i.id === id)!;

		if (action === 'dropped' && !safetyCheckBeforeDropping(player, target)) return false;

		if (callback) {
			await callback(target, { data: slot, item, actioner: player, target }, (string: string) => lang.get(string));
			actionExecuted = true;
		} else if (!callback && action == 'destroy' && item.dispensable) {
			await target.deleteItem(id);
			actionExecuted = true;
		} else if (!callback && action === 'dropped' && item.droppable) {
			await target.dropItem(id);
			actionExecuted = true;
		}

		// On inventory item change
		mp.events.call(`onInventoryUpdate`, target, action);

		if (actionExecuted !== true) return false;

		target.createAmplitudeEvent(`Item ${getActionText(action)} from inventory`, {
			...inventoryItem,
			actioner: player.info.username
		});

		return true;
	} catch (err) {
		target.sendErrorMessage('Server', 'system', `Internal item processor error. Please contact our administrators.`, 'system');
		target.updateInventoryInterface();
		await logError(`ITEM_PROCESSOR_ERROR`, err);
		return false;
	}
});

// If the user wants to drop an item these checks will be made first.

const safetyCheckBeforeDropping = (player: PlayerMp, target: PlayerMp) => {
	const globalLang = i18n.getLanguagePack('ItemRegistry', player.info.language);

	if (mp.items.getNearbyDrops(target.position, MAX_PICKUP_ITEM_RANGE).length >= MAX_INVENTORY_SLOTS_PER_PAGE) {
		player.toast({ type: 'error', message: globalLang.get('DROP_LIMIT') });
		return false;
	}

	return true;
};
