import { logError } from '@server/utils/helpers';

// Dependencies
import ContactsDb from '@modules/database/game/contacts/repository';

mp.events.add('loadPlayerDefaults', async (player) => {
	try {
		// Load our in-game phone contacts.
		const phoneContacts = await ContactsDb.getContacts(player.info.id);

		// Update his variable
		player.updateVars({ phoneContacts });
	} catch (err) {
		await logError(`phone.contacts:loadContactsAndBlockedContactsOnLogin`, err);
	}
});
