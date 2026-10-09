import { formatPhoneNumber, logError } from '@server/utils/helpers';

// Dependencies
import { findAccountIdByPhoneNumber } from '@server/legacy/phone/components/phoneBook';
import { MessageParticipant, MessageSender } from '@modules/database/game/messages/model/types';
import { isNumberBlocked } from '@server/general/blockedNumbers/components/functions';

/**
 *
 * @param recipient The recipient data
 * @param contacts Array of contacts to match it
 * @returns The recipient data formatted accordingly as per our player's list of contacts.
 */

export const getMetaDataForMessageRecipient = (recipient: MessageParticipant | MessageSender, contacts: Array<PhoneContact>) => {
	// Get the phone contact matching to this phone number from when the message was sent.
	const contact = contacts.find((c) => c.number === recipient.phoneNumber);

	return {
		...recipient,
		meta: {
			displayName: contact ? contact.name : formatPhoneNumber(recipient.phoneNumber)
			// TBD Later: Avatar.
		}
	};
};

/**
 *
 * @param phoneNumbers Array of phone numbers
 * @returns The message participants properly matched.
 */

export const mapToMessageParticipants = (participants: Array<{ phoneNumber: string; received: boolean }>): Array<MessageParticipant> => {
	try {
		// Hold the result
		const res: Array<MessageParticipant> = [];

		// Iterate and push
		participants.forEach((participant: ExpectedAny) => {
			// Push the result
			res.push({
				// Who receives this message
				type: participant.type,
				id: participant.id,
				// Their phone number
				phoneNumber: participant.phoneNumber,
				// Has this person received the message?
				received: participant.received,
				// We have not deleted or seen the message yet.
				deleted: false,
				seen: false
			});
		});

		// Return the result
		return res;
	} catch (err) {
		logError(`mapToMessageParticipants`, err, { participants });
		return []; // Failed.
	}
};

/**
 *
 * @param type
 * @param entity
 * @returns The message sender data accordingly from the entity.
 */

export const formatMessageSenderDetails = (type: 'player' | 'actor', entity: PlayerMp) => ({
	// Who sent this message
	type,
	id: entity.info.id,
	// Other details
	phoneNumber: entity.info.phoneNumber, // Our phone number..
	// Administrative metadata..
	metadata: entity.client_location,
	// We haven't deleted this message.
	deleted: false
});

/**
 *
 * @param recipientNumbers - The numbers we're trying to send a message to.
 * @param phoneNumber - The number who is sending the mesasge.
 * @returns the array filtered according to: if they're valid numbers and if we're not blocked.
 */

export const validateMessageRecipients = (recipientNumbers: Array<string>, player: PlayerMp) => {
	const arr: ExpectedAny = [];

	recipientNumbers.forEach((number) => {
		let received = true;

		// Get the account id of this phone number
		const accountId = findAccountIdByPhoneNumber(number);

		// Get the player at that phone number
		const target = mp.players.atPhoneNumber(number);

		// There is no account matching therefore an invalid phone number.
		if (!accountId) {
			received = false;
		}

		// If we are blocked by him or we blocked him.
		if ((accountId && isNumberBlocked(accountId, player.info.phoneNumber)) || isNumberBlocked(player.info.id, number)) {
			received = false;
		}

		// If somehow they byppased our client interface prevention - They can't email themselves.
		if (target === player) {
			received = false;
		}

		// Add
		arr.push({
			// Important..
			type: 'player',
			id: accountId ? accountId : null,
			// Other details..
			received,
			phoneNumber: number
		});
	});

	return arr;
};

/**
 *
 * @param message The message from database (after being parsed)
 * @param player  the player we're formatting it for
 * @returns the message nicely formatted.
 */

export const formatMessageForPlayer = (message: PhoneMessage, player: PlayerMp) => {
	// Format messages for the web interface.
	const formattedMessage = {
		...message,
		// Format the sender and recipients.
		sender: getMetaDataForMessageRecipient(message.sender, player.vars.phoneContacts),
		recipients: message.recipients.map((p: ExpectedAny) => getMetaDataForMessageRecipient(p, player.vars.phoneContacts))
	};

	return formattedMessage;
};
