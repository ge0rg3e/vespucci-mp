import { getNativeWeapon } from '@server/natives/weapons/components/core';
import { logError } from '@server/utils/helpers';
import { createActorParams } from './types';

// Known bugs:
// When a pedestrian is driving, the server-side position of the pedestrian is not updated.
// TypeScript improvement: Actor & ActorMp types need to be reviewed.
// To be tested: If the pedestrian is static and invincible, whether it takes damage and triggers "on respawn" event.

class Actor implements Actor {
	// Properties of the actor
	public identifier;
	public attributes;
	public info;
	public entity;
	public variables;

	// The creation of an actor
	constructor(params: createActorParams) {
		// We set the core variables
		this.identifier = params.identifier;
		this.info = params.info;
		this.variables = params.variables;

		// Extract attributes and set the defaults. Is important to set dynamic to true by defalt.
		const { model, position, frozen = false, dynamic = true, invincible = false, heading = undefined, dimension = 0 } = params.attributes;

		// We save the attributs
		this.attributes = {
			// Core attributes for creation of ped..
			model,
			position,
			frozen,
			dynamic,
			invincible,
			heading,
			dimension,
			// New Attributes:
			spawn: { position, heading }
		};

		// Create the entity..
		this.entity = this.createPed();
	}

	/** This creates a ped in GTA server-side synced. */
	createPed() {
		// Extract required attributes
		const { model, spawn, dynamic, frozen, invincible, dimension } = this.attributes;

		// We create the ped..
		const ped = mp.peds.new(mp.joaat(model), spawn.position, {
			dynamic,
			frozen,
			invincible,
			heading: spawn.heading,
			dimension,
			// LockController true locks them to a scripted controller disabling multiplayer own re-assignemnt which can be faulty.
			lockController: true
		});

		// Save varibles for client-side.
		ped.setVariable(`@actorData`, { identifier: this.identifier, attributes: this.attributes, info: this.info });
		ped.setVariable(`@actorVariables`, this.variables);

		// Return the new so it can be saved.
		return ped;
	}

	/**
	 *
	 * @param info The info you want to update
	 * Updates the info of the actor.
	 */

	updateInfo(info: Partial<Actor['info']>) {
		this.info = { ...this.info, ...info };
	}

	/**
	 *
	 * @param variables The variables you want to update
	 * Updates the variables of the actor.
	 */

	updateVariables(variables: Partial<Actor['variables']>) {
		this.variables = { ...this.variables, ...variables };
	}

	/* Call a mp.event.add from client-side */

	callClientEvent(eventName: string, ...args: ExpectedAny) {
		try {
			// Get a player to execute his code.
			const player = this.entity.controller ? this.entity.controller : mp.players.at(0);

			// If there's none we need to throw an error..
			// @Info: this is to know how often we will ever have scenarios when actors call client-side events on their own and no one is around to do so.
			if (!player) throw new Error(`Failed to find an executable player for actor ${this.identifier} to execute client-side functions.`);

			// Is current ped still valid? This check is gonna make sure that this code is not executed at the exact moment when the ped is maybe re-created by the server.
			if (!mp.peds.at(this.entity.id)) throw new Error(`Ped is no longer valid for actor ${this.identifier}`);

			// Execute this and auto-assign first parameter to be the ped to control easily..
			player.call(eventName, [this.entity, ...args]);
		} catch (err) {
			logError(`ACTOR_CALL_CLIENT_EVENT`, err, { eventName, actorIdentifier: this.identifier });
		}
	}

	/* Invoke a rpc register from client-side */

	async invokeClientEvent(eventName: string, ...args: ExpectedAny) {
		try {
			// Get a player at random, if the ped has no controller we'll just use a random player.
			const player = this.entity.controller ? this.entity.controller : mp.players.at(0);

			// If there's none we need to throw an error..
			// @Info: this is to know how often we will ever have scenarios when actors call client-side events on their own and no one is around to do so.
			if (!player) throw new Error(`Failed to find an executable player for actor ${this.identifier} to execute client-side functions.`);

			// Is current ped still valid? This check is gonna make sure that this code is not executed at the exact moment when the ped is maybe re-created by the server.
			if (!mp.peds.at(this.entity.id)) throw new Error(`Ped is no longer valid for actor ${this.identifier}`);

			// Invoke event..
			const response = await player.invokeClientEvent(eventName, { pedId: this.entity.id, ...args });

			return response;
		} catch (err) {
			logError(`ACTOR_INVOKE_CLIENT_EVENT`, err, { eventName, actorIdentifier: this.identifier });
			return null;
		}
	}

	/**
	 * Clears any tasks performed by the actor immediately.
	 */

	clearTasks() {
		this.callClientEvent('actor:clearTasks');
	}

	/**
	 * Revives a dead ped by re-creating again and its spawn position
	 * @Reminder: We need to re-create them or otherwise the ped will remember the player who attacked him, and keep attacking him or they will run away.
	 */

	respawn() {
		// Destroy existing ped entity..
		this.entity.destroy();

		// We now create the ped again.
		this.entity = this.createPed();
	}

	/**
	 * Task the actor to attack.
	 * @param entity - The entity that it must be attacked can be a vehicle or player.
	 */

	taskAttack(entity: EntityMp) {
		// Task the ped to attack the entity.
		this.callClientEvent(`actor:attack`, entity);
	}

	/**
	 * Give a weapon to the actor.
	 */

	giveWeapon(model: string, ammo: number) {
		const weapon = getNativeWeapon({ model });
		if (!weapon) throw new Error(`Actor ${this.identifier} received an invalid weapon: ${model}`);

		// Task the ped to attack the entity.
		this.callClientEvent(`actor:giveWeapon`, weapon.hash, ammo);
	}

	/**
	 * Put the player into a vehicle
	 * @param vehicle - the vehicle that we want to enter
	 */

	putIntoVehicle(vehicle: VehicleMp, seat: number) {
		this.callClientEvent(`actor:putIntoVehicle`, vehicle, seat);
	}

	/**
	 * Remove the player from a vehicle
	 */

	removeFromVehicle() {
		this.callClientEvent(`actor:removeFromVehicle`);
	}

	/**
	 * Task the ped to drive to a coord.
	 */

	taskVehicleDriveToCoord(vehicle: VehicleMp, position: Vector3, speed: number, drivingMode: number) {
		this.callClientEvent(`actor:taskVehicleDriveToCoord`, vehicle, position, speed, drivingMode);
	}
	/**
	 * Task the ped to drive to a long coord.
	 */

	taskVehicleDriveToCoordLongrange(vehicle: VehicleMp, position: Vector3, speed: number, drivingMode: number) {
		this.callClientEvent(`actor:taskVehicleDriveToCoordLongrange`, vehicle, position, speed, drivingMode);
	}

	/**
	 *  Make sure the ped doesn't flee or gets distracted
	 */

	setDoesNotFlee(boolean: boolean) {
		this.callClientEvent('actor:setBlockingOfNonTemporaryEvents', boolean);
	}

	/**
	 * Task the ped to drive and wander
	 */

	taskVehicleDriveWander(vehicle: VehicleMp, speed: number, drivingMode: number) {
		this.callClientEvent(`actor:taskVehicleDriveWander`, vehicle, speed, drivingMode);
	}

	taskWanderStandard(walkAnywhereWithoutDuration?: boolean) {
		this.callClientEvent(`actor:taskWanderStandard`, walkAnywhereWithoutDuration);
	}

	/**
	 *
	 * @param position - Position where to wander (center position)
	 * @param radius - The radius of the area to wander around in
	 * @param minimalLength - The minimal length it will wander before waiting timeBetweenWalks seconds before continuing (seconds)
	 * @param timeBetweenWalks -  The length of time the ped will stand still/rest between walks (seconds)
	 */

	// Reminder: For now it seems is orking only when minimalLength is 0, and timeBetweenWalks is 0.5.

	taskWanderInArea(position: Vector3, radius: number, minimalLength: number, timeBetweenWalks: number) {
		this.callClientEvent('actor:taskWanderInArea', position, radius, minimalLength, timeBetweenWalks);
	}

	/* Find out if actor is playing am ambient speech */
	async isAmbientSpeechPlaying() {
		const response = await this.invokeClientEvent(`actor:isAmbientSpeechPlaying`);
		return response;
	}

	// Makes the ped say a line from here: https://gist.githubusercontent.com/alexguirre/0af600eb3d4c91ad4f900120a63b8992/raw/3d7e8e30ad4ce6f361c9e1b41e0a57c8f939a30a/Speeches.txt
	playAmbientSpeechWithVoice(speechName: string, voiceName: string, speechParam: string) {
		this.callClientEvent('actor:playAmbientSpeechWithVoice', speechName, voiceName, speechParam);
	}

	/**
	 * Get actor position
	 */

	getPosition() {
		// Check if the player is currently inside a vehicle
		if (this.variables.vehicleId) {
			// Retrieve the vehicle object based on its ID
			const vehicle = mp.vehicles.at(this.variables.vehicleId);
			if (!vehicle) return this.entity.position; // bug

			// Return the position of the vehicle
			return vehicle.position;
		}

		// If the player is not inside a vehicle, return their current position
		return this.entity.position;
	}

	/**
	 * Initiates facial animation on the specified ped to simulate talking.
	 */
	startMouthTalking() {
		this.callClientEvent('actor:startMouthTalking');
	}

	/**
	 * Stops facial animation on the specified ped, returning the expression to normal.
	 */
	stopMouthTalking() {
		this.callClientEvent('actor:stopMouthTalking');
	}
	/**
	 * Initiates the talking gesture animation.
	 */
	startGestureTalking() {
		this.callClientEvent('actor:startGestureTalking');
	}

	/**
	 * Stops the talking gesture animation.
	 */
	stopGestureTalking() {
		this.callClientEvent('actor:stopGestureTalking');
	}
}

export default Actor;
