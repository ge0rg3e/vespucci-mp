import { logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

rpc.on('antiCheat.detected@weapons', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		const { weaponInHand, currentWeapon } = JSON.parse(args);

		player.kickDelayed(
			'Cheats Detected',
			'You have been flagged by our anti-cheat system for using unauthorized weapons. This behavior is not tolerated. Your have been kicked out of the game.',
			30
		);
		player.createAmplitudeEvent(`Cheat Detected: Weapons`, { weaponInHand, currentWeapon });
	} catch (err) {
		await logError('antiCheat.detected@weapons', err, { player: player && player.info && player.info.username ? player.info.username : 'Not logged in' });
		return false;
	}
});
