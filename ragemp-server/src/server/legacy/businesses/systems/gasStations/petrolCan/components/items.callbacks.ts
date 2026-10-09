import { getNativeWeapon } from '@server/natives/weapons/components/core';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { getNearbyPumpStation, getNearbyVehiclesWithPetrolTanks } from '../../pump/components/functions';

export const onItemUse = async (player: PlayerMp, itemData: ExpectedAny) => {
	try {
		// Get the language
		const lang = getLanguagePack(`petrolCan:onItemUse`, player.lang);

		// Close inventory..
		player.closeInventory();

		// Is using a pump for refilling a vehicle
		if (player.vars.gasStationPump.gasStationId) return false;

		// Already holding petrol can..
		if (player.vars.petrolCan.status) return player.alert({ system: 'petrolCan', type: 'error', message: lang.get('alreadyHoldingPetrolCan') });

		// If the petrol can is empty and they are not near a petrol pump station
		if (!getNearbyPumpStation(player.position, 15) && itemData.meta.litres < 1) return player.alert({ system: 'petrolCan', type: 'error', message: lang.get('noGasStationNearby') });

		// If the petrol can has litres in it we allow them to take it out only if nearby vehicles or near gas s tations
		if (itemData.meta.litres > 0 && !getNearbyVehiclesWithPetrolTanks(player.position, 10) && !getNearbyPumpStation(player.position, 15)) {
			return player.alert({ system: 'petrolCan', type: 'error', message: lang.get('noVehicleNearby') });
		}

		// Is player in vehicle..
		if (player.vehicle) return player.alert({ system: 'petrolCan', type: 'error', message: lang.get(`cannotUseInVehicle`) });

		// Mark that we use this..
		player.updateVars({
			petrolCan: {
				status: 'idle',
				inventoryItemId: itemData.id,
				litres: itemData.meta.litres
			}
		});

		// Get the prop weapon
		const weapon = getNativeWeapon({ model: 'petrolcan' });
		if (!weapon) return false; // Error.

		// Give the weapon as a mission prop.
		player.setWeapon(
			weapon.id,
			999,
			{
				ammo: 1
			},
			{
				forceInHand: true
			}
		);

		// Disable the player escape
		player.triggerClientEvent(`setEscapeKeyDisabled`, { system: 'item:petrolCan', value: true });

		// Show informational message based on their sitaution
		const messageId = itemData.meta.litres < 1 || getNearbyPumpStation(player.position, 15) ? 'empty' : 'filledIn';
		player.alert({ system: 'petrolCan', type: 'info', message: lang.get(`instructions:${messageId}`), seconds: 30 });

		// How to get rid of it
		player.alert({ system: 'petrolCan', type: 'info', message: lang.get(`instructions:escape`) });

		// Get nearby pump
		const nearbyPump = getNearbyPumpStation(player.position, 3);

		// IF we are nearby a pump let's show the right pump use dialog.
		if (nearbyPump) {
			// Hide initial one
			player.hidePlayerDialog();

			// Show the new one that now has the button to fill petrol can..
			mp.events.call(`pump:onColshapeShowDialog`, player, { gasStationId: nearbyPump.gasStationId, pumpId: nearbyPump.pumpId });
		}
	} catch (err) {
		await logError(`onUseGasCan`, err);
	}
};

export const onItemDestroy = async (player: PlayerMp, itemData: ExpectedAny) => {
	// Cannot destroy the freaking item while using it.
	if (player.vars.petrolCan.status) return false;

	// Otherwise..
	player.deleteItem(itemData.id);

	return true;
};

export const onItemDropped = async (player: PlayerMp, itemData: ExpectedAny) => {
	// Cannot drop the freaking item while using it.
	if (player.vars.petrolCan.status) return false;

	// Otherwise..
	player.dropItem(itemData.id);

	return true;
};
