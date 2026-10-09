import Bans from '@modules/database/game/bans/repository';
import { logError } from '@server/utils/helpers';

export const checkActiveBans = async () => {
	try {
		const bans = await Bans.getBans();
		if (!bans.length) return false;

		bans.forEach((ban) => {
			Bans.update(
				{
					active: false
				},
				{
					where: {
						username: ban.username,
						rockstarId: ban.rockstarId
					}
				}
			);
		});

		return true;
	} catch (err) {
		await logError(`CHECK_ACTIVE_BANS`, err);
		return false;
	}
};
