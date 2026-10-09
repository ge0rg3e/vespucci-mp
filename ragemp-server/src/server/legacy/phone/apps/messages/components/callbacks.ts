import * as rpc from 'rage-rpc';

// Dependencies
import { logError, sliceIntoChunks } from '@server/utils/helpers';
import { formatMessageForPlayer } from '../utils/functions';

// Database
import MessagesDb from '@modules/database/game/messages/repository';

rpc.on('messages.loadDependencies', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Get the messages
		let messages: ExpectedAny = await MessagesDb.getPlayerMessages(player.info.id);

		// Send the messages..
		if (messages.length > 0) {
			// Format messages for the app interface.
			messages = messages.map((c: PhoneMessage) => formatMessageForPlayer(c, player));

			// Send the messages if there's any
			const chunks = sliceIntoChunks(messages, 1000);
			chunks.forEach((chunk: ExpectedAny) => player.triggerSocketEvent('messages.loadMessages', chunk));
		} else {
			// If there are zero messages we need to send at least an empty array
			player.triggerSocketEvent(`messages.loadMessages`, []);
		}

		// Send the contacts.
		const contactsChunks = sliceIntoChunks(player.vars.phoneContacts, 1000);
		contactsChunks.forEach((chunk: ExpectedAny) => player.triggerSocketEvent('messages.loadContacts', chunk));

		// Send core data
		player.triggerBrowserEvent(`messages.loadData`, {
			phoneNumber: player.info.phoneNumber
		});

		return true;
	} catch (err) {
		await logError(`messages.requestData`, err);
		return false;
	}
});

rpc.on('messages.send', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Extract parameters
		const { phoneNumbers, content } = JSON.parse(args);

		// Send the message to the validated phone numbers.
		player.sendPhoneMessage(phoneNumbers, {
			type: content.type,
			data: content.data
		});

		return true;
	} catch (err) {
		await logError(`messages.send`, err);
		return false;
	}
});

rpc.on('messages.deleteConversation', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Extract the ids..
		const { messageIds } = JSON.parse(args);

		// Delete in a batch the messages.
		messageIds.forEach((id: number) => player.deletePhoneMessage(id));

		return true;
	} catch (err) {
		await logError(`messages.deleteConversation`, err);
		return false;
	}
});

rpc.on('messages.markAsSeen', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const { id } = JSON.parse(args);

		// Mark it
		player.markPhoneMessageAsSeen(id);

		return true;
	} catch (err) {
		await logError(`messages.markAsSeen`, err);
		return false;
	}
});
