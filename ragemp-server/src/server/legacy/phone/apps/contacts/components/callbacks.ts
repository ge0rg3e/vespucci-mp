import { logError, sliceIntoChunks } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

// Dependencies
import ContactsDb from '@modules/database/game/contacts/repository';
import AccountsDb from '@modules/database/game/accounts/repository';
import { isNumberBlocked } from '@server/general/blockedNumbers/components/functions';

rpc.on('phone:contacts.requestData', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// If we don't have any contacts we'll just let the front-end know.
		if (player.vars.phoneContacts.length < 1) {
			// We're just gonna send an empty array. is fine. We need the front-end to mark it as loaded.
			player.triggerSocketEvent(`phoneContacts.receivedData`, []);
			return false;
		}

		// Get the array of contacts into chunks.
		const chunks = sliceIntoChunks(player.vars.phoneContacts, 1000);
		chunks.forEach((chunk: ExpectedAny) => player.triggerSocketEvent('phoneContacts.receivedData', chunk));

		return true;
	} catch (err) {
		await logError(`phone:contacts.requestData`, err);
		return false;
	}
});

rpc.on('phoneApp.requestData', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Send this data..
		player.triggerBrowserEvent(`phoneApp.receivedData`, {
			localInfo: {
				number: player.info.phoneNumber,
				credits: player.info.phoneCredits
			}
		});

		return true;
	} catch (err) {
		await logError(`phoneApp.requestData`, err);
		return false;
	}
});

rpc.register('phone:contacts.add', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Extract variables
		const { name, number, notes } = JSON.parse(args);

		// If the number is already in contacts
		if (player.vars.phoneContacts.find((x) => x.number === number)) return 'NUMBER_ALREADY_EXISTS';

		// Get the account of the phone number added
		const account = await AccountsDb.findOne({
			where: {
				phoneNumber: number
			}
		});

		// If there is no account.
		if (!account) return `INVALID_PHONE_NUMBER`;

		// Add it in the database
		const entry = await ContactsDb.createContact({
			// Details..
			name,
			number,
			notes,
			// In the future we will also have type actor. And each actor (contactable) will have their own unique id.
			type: 'player',
			// Contact details
			contactId: account.id,
			creatorId: player.info.id
		});

		// Update the player's variables
		player.updateVars({ phoneContacts: [...player.vars.phoneContacts, entry] });

		// Send the new contact to the phone app
		player.triggerSocketEvent('phoneContacts.receivedData', [entry]);

		// Track it in amplitude
		player.createAmplitudeEvent(`Added number to Phone Contacts`, {
			name,
			phoneNumber: number,
			accountId: account.id,
			type: 'player'
		});

		return entry;
	} catch (err) {
		await logError(`phone:contacts.add`, err);
		return false;
	}
});

rpc.register('phone:contacts.delete', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Extract variables
		const { id } = JSON.parse(args);

		// Get the index from current array of variable and remove id\
		const index = player.vars.phoneContacts.findIndex((c) => c.id === id);
		if (index == -1) return 'NOT_IN_CONTACTS';

		// Delete the contact from database
		await ContactsDb.deleteContact(id, player.info.id);

		// Get the index from current array of variable and remove id\
		const updatedArr = [...player.vars.phoneContacts];

		// Remove it
		updatedArr.splice(index, 1);

		// Update player variables
		player.updateVars({ phoneContacts: updatedArr });

		return true;
	} catch (err) {
		await logError(`phone:contacts.delete`, err);
		return false;
	}
});

rpc.register('phone:contacts.edit', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Extract variables
		const { id, payload } = JSON.parse(args);

		// Extract payload
		const { name, number, notes } = payload;
		// In his contacts?
		const contactIndex = player.vars.phoneContacts.findIndex((c) => c.id === id);
		if (contactIndex === -1) return 'NOT_IN_CONTACTS';

		// If we just changed the phone number..
		if (player.vars.phoneContacts[contactIndex].number !== number) {
			// Get the account of the phone number added
			const account = await AccountsDb.findOne({
				where: {
					phoneNumber: number
				}
			});

			// If there is no account matching.
			if (!account) return `INVALID_PHONE_NUMBER`;
		}

		// What fields are changed
		const fieldsChanged = {
			name,
			number,
			notes
		};

		// Update it in db
		await ContactsDb.updateContact(id, fieldsChanged);

		// Update on server-side now..
		const newArr = [...player.vars.phoneContacts];
		newArr[contactIndex] = { ...newArr[contactIndex], ...fieldsChanged };

		// Update the player's variables
		player.updateVars({ phoneContacts: newArr });

		// Track it in amplitude
		player.createAmplitudeEvent(`Updated number in Phone Contacts`, {
			id,
			fieldsChanged
		});

		return true;
	} catch (err) {
		await logError(`phone:contacts.edit`, err);
		return false;
	}
});

rpc.register('phone:shareNumbers.getPlayersNearby', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const players: ExpectedAny[] = [];

		// Iterate through all logged-in players within a certain range of the requesting player's position
		mp.players.forEachLoggedInRange(player.position, 10, (target: PlayerMp) => {
			if (player.dimension !== target.dimension) return;
			if (player === target) return; // fixed.
			if (isNumberBlocked(target.info.id, player.info.phoneNumber)) return;

			players.push({
				id: target.id,
				name: target.info.username
			});
		});

		// Return the array of nearby players, limited to 15 players
		return players.slice(0, 15);
	} catch (err) {
		await logError('phone:shareNumbers.getPlayersNearby', err); // Log any errors that occur
		return false;
	}
});

rpc.register('phone:shareNumbers.sendShare', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.

	try {
		const { contactName, phoneNumber, targetId } = JSON.parse(args);

		// Get the target player's data
		const target = mp.players.at(targetId);

		// If the target player is not valid
		if (!target) return 'TARGET_UNAVAILABLE';

		// Check if the target player has the contacts app open
		const app = await target.getPhoneApplicationRunning();
		if (!app || app !== 'phone') return 'APP_CLOSED';

		// Send a confirmation to the target player's phone
		target.triggerBrowserEvent('phoneContacts.shareNumbers.request', {
			contactName,
			phoneNumber,
			sender: { id: player.id, name: player.info.username }
		});

		return true;
	} catch (err) {
		await logError('phone:shareNumbers.sendShare', err); // Log any errors that occur
		return false;
	}
});
