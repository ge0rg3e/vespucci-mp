import dimensions from '@server/definitions/dimensions';
import { GarageInteriors } from '@server/definitions/garageInteriors';
import { Houses } from '@server/legacy/houses/components/core';
import { PersonalVehicleEntities, PersonalVehicles, updateVehicle } from '@server/legacy/vehicles/components/core';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { Garages } from './core';

mp.events.add('onPlayerEnterColshape', function (player, colshape) {
	if (player.vars.dialogCooldown) return;

	const identifier = colshape.identifier;
	const payload = colshape.payload;

	if (!(identifier.includes(`GarageEntrance`) || identifier.includes(`GarageExit`))) return false;

	const garage = Garages.find((g: Garage) => g.id === payload!.garageId);

	if (garage === undefined) return false;

	if (identifier.includes(`GarageEntrance`)) {
		let canParkInGarage = false;

		// If the player is passenger in a vehicle and he's not the driver we should not show anything so the player won't go in the garage without the driver.
		if (player.vehicle && player.seat !== 0) return false;

		// If it's a garage type house..
		if (garage.type === 1) {
			const house = garage.type === 1 ? Houses.find((h) => h.id === garage.ownerId) : null;
			if (!house) return false;

			canParkInGarage = player.checkCanUseHouseGarage(house.id);

			// If the garage is a house-type and they don't have the required upgrade..
			if (canParkInGarage === true && garage.type === 1 && house.upgradeLevel < 3) {
				player.showGarageEntranceAccessDenied(2);
				return false;
			}
		}

		// In final.. if he can't park in it..
		if (canParkInGarage === false) {
			player.showGarageEntranceAccessDenied(1);
			return false;
		}

		player.showGarageEntranceDialog(garage.id, false);
		return true;
	}

	if (identifier.includes(`GarageExit`)) {
		player.showGarageExitDialog(garage.id);
		return false;
	}

	return;
});

mp.events.add('onPlayerExitColshape', function (player) {
	const garageDialogs = [`garageEntranceDialog`, `garageExitDialog`, `garageAccessDenied`];
	if (player.vars && player.vars.dialogId && garageDialogs.find((x: string) => player.vars.dialogId?.includes(x))) {
		player!.hidePlayerDialog();
		return;
	}
	return;
});

mp.events.add('onGarageDeleted', (garage) => {
	mp.players.forEachLoggedIn((p: PlayerMp) => {
		// Taking them out of the garage
		if (p.vars.garageEntered === garage.id) {
			p.exitGarage(garage.id, null);
		}

		// Hiding the player dialogs
		if (p.vars.dialogId && p.vars.dialogId.includes(`garage`) && p.vars.dialogPayload && p.vars.dialogPayload.garageId === garage.id) {
			p.hidePlayerDialog();
		}
	});

	PersonalVehicles.forEach(async (vehicle) => {
		if (!(vehicle.status === 2 && vehicle.garageId === garage.id)) return;

		// Updating the vehicle first..
		await updateVehicle(
			vehicle.id,
			{
				status: 1,
				garageId: null,
				garageSlot: null,
				garageEntranceCoords: null
			},
			true
		);

		// Respawning the vehicle
		const entityId = PersonalVehicleEntities[vehicle.id];
		const entity = mp.vehicles.at(entityId);

		if (!entity) return;

		// Respawning it so the 'lastLocation' from despawnVehicle will be its parking location.
		entity.respawn();

		// Despawning it
		mp.events.call('despawnVehicle', vehicle.id, false);
	});
});

mp.events.add('loadPlayerDefaults', (player) => {
	// Mark that this key should be in client-side.
	player.addClientsideVariables(`garageEntered`);

	// Set the variables
	player.updateVars({ garageEntered: null });

	// Load garage dependencies
	Garages.forEach((g) => mp.events.call(`garages:loadDependencies`, player, g));
});

mp.events.add(`garages:loadDependencies`, (player, g) => {
	// Dependencies
	const gInt = GarageInteriors.find((int) => int.id === g.interiorId);
	if (!gInt) return false;
	const gIntExit = gInt.coords.player.coords;

	// Entrance markers
	player.createMarker({
		identifier: `GarageEntrance:${g.id}`,
		type: 1,
		position: new mp.Vector3(g.coords.x, g.coords.y, g.coords.z - 1.1),
		scale: 0.9,
		rotation: new mp.Vector3(0, 0, 0),
		direction: new mp.Vector3(0, 0, 0),
		color: [0, 117, 106, 80],
		dimension: 0
	});

	player.createMarker({
		identifier: `GarageEntranceIcon:${g.id}`,
		type: 36,
		position: new mp.Vector3(g.coords.x, g.coords.y, g.coords.z - 0.3),
		scale: 0.9,
		rotation: new mp.Vector3(0, 0, 0),
		direction: new mp.Vector3(0, 0, 0),
		color: [0, 117, 106, 120],
		dimension: 0
	});

	player.createColshape({
		identifier: `GarageEntrance:${g.id}`,
		position: new mp.Vector3(g.coords),
		range: 2.5,
		type: 'sphere',
		dimension: 0,
		payload: {
			garageId: g.id
		}
	});

	// Exit
	player.createMarker({
		identifier: `GarageExit:${g.id}`,
		type: 1,
		position: new mp.Vector3(gIntExit.x, gIntExit.y, gIntExit.z - 1.1),
		scale: 0.9,
		rotation: new mp.Vector3(0, 0, 0),
		direction: new mp.Vector3(0, 0, 0),
		color: [0, 117, 106, 80],
		dimension: dimensions.garages + g.id
	});

	player.createColshape({
		identifier: `GarageExit:${g.id}`,
		position: new mp.Vector3(gIntExit.x, gIntExit.y, gIntExit.z),
		range: 2.5,
		type: 'sphere',
		dimension: dimensions.garages + g.id,
		payload: {
			garageId: g.id
		}
	});

	return true;
});

mp.events.add(`garages:removeDependencies`, (player, g) => {
	// Delete the colshapes
	const colshapes = [`GarageEntrance:${g.id}`, `GarageExit:${g.id}`];
	colshapes.forEach((c) => player.deleteColshape(c));

	// Delete the markers
	const markers = [`GarageEntrance:${g.id}`, `GarageEntranceIcon:${g.id}`, `GarageExit:${g.id}`];
	markers.forEach((m) => player.deleteMarker(m));
});

// This event is called whenever the server restarts, spawns a vehicle and there is one which was marked as in-garage

const resetGarageIds = (id: number) => {
	updateVehicle(
		id,
		{
			status: 1,
			garageId: null,
			garageEntranceCoords: null,
			garageSlot: null
		},
		true
	);
};

mp.events.add('onVehicleSpawn', (entity) => {
	// We must make sure that this event is called only for vehicles that are in garage.
	if (!entity.vars || (entity.vars && !entity.vars.pVehicle)) return false;
	const veh = PersonalVehicles.find((v) => v.id === entity.vars.pVehicle);
	if (!veh || (veh && veh.status !== 2)) return false;

	// Getting the garage..
	const garage = Garages.find((g) => g.id === veh.garageId);
	if (!garage) {
		resetGarageIds(veh.id);
		return false;
	}

	// Getting the garage interior
	const gInterior = GarageInteriors.find((gInt) => gInt.id === garage.interiorId);
	if (!gInterior) {
		resetGarageIds(veh.id);
		return false;
	}

	// Getting the parking space..
	const parkingSpace = gInterior.coords.parkings[veh.garageSlot!];

	// If the parking space is no longer there.
	if (!parkingSpace) {
		resetGarageIds(veh.id);
		return false;
	}

	// Teleporting the vehicle back into the garage..
	entity.dimension = garage.id + dimensions.garages;
	entity.position = new mp.Vector3(parkingSpace.location);
	entity.rotation = new mp.Vector3(parkingSpace.rotation);

	return true;
});

// This event is called when the gamemode loads the vehicles from the database
mp.events.add('onVehiclesLoaded', (pVehicles) => {
	pVehicles.filter((veh) => veh.status === 2).forEach((veh) => mp.events.call('spawnVehicle', veh.id));
});

mp.events.add('patched:playerEnterVehicle', async (player, vehicle, seat) => {
	if (player.vars.garageEntered === null) return false;
	if (!player.vehicle.vars || (player.vehicle.vars && player.vehicle.vars.pVehicle === null)) return false;

	if (seat !== 0) return false; // only the driver can take them out the rest can simply sit as passenger to go out at once

	// Getting the vehicle..
	const veh = PersonalVehicles.find((v) => v.id === vehicle.vars.pVehicle);
	if (!veh || (veh && veh.status !== 2) || (veh && veh.garageId === null)) return false;

	// Getting the garage..
	const garage = Garages.find((g) => g.id === veh.garageId);
	if (!garage) return false;

	// Checking if he can remove this vehicle from the garage..

	let canRemoveVehicleFromGarage = false;

	// If It's an admin..
	if (player.getAdminLevel() !== 0) {
		canRemoveVehicleFromGarage = true;
	}

	// If it's his personal vehicle..
	if (player.info.id === veh.ownerId) {
		canRemoveVehicleFromGarage = true;
	}

	// If he owns the house
	if (garage.type === 1 && player.info.house === garage.ownerId) {
		canRemoveVehicleFromGarage = true;
	}

	if (!canRemoveVehicleFromGarage) {
		// Getting the language for all the texts, errors etc.
		const lang = getLanguagePack('Garages:NotOwnerVehicle', player.info.language);
		player.triggerClientEvent(`taskLeaveVehicle`);
		player.showPlayerDialog({
			dialogId: `garageNotOwnerVehicle`,
			icon: 'information',
			hideInSeconds: 5,
			appearInSeconds: 1,
			type: 'message',
			buttons: [],
			title: lang.get('DialogTitle'),
			content: lang.get('DialogContent')
		});
		return false;
	}

	// Showing the player the dialog to leave garage
	player.showGarageVehicleDialog(veh, vehicle, veh.garageId!);

	return true;
});

mp.events.add('patched:playerExitVehicle', (player) => {
	if (player.vars && player.vars.dialogId === 'garageVehicle') {
		player.hidePlayerDialog();
	}
});

mp.events.add('abandonVehicleInGarage', async (id) => {
	// Getting the vehicle...
	const veh = PersonalVehicles.find((v) => v.id === id);

	if (!veh) return false;

	try {
		if (PersonalVehicleEntities[veh.id] === undefined) return false;
		const entityId = PersonalVehicleEntities[veh.id];
		const vehicleEntity = mp.vehicles.at(entityId);
		if (!vehicleEntity) return false;

		delete PersonalVehicleEntities[veh.id]; // delete it from the object.

		// Destroying the entity
		vehicleEntity.destroy();

		return true;
	} catch (err) {
		await logError(`ABANDON_VEHICLE_IN_GARAGE`, err, { vehId: veh.id, owner: veh.ownerName });
		return false;
	}
});

// Related code in other systems:
// - playerQuit and onPlayerLogin - @vehicles.
// - Not being able to park in garages - @vehicles.
// - the AFK despawn timer for vehicles doensn't affect garages - @vehicles
// - onEngineKeyPressed +playerEnterVehicle - @general/engine
// - Vehicle raycasts are disabled when in garage.
// - Key N is disabled in garage.
// - /getveh command.
