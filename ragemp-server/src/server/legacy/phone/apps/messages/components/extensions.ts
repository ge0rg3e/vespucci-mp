// Dependencies
import { logError } from '@server/utils/helpers';
import { validateMessageRecipients, formatMessageSenderDetails, mapToMessageParticipants, formatMessageForPlayer } from '../utils/functions';

// Types
import { CreateMessageInput } from '@modules/database/game/messages/repository/types';

// Database
import MessagesDb from '@modules/database/game/messages/repository';

mp.Player.prototype.sendPhoneMessage = async function (phoneNumbers, content) {
	try {
		// Get the recipients received status
		const recipients = validateMessageRecipients(phoneNumbers, this);

		// Formatting the message..
		const message: CreateMessageInput = {
			content,
			// Sender and recipients..
			sender: formatMessageSenderDetails('player', this),
			recipients: mapToMessageParticipants(recipients)
		};

		// Save the message in db
		const entry: ExpectedAny = await MessagesDb.createMessage(message);

		// Trigger event that inform us when a message has just been sent.
		mp.events.call(`phone:messageSent`, entry);

		// We need to make sure only the person that recived the message will be synced
		const filtredRecipients = recipients.filter((c: ExpectedAny) => c.recived === true);

		// Sync the message down to the participants
		const numbers = [this.info.phoneNumber, ...filtredRecipients.map((c: ExpectedAny) => c.phoneNumber)];
		for (const number of numbers) {
			// Get the player
			const target = mp.players.atPhoneNumber(number);
			if (!target) continue;

			// Get the app id
			const appId = await target.getPhoneApplicationRunning();
			if (appId !== 'messages') continue; // Not interested, will receive notification.

			// Sent this to the app.
			target.triggerSocketEvent('messages.loadMessages', [formatMessageForPlayer(entry, target)]);
		}
	} catch (err) {
		await logError(`sendPhoneMessage`, err);
	}
};

mp.Player.prototype.deletePhoneMessage = async function (id) {
	try {
		// Ask db to perform query
		await MessagesDb.deleteMessageForPlayer(id, this.info.id);

		return true;
	} catch (err) {
		await logError('deletePhoneMessage', err, { id });
		return false;
	}
};

mp.Player.prototype.markPhoneMessageAsSeen = async function (id) {
	try {
		// @ts-ignore-next-line
		const message = await MessagesDb.findOne({ where: { id: id } });
		if (!message) return false;

		// Mark it in the database as seen
		await MessagesDb.markMessageSeenForPlayer(message.id, this.info.id);

		// Sync it down to the sender
		if (message.sender.type === 'player' && mp.players.atPhoneNumber(message.sender.phoneNumber)) {
			// Get the player
			const target = mp.players.atPhoneNumber(message.sender.phoneNumber);
			if (!target) return;

			// Get the app id
			const appId = await target.getPhoneApplicationRunning();
			if (appId !== 'messages') return; // Not interested.

			// Sent this to the app.
			target.triggerSocketEvent('messages.updateSeenStatus', {
				recipient: {
					type: 'player',
					id: this.info.id
				},
				id: message.id
			});
		}

		return true;
	} catch (err) {
		await logError('markPhoneMessageAsSeen', id);
		return false;
	}
};

declare global {
	interface PlayerMp {
		sendPhoneMessage(phoneNumbers: Array<string>, content: CreateMessageInput['content']): void;
		deletePhoneMessage(id: number): void;
		markPhoneMessageAsSeen(id: number): void;
	}
}

export {};
