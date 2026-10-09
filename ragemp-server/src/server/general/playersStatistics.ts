import { logError } from '@server/utils/helpers';

import { createLanguagePack } from '@vmp/i18n';

// Databases
import Vaults from '@modules/database/shared/vaults/repository';
import { Op } from 'sequelize';

export const recordPlayersOnline = async () => {
	try {
		// Recording the number of players online..
		const playersOnline = mp.players.toArray().length;

		// Save it to the database..
		await Vaults.insert({
			type: 'playersOnline',
			data: {
				value: playersOnline
			}
		});

		// Generating the cut off date..
		const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // last 7 days.

		// Delete older records that are older than 7 days.
		await Vaults.destroy({
			where: {
				type: 'playersOnline',
				createdAt: {
					[Op.lt]: cutoffDate
				}
			}
		});

		return true;
	} catch (err) {
		await logError(`RECORD_PLAYERS_ONLINE`, err);
		return false;
	}
};

const recordPlayersRecord = async () => {
	try {
		// Recording the number of players online.
		const playersOnline = mp.players.toArray().length;

		// Now let's check the record of online players.
		const latestRecord = await Vaults.findOne({
			order: [['createdAt', 'DESC']],
			where: {
				type: 'playersRecord'
			}
		});

		// There is no record yet made so let's create the first one.
		if (!latestRecord) return await createRecordOfPlayers(0);

		// Getting the latest record number.
		const { value: latestRecordNumber } = JSON.parse(latestRecord.data);

		// If a new record has been set.
		if (playersOnline > latestRecordNumber) {
			await createRecordOfPlayers(playersOnline);

			// Inform chat.
			await mp.chat.sendStaffMessageToAll({
				permission: 'game.staffMessages',
				systemId: 'playersStatistics',
				messageId: 'newRecord',
				args: () => ({ players: playersOnline })
			});
		}

		// Deleting older records that are older than 7 days.
		const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		await Vaults.destroy({
			where: {
				type: 'playersRecord',
				createdAt: {
					[Op.lt]: cutoffDate
				}
			}
		});
	} catch (err) {
		await logError(`RECORD_PLAYERS_RECORD`, err);
		return false;
	}
};

const createRecordOfPlayers = async (number: number) => {
	await Vaults.insert({
		type: 'playersRecord',
		data: {
			value: number
		}
	});
};

createLanguagePack('playersStatistics', {
	newRecord: {
		EN: ({ players }) => `New record of players online: ${players}!`,
		RO: ({ players }) => `Un nou record de jucători online: ${players}!`
	}
});

setInterval(recordPlayersRecord, 10 * 60 * 1000); // once every 10 minutes.
