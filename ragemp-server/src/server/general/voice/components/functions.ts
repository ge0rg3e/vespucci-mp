import { logError } from '@server/utils/helpers';

/**
 *
 * @param channel The channel that the player wants to check if is resumable upon reconnection
 * @returns boolean
 */

export const isChannelResumable = (player: PlayerMp, channel: string | null) => {
	try {
		return true;
	} catch (err) {
		logError(`isChannelResumable`, { channel, player: player.info.username });
		return false;
	}
};
