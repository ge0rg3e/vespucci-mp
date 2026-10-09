import { logClientsideError } from '@client/general/errors';
import { pumpObjectsProps } from '../../fillVehicles/components/definitions';
import { getRaycastLookingAtEntity } from '@client/natives/raycast';
import { getPlayerVariable } from '@client/utils/helpers';
import { interfacesOpened } from '@client/natives/interfaces';

// Variables
const player = mp.players.local;

/**
 * This will check in-game if you are nearby a gas station pump object.
 * @Warning: Server-side we have them defined too. But we need them available in client-side like this too so we can attach rope to them when using them.
 *
 * @param pos
 * @param range
 * @returns
 */

export const getClosestPump = (pos: Vector3, range: number): ObjectMp | null => {
	let result = null;

	// Iterate and try to find them..
	for (const prop of pumpObjectsProps) {
		let handle = mp.game.object.getClosestObjectOfType(pos.x, pos.y, pos.z, range, mp.game.joaat(prop), true, true, true);

		if (handle) {
			// Load GTA Object as object RAGE.
			result = mp.objects.newWeak(handle);
		}
	}

	return result;
};

/**
 *
 * @param object
 * @returns The prop model if is a pump or if not null.
 */

export const getPumpObjectModel = (object: ObjectMp) => {
	let result: string | null = null;

	// Get Pos
	const pos = object.getOffsetFromInWorldCoords(0, 0, 0); // @Also this is Bugfix. pump.position doesn't work on this converted objects.

	// Iterate and try to find them..
	for (const prop of pumpObjectsProps) {
		let handle = mp.game.object.getClosestObjectOfType(pos.x, pos.y, pos.z, 5, mp.game.joaat(prop), true, true, true);

		// We found a match for a pump object and is this object.
		if (handle && handle === object.handle) {
			result = prop;
		}
	}

	return result;
};

/**
 * This function helps us show the press F to fill vehicle.
 * @returns true if we should show the hint
 */

export const getVehicleRaycastFillable = () => {
	try {
		// Get the variables
		const petrolCan = getPlayerVariable(player.remoteId, `petrolCan`);
		if (!petrolCan || (petrolCan && !petrolCan.status)) return false;

		// If any interface is showing (dialog?)
		if (interfacesOpened.length > 0) return false;

		// Has fuel in petrol can
		if (petrolCan.litres < 1) return false;

		// We must stay idle (aka just holding it) to see this.
		if (petrolCan.status !== 'idle') return false;

		// Get the vheicle you're looking at..
		const result = getRaycastLookingAtEntity({ distance: 5, flags: { vehicles: true } });

		if (!result || typeof result.entity === 'number' || result.entity.type !== 'vehicle') return false;

		// If is not a server-side vehicle
		if (result.entity.remoteId === 65535) return false;

		// Get vehicle
		const vehicle = mp.vehicles.atRemoteId(result.entity.remoteId);
		if (!vehicle) return false;

		// We have clear LOS (Aka we can't see through walls)
		if (!player.hasClearLosTo(vehicle.handle, 17)) return false;

		return { entity: vehicle };
	} catch (err) {
		logClientsideError(`petrolCan.render.showHintToFill`, err);
		return false;
	}
};

export const isHoldingPetrolCan = () => {
	// Get the variables
	const petrolCan = getPlayerVariable(player.remoteId, `petrolCan`);

	// Stupid but can happen..
	if (!petrolCan) return false;

	if (!petrolCan.status) return false;

	return true;
};
