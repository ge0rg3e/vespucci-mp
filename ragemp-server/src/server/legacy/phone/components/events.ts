import { logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

rpc.register('getPhoneInstalledApplications', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		const apps = mp.phone.getHomeScreenApps(player);
		return apps;
	} catch (err) {
		return [];
	}
});

mp.events.add('gamemodeStarted', () => {
	// Register this attachment for the phone..
	mp.playerAttachments.register('phone', 'ifruit_12', 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
});

mp.events.add('loadPlayerDefaults', (player) => {
	// Make sure this variable is client-sided
	player.addClientsideVariables('phoneAnimState');

	// At this moment the player does nothing with his phone.
	player.updateVars({ phoneAnimState: null });
});

rpc.on('phone:setAnimState', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.

	try {
		const { value } = JSON.parse(args);

		// Update the animation state
		player.updateVars({ phoneAnimState: value });

		return true;
	} catch (err) {
		await logError(`phone:setHoldingState`, err, { player: player?.info.username });
		return false;
	}
});
