import * as rpc from 'rage-rpc';

import { SpeedometerData } from './types';
import { logClientsideError } from '@client/general/errors';
import { playerBelt } from '@client/general/misc';
import { isTestDriveDealershipInProgress, vehicleTestDriveFuel, vehicleTestDriveModel } from '@client/legacy/dealership/components/testDrive';
import { getVehicleVariable } from '@client/utils/helpers';
import { getVehicleNativeInfo } from '@client/natives/nativeInformation';

// Variables
export let speedometerVisible = false;
const player = mp.players.local;

export const getData = async () => {
	try {
		// If we are not in a vehicle
		if (!player.vehicle) return null;

		// Check if we're inside test drive
		const drivingClientsideVehicle = isTestDriveDealershipInProgress() ? true : false;

		// If are driving we need to get the data with a different function
		if (drivingClientsideVehicle) return getClientsideData();

		// Getting engine health
		let engineHealth = player.vehicle.getEngineHealth() / 10; // is 1000 when is 100%

		// Getting the vehicle variables which are set by the server-side.
		const pVehicle = getVehicleVariable(player.vehicle.remoteId, 'pVehicle');
		const engineState = getVehicleVariable(player.vehicle.remoteId, 'engine');
		const lockedState = getVehicleVariable(player.vehicle.remoteId, 'locked');
		const vehicleFuel = getVehicleVariable(player.vehicle.remoteId, 'fuel');
		const vehicleModel = getVehicleVariable(player.vehicle.remoteId, 'model');
		const odometer = getVehicleVariable(player.vehicle.remoteId, 'odometer');

		// Check native info..
		const nativeInfo: ExpectedAny = await getVehicleNativeInfo(vehicleModel);
		if (!nativeInfo || (nativeInfo && nativeInfo.hasEngine === false)) return null;

		// The engine is off so we don't show.
		if (!engineState) return null; // Vehicle is off so we don't display speedometer.

		let payload: SpeedometerData = {
			isPersonalVehicle: pVehicle ? true : false,
			locked: lockedState || false,
			belt: playerBelt,
			// Numbers
			// Speed
			speed: parseInt((player.vehicle.getSpeed() * 3.6).toFixed(0)),
			maxSpeed: parseInt((mp.game.vehicle.getVehicleModelMaxSpeed(player.vehicle.model) * 3.6).toFixed(0)),
			// Others..
			fuel: vehicleFuel,
			maxFuel: nativeInfo.carTank,
			engineHealth,
			odometer: odometer || 0
		};

		return payload;
	} catch (err) {
		await logClientsideError(`hud.updateSpeedometer`, err);
		return null;
	}
};

/**
 * This function is used only when a vehicle is created in client-side and doesn't exist in server-side.
 * @returns
 */

export const getClientsideData = async () => {
	try {
		// Getting engine health
		let engineHealth = player.vehicle.getEngineHealth() / 10; // is 1000 when is 100%

		// Check native info..
		if (!vehicleTestDriveModel) return null; // nothing to use there.

		// Get native info..
		const nativeInfo: ExpectedAny = await getVehicleNativeInfo(vehicleTestDriveModel);
		if (!nativeInfo || (nativeInfo && nativeInfo.hasEngine === false)) return null;

		let payload: SpeedometerData = {
			isPersonalVehicle: false,
			locked: false,
			belt: playerBelt,
			// Numbers
			// Speed
			speed: parseInt((player.vehicle.getSpeed() * 3.6).toFixed(0)),
			maxSpeed: parseInt((mp.game.vehicle.getVehicleModelMaxSpeed(player.vehicle.model) * 3.6).toFixed(0)),
			// Others..
			fuel: isTestDriveDealershipInProgress() ? vehicleTestDriveFuel : 0,
			maxFuel: nativeInfo.carTank,
			engineHealth,
			odometer: 0
		};

		return payload;
	} catch (err) {
		await logClientsideError(`hud.speedometer.getClientsideData`, err);
		return null;
	}
};

export const updateInterfaceData = (payload: SpeedometerData) => {
	rpc.triggerBrowsers(`hud.speedometer.updateData`, JSON.stringify(payload));
};

export const setVisible = (value: boolean) => {
	rpc.triggerBrowsers(`hud.speedometer.setVisible`, JSON.stringify({ visible: value }));
	speedometerVisible = value;
};
