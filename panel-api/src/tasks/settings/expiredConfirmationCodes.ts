import { Op } from 'sequelize';
import cron from 'node-cron';

// Databases
import confirmationCodes from '@modules/database/panel/confirmationCodes/repository';

// This event deletes expired confirmation codes.

cron.schedule('0 23 * * *', async () => {
	const expiredCodes = await confirmationCodes.findAll({
		where: {
			expiresAt: {
				[Op.lt]: new Date()
			}
		}
	});

	// Delete the expired codes..
	expiredCodes.forEach(async (code) => {
		await code.destroy();
	});
});
