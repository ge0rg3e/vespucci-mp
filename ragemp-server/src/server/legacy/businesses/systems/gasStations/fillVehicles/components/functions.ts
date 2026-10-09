/**
 *
 * @param vehicleId
 * @returns The player who has nozzle attached to vehicle.
 */

import { logError } from '@server/utils/helpers';
import { GasStations } from '../../business/components/functions';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { getLanguagePack } from '@vmp/i18n';

export const isNozzleAttachedToVehicle = (vehicleId: number) => {
	return mp.players.toArrayLoggedInFind((p: PlayerMp) => p.vars.gasStationPump.gasStationId && p.vars.gasStationPump.vehicleId === vehicleId);
};

/**
 * This task is filling the vehicle that he has the nozzle in and is called every second.
 * @param player
 */

export const TaskFillVehicleAtGasStation = async (accountId: number) => {
	try {
		// Get the player
		const player = mp.players.atAccountId(accountId);

		// If the player no longer exists..
		if (!player) return false;

		// Is using the pump
		if (!player.vars.gasStationPump.gasStationId) return false;

		// Is attached to vehicle still
		if (player.vars.gasStationPump.vehicleId === null) return false;

		// Get the vehicle
		const vehicle = mp.vehicles.at(player.vars.gasStationPump.vehicleId);
		if (!vehicle) return false;

		// Get vehicle native info to know its maximum litres capacity.
		const nativeInfo = getVehicleNativeInfo({ model: vehicle.vars.model });
		if (!nativeInfo) return false;

		// Get the gas station data.
		const gasStation = GasStations.find((c) => c.id === player.vars.gasStationPump.gasStationId);
		if (!gasStation) return false;

		// Does the player money to pay for the litre he's adding?
		if (!player.hasEnoughMoney(gasStation.costPerLitre)) {
			mp.events.call(`gasStation:stopFillingVehicle`, player, 'notEnoughMoney');
			return false;
		}

		// Take the moeny from the player
		player.takeMoney(gasStation.costPerLitre);

		// Give the vehicle the fuel.
		vehicle.setFuel(vehicle.vars.fuel + 1);

		// Update variable
		player.updateVars({
			gasStationPump: {
				...player.vars.gasStationPump,
				litres: player.vars.gasStationPump.litres! + 1
			}
		});

		// If car tank is now full
		if (vehicle.vars.fuel >= nativeInfo!.carTank) return mp.events.call(`gasStation:stopFillingVehicle`, player, 'finished');

		return true;
	} catch (err) {
		await logError(`TaskFillVehicleAtGasStation`, { accountId });
		return false;
	}
};

/**
 * If they fail to put the nozzle into a vehicle in 30 seconds.
 * @param accountId
 */

export const TaskFailedToPutNozzleInVehicle = async (accountId: number) => {
	try {
		// Get the player
		const player = mp.players.atAccountId(accountId);

		// If the player no longer exists..
		if (!player) return false;

		// Is no longer using the pump.
		if (!player.vars.gasStationPump.gasStationId) return false;

		// If they have added it  into a vehicle is all good.
		if (player.vars.gasStationPump.vehicleId !== null) return false;

		// Lang
		const lang = getLanguagePack(`gasStation:insertNozzleInVehicle`, player.lang);

		// If not..
		mp.events.call(`pump:cancelHoldingNozzle`, player, `Failed to insert nozzle in vehicle`);

		// Alert to player..
		player.alert({ system: 'gasStationPump', type: 'error', message: lang.get(`failedToAttachPump`) });
		return true;
	} catch (err) {
		await logError(`TaskFailedToPutNozzleInVehicle`, err);
		return false;
	}
};
