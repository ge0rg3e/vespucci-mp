import PersonalVehiclesDb from '@modules/database/game/vehicles/repository';

import { logError } from '@server/utils/helpers';
import { green } from 'colorette';
import { createVehicleParams } from './types';

export let PersonalVehicles: Array<PersonalVehicle> = [];
export const PersonalVehicleEntities: Record<string, number> = {};

export const loadVehicles = async () => {
	try {
		const arr = await PersonalVehiclesDb.getVehicles();

		PersonalVehicles = arr.map((v: PersonalVehicle) => ({
			...v,
			// Extra fields:
			// Warning: Make sure to include them on updateVehicle "extraKeys" to not crap the db update.
			// Warning: Also make sure they're not saved on Tasks.ts
			lastRespawnAt: null,
			lastSpawnAt: null
		}));

		// Setting status to zero where status was 1 to make sure the player can re-spawn his vehicle

		PersonalVehicles.filter((veh: PersonalVehicle) => veh.status === 1).forEach((veh: PersonalVehicle) => {
			updateVehicle(veh.id, {
				status: 0
			});
		});

		console.info(`${green('[DONE]')} Loaded ${PersonalVehicles.length} personal vehicles`);

		mp.phone.install({
			id: `vehicles`,
			sortNumber: 3,
			checkAccess: (player) => (PersonalVehicles.find((v) => v.ownerId === player.info.id) ? true : false)
		});

		// Required to inform garages system
		mp.events.call('onVehiclesLoaded', PersonalVehicles);
	} catch (err) {
		await logError(`LOAD_PERSONAL_VEHICLES`, err);
		process.exit(1);
	}
};

export const createVehicle = async (args: createVehicleParams) => {
	try {
		// Get the arguments..
		const { displayName, model, ownerId, ownerName, modifications, fuel } = args;

		const VehicleCreated: ExpectedAny = await PersonalVehiclesDb.createVehicle({
			model,
			displayName,
			ownerId,
			ownerName,
			modifications: JSON.stringify(modifications),
			fuel,
			expiresAt: args.expiresAt ? args.expiresAt : null
		});

		PersonalVehicles.push(VehicleCreated);

		// Update the vehicles app if he's having it opened..
		mp.events.call('updatePhoneAppVehicles', VehicleCreated.id, args.ownerId);

		return VehicleCreated;
	} catch (err) {
		await logError(`CREATE_PERSONAL_VEHICLE`, err, args);
		return null;
	}
};

export const deleteVehicle = async (vehicleId: number) => {
	try {
		// Delete it from game

		const v = PersonalVehicles.find((v) => v.id === vehicleId);
		if (!v) return; // failed to find it.

		const ownerId = v.ownerId;
		const oldId = v.id;

		if (v.status === 1) {
			mp.events.call('despawnVehicle', v.id);
		} else if (v.status === 2) {
			mp.events.call(`abandonVehicleInGarage`, v.id);
		}

		// Delete it from DB
		await PersonalVehiclesDb.destroy({ where: { id: vehicleId } });

		// Remove it from the array
		const index = PersonalVehicles.findIndex((item: PersonalVehicle) => item.id === vehicleId);
		PersonalVehicles.splice(index, 1);

		// Update the vehicles app if he's having it opened..
		mp.events.call('updatePhoneAppVehicles', oldId, ownerId);

		return true;
	} catch (err) {
		await logError(`DELETE_PERSONAL_VEHICLE`, err, {
			personalVehicleId: vehicleId
		});
		return false;
	}
};

export const updateVehicle = async (vehicleId: number, fields?: Partial<PersonalVehicle>, updateDatabase = true, avoidPhoneUpdate = false) => {
	try {
		const indexOf = PersonalVehicles.findIndex((elm: PersonalVehicle) => elm.id === vehicleId);
		if (indexOf === -1) return; // Failed to find it.

		// Sometimes we just want to quickly update the entity server-side without updating db..
		if (updateDatabase === true) {
			const args: ExpectedAny = { ...fields };

			const fieldMustBeStringified = ['locations', 'modifications', 'garageEntranceCoords'];
			const extraFields = ['lastRespawnAt', 'lastSpawnAt']; // Fields that don't exist in the database.

			Object.keys(args).forEach((key: string) => {
				if (fieldMustBeStringified.includes(key)) {
					args[key] = JSON.stringify(args[key]);
				}

				if (extraFields.includes(key)) {
					delete args[key];
				}
			});

			await PersonalVehiclesDb.update(args, { where: { id: vehicleId } });
		}

		PersonalVehicles[indexOf] = {
			...PersonalVehicles[indexOf],
			...fields
		};

		// @Reminder: We don't want to update all existing colshapes markers at payday for nothing.
		if (avoidPhoneUpdate === false) {
			const fieldsTriggeringPhoneUpdate: Array<keyof PersonalVehicle> = ['status', 'locked', 'odometer']; // Add here if ever want to update phone in real time.

			if (fields && Object.keys(fields!).filter((k: ExpectedAny) => fieldsTriggeringPhoneUpdate.includes(k)).length > 0) {
				// Update the vehicles app if he's having it opened..
				mp.events.call('updatePhoneAppVehicles', vehicleId, PersonalVehicles[indexOf].ownerId);
			}
		}
	} catch (err) {
		await logError(`UPDATE_PERSONAL_VEHICLE`, err, {
			vehicleId,
			fields
		});
	}
};
