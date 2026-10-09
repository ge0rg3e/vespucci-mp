import { logError } from '@server/utils/helpers';

// Dependencies
import { green } from 'colorette';
import { RentingLocation, RentingVehicle } from './types';
import { v4 as uuidv4 } from 'uuid';

// Definitions
import StaticRentingLocations from '@server/definitions/rentingLocations';
import { getVehicleNativeInfo, nativeVehicles } from '@server/natives/vehicles/components/core';
import { getLanguagePack } from '@vmp/i18n';
import { getDefaultVehicleModifications } from '@server/legacy/businesses/systems/tunning/components/functions';

export let rentingLocations: Array<RentingLocation> = [];
export const rentingVehicles: Array<RentingVehicle> = [];

export const loadRentingLocations = async () => {
	try {
		// Later down the line maybe we can turn this into a database? For now for rapid development let's not.
		rentingLocations = [...StaticRentingLocations];

		rentingLocations.forEach((r: RentingLocation) => {
			mp.events.call('onRentingLocationCreated', r);
		});

		// Figuring out the number of unique models available to rent in-game.
		const modelsToRent: Array<string> = [];

		rentingLocations.forEach((r) => {
			r.vehicles.forEach((s) => {
				// If the renting location has an invalid model...
				if (!nativeVehicles.find((v) => v.model === s.model)) throw new Error(`Renting Location (ID ${r.id}) has an invalid model in his stock: "${s.model}"`);

				// Adding id to the models list
				if (!modelsToRent.includes(s.model)) {
					modelsToRent.push(s.model);
				}
			});
		});

		console.info(`${green('[DONE]')} Loaded ${rentingLocations.length} vehicles renting locations (${modelsToRent.length} vehicle models)`);
	} catch (err) {
		await logError(`LOAD_VEHICLE_RENTING_LOCATIONS`, err);
		process.exit(1);
	}
};

export const updateRentingVehicle = (rentId: string, fields?: Partial<RentingVehicle>) => {
	const rentIndex = rentingVehicles.findIndex((r) => r.id === rentId);
	if (rentIndex === -1) return false;

	rentingVehicles[rentIndex] = {
		...rentingVehicles[rentIndex],
		...fields
	};

	return true;
};

export const createRentingVehicle = (ownerId: number, model: string, position: Vector3, costPerMinute: number) => {
	// Getting vehicle native info
	const nativeInfo = getVehicleNativeInfo({ model });
	if (!nativeInfo) return false;

	// The id of this new rented vehicle.
	const id = uuidv4();

	// Creating the new entity vehicle
	const entity = mp.vehicles.createVehicle(
		model,
		model,
		position,
		{},
		{
			fuel: nativeInfo?.carTank,
			rVehicle: id,
			rVehicleOwnerId: ownerId,
			modifications: {
				...getDefaultVehicleModifications(model)
			}
		}
	);

	// Adding it to the array.
	rentingVehicles.push({
		id,
		ownerId,
		entityId: entity.id,
		model,
		costPerMinute,
		minutesOutside: 0,
		startedAt: new Date() // to know when this rent started
	});

	return {
		entity,
		id
	};
};

export const destroyRentingVehicle = (rentId: string) => {
	const rentingIndex = rentingVehicles.findIndex((r) => r.id === rentId);
	if (rentingIndex === -1) return false;
	const rentingVeh = rentingVehicles[rentingIndex];
	if (rentingVeh.entityId === null) return false;

	const entity = mp.vehicles.at(rentingVeh.entityId!);
	if (!entity) return false;

	entity.destroy();

	// Splice from the list.
	rentingVehicles.splice(rentingIndex, 1);

	return true;
};

export const stopVehicleRenting = (rentId: string, reason: string) => {
	// Get the renting ...
	const rentingIndex = rentingVehicles.findIndex((r) => r.id === rentId);
	if (rentingIndex === -1) return false;

	const rentingVeh = rentingVehicles[rentingIndex];

	// Inform the player...
	const player = mp.players.toArrayLoggedInFind((p: PlayerMp) => p.info.id === rentingVeh.ownerId);
	if (!player) return false;

	// Get the language
	const lang = getLanguagePack('RentingLocations:TaskCharging', player.info.language);

	// Get the native Info
	const nativeInfo = getVehicleNativeInfo({ model: rentingVeh.model });
	if (!nativeInfo) return false;

	// Inform him..
	player.alert({ type: 'warning', message: lang.get('StoppedRent', { reason, model: nativeInfo.displayName }) });

	// Destroy the rent
	destroyRentingVehicle(rentId);

	// Resetting the player variables
	player.updateVars({
		rentingVehicleId: null
	});

	return true;
};
