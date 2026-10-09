import { logError } from '@server/utils/helpers';

// Messages..
import MessagesDb from '@modules/database/game/messages/repository';

// Variables
const MAX_AGE_DAYS = 60; // Days. How old the message must be to be deleted.

const DeleteMessages = async () => {
	try {
		const sixtyDaysAgo = new Date();
		sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - MAX_AGE_DAYS);

		// Delete any messages older than X days.
		await MessagesDb.destroy({
			where: {
				createdAt: { $lt: sixtyDaysAgo }
			}
		});
	} catch (err) {
		await logError('DELETE_MESSAGES_CRON_TASK', err);
	}
};

setInterval(DeleteMessages, 10 * 60 * 1000); // Once every 10 minutes.
