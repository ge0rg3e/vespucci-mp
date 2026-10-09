import * as rpc from 'rage-rpc';

// Dependencies
import { createPhoneLine, filterParticpantsForValids, getCallerName, getPhoneLine, updateParticipant } from './functions';
import { formatPhoneNumber, logError } from '@server/utils/helpers';
import { isNumberBlocked, registerBlockedNumber } from '@server/general/blockedNumbers/components/functions';

/**
 * Callback when someone initiates a call to someone. (Ex: John Doe calls Someone)
 */

rpc.on('phone:call', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// From the contact list the name of the contact we're calling and his accountId.
		const { phoneNumber } = JSON.parse(args);

		// No phone number passed.
		if (!phoneNumber) return false;

		// If we already have a phone line we cannot make another call.
		if (player.getPhoneLine() !== null) return false;

		// If we don't have enough phone credits.
		if (player.info.phoneCredits < 1) return player.showPhoneAlert(`Phone Credits`, `You need to buy Phone Credits from General Store before calling this number.`);

		// @Reminder pentru George: Daca implementezi "block" system sa nu poata suna nr blocate
		// Sa pui aceasi logica si la "callAgain" mai jos. E o functie ce permite sa dai sa suni iar.

		// Tracking on amplitude
		player.createAmplitudeEvent(`Calling Number`, {
			phoneNumber,
			playerMatching: mp.players.atPhoneNumber(phoneNumber) ? mp.players.atPhoneNumber(phoneNumber)!.info.username : 'No one online.'
		});

		// To get the role for the player we're about to call
		let targetStatus: phoneLineStatus = 'pending';

		// Check this player..
		const playerCalled = mp.players.atPhoneNumber(phoneNumber);

		// If the player we're calling is either offline or he's in a call
		if (!playerCalled || (playerCalled && playerCalled.getPhoneLine() !== null)) {
			targetStatus = playerCalled ? 'busy' : 'unreachable';
		}

		// If your number is blocked by the recipient phone number
		if (playerCalled && isNumberBlocked(playerCalled.info.id, player.info.phoneNumber)) {
			targetStatus = 'unreachable';
		}

		// If you have blocked that number
		if (isNumberBlocked(player.info.id, phoneNumber)) {
			targetStatus = 'unreachable';
		}

		// If we just tried to call ourselves cause we're stupid
		if (playerCalled === player) {
			targetStatus = 'unreachable';
		}

		// If there's a player and we called him and he was busy...
		if (targetStatus === 'busy' && playerCalled) {
			// Log it for the player called
			playerCalled.logRecentCall({
				phoneNumber: player.info.phoneNumber,
				isCaller: false,
				callMissed: true
			});
		}

		// If the target was unreachable or busy we log it for us.
		if (targetStatus !== 'pending') {
			// Log it for the player called
			player.logRecentCall({
				phoneNumber,
				isCaller: true
			});
		}

		// Creating a new phone line for this new call.
		const { id } = createPhoneLine({
			participants: [
				// The player making the call
				{
					phoneNumber: player.info.phoneNumber,
					role: 'caller',
					status: 'active',
					joinedAt: new Date(),
					calledAt: new Date()
				},
				// The player we're calling.
				{
					phoneNumber,
					role: 'participant',
					status: targetStatus,
					joinedAt: null, // Haven't joined yet.
					calledAt: new Date() // important to know when we called this person
				}
			]
		});

		// Get the data again after the function above updated its data.
		const lineData = getPhoneLine(id);
		if (!lineData) throw new Error(`Line no longer exists after validation.`);

		// Get the valid participants to know to who we will show the phone call interface.
		const validParticipants = filterParticpantsForValids(lineData.participants);

		// Now for each participant we need to start the phone call overlay interface..
		validParticipants.forEach((participant) => {
			// Get the participant.
			const target = mp.players.atPhoneNumber(participant.phoneNumber);

			// If the participant is not online
			if (!target) return false;

			// Load him the interface. (@Reminder: the interface will make him fetch the data from server)
			target.triggerBrowserEvent(`phoneCall:setOverlayState`, { active: true });

			// Raising the phone up
			target.triggerClientEvent(`setPhoneIsRaised`, { boolean: true });

			// Mark it on amplitude for other players
			if (target !== player) {
				target.createAmplitudeEvent(`Phone Ringing`, { calledBy: player.info.username });
			}

			return true;
		});

		return true;
	} catch (err) {
		await logError(`phone.call`, err);
		return false;
	}
});

/**
 * Callback that gets us the player's data for the call interface.
 */

rpc.on('phone:requestCallData', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Get the player phone line
		const phoneLine = player.getPhoneLine();

		// If current player is not part of any phone line.
		if (phoneLine === null) return null;

		// Get the phone line from the server
		const line = getPhoneLine(phoneLine.id);
		if (!line) return null;

		// The array that will hold all the validated participants.
		const participants = [];

		// Iterate and format data for each one..
		for (const participant of line.participants) {
			// If we have this contact in our list we will use the name we set forthem.
			const contactMatch = player.vars.phoneContacts.find((c) => c.number === participant.phoneNumber);

			// Push it to the array..
			participants.push({
				// The name we have on display for him.
				displayName: contactMatch ? contactMatch.name : participant.phoneNumber.length > 3 ? formatPhoneNumber(participant.phoneNumber) : participant.phoneNumber,
				// The role and status for them in this call.
				role: participant.role,
				status: participant.status,
				joinedAt: participant.joinedAt,
				// A small hack to know which one is us.
				_isLocalPlayer: player.info.phoneNumber === participant.phoneNumber ? true : false
			});
		}

		// Call this event to set the call data interface.
		player.triggerBrowserEvent(`phone:setCallData`, {
			id: line.id,
			participants,
			localInfo: {
				ringtone: {
					type: player.info.phoneRingtoneType,
					value: player.info.phoneRingtoneValue
				}
			}
		});

		// Get local data
		const localData = participants.find((c) => c._isLocalPlayer);
		if (!localData) return false;

		return true;
	} catch (err) {
		await logError(`phone:getCallData`, err);
		return false;
	}
});

/**
 * Callback when someone accepts the call we made.
 */

rpc.on('phone:acceptCall', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Get the player phone line
		const phoneLine = player.getPhoneLine();

		// If current player is not part of any phone line.
		if (phoneLine === null) return null;

		// Get the phone line from the server
		const line = getPhoneLine(phoneLine.id);
		if (!line) return null;

		// Update his participant title..
		updateParticipant(line.id, player.info.phoneNumber, { status: 'active', joinedAt: new Date() });

		// Track on amplitude
		player.createAmplitudeEvent(`Accepted Call`, {
			calledBy: getCallerName(line.id)
		});

		// Call event
		mp.events.call(`phoneLine:onCallAccepted`, phoneLine.id);

		return true;
	} catch (err) {
		await logError(`phone:acceptCall`, err);
		return false;
	}
});

/**
 * Callback when someone denies the call we made.
 */

rpc.on('phone:rejectCall', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Get the player phone line
		const phoneLine = player.getPhoneLine();

		// If current player is not part of any phone line.
		if (phoneLine === null) return null;

		// Get the phone line from the server
		const line = getPhoneLine(phoneLine.id);
		if (!line) return null;

		// Update his participant title..
		updateParticipant(line.id, player.info.phoneNumber, { status: 'busy' });

		// Track on amplitude
		player.createAmplitudeEvent(`Rejected Call`, {
			calledBy: getCallerName(phoneLine.id)
		});

		// Hide the overlay now.
		player.triggerBrowserEvent(`phoneCall:setOverlayState`, { active: false });

		// Call event
		mp.events.call(`phoneLine:onCallRejected`, line.id);

		return true;
	} catch (err) {
		await logError(`phone:rejectCall`, err);
		return false;
	}
});

/**
 * Callback when someone hangs up on the call.
 * @Reminder: There are two types of hangups: manual and automatic. The main caller will automatically hang up if no one is left in the call.
 */

rpc.on('phone:hangupCall', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Get the type of hangup call.
		const { type } = JSON.parse(args);

		// Make the player hang up
		player.hangUpCall(type);

		return true;
	} catch (err) {
		await logError(`phone:rpc.hangupCall`, err);
		return false;
	}
});

rpc.on('phone:mute', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Get the player phone line
		const phoneLine = player.getPhoneLine();

		// If current player is not part of any phone line.
		if (phoneLine === null) return null;

		// Update state
		player.updateVars({ callMuted: !player.vars.callMuted });

		return true;
	} catch (err) {
		await logError(`phone:mute`, err);
		return false;
	}
});

rpc.on('phone:blockCaller', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Get the player phone line
		const activeLine = player.getPhoneLine();

		// If current player is not part of any phone line.
		if (!activeLine) return null;

		// Get line
		const line = getPhoneLine(activeLine.id);
		if (!line) return null;

		// Filter participants
		const participants = line?.participants.filter((x) => x.phoneNumber !== player.info.phoneNumber);

		// Get participant
		const participant = participants[0];

		// Block the number...
		await registerBlockedNumber(player.info.id, participant.phoneNumber);

		// Hangup call...
		player.hangUpCall('automatic');

		return true;
	} catch (err) {
		await logError(`phone:blockCaller`, err);
		return false;
	}
});

rpc.on('phoneCall.sendQuickMessage', async (args, { player }: rpc.ProcedureInfo) => {
	// Check if player exists to avoid TS Error.
	if (!player) return false;
	try {
		const { lineId, msg } = JSON.parse(args);

		// Get the phone line based on lineId.
		const line = getPhoneLine(lineId);
		if (!line) return false;

		// Find the target phone number.
		const targetPhoneNumber = line.participants.find((x) => x.phoneNumber !== player.info.phoneNumber)?.phoneNumber;
		if (!targetPhoneNumber) return false;

		// Get the target language based on the target phone number.
		const targetLang = mp.players.atPhoneNumber(targetPhoneNumber)!.lang;

		// Send the phone message from the player to the target number.
		player.sendPhoneMessage([targetPhoneNumber], {
			type: 'text',
			data: msg[targetLang]
		});

		return true;
	} catch (err) {
		// Log any errors that occur and return false.
		await logError('phoneCall.sendQuickMessage', err);
		return false;
	}
});
