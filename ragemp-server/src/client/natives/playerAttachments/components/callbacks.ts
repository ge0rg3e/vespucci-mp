import * as rpc from 'rage-rpc';

export let Attachments: Array<RegisteredPlayerAttachments> = [];
export let AttachmentsLoaded = false;

// Variable
let timerId: ExpectedAny = null;

/**
 * This event receives from the server at login the possible attachments that we can set.
 */

rpc.on(`attachments.registerAttachments`, (args) => {
	const { entries } = JSON.parse(args);

	// Add it to the attachments.
	Attachments = [...Attachments, ...entries];

	// If is another batch..
	if (timerId !== null) {
		// Clear timeout
		clearTimeout(timerId);

		// Reset id
		timerId = null;
	}

	timerId = setTimeout(() => {
		AttachmentsLoaded = true;

		// Call event to sync on startup.
		mp.events.call('playerAttachments:syncOnStartup');

		// Reset variable
		timerId = null;
	}, 1000);
});
