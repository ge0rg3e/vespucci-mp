import Speaker from './class';

// Dependencies
import { isInRange, logError } from '@server/utils/helpers';
import { createSpeakerParams } from './types';

// Initialize an array to store speakers.
export let speakers: Array<Speaker> = [];

/**
 * A simple function that will make sure that an id is never allocated twice.
 * @returns
 */

export const allocateId = (): number => {
	const usedIds = new Set(speakers.map((speaker) => speaker.id));

	let nextId = 1;

	while (usedIds.has(nextId)) {
		nextId++;
	}

	return nextId;
};

/**
 * This creates a speaker in our server.
 * @param params
 * @returns The id of the speaker created
 */

export const createSpeaker = async (params: createSpeakerParams) => {
	try {
		// Get the generated id
		const id = allocateId();

		// Create the speaker entity
		const entity = new Speaker({
			id,
			position: params.position,
			rotation: params.rotation,
			range: params.range,
			dimension: params.dimension,
			owner: params.owner,
			objectType: params.objectType
		});

		// Add to array
		speakers.push(entity);

		// Return the id..
		return entity;
	} catch (err) {
		await logError(`speakers.createSpeaker`, err);
		throw err;
	}
};

/**
 * This deletes the speaker from in-game.
 * @param id
 * @returns
 */

export const deleteSpeaker = async (id: number, byAdmin = false) => {
	try {
		// Create the speaker entity
		const entity = getSpeakerById(id);
		if (!entity) return false;

		// Destroy
		entity.destroy(byAdmin);

		// Delete it from the array
		speakers = speakers.filter((c) => c.id !== id);

		return true;
	} catch (err) {
		await logError(`speakers.createSpeaker`, err);
		throw err;
	}
};

/**
 * This function will tell you if there's a speaker within a certain position's range.
 * @param position
 * @param range
 * @returns An array of speakers.
 */

export const getSpeakersWithinRange = (position: Vector3, range: number) => {
	return speakers.filter((c) => isInRange(c.position, position, range));
};

/**
 * Finds the speaker by identifier.
 * @param identifier
 * @returns
 */

export const getSpeakerById = (id: number) => speakers.find((c) => c.id === id);

/**
 * Get how many connections can this player make at the same time.
 * @param player
 * @returns
 */

export const getPlayerMaximumSpeakersConnections = (player: PlayerMp) => {
	if (player.getAdminLevel()) return 999;

	// La VIP sa facem 3-6.

	return 1;
};
