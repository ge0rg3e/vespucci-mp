import { getVehicleClientsideVariableKeys, getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { getDefaultVehicleModifications } from '@server/legacy/businesses/systems/tunning/components/functions';
import { PersonalVehicleEntities, updateVehicle } from '@server/legacy/vehicles/components/core';

mp.vehicles.createVehicle = function createVehicle(model, hash, position, options = {}, vars = {}) {
	// Get the native info
	const nativeInfo = getVehicleNativeInfo({ model });
	if (!nativeInfo) throw new Error(`There is no native info for vehicle model ${model}`);

	// Spawning entity
	const entity: VehicleMp = mp.vehicles.new(hash, position, options);

	entity.vars = {
		model,
		radio: 0,
		dirtLevel: 0,
		fuel: 55,
		locked: false,
		engine: nativeInfo.hasEngine ? false : true,
		emptyVehicle: 0,
		engineDamaged: false,
		spawnLocation: {
			position,
			rotation: entity.rotation
		},
		lastPosition: position,
		temporary: false,
		pVehicle: null,
		pVehicleOwnerId: null,
		odometer: 0,
		rVehicle: null,
		rVehicleOwnerId: null,
		modifications: vars.modifications ? vars.modifications : getDefaultVehicleModifications(model),
		...vars
	};

	// Set the vehicle vars so it can update the client-side variables on vehicle spawn
	entity.updateVars(entity.vars);

	// Updating optionss variable (used in respawn)..
	entity.setVariable(`@vehicleOptions`, options);

	// Calling the event..
	mp.events.call('onVehicleSpawn', entity);
	entity.isVehicleDead = false; // Just so the server knows is safe to use this veh.

	return entity;
};

mp.vehicles.forEachValid = (func: Function) => {
	mp.vehicles.forEach((entity: VehicleMp) => {
		if (entity.isVehicleDead === true) return;
		func(entity);
		return true;
	});
};

mp.vehicles.forEachValidInRange = (position, range, func: Function) => {
	mp.vehicles.forEachInRange(position, range, (entity: VehicleMp) => {
		if (entity.isVehicleDead === true) return;
		func(entity);
		return true;
	});
};

mp.Vehicle.prototype.getFuel = function getFuel() {
	return this.vars.fuel;
};

mp.Vehicle.prototype.getEngineState = function getEngineState() {
	return this.vars.engine;
};

mp.Vehicle.prototype.repairVehicle = function () {
	if (!this.controller) return this.repair(); // RAGE:MP will sync the fix veh to everyone.
	this.controller.call('sync:fixPlayerVehicle'); // Fix the veh on the controller that will sync to everyone else.
};

mp.Vehicle.prototype.getNativeInfo = function () {
	const info = getVehicleNativeInfo({ model: this.vars.model });
	return info;
};

mp.Vehicle.prototype.respawn = function respawn() {
	// Removing the current players
	mp.players.forEachLoggedIn((player: PlayerMp) => {
		if (player.vehicle && player.vehicle === this) {
			player.removeFromVehicle();
		}
	});

	// Respawning
	this.position = new mp.Vector3(this.vars.spawnLocation.position);
	this.rotation = new mp.Vector3(this.vars.spawnLocation.rotation);
	this.updateVars({ engine: false });
	this.repairVehicle();
	return true;
};

mp.Vehicle.prototype.cloneOnDeath = function respawn() {
	//! As of now: 25 June - Once a car explodes it's impossible to drive it again, the doors are locked even after fixing teh vehicle.
	//! We had to destroy the old entity and re-create a new one.

	// Creating the clone
	const options = this.getVariable(`@vehicleOptions`); // used in respawn

	const entity = mp.vehicles.createVehicle(
		this.vars.model,
		this.model,
		this.vars.spawnLocation.position,
		{
			...options
		},
		{
			...this.vars,
			engine: false
		}
	);

	entity.rotation = new mp.Vector3(this.vars.spawnLocation.rotation);

	if (this.vars.pVehicle) {
		// Updatinge entities id for pvehicles.
		PersonalVehicleEntities[this.vars.pVehicle] = entity.id;

		// Updating the vehicle on phones to update entity id
		mp.events.call('updatePhoneAppVehicles', this.vars.pVehicle, this.vars.pVehicleOwnerId);
	}

	// Destroy the old one
	this.destroy();

	return entity;
};

mp.Vehicle.prototype.setFuel = function setFuel(value) {
	// Get native info
	const nativeInfo = getVehicleNativeInfo({ model: this.vars.model });
	if (!nativeInfo) return false;

	// Making sure they cannot be bugged and have more than their maximum capacity in litres.
	if (value >= nativeInfo.carTank) {
		value = nativeInfo.carTank;
	}

	// Update vars..
	this.updateVars({
		fuel: value
	});

	if (this.vars.pVehicle) {
		// Updating personal vehicle fuel value
		updateVehicle(this.vars.pVehicle, { fuel: this.vars.fuel }, false);
	}

	return true;
};

mp.Vehicle.prototype.reduceFuel = function reduceFuel(value) {
	this.vars.fuel -= value;

	if (this.vars.fuel < 0) {
		this.vars.fuel = 0;
	}

	this.setVariable(`@vehicleVars`, this.vars);

	if (this.vars.pVehicle) {
		// Updating personal vehicle fuel value
		updateVehicle(this.vars.pVehicle, { fuel: this.vars.fuel }, false);
	}
};

mp.Vehicle.prototype.giveFuel = function giveFuel(value) {
	this.vars.fuel == value;

	if (this.vars.fuel > 100) {
		this.vars.fuel = 100;
	}

	this.setVariable(`@vehicleVars`, this.vars);

	if (this.vars.pVehicle) {
		// Updating personal vehicle fuel value
		updateVehicle(this.vars.pVehicle, { fuel: this.vars.fuel }, false);
	}
};

/**
 * Use this function instead of the getOccupants one to avoid a server crash on vehicles that have peds (actors) inside.
 */

mp.Vehicle.prototype.getOccupantsPatched = function () {
	const arr: Array<PlayerMp> = [];

	mp.players.forEachLoggedInRange(this.position, 10, (target: PlayerMp) => {
		if (target.vehicle && target.vehicle === this) {
			arr.push(target);
		}
	});

	return arr;
};

mp.Vehicle.prototype.setDimension = function (dimension) {
	const occupants = this.getOccupantsPatched();

	this.dimension = dimension;

	occupants.forEach((player, index) => {
		player.dimension = dimension;
		player.putIntoVehicle(this, index);
	});
};

mp.events.add('onVehicleSpawn', (vehicle) => {
	vehicle.locked = vehicle.vars.locked;
});

mp.Vehicle.prototype.updateVars = function updateVars(variables) {
	// Updating the state
	this.vars = { ...this.vars, ...variables };

	// Creating individual player variables for each one of those keys
	getVehicleClientsideVariableKeys().forEach((key) => {
		this.setVariable(`@vehicleVars.${key}`, this.vars[key]);
	});
};
