import { onVehicleDoorsLocked } from '@server/legacy/vehicles/components/functions';
import { destroyRentingVehicle, rentingLocations } from './core';
import { RentingLocation } from './types';

mp.events.add('onPlayerEnterColshape', function (player, colshape) {
	if (player.vars.dialogCooldown) return;

	const identifier = colshape.identifier;
	const payload = colshape.payload;

	if (!identifier.includes(`RentingLocationPickup`) || !payload) return false;

	const rentingLocation = rentingLocations.find((r) => r.id === payload.rentingLocationId);

	if (rentingLocation === undefined) return false;

	player.showRentingMenuDialog(payload.rentingLocationId, false);

	return;
});

mp.events.add('onPlayerExitColshape', function (player) {
	const dialogs = [`rentingLocationsMenu`];
	if (player.vars && player.vars.dialogId && dialogs.find((x: string) => player.vars.dialogId?.includes(x))) {
		player!.hidePlayerDialog();
		return;
	}
	return;
});

mp.events.add('onPlayerPressedVehicleLockKey', (player) => {
	let matched = false;

	let vehicleEntity = null;

	// If he's sitting in a vehicle..

	if (player.vehicle && player.vehicle.vars.rVehicle && (player.vehicle.vars.rVehicleOwnerId === player.info.id || player.getAdminLevel() > 0)) {
		vehicleEntity = player.vehicle;
	}

	// If not let's do range check..

	if (vehicleEntity === null) {
		mp.vehicles.forEachValidInRange(player.position, 3, (veh: VehicleMp) => {
			if (matched === true) return false; // avoiding double locking.

			if (veh.vars.rVehicle && (veh.vars.rVehicleOwnerId === player.info.id || player.getAdminLevel() > 0)) {
				vehicleEntity = veh;
				matched = true;
			}

			return true;
		});
	}

	// Final checks..

	if (vehicleEntity) {
		mp.events.call('changeVehicleLockState', vehicleEntity, !vehicleEntity.vars.locked);
		onVehicleDoorsLocked(vehicleEntity, !vehicleEntity.vars.locked);
	}

	return false;
});

mp.events.add('loadPlayerDefaults', (player) => {
	// Set the variable
	player.updateVars({ rentingVehicleId: null });

	// Load dependencies
	rentingLocations.forEach((r: RentingLocation) => {
		mp.events.call('rentingLocation:loadDependencies', player, r);
	});
});

mp.events.add('rentingLocation:loadDependencies', (player, r) => {
	const rCoords = r.pickupCoords;

	const markerIds = {
		1: 36,
		2: 37,
		3: 34,
		4: 35
	};

	const blipIds = {
		1: 523,
		2: 226,
		3: 574,
		4: 531
	};

	const blipNames = {
		1: 'Cars',
		2: 'Bikes',
		3: 'Helicopters',
		4: 'Boats'
	};

	// Create the markers
	player.createMarker({
		identifier: `RentingLocationPickup:${r.id}`,
		type: 1,
		position: new mp.Vector3(rCoords.x, rCoords.y, rCoords.z - 1.1),
		scale: 0.9,
		direction: new mp.Vector3(0, 0, 0),
		rotation: new mp.Vector3(0, 0, 0),
		color: [36, 104, 255, 80],
		dimension: 0
	});

	player.createMarker({
		identifier: `RentingLocationPickupIcon:${r.id}`,
		type: markerIds[r.blipType],
		position: new mp.Vector3(rCoords.x, rCoords.y, rCoords.z - 0.3),
		scale: 0.9,
		direction: new mp.Vector3(0, 0, 0),
		rotation: new mp.Vector3(0, 0, 0),
		color: [36, 104, 255, 120],
		dimension: 0
	});

	// Create the colshape
	player.createColshape({
		identifier: `RentingLocationPickup:${r.id}`,
		position: new mp.Vector3(r.pickupCoords),
		dimension: 0,
		range: 2,
		type: 'sphere',
		payload: {
			rentingLocationId: r.id
		}
	});

	// Create blip
	player.createBlip({
		identifier: `RentingLocationPickup:${r.id}`,
		type: blipIds[r.blipType],
		position: new mp.Vector3(r.pickupCoords),
		dimension: 0,
		label: `Rent - ${blipNames[r.blipType]}`,
		color: 74
	});
});

mp.events.add('rentingLocation:removeDependencies', (player, r) => {
	// Delete dependencies
	player.deleteMarker(`RentingLocationPickup:${r.id}`);
	player.deleteMarker(`RentingLocationPickupIcon:${r.id}`);
	player.deleteColshape(`RentingLocationPickup:${r.id}`);
	player.deleteBlip(`RentingLocationPickup:${r.id}`);
});

mp.events.add('playerQuit', (player) => {
	if (player.vars && player.vars.loggedIn && player.vars.rentingVehicleId) {
		destroyRentingVehicle(player.vars.rentingVehicleId);
	}
});
