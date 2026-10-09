import { logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

rpc.on('vespify:getApplicationData', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Get his permissions
		const data = {
			permissions: {
				keepVideoInBackground: player.checkPermission('phone.vespify.keepVideoInBackground')
			}
		};

		// Trigger a browser event with the prepared data.
		player.triggerBrowserEvent('phone.vespify@receivedApplicationData', data);

		return true;
	} catch (err) {
		await logError(`vespify:getApplicationData`, err);
		return false;
	}
});
