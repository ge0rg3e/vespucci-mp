import { isInRange, logError } from '@server/utils/helpers';
import { getNearbyVehiclesWithPetrolTanks } from '../../pump/components/functions';
import { getLanguagePack } from '@vmp/i18n';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { TaskFailedToPutNozzleInVehicle, TaskFillVehicleAtGasStation, isNozzleAttachedToVehicle } from './functions';
import { GasStations } from '../../business/components/functions';
import { cancelInterval, createInterval, isIntervalValid } from '@server/natives/intervals';
import { cancelTimeout, createTimeout, isTimeoutValid } from '@server/natives/timeouts';

mp.events.add(`gasStation:pickNozzle`, async (player: PlayerMp, payload: ExpectedAny) => {
	try {
		// Get language
		const lang = getLanguagePack(`gasStation:pickNozzle`, player.lang);

		// If is in vehicle he cannot do this.
		if (player.vehicle) return false;

		// There is no vehicle nearby to fill.
		if (!getNearbyVehiclesWithPetrolTanks(player.position, 15)) {
			return player.alert({ system: 'gasStationPump', type: 'error', message: lang.get(`noVehiclesNearby`), seconds: 15 });
		}

		// Get gas station data
		const gasStation = GasStations.find((c) => c.id === payload.gasStationId);
		if (!gasStation) return false;

		// Has at least money enough to pay for 1 litre of gas?
		if (!player.hasEnoughMoney(gasStation.costPerLitre)) return player.alert({ system: 'gasStationPump', type: 'error', message: lang.get(`notEnoughMoney`), seconds: 15 });

		// Already holding the nozzle - This event shouldn't be called.
		if (player.vars.gasStationPump.gasStationId) return false;

		// Mark him as using the pump
		player.updateVars({
			gasStationPump: {
				gasStationId: payload.gasStationId,
				position: payload.position,
				pumpId: payload.pumpId,
				vehicleId: null,
				litres: null
			}
		});

		// Clear alerts to make sure we're claer.
		player.clearAlertsFromSystem('gasStationPump');

		// Amplitude
		player.createAmplitudeEvent(`Picked up Nozzle at Gas Station`);

		// Play sound
		player.playSoundEffect(`${`__ASSETS__`}/audios/systems/businesses/gasStations/pickup.ogg`, {
			volume: 0.45,
			spatialSound: {
				source: 'position',
				position: payload.position,
				maxDistance: 8
			}
		});

		// Disable the player escape
		player.triggerClientEvent(`setEscapeKeyDisabled`, { system: 'gasStation', value: true });

		// Instruct player
		player.alert({ system: 'gasStationPump', type: 'info', message: lang.get(`attachPumpToVehicle`), seconds: 10 });

		// Create timeout limit to put nozzle in 30 seconds.
		createTimeout(`checkPutNozzleInVehicle:${player.info.id}`, () => TaskFailedToPutNozzleInVehicle(player.info.id), 30 * 1000);
	} catch (err) {
		await logError(`gasStation:pickNozzle`, err, payload);
	}
});

mp.events.add(`gasStation:leaveNozzle`, async (player: PlayerMp) => {
	try {
		// Is not using any pump
		if (!player.vars.gasStationPump.gasStationId) return false;

		// If is in vehicle he cannot do this.
		if (player.vehicle) return false;

		// Invoke the other bits..
		mp.events.call(`pump:cancelHoldingNozzle`, player, `Left pump down`);

		// Clear alerts
		player.clearAlertsFromSystem('gasStationPump');

		// Amplitude
		player.createAmplitudeEvent(`Left Nozzle down at Gas Station`);

		// Play sound
		player.playSoundEffect(`${`__ASSETS__`}/audios/systems/businesses/gasStations/place.ogg`, {
			volume: 0.25,
			spatialSound: {
				source: 'position',
				position: player.vars.gasStationPump.position!,
				maxDistance: 8
			}
		});
		return true;
	} catch (err) {
		await logError(`gasStation:leaveNozzle`, err, {});
		return false;
	}
});

mp.events.add(`pump:cancelHoldingNozzle`, (player: PlayerMp, reason: string) => {
	// Get language
	const lang = getLanguagePack(`gasStation:cancelHoldingNozzle`, player.lang);

	// We don't want to call this if they were just filling the can.
	if (player.vars.petrolCan.status) return false;

	// Disable the player escape
	player.triggerClientEvent(`setEscapeKeyDisabled`, { system: 'gasStation', value: false });

	// Inform
	player.createAmplitudeEvent(`Stopped using the Nozzle at Gas Station`, { reason: reason || 'Unknown' });

	// If he was filling at gas station
	if (isIntervalValid(`fillVehicleAtGasStation:${player.info.id}`)) {
		// Clear interval
		cancelInterval(`fillVehicleAtGasStation:${player.info.id}`);

		// Stop the sound..
		player.stopAudio(`gasStation:fillingVehicle`);
	}

	// Clear timeout
	if (isTimeoutValid(`checkPutNozzleInVehicle:${player.info.id}`)) {
		cancelTimeout(`checkPutNozzleInVehicle:${player.info.id}`);
	}

	// If reason is related to far away from vehicle then alert the player
	if (reason === 'Went too far from the vehicle he was filling.')
		return player.alert({
			system: 'gasStationPump',
			type: 'error',
			message: lang.get(`farAwayFromVehicle`)
		});

	return true;
});

mp.events.add('gasStation:onEscape', (player: PlayerMp) => {
	if (!player.vars.gasStationPump.gasStationId) return false;
	if (player.vars.gasStationPump.vehicleId !== null) return false;

	// Invoke this event so the sub-systems can act.
	mp.events.call(`pump:cancelHoldingNozzle`, player, 'Pressed ESC');

	return true;
});

mp.events.add(`gasStation:insertNozzleInVehicle`, (player: PlayerMp, vehicleId: number) => {
	// Get language
	const lang = getLanguagePack(`gasStation:insertNozzleInVehicle`, player.lang);

	// Get the vehicle
	const vehicle = mp.vehicles.at(vehicleId);
	if (!vehicle) return false;

	// Has engine tank
	const nativeInfo = getVehicleNativeInfo({ model: vehicle.vars.model });
	if (!nativeInfo) return false;

	// If we didn't even use the pump at all
	if (!player.vars.gasStationPump.gasStationId) return false;

	// If we have a vehicle attached to already.
	if (player.vars.gasStationPump.vehicleId !== null) return false;

	// This model does not have a tank.
	if (nativeInfo.carTank === 0) return player.alert({ system: 'gasStationPump', type: 'error', message: lang.get(`noCarTank`) });

	// Is nozzle attached
	if (isNozzleAttachedToVehicle(vehicleId)) return player.alert({ system: 'gasStationPump', type: 'error', message: lang.get(`nozzleAlreadyAttached`) });

	// If filling a petrol can
	if (player.vars.petrolCan.status === 'refilling') return player.alert({ system: 'gasStationPump', type: 'error', message: lang.get(`currentlyFillingPetrolCan`) });

	// Is vehicle full already
	if (vehicle.vars.fuel >= nativeInfo.carTank) return player.alert({ system: 'gasStationPump', type: 'error', message: lang.get(`vehicleIsFull`) });

	// Clear timeout
	if (isTimeoutValid(`checkPutNozzleInVehicle:${player.info.id}`)) {
		cancelTimeout(`checkPutNozzleInVehicle:${player.info.id}`);
	}

	// Play sound
	player.playSoundEffect(`${`__ASSETS__`}/audios/systems/businesses/gasStations/mount.ogg`, {
		volume: 0.45,
		spatialSound: {
			source: 'position',
			position: vehicle.position,
			maxDistance: 8
		}
	});

	// Update the player vars
	player.updateVars({
		gasStationPump: {
			...player.vars.gasStationPump,
			vehicleId,
			litres: 0
		}
	});

	// Clear alerts
	player.clearAlertsFromSystem('gasStationPump');

	// Track on amplitude
	player.createAmplitudeEvent(`Attached nozzle to vehicle`, {
		model: nativeInfo.displayName,
		isPersonalVehicle: vehicle.vars.pVehicle ? `ID: ${vehicle.vars.pVehicle}` : `No.`
	});

	// Create interval and start charging the vehicle...
	createInterval(`fillVehicleAtGasStation:${player.info.id}`, () => TaskFillVehicleAtGasStation(player.info.id), 1000);

	// Play sound
	player.playSoundEffect(`${`__ASSETS__`}/audios/systems/businesses/gasStations/fillingVehicle.mp3`, {
		volume: 0.3,
		loop: true,
		identifier: 'gasStation:fillingVehicle',
		spatialSound: {
			source: 'position',
			position: player.vars.gasStationPump.position!,
			maxDistance: 8
		}
	});
});

mp.events.add(`gasStation:stopFillingVehicle`, (player: PlayerMp, reason: string) => {
	// They shouldn't use this event.
	if (!player.vars.gasStationPump.gasStationId && player.vars.gasStationPump.vehicleId !== null) return false;

	// Get the language
	const lang = getLanguagePack(`gasStation:filling`, player.lang);

	// Get the gas station data
	const gasStation = GasStations.find((c) => c.id === player.vars.gasStationPump.gasStationId);
	if (!gasStation) return false;

	// If they ran out of money we tell them that first.
	if (reason === 'notEnoughMoney') {
		player.alert({ system: 'gasStationPump', type: 'error', message: lang.get(`ranOutOfMoney`), seconds: 15 });
	}

	// Clear interval
	cancelInterval(`fillVehicleAtGasStation:${player.info.id}`);

	// If they managed to fill something we tell them the cost.
	if (player.vars.gasStationPump.litres! > 0) {
		player.alert({
			system: 'gasStationPump:Success', // To avoid clearing the warning.
			type: 'success',
			message: lang.get(`finishMessage`, { litres: player.vars.gasStationPump.litres, cost: gasStation.costPerLitre * player.vars.gasStationPump.litres! }),
			seconds: 10
		});
	}

	// If reason is not "removedNozzle" we must call the remove nozzle to remove the nozzle form the vehicle.
	if (reason !== 'removedNozzle') {
		// Call this to remove the nozzle from the vehicle..
		mp.events.call(`gasStation:removeNozzleFromVehicle`, player, player.vars.gasStationPump.vehicleId, 'stopFillingVehicle');
	}

	// Stop the sound..
	player.stopAudio(`gasStation:fillingVehicle`);

	return true;
});

// finished calls gasStation:remove nozzle but then remove nmozzle calls the other one.

mp.events.add(`gasStation:removeNozzleFromVehicle`, (player: PlayerMp, vehicleId: number, method: string) => {
	// Get the vehicle
	const vehicle = mp.vehicles.at(vehicleId);
	if (!vehicle) return false;

	// If there is no nozzle attached or we are not the ones who attached it.
	if (!isNozzleAttachedToVehicle(vehicleId) || (isNozzleAttachedToVehicle(vehicleId) && isNozzleAttachedToVehicle(vehicleId) !== player)) return false;

	// Get native info
	const nativeInfo = getVehicleNativeInfo({ model: vehicle.vars.model });
	if (!nativeInfo) return false;

	// If they just pressed F to remove the nozzle.
	// @Reminder: This is important. This function is also called by stopFillingvehicle when the interval finishes so we don't want a loop.
	if (method === 'onKeyPressed') {
		// Call the event to inform the player
		mp.events.call(`gasStation:stopFillingVehicle`, player, 'removedNozzle');
	}

	// Play sound
	player.playSoundEffect(`${`__ASSETS__`}/audios/systems/businesses/gasStations/unmount.ogg`, {
		volume: 0.45,
		spatialSound: {
			source: 'position',
			position: vehicle.position,
			maxDistance: 8
		}
	});

	// Update the player vars
	player.updateVars({
		gasStationPump: {
			...player.vars.gasStationPump,
			vehicleId: null,
			litres: null
		}
	});

	// Track on amplitude
	player.createAmplitudeEvent(`Removed nozzle from vehicle`, {
		model: nativeInfo.displayName,
		isPersonalVehicle: vehicle.vars.pVehicle ? `ID: ${vehicle.vars.pVehicle}` : `No.`
	});

	return true;
});

// @Verification: We go too far from vehicle or the vehicle goes too far from us.
mp.events.add('everySecondForPlayerTimer', (player: PlayerMp) => {
	// They weren't filling a vehicle.
	if (!player.vars.gasStationPump.gasStationId) return false;
	if (player.vars.gasStationPump.vehicleId === null) return false;

	// Get vehicle data
	const veh = mp.vehicles.at(player.vars.gasStationPump.vehicleId!);

	// The vehicle does not exist anymore
	if (!veh) return mp.events.call(`pump:cancelHoldingNozzle`, player, 'Vehicle he was filling at Gas Station no longer exists');

	// Is still within range..
	if (isInRange(player.position, veh.position, 8)) return false;

	// Invoke this event so the sub-systems can act.
	mp.events.call(`pump:cancelHoldingNozzle`, player, 'Went too far from the vehicle he was filling.');

	return true;
});
