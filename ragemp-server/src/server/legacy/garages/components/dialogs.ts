import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { PersonalVehicles } from '@server/legacy/vehicles/components/core';
import { GarageInteriors } from '@server/definitions/garageInteriors';
import { Garages } from './core';
import { parkVehicleInGarage, removeVehicleFromGarage } from './functions';

mp.events.add('onDialogResponse', async function (player, response) {
	if (response.dialogId !== 'garageEntranceDialog') return false;
	// Getting the garage
	const garage = Garages.find((g: Garage) => g.id === response.payload.garageId);
	if (!garage) return false;

	// Entering the garage
	if (response.responseKey === 'F') {
		if (player.vehicle) return player.hidePlayerDialog();
		player.stopAnimation(); // bugfix: If vehicle is nearby sometimes the player will start the action of entering a vehicle.
		await player.startLoadingScreen();
		player.enterGarage(garage.id, 'outside');
		await player.stopLoadingScreen();
		return true;
	}

	if (response.responseKey === 'G') {
		const isDriver = player.vehicle && player.vehicle.getOccupant(0) === player ? true : false;
		if (!isDriver) return player.hidePlayerDialog();

		// People in the vehicle
		const occupants = player.vehicle.getOccupantsPatched();

		// We await until everyone has a dark screen..
		for (let index = 0; index < occupants.length; index++) {
			const occupant = occupants[index];
			await occupant.startLoadingScreen();
		}

		// Mark all people in the vehicle as loading and play the sound..
		player.vehicle.getOccupantsPatched().forEach((occupant: PlayerMp) => {
			occupant.playSoundEffect(`${`__ASSETS__`}/audios/systems/garages/door.mp3`, { volume: 0.3 });
			occupant.triggerClientEvent(`setUnableToLeaveVehicle`, { bool: true });
		});

		const res = await parkVehicleInGarage(player, response.payload.garageId);

		// It failed to park it due to validation issues.
		if (res !== true) {
			player.vehicle.getOccupantsPatched().forEach((occupant: PlayerMp) => {
				occupant.stopLoadingScreen();
				occupant.triggerClientEvent(`setUnableToLeaveVehicle`, { bool: false });
			});

			return false;
		}

		return true;
	}

	if (response.responseKey === 'ESC') {
		player.hidePlayerDialog();
		return true;
	}
	return false;
});

mp.events.add('onDialogResponse', async function (player, response) {
	if (response.dialogId !== 'garageExitDialog') return false;

	// Getting the garage..
	const garage = Garages.find((g: Garage) => g.id === response.payload.garageId);
	if (!garage) return false;

	// Getting the garage interior
	const garageInterior = GarageInteriors.find((int) => int.id === garage.interiorId);
	if (!garageInterior) return false;

	if (response.responseKey === 'F' && !player.vehicle) {
		player.stopAnimation(); // bugfix: If vehicle is nearby sometimes the player will start the action of entering a vehicle.
		await player.startLoadingScreen();
		player.exitGarage(garage.id, 'outside');
		await player.stopLoadingScreen();
		return true;
	}

	if (response.responseKey === 'G' && !player.vehicle) {
		await player.startLoadingScreen();
		player.exitGarage(garage.id, 'house');
		// If it's a house garage..
		if (garage.type == 1) {
			player.enterHouse(garage.ownerId);
		}
		await player.stopLoadingScreen();
		return true;
	}

	return false;
});

mp.events.add('onDialogResponse', async function (player, response) {
	if (response.dialogId !== 'garageVehicle') return false;
	if (player.vars.garageEntered === null) return false;

	// Making sure that they have a vehicle, they're the driver and is a personal vehicle.

	if (response.responseKey === 'G' && player.vehicle && player.vehicle.getOccupant(0) === player && player.vehicle.vars.pVehicle) {
		// Getting the personal vehicle
		const veh = PersonalVehicles.find((v) => v.id === player.vehicle.vars.pVehicle);
		if (!veh) return false;

		// Getting the garage information first
		const garage = Garages.find((g) => g.id === veh.garageId);
		if (!garage) return false;

		// Getting the native veh info
		const nativeVehicleInfo = getVehicleNativeInfo({ model: player.vehicle.vars.model });
		if (!nativeVehicleInfo) return false;

		// People in the vehicle
		const occupants = player.vehicle.getOccupantsPatched();

		// We await until everyone has a dark screen..
		for (let index = 0; index < occupants.length; index++) {
			const occupant = occupants[index];
			await occupant.startLoadingScreen();
		}

		// Play the sound now..
		occupants.forEach(async (target: PlayerMp) => {
			// Play the sound..
			target.playSoundEffect(`${`__ASSETS__`}/audios/systems/garages/door.mp3`, { volume: 0.3 });
			target.triggerClientEvent(`setUnableToLeaveVehicle`, { bool: true });
		});

		const res = await removeVehicleFromGarage(player.vehicle.vars.pVehicle, response.payload.garageId);

		// If it failed to remove it from garage due to an error or validation..
		if (!res) {
			player.vehicle.getOccupantsPatched().forEach(async (target: PlayerMp) => {
				await target.stopLoadingScreen();
				target.triggerClientEvent(`setUnableToLeaveVehicle`, { bool: false });
			});
			return false;
		}

		player.vehicle.getOccupantsPatched().forEach(async (target: PlayerMp) => {
			await target.stopLoadingScreen();
			target.triggerClientEvent(`setUnableToLeaveVehicle`, { bool: false });
		});

		// If it failed to remove it from garage due to an error or validation..
		if (!res) return false;

		player.createAmplitudeEvent(`Driven vehicle from garage`, {
			vehicleId: veh.id,
			vehicleModel: nativeVehicleInfo.displayName,
			garageId: garage.id,
			garageSlot: veh.garageSlot,
			hisVehicle: veh.ownerId === player.info.id ? 'Yes' : 'No'
		});

		return true;
	}

	return false;
});
