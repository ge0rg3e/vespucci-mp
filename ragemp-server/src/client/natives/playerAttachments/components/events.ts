import { loggedIn } from '@client/natives/interfaces';

// Dependencies
import { createAttachment, removeAttachment } from './functions';

// Types
import { playerAttachments } from './types';
import { logClientsideError } from '@client/general/errors';
import { AttachmentsLoaded } from './callbacks';
import { getPlayerVariable } from '@client/utils/helpers';

// This event will make sure whenever someone close by attaches an object to them will be synced to us too.

const player = mp.players.local;

mp.events.addDataHandler('@playerVars.attachments', async (entity: PlayerMp, currentAttachments: playerAttachments, _oldVariable: playerAttachments) => {
	try {
		if (!loggedIn) return; // Not yet.
		if (entity.type !== 'player') return; // If is not a player we skip...
		if (entity.handle === 0) return; // Not streamed in.
		if (JSON.stringify(currentAttachments) === JSON.stringify(_oldVariable)) return; // Anti SPAM by RAGE:MP that sometimes triggers this event with same data.
		if (AttachmentsLoaded === false) return; // Not ready.

		// Get old attachments this player has created by our clientside for him.
		const oldAttachments: Record<string, PlayerAttachment> = entity.attachments || {};

		// If some attachments are no longer on this player, we destroy them
		Object.keys(oldAttachments).forEach(async (id) => {
			if (currentAttachments.includes(id)) return; // We still have this one.
			if (oldAttachments[id].origin === 'client') return; // We don't clean clientsided attachments.

			// Delete it.
			await removeAttachment(entity, id);
		});

		// We now create the new ones..
		currentAttachments.forEach((id) => {
			// It was already created.
			if (Object.keys(oldAttachments).includes(id)) return;

			// Create it..
			createAttachment(entity, id, 'server');
		});
	} catch (err) {
		await logClientsideError(`addDataHandler:@playerVars.attachments`, err, {
			oldAttachments: Object.keys(entity.attachments || {}),
			currentAttachments
		});
	}
});

// @Event: This event makes sure when someone enters our stream we'll create their object on them.
mp.events.add('entityStreamIn', async (entity: PlayerMp) => {
	try {
		if (!loggedIn) return; // Not yet.
		if (entity.type !== 'player') return; // Not of interest.
		if (AttachmentsLoaded === false) return; // Not ready.

		// We get the attachments..
		const attachments: playerAttachments = getPlayerVariable(entity.remoteId, `attachments`);
		if (!attachments) return; // Something wrong and odd.

		// We create the attachments..
		attachments.forEach((id) => createAttachment(entity, id, 'server'));
	} catch (err) {
		await logClientsideError(`entityStreamIn.playerAttachments`, err, {
			oldAttachments: Object.keys(entity.attachments || {})
		});
	}
});

// @Event: This event makes sure to delete the objects off someone that left our stream to keep a tidy client.
mp.events.add('entityStreamOut', async (entity: PlayerMp) => {
	try {
		if (!loggedIn) return; // Not yet.
		if (entity.type !== 'player') return; // Not of interest.
		if (AttachmentsLoaded === false) return; // Not ready.

		// We get the attachments created for him.
		const attachments = entity.attachments || {};

		// We delete the attachments..
		Object.keys(attachments).forEach((id) => removeAttachment(entity, id));
	} catch (err) {
		await logClientsideError(`entityStreamOut.playerAttachments`, err, {
			oldAttachments: Object.keys(entity.attachments || {})
		});
	}
});

// Client-side will not create the attachments for other synced players until the server sends them the registered attachments.
// This means we need to wait until their attachments are loaded client-side.

mp.events.add(`playerAttachments:syncOnStartup`, async () => {
	if (!loggedIn) return; // Not yet.
	if (AttachmentsLoaded === false) return; // Not ready.

	try {
		mp.players.forEach((entity: PlayerMp) => {
			// Set this variable for a start..
			entity.attachments = {};

			// Check is logged in
			const loggedIn = getPlayerVariable(entity.remoteId, `loggedIn`);
			if (!loggedIn) return; // not yet.

			// We get the attachments..
			const attachments: playerAttachments = getPlayerVariable(entity.remoteId, `attachments`);
			if (!attachments) return; // Something wrong and odd.

			// Is not in our stream
			if (entity.handle === 0) return;

			// We create the attachments..
			attachments.forEach((id) => createAttachment(entity, id, 'server'));
		});
	} catch (err) {
		await logClientsideError(`playerAttachments:syncOnStartup`, err);
	}
});

mp.events.add('playerJoin', (p) => {
	// Reset attachments
	p.attachments = {};
});

// @Event: When we start the game let's clear all players attachments.
mp.events.add('playerReady', () => mp.players.forEach((p) => (p.attachments = {})));

// @Event: When a player leaves the game let's delete their attachments if there's any.
mp.events.add('playerQuit', (p) => {
	// Nothing to delete.
	if (!p.attachments || (p.attachments && Object.keys(p.attachments).length < 1)) return false;

	// Delete all attachments.
	Object.keys(p.attachments).forEach((id: string) => removeAttachment(p, id));

	return true;
});

// This makes sure when we leave with our attachments or change dimension, we will keep seeing them.
const maintainAttachmentsDimensions = () => {
	try {
		if (!loggedIn) return false;

		// We get the attachments created for him.
		const attachments: ExpectedAny = player.attachments || [];

		// No attachment to maintain.
		if (!attachments) return false;

		// loop
		Object.keys(attachments).forEach(async (id) => {
			const attachment: PlayerAttachment = attachments[id];

			// Invalid obj
			if (!mp.objects.exists(attachment.entity)) return;

			// Already in same dimension
			if (attachment.entity.dimension === player.dimension) return;

			// Re-create it since stupid RAGE:MP won't allow us to update that object dimension.
			await removeAttachment(player, id);
			await createAttachment(player, id, attachment.origin);
		});

		return true;
	} catch (err) {
		logClientsideError(`playerAttachments.maintainAttachmentsDimensions`, err);
		return false;
	}
};

setInterval(maintainAttachmentsDimensions, 1000);
