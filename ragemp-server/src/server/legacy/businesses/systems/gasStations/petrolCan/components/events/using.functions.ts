import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

export const onTimeoutVehicleFilled = async (accountId: number) => {
	try {
		// Get the player entity after timeout (which now maybe he left the game)
		const player = mp.players.atAccountId(accountId);
		if (!player) return;

		// Keep track of vars (The event below will reset them to null)
		const vars: PlayerVariables['petrolCan'] = player.vars.petrolCan;

		// Inform server.
		mp.events.call(`petrolCan:stopUsingOnVehicle`, player, `Finished waiting to fill the vehicle`);

		// Get vehicle
		const vehicle = mp.vehicles.at(vars.vehicleId!);
		if (!vehicle) return false;

		// Get native info..
		const nativeInfo = getVehicleNativeInfo({ model: vehicle.vars.model });
		if (!nativeInfo) return false;

		// Calculate the new fuel
		let oldFuel = vehicle.vars.fuel; // Store the old fuel level
		let newFuel = oldFuel + vars.litres;

		// They can't fill more than that.
		if (newFuel > nativeInfo.carTank) {
			newFuel = nativeInfo.carTank;
		}

		// Calculate how many liters were used
		let litersUsed = parseInt((newFuel - oldFuel).toFixed(0));

		// Update vehicle
		vehicle.setFuel(newFuel);

		// Get item data
		const item = player.getInventoryItemMatch({ id: vars.inventoryItemId! });
		if (!item) return false; //Very odd.

		// Update item to set litres to zero.
		player.updateItem(vars.inventoryItemId!, {
			meta: {
				...item.meta,
				litres: item.meta.litres - litersUsed // Deduct used liters from the petrol can
			}
		});

		// Get language pack
		const lang = getLanguagePack(`petrolCan:onTimeoutSuccessful`, player.lang);

		// Inform user
		player.alert({ system: 'petrolCan', type: 'success', message: lang.get(`SuccessFill`, { litres: newFuel }), seconds: 15 });

		// Track amplitude the success.
		player.createAmplitudeEvent(`Filled vehicle with Petrol Can`, { newFuel, vehicleModel: nativeInfo.displayName });

		return true;
	} catch (err) {
		await logError(`petrolCan.onTimeoutVehicleFilled`, err);
		return false;
	}
};
