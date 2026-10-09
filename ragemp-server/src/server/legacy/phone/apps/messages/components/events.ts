import { formatPhoneNumber, logError, truncateString } from '@server/utils/helpers';

mp.events.add(`phone:messageSent`, async (message: PhoneMessage) => {
	try {
		for (const recipient of message.recipients) {
			// Get the player..
			const player = mp.players.atAccountId(recipient.id!);
			if (!player) return false; // Not online.

			// Get the app they're running.
			const appId = await player?.getPhoneApplicationRunning();
			if (appId === `messages`) return false; // No need if they're inside it.

			// Get the display name..
			const contactMatch = player.vars.phoneContacts.find((c) => c.number === message.sender.phoneNumber);
			const displayName = contactMatch ? contactMatch.name : formatPhoneNumber(message.sender.phoneNumber);

			// Get what the content should say
			let content = 'INVALID_PREVIEW_MESSAGE';

			// If we received a text..
			if (message.content.type === 'text') {
				const text: ExpectedAny = message.content.data;
				content = truncateString(text, 60);
			}

			player.sendPhoneNotification(displayName, content, `Messages`, `messages`);
		}

		return true;
	} catch (err) {
		await logError(`phone:messageSent@notifications`, err);
		return false;
	}
});
