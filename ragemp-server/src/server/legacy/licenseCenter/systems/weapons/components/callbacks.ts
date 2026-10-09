import { logError } from '@server/utils/helpers';
import rpc from 'rage-rpc';

rpc.on('ammuNation.licenseCenter@onCountdownFinished', (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;

	// Unfreeze the player if it was Frozen still.
	player.freeze({ systemId: 'ammuNation', toggle: false });

	return;
});

rpc.on('ammuNation.licenseCenter@onSuccess', (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;

	// Clear the test dependencies
	mp.events.call('testingCenter@weapon.success', player);
	return;
});

rpc.on('ammuNation.licenseCenter@onFailure', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;

	try {
		const { reason } = JSON.parse(args);

		// Inform the server
		mp.events.call(`testingCenter@weapon.failed`, player, reason);

		return true;
	} catch (err) {
		await logError(`ammuNation.licenseCenter@onFailure`, err, { args });
		return true;
	}
});
