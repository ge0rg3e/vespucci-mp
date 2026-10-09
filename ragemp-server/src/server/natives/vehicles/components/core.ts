import VehiclesDb from '@modules/database/natives/vehicles/repository';
import { VehicleNativeInfo } from './types';
import { green } from 'colorette';
import { logError } from '@server/utils/helpers';

export let nativeVehicles: Array<VehicleNativeInfo> = [];

export const loadNativeVehicles = async () => {
	try {
		// Load them from the database
		const res = await VehiclesDb.getVehicles();
		nativeVehicles = res;

		// Inform..
		console.info(`${green('[DONE]')} Loaded ${res.length} vehicle native information.`);

		// Emit event
		mp.events.call('onVehiclesNativesLoaded');
	} catch (err) {
		await logError(`LOAD_NATIVE_VEHICLES`, err);
		process.exit(1);
	}
};

const c = (str: string) => str.toString().trim().toLowerCase();

export const getVehicleNativeInfo = ({ model, displayName }: { model?: string; displayName?: string }) => {
	const match = nativeVehicles.find((veh: VehicleNativeInfo) => {
		if (model && c(veh.model) === c(model)) return true;
		if (displayName && c(veh.displayName) === c(displayName)) return true;
		return false;
	});
	if (!match) return null;
	return match;
};

/**
 * This function defines vehicle variables should be sent to client-side.
 */

export const getVehicleClientsideVariableKeys = () => {
	let arr: Array<keyof VehicleVars> = [
		// Tunning
		`modifications`,
		// General
		'engine',
		'model',
		'locked',
		'fuel',
		'dirtLevel',
		// Temp veh created with /veh
		'temporary',
		// Personal vehicle
		'pVehicle',
		'pVehicleOwnerId',
		'odometer'
	];

	return arr;
};
