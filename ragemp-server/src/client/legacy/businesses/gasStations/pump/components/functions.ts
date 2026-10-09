// Functions
import { getClosestPump, getPumpObjectModel, isHoldingPetrolCan } from '../../petrolCan/components/functions';

// Dependencies
import { activeColshapes } from '@client/natives/colshapes';
import { getRaycastLookingAtEntity } from '@client/natives/raycast';
import { logClientsideError } from '@client/general/errors';
import { waitForObjectToStreamIn } from '@client/utils/events';

// Types
import { GasStationPump } from './types';
import { getPlayerVariable } from '@client/utils/helpers';

// Variables
const player = mp.players.local;

/**
 * Create the nozzle attachment object in-game.
 * @param target
 */

export const createNozzle = async (target: PlayerMp) => {
	try {
		// Create the nozzle
		target.gsNozzle = mp.objects.new(mp.game.joaat('prop_cs_fuel_nozle'), new mp.Vector3(target.position.x, target.position.y, target.position.z - 5), {
			rotation: new mp.Vector3(0, 0, 0),
			alpha: 255,
			dimension: target.dimension
		});
	} catch (err) {
		await logClientsideError(`pump.sync.createNozzle`, err);
	}
};

/**
 * Creates the rope in-game and activate its physics after it's attached to the attachment & pump.
 * @param target
 */

export const createRope = async (target: PlayerMp) => {
	try {
		// Get the closest pump.
		const pump = getClosestPump(target.position, 5);
		if (!pump) return false;

		// Get the attachment
		const attachment = target.gsNozzle;
		if (!attachment) return false;

		// Get the gas station pump position
		const pumpPosition = pump.getOffsetFromInWorldCoords(0, 0, 0); // @Also this is Bugfix. pump.position doesn't work on this converted objects.

		// Load rope textures if they're not loaded
		const texturesLoaded = mp.game.invoke(`0xF2D0E6A75CC05597`);

		// Load rope textures if not loaded.
		if (!texturesLoaded) {
			mp.game.invoke(`0x9B9039DBF2D258C1`);
		}

		// @Code reminders:
		// LoadRopeData causes an extreme annoying effect (rope on creation moves left and right like mad) so is not added.

		// Create the rope
		const rope = mp.game.rope.addRope(
			// [ === Position of Pump Station === ]
			pumpPosition.x,
			pumpPosition.y,
			pumpPosition.z,
			// [ === ROTATION === ]
			0,
			0,
			0,
			// [ === ROPE SETTINGS === ]
			1, // initial length
			4, // rope type
			15, // max length
			0, // min lenghth of rope
			// [ == OTHER SETTINGS === ]
			0.5, // winding speed
			false,
			false, // p12?
			false, // rigid
			10, // increasing this makes the rope wobble when creating
			false, // break when shot
			// @ts-ignore-next-line
			0
		);

		// Save the rope in his entity
		target.gsRope = rope;

		// Wait for it tos tream
		await waitForObjectToStreamIn(attachment.id, false);

		// Get the coords of the attachment..
		let attachmentCoords = attachment.getOffsetFromInWorldCoords(0.0, -0.02, -0.175);

		// Attach now to the attachment
		mp.game.rope.attachEntitiesToRope(
			// The rope
			rope.result,
			// Entity one
			attachment.handle,
			// Entity two
			pump.handle,
			// Entity one coords..
			attachmentCoords.x,
			attachmentCoords.y,
			attachmentCoords.z,
			// Entity two coords..
			pumpPosition.x,
			pumpPosition.y,
			pumpPosition.z + 2.15,
			// Length (undocumented)
			5,
			// Booleans (undocumented)
			false, //p10
			false, // p11
			// Unknowns
			// @ts-ignore-next-line
			'', // p12
			'' // p13
		);

		// Activate the physics now
		mp.game.invoke('0x710311ADF0E20730', rope.result);

		return true;
	} catch (err) {
		logClientsideError(`pump.sync.createRope`, err);
		return false;
	}
};

/**
 * This function will take care of the deattachments then destroyment of the objects used in the gas station animation.
 * @param target
 */

export const deleteDependencies = async (target: PlayerMp) => {
	try {
		// This player has never used a nozzle at a gas station
		if (!target.gsNozzle) return false;

		// Variables
		const nozzle = target.gsNozzle;
		const rope = target.gsRope;

		// We deattach the rope from the attachment then we destroy the nozzle first
		if (nozzle && rope) {
			mp.game.rope.detachRopeFromEntity(rope.result, nozzle.handle);
			nozzle!.destroy();
		}

		// Destroy rope..
		if (rope) {
			mp.game.rope.deleteRope(rope!.result);
		}

		return true;
	} catch (err) {
		logClientsideError(`pump.sync.deleteDependencies`, err);
		return false;
	}
};

/**
 * Attach the nozzle to the player
 * @param target
 * @returns
 */

export const attachNozzleToPlayer = async (target: PlayerMp) => {
	try {
		// Get the attachment
		const attachment = target.gsNozzle;
		if (!attachment) return false;

		// Wait for it to stream
		await waitForObjectToStreamIn(attachment.id, false);

		// Attach attachment to player's hand
		attachment.attachTo(target.handle, target.getBoneIndex(60309), 0.055, 0.05, 0, -50, -90, -50, true, true, false, true, 0, true);
		return true;
	} catch (err) {
		await logClientsideError(`pump.sync.attachNozzleToPlayer`, err);
		return true;
	}
};

/**
 * Deattach the nozzle from the player or vehicle.
 * @param target
 * @returns
 */

export const deAttachNozzle = async (target: PlayerMp) => {
	try {
		// Get the attachment
		const attachment = target.gsNozzle;
		if (!attachment) return false;

		// Make the attachment stop being attached
		attachment.detach(true, false);
		return true;
	} catch (err) {
		await logClientsideError(`pump.sync.attachNozzleToPlayer`, err);
		return true;
	}
};

/**
 * Attaches the nozzle to the vehicle side.
 * @param target
 * @param vehicleId
 * @returns
 */

export const attachNozzleToVehicle = async (target: PlayerMp, vehicleId: number) => {
	try {
		// Get the attachment
		const attachment = target.gsNozzle;
		if (!attachment) return false;

		// Get the vehicle
		const vehicle = mp.vehicles.atRemoteId(vehicleId);
		if (!vehicle) return false;

		// Wait for it to stream
		await waitForObjectToStreamIn(attachment.id, false);

		// Pump side
		let side = 'r'; // can be r or l // @TBD: to use this right on different vehicles in the future?

		// Calculate offset
		let offset = 1;

		if (side === 'r') {
			offset = -1;
		}

		// Get vehicle class
		const vehClass = vehicle.getClass();

		// mp.console.logInfo(`Vehicle class: ${JSON.stringify(vehClass)}`);

		// If is motorcycle
		if (vehClass === 8) {
			let boneIndex = vehicle.getBoneIndexByName(`petrolcap`);

			// @Attempt: Maybe has petroltank?
			if (boneIndex === -1) {
				boneIndex = vehicle.getBoneIndexByName(`petroltank`);
			}

			// @Attempt: Maybe it has engine?
			if (boneIndex === -1) {
				boneIndex = vehicle.getBoneIndexByName(`engine`);
			}

			// Attach attachment to motorcycle
			attachment.attachTo(vehicle.handle, boneIndex, 0.0, -0.2, 0.2, -80.0, 0.0, 0.0, true, true, false, true, 0, true);

			return true;
		}

		// Attach attachment to vehicle
		attachment.attachTo(vehicle.handle, vehicle.getBoneIndexByName(`taillight_r`), -0.4 * offset, 0.6, 0.15, -45, 0, -90 * offset, true, true, false, true, 0, true);

		return true;
	} catch (err) {
		await logClientsideError(`pump.sync.attachNozzleToPlayer`, err);
		return true;
	}
};

/**
 * Resets the variables required for this sync to work.
 * @param target
 */

export const resetVariables = (target: PlayerMp) => {
	// Reset their variables..
	target.gsNozzle = null;
	target.gsRope = null;
};

/**
 * This function will manage the state changes for when someone is using a pump.
 * @param oldState
 * @param newState
 */

export const executePumpSync = async (target: PlayerMp, oldState: GasStationPump | null, newState: GasStationPump) => {
	try {
		// If we are no longer using the pump.
		if (newState.gasStationId === null && target.gsNozzle) {
			// Deattach
			deAttachNozzle(target);

			// Delete the dependencies (object)
			deleteDependencies(target);

			// Reset variables
			resetVariables(target);

			return true;
		}

		// Something has changed and we also know the last state
		if (newState.gasStationId !== null && oldState !== null) {
			// Is the nozzle created
			if (!target.gsNozzle) {
				// Create nozzle
				createNozzle(target);

				// By default we attach the nozzle to the player
				attachNozzleToPlayer(target);
			}

			// Is the rope created
			if (!target.gsRope) {
				// Create the rope
				createRope(target);
			}

			// If now the nozzle is attached to a vehicle
			if (newState.vehicleId !== null && oldState.vehicleId === null) {
				// De attach it
				deAttachNozzle(target);

				// Attach it to the vehicle.
				attachNozzleToVehicle(target, newState.vehicleId);
			}

			// If not the nozzle is no longer attached to the vehicle
			if (newState.vehicleId === null && oldState.vehicleId !== null) {
				// Remove it from the vheicle
				deAttachNozzle(target);

				// Attach it to the player
				attachNozzleToPlayer(target);
			}

			return true;
		}

		// We know the current state but not he last state. (onStreamIn)
		if (newState.gasStationId !== null && oldState === null) {
			// Create the nozzle attachment
			createNozzle(target);

			// Attach it accordingly now
			if (newState.vehicleId) {
				attachNozzleToVehicle(target, newState.vehicleId);
			} else {
				attachNozzleToPlayer(target);
			}

			// We create the required
			createRope(target);

			return true;
		}

		return true;
	} catch (err) {
		await logClientsideError(`pump.sync.executePumpSync`, err, { oldState, newState });
		return false;
	}
};

/**
 * Checks if we are looking at a gas station pump.
 * @returns boolean
 */

export const isLookingAtPumpObject = () => {
	// Get the variables
	const petrolCan = getPlayerVariable(player.remoteId, `petrolCan`);
	const gasStationPump = getPlayerVariable(player.remoteId, `gasStationPump`);

	if (!petrolCan || !gasStationPump) return false;

	// Is using pump
	const isUsingPump = gasStationPump.gasStationId !== null ? true : false;

	// // If we are refilling the petrol can..
	if (isUsingPump && isHoldingPetrolCan() && petrolCan.status === 'refilling') return false;

	// Is not close.
	if (!getClosestPump(player.position, 1)) return false;

	// Get the active colshape
	const activeColshape = activeColshapes.find((c: ExpectedAny) => c.identifier.includes(`GasStationPump`));

	// Is close to pump ? to not bother using raycast.
	if (!activeColshape) return false;

	// Is it his pump?
	if (gasStationPump.gasStationId) {
		// Not the original gas station??
		if (gasStationPump.gasStationId !== activeColshape.payload.gasStationId) return false;
		// Not the original pump.
		if (gasStationPump.pumpId !== activeColshape.payload.pumpId) return false;
	}

	// He is connected to a vehicle. They should unplug the vehicle first.
	if (isUsingPump && gasStationPump.vehicleId) return false;

	// They can't see it from their car.
	if (player.vehicle) return false;

	// Get the object you're looking at.. (including og game objects)
	const result = getRaycastLookingAtEntity({ distance: 2, includeMapObjects: true, flags: { objects: true } });

	// Making sure..
	if (!result || !result.entity || typeof result.entity !== 'number') return false;

	// Get the object
	const object = mp.objects.newWeak(result.entity);
	if (!object) return false;

	// Making sure the object is a pump.
	if (!getPumpObjectModel(object)) return false;

	return true;
};
