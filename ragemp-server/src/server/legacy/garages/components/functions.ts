import dimensions from '@server/definitions/dimensions';
import { GarageInterior, GarageInteriors } from '@server/definitions/garageInteriors';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { PersonalVehicleEntities, PersonalVehicles, updateVehicle } from '@server/legacy/vehicles/components/core';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { Garages } from './core';

// Reminder: In theory if in the future we want to support non-personal vehicles too for garage it should be relatively easy. Update this function accordingly.
// The only difference is that don't check if the veh is a personal veh + we don't update it in the db as status 2.

export const parkVehicleInGarage = async (player: PlayerMp, garageId: number) => {
	try {
		// Getting the language for all the texts, errors etc.
		const lang = getLanguagePack('Garages:ParkVehicleInGarage', player.info.language);

		// Getting the garage
		const garage = Garages.find((g: Garage) => g.id === garageId);
		if (!garage) return false;

		// Getting the garage interior
		const garageInterior = GarageInteriors.find((int) => int.id === garage.interiorId);
		if (!garageInterior) return false;

		// Safety check again..
		if (!player) return false;
		if (!player.vehicle) return false;

		// Is not the driver anymore..
		if (player.vehicle.getOccupant(0) !== player) return false;

		// If it's not his personal vehicle (except admins) nor a personal vehicle.
		if (!player.vehicle.vars.pVehicle || (player.vehicle.vars.pVehicle && player.vehicle.vars.pVehicleOwnerId !== player.info.id && player.getAdminLevel() === 0)) {
			player.alert({ type: 'error', message: lang.get('Toast:ErrorOnlyYourPersonalVehicles') });
			return false; // we must return false so the screen fade ends
		}

		// Checking if this garage slot is used by someone
		const mappedSpaces = garageInterior.coords.parkings.map((elm, ix) => ({
			occupied: PersonalVehicles.find((v) => v.status === 2 && v.garageId === garageId && v.garageSlot === ix) ? true : false,
			id: ix,
			coords: elm
		}));

		// Getting the one available space.
		const parkingSpace = mappedSpaces.find((p) => p.occupied === false);

		// If there is no space left..
		if (!parkingSpace) {
			player.alert({ message: lang.get('Toast:NoSpaceInGarage'), type: 'error' });
			return false; // we must return false so the screen fade ends
		}
		// Get the personal vehicle details
		const veh = PersonalVehicles.find((v) => v.id === player.vehicle.vars.pVehicle);

		// Safety checks..
		if (!veh) return false; // No match for that vehicle id.
		if (veh.status !== 1) return false; // The vehicle states that is not actually spawned.

		// Geting details about this vehicle..
		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });
		if (!nativeVehicleInfo) return false;

		// If the vehicle is too big..
		if (nativeVehicleInfo.size == 'large') {
			player.alert({ type: 'error', message: lang.get('Toast:VehicleTooBig') });
			return false; // we must return false so the screen fade ends
		}

		// Hiding the dialog for the player
		player.hidePlayerDialog();

		// Tracking the amplitude
		player.createAmplitudeEvent(`Parked vehicle in garage`, {
			vehicleId: veh.id,
			vehicleModel: nativeVehicleInfo.displayName,
			garageId: garage.id,
			garageSlot: parkingSpace.id,
			hisVehicle: veh.ownerId === player.info.id
		});

		// Saving the garage entrance position..
		const garageEntranceCoords = {
			position: player.vehicle.position,
			rotation: player.vehicle.rotation
		};

		// If there are any other player with him -- they will not go in garage with the player - they must enter manually.
		const occupants = player.vehicle.getOccupantsPatched();

		// Iterate through each player..
		occupants.forEach((target: PlayerMp) => {
			if (target !== player) {
				// Informing them of the action
				const lang2 = getLanguagePack(`Garages:Entrance`);
				target.alert({ type: 'success', message: lang2.get('Toast:DriverParkedHisVehicle', { driver: player.info.username }) });
			}

			// Updating the vars
			target.updateVars({ garageEntered: garage.id });

			// Mark them as unable to do damage while in garage
			target.triggerClientEvent(`setUnableToDoDamage`, { bool: true });

			// Loading the garage interior props if needed..
			loadGarageInteriorProps(target, garage, garageInterior);

			// Stop loading effect
			target.stopLoadingScreen();

			// Now he can leave the car
			target.triggerClientEvent(`setUnableToLeaveVehicle`, { bool: false });
		});

		// Updating dimensions
		player.vehicle.setDimension(garage.id + dimensions.garages);

		// Setting now the vehicle in garage accordingly.
		player.vehicle.setPositionPatched(new mp.Vector3(parkingSpace.coords.location));
		player.vehicle.rotation = new mp.Vector3(parkingSpace.coords.rotation);

		// Setting the lock state so everyone with access to garage can use the veh
		mp.events.call('changeVehicleLockState', player.vehicle, false, true);

		// Stopping the engine of that vehicle if it has any
		if (nativeVehicleInfo.hasEngine === true) {
			player.vehicle.updateVars({
				engine: false
			});
		}

		// Informing him how to take the vehicle out.
		player.showGarageParkedDialog(nativeVehicleInfo.displayName);

		// Updating the vehicle accordingly
		await updateVehicle(
			veh.id,
			{
				status: 2,
				garageId: garage.id,
				garageSlot: parkingSpace.id,
				garageEntranceCoords
			},
			false
		);

		// Syncing vehicle positions again to fix bugs..
		syncGarageVehiclePositions(garage, garageInterior);

		return true;
	} catch (err) {
		await player.stopLoadingScreen();
		await logError(`PARK_VEHICLE_IN_GARAGE`, err, {
			player: player.info.username,
			garageId
		});
		return false;
	}
};

// Reminder: The other way to remove vehicles from garage is through vehicles's ChangeSpawnState.

export const removeVehicleFromGarage = async (personalVehicleId: number, garageId: number) => {
	try {
		// Getting the garage
		const garage = Garages.find((g: Garage) => g.id === garageId);
		if (!garage) return false;

		// Getting the garage interior
		const garageInterior = GarageInteriors.find((int) => int.id === garage.interiorId);
		if (!garageInterior) return false;

		// Getting the personal vehicle
		const veh = PersonalVehicles.find((v) => v.id === personalVehicleId);

		// Safety checks..
		if (!veh) return false; // No match for that vehicle id.
		if (veh.status !== 2) return false; // The vehicle states that is in garage.

		// Getting the vehicle entity
		const entityId = PersonalVehicleEntities[veh.id];
		const entity = mp.vehicles.at(entityId);

		if (!entity) return false;

		// Getting vehicle native info..
		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });

		if (!nativeVehicleInfo) return false;

		// Teleporting the vehicle out of the garage and updating dimensions
		entity.setPositionPatched(new mp.Vector3(veh.garageEntranceCoords!.position!));
		entity.rotation = new mp.Vector3(veh.garageEntranceCoords!.rotation);
		entity.setDimension(0);

		// Setting the lock state back to original state
		mp.events.call('changeVehicleLockState', entity, veh.locked ? true : false, true);

		// If the vehicle has engine..
		if (nativeVehicleInfo.hasEngine) {
			entity.updateVars({
				engine: entity.vars.engineDamaged ? false : true
			});
		}

		// If there are any other player with him -- they will not go in garage with the player - they must enter manually.
		const occupants = entity.getOccupantsPatched();

		occupants.forEach((target: PlayerMp) => {
			// Updating this variable
			target.updateVars({ garageEntered: null });

			// Mark the target as able to do damage again
			target.triggerClientEvent(`setUnableToDoDamage`, { bool: false });

			// Unloading the garage interior props
			unloadGarageInteriorProps(target, garage, garageInterior);

			// If it's the driver..
			if (entity.getOccupant(0) === target) {
				// Hiding the dialog for the player so he won't be spammed by entrance dialog.
				target.hidePlayerDialog();
				target.setDialogCooldown(3000);

				// Making the vehicle driveable again. (Even for bikes.)
				target.vehicle.updateVars({ engine: true });
			}
		});

		// Updating the vehicle accordingly to mark that is no longer in garage.
		await updateVehicle(veh.id, { status: 1, garageId: null, garageSlot: null, garageEntranceCoords: null }, false);
		return true;
	} catch (err) {
		await logError(`REMOVE_VEHICLE_FROM_GARAGE`, err, {
			personalVehicleId,
			garageId
		});
		return false;
	}
};

export const loadGarageInteriorProps = async (player: PlayerMp, garage: Garage, interior: GarageInterior) => {
	if (!interior.props) return false;

	const props: Array<string> = [...interior.props!] || [];

	if (interior.id === 4 && garage.variantId) {
		// Fixing a bug where where user was in garage id 4, variant 3, warped, then entered another garage id 4 with variant 4 - props were still loaded.
		for (let index = 1; index < 10; index++) {
			// 1 to 9 variants
			const loaded: boolean = await player.invokeClientEvent(`isInteriorPropLoaded`, {
				prop: `entity_set_style_${index}`,
				...interior.coords.player.coords
			})!;

			if (loaded === true && garage.variantId !== index) {
				player.triggerClientEvent(`removeInteriorProps`, {
					props: [...props, `entity_set_style_${index}`],
					...interior.coords.player.coords
				});
			}
		}

		// adding the right one to load
		props.splice(0, 0, `entity_set_style_${garage.variantId}`);
	}

	player.triggerClientEvent(`loadInteriorProps`, {
		props,
		...interior.coords.player.coords
	});

	return true;
};

export const unloadGarageInteriorProps = async (player: PlayerMp, garage: Garage, interior: GarageInterior) => {
	if (!interior.props) return false;
	const props: Array<string> = [...interior.props] || [];

	if (interior.id === 4 && garage.variantId) {
		props.push(`entity_set_style_${garage.variantId}`);
	}

	player.triggerClientEvent(`removeInteriorProps`, {
		props,
		...interior.coords.player.coords
	});

	return true;
};

export const syncGarageVehiclePositions = async (garage: Garage, interior: GarageInterior) => {
	// Re-syncing the vehicles positions just in cause they're out of sync...
	// As of now (6th Aug) there's a bug where sometimes if vehicles explodes (because of hackers) they're not synced fully (rotation is not)
	// As of now 09th Aug: A big bug with interior id 4. Two vehicles fall out of the garage when someone parks another veh in it. Fuck RAGE:MP

	PersonalVehicles.filter((v) => v.status === 2 && v.garageId === garage.id).forEach((vehicle) => {
		const entityId = PersonalVehicleEntities[vehicle.id];
		const entity: VehicleMp = mp.vehicles.at(entityId);
		if (!entity) return;

		const parking = interior.coords.parkings[vehicle.garageSlot!];
		if (!parking) return;

		entity.position = new mp.Vector3(parking.location);
		entity.rotation = new mp.Vector3(parking.rotation);
	});

	return true;
};
