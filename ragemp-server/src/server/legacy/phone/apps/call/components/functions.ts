import { v4 as uuidv4 } from 'uuid';

//  Dependencies
import { logError } from '@server/utils/helpers';

export const phoneLines: Array<PhoneLine> = [];

/**
 * @summary: Creates a phone line between players to communicate after they accept the call.
 */

export const createPhoneLine = (params: createPhoneLine) => {
	// Creating the object..
	const entry = {
		id: uuidv4(),
		participants: params.participants
	};

	// Adding to the array
	phoneLines.push(entry);

	// We return the id.
	return entry;
};

/**
 *
 * @Summary: this deletes a phone line
 */

export const deletePhoneLine = (id: string) => {
	const index = phoneLines.findIndex((c) => c.id === id);
	if (index === -1) return false;

	// Delete it..
	phoneLines.splice(index, 1);

	return true;
};

/**
 *
 * @sumary: Gets the phone line by id.
 */

export const getPhoneLine = (id: string) => phoneLines.find((c) => c.id === id) || null;

/**
 *
 * @summary: Updates the participants of a call and also triggers updates.
 */

export const updateParticipant = async (lineId: string, phoneNumber: string, payload: Partial<phoneLineParticipant>) => {
	try {
		// Find the phone line
		const lIndex: number = phoneLines.findIndex((c) => c.id === lineId);
		if (lIndex === -1) return false;

		// Update the participant
		const pIndex = phoneLines[lIndex].participants.findIndex((c) => c.phoneNumber === phoneNumber);
		if (pIndex === -1) return false;

		// Update the participant while not affecting the other data.
		phoneLines[lIndex].participants[pIndex] = {
			...phoneLines[lIndex].participants[pIndex],
			...payload
		};

		// Update participants phone data
		phoneLines[lIndex].participants.forEach((participant) => {
			// Get the target
			const target = mp.players.atPhoneNumber(participant.phoneNumber);
			if (!target) return false;

			// It means this person is not in call with us.
			if (participant.status !== 'active') return false;

			// Ask broswer to update his data.
			target.triggerBrowserEvent(`phoneCall:refreshData`);

			return true;
		});

		return true;
	} catch (err) {
		await logError(`phone:updateParticipant`, err, { phoneNumber, payload });
		return false;
	}
};

/**
 *
 * @param lineId The line id
 * @returns The player name of the person calling. This function is used in logs.
 */

export const getCallerName = (lineId: string) => {
	// Get the line
	const line = phoneLines.find((c) => c.id === lineId);
	if (!line) return 'UNKNOWN_LINE';

	// Get the caller
	const caller = line.participants.find((c) => c.role == 'caller');
	if (!caller) return 'UNKNOWN_CALLER';

	// Get the player
	const player = mp.players.atPhoneNumber(caller.phoneNumber);
	if (!player) return `${caller.phoneNumber}`;

	// Return his username..
	return player.info.username;
};

/**
 *
 * @param participants Array of participants
 * @returns The valid participants that are considered "in call" - Either people that haven't rejected or accepted a call yet or people in that call, active.
 */

export const filterParticpantsForValids = (participants: Array<phoneLineParticipant>) => participants.filter((c) => ['pending', 'active'].includes(c.status));

/**
 *
 * @param lineId The ID of the line
 * @param role The role who we get
 */

export const getParticipant = (lineId: string, role: phoneLineParticipant['role']) => {
	const line = getPhoneLine(lineId);
	if (!line) return null;

	const participant = line.participants.find((c) => c.role === role);
	if (!participant) return null;

	const target = mp.players.atPhoneNumber(participant.phoneNumber);
	if (!target) return null;

	return target;
};
