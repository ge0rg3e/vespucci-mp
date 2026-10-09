import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { logError } from '@server/utils/helpers';
import { deleteVehicle, PersonalVehicleEntities, PersonalVehicles, updateVehicle } from './core';
import { onVehicleDoorsLocked } from './functions';

mp.events.add('updatePhoneAppVehicles', (vehId, ownerId) => {
	// Update the data on the app for anyone using it.
	mp.players.forEachLoggedIn(async (target: PlayerMp) => {
		if (target.info.id === ownerId || (target.vars.checkingPersonalVehicles && target.vars.checkingPersonalVehicles.includes(vehId))) {
			const appId: ExpectedAny = await target.getPhoneApplicationRunning()!;
			if (!(appId === 'vehicles')) return;
			target.triggerBrowserEvent(`requestAppDataUpdate`);
		}
	});
});

mp.events.add('spawnVehicle', async (id, args) => {
	// Getting the vehicle...

	const veh = PersonalVehicles.find((v) => v.id === id);
	if (!veh) return false;
	try {
		// Getting the native info first..
		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });

		if (!nativeVehicleInfo) {
			// Actioning on it..
			await logError(`INVALID_VEHICLE_MODEL`, { model: veh.model, owner: veh.ownerName });
			await deleteVehicle(veh.id);
			return false;
		}

		// Spawning the entity..
		if (veh.status === 0 || veh.status == 2) {
			const entityOptions: ExpectedAny = {};

			const entityVariables: ExpectedAny = {
				fuel: veh.fuel,
				pVehicle: veh.id,
				pVehicleOwnerId: veh.ownerId,
				odometer: veh.odometer,
				locked: veh.locked,
				modifications: veh.modifications
			};

			if (veh.locations !== null) {
				entityOptions.heading = veh.locations.lastLocation.rotation.z; // Is good to have this on creation but not mandatory. Heading is just rotation.z.
				entityVariables.spawnLocation = {
					// When vehicle dies goes here
					position: veh.locations.parking.position,
					rotation: veh.locations.parking.rotation
				};
			}

			const spawnPosition = veh.locations === null ? args.player.position : veh.locations.lastLocation.position;

			const entity = mp.vehicles.createVehicle(veh.model, nativeVehicleInfo.hash, new mp.Vector3(spawnPosition), entityOptions, entityVariables);

			// Storing the entity ID for later to destroy
			PersonalVehicleEntities[veh.id] = entity.id;

			// Status for vehicle in garage is 2. We must make sure that status stays the same.
			// We have an event 'onVehicleSpawn' that teleports all vehicles with status 2 back into their garage positions.

			const dbUpdatePayload: ExpectedAny = {
				status: veh.status === 2 ? 2 : 1,
				lastSpawnAt: new Date()
			};

			if (veh.locations === null) {
				// Putting player in to vehicle..
				args.player.putIntoVehicle(entity, 0);

				// Leave the phone down for better user experience
				args.player.triggerClientEvent(`setPhoneIsRaised`, { boolean: false });

				dbUpdatePayload.locations = {
					parking: {
						position: entity.position,
						rotation: entity.rotation
					},
					lastLocation: {
						position: entity.position,
						rotation: entity.rotation
					}
				};
			}

			updateVehicle(veh.id, dbUpdatePayload, veh.locations ? false : true);
			return true;
		}

		return false;
	} catch (err) {
		await logError(`SPAWN_VEHICLE`, err, { vehId: veh.id, owner: veh.ownerName });
		return false;
	}
});

mp.events.add('despawnVehicle', async (id, onDisconnect = false) => {
	// Getting the vehicle...
	const veh = PersonalVehicles.find((v) => v.id === id);
	if (!veh) return false;

	try {
		if (veh.status === 1) {
			if (PersonalVehicleEntities[veh.id] === undefined) return false;

			const entityId = PersonalVehicleEntities[veh.id];
			const vehicleEntity = mp.vehicles.at(entityId);

			if (!vehicleEntity) return false;

			delete PersonalVehicleEntities[veh.id]; // delete it from the object.

			const lastLocation = {
				position: vehicleEntity.position,
				rotation: vehicleEntity.rotation
			};

			// Destroying the entity
			vehicleEntity.destroy();

			// Updating the status
			const dataUpdated: Partial<PersonalVehicle> = {
				status: 0,
				locations: {
					...veh.locations!,
					lastLocation
				}
			};

			updateVehicle(veh.id, dataUpdated, onDisconnect ? true : false);
			return true;
		}
		return false;
	} catch (err) {
		await logError(`DESPAWN_VEHICLE`, err, { vehId: veh.id, owner: veh.ownerName });
		return false;
	}
});

mp.events.add('playerQuit', (player) => {
	if (player.vars && player.vars.loggedIn) {
		const ownedVehicles = PersonalVehicles.filter((veh: PersonalVehicle) => veh.ownerId === player.info.id && veh.status === 1);
		ownedVehicles.forEach((veh: PersonalVehicle) => mp.events.call('despawnVehicle', veh.id, true));
	}
});

mp.events.add('changeVehicleLockState', (vehicle, state, bool2 = false) => {
	vehicle.updateVars({
		locked: state
	});

	vehicle.locked = state;

	if (vehicle.vars.pVehicle && bool2 === false) {
		updateVehicle(vehicle.vars.pVehicle, { locked: state }, false);
	}
});

mp.events.add('onPlayerPressedVehicleLockKey', (player, targetedVehicleId, autoLock) => {
	let matched = false;

	let vehicleEntity = null;

	// If he's sitting in a vehicle..

	if (player.vehicle && player.vehicle.vars.pVehicle && (player.vehicle.vars.pVehicleOwnerId === player.info.id || player.getAdminLevel() > 0)) {
		vehicleEntity = player.vehicle;
	}

	if (player.vehicle && player.vehicle.vars.temporary && player.getAdminLevel() > 0) {
		vehicleEntity = player.vehicle;
	}

	// If he was looking at the door of a personal vehicle..

	if (targetedVehicleId !== null) {
		const entity = mp.vehicles.at(targetedVehicleId);
		if (entity && entity.vars.pVehicle && (entity.vars.pVehicleOwnerId === player.info.id || player.getAdminLevel() > 0)) {
			vehicleEntity = entity;
		}

		if (entity && entity.vars.temporary && player.getAdminLevel() > 0) {
			vehicleEntity = entity;
		}
	}

	// If not let's do range check..

	if (vehicleEntity === null) {
		// we don't want to do this if he's in a vehicle already. clearly he's trying to lock his curretn vehicle.

		mp.vehicles.forEachValidInRange(player.position, 3, (veh: VehicleMp) => {
			if (matched === true) return false; // avoiding double locking.

			if (veh.vars.pVehicle && (veh.vars.pVehicleOwnerId === player.info.id || player.checkPermission('feature.unlockAnyPersonalVehicle'))) {
				vehicleEntity = veh;
				matched = true;
			}

			if (veh.vars.temporary && player.getAdminLevel() > 0) {
				vehicleEntity = veh;
				matched = true;
			}

			return true;
		});
	}

	// Final checks..

	if (vehicleEntity) {
		// Can't lock vehicles in garage.
		if (player.vars.garageEntered) return false;

		mp.events.call('changeVehicleLockState', vehicleEntity, !vehicleEntity.vars.locked);

		onVehicleDoorsLocked(vehicleEntity, !vehicleEntity.vars.locked, autoLock);
	}

	return false;
});

mp.events.add('onPlayerLogin', (player) => {
	const ownedVehicles = PersonalVehicles.filter((veh: PersonalVehicle) => veh.ownerId === player.info.id && veh.autoSpawn === true && veh.status === 0 && veh.locations !== null);

	if (ownedVehicles.length < 1) return false;
	const spawnedVehicles: ExpectedAny = [];

	ownedVehicles.forEach((veh: PersonalVehicle) => {
		spawnedVehicles.push({
			model: veh.model,
			id: veh.id,
			location: veh.locations ? veh.locations.lastLocation : `First time`
		});
		mp.events.call('spawnVehicle', veh.id);
	});

	if (spawnedVehicles.length > 0) {
		player.createAmplitudeEvent(`Spawned personal vehicle`, {
			autoSpawn: true,
			vehicles: spawnedVehicles
		});
	}

	return true;
});

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		checkingPersonalVehicles: null,
		checkingVehMethodType: null,
		checkingVehPlayerId: null
	});
});
