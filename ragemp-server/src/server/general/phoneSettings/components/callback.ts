import { logError } from '@server/utils/helpers';
import { ringtones } from './ringtones';
import * as rpc from 'rage-rpc';

rpc.on('phone:settings.ringtone.requestData', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Prepare data containing the current ringtone settings and available ringtones.
		const data = {
			current: player.info.phoneRingtoneValue,
			type: player.info.phoneRingtoneType,
			ringtones
		};

		// Trigger a browser event with the prepared data.
		player.triggerBrowserEvent('phone:settings.ringtone.receivedData', data);

		return true;
	} catch (err) {
		await logError(`phone:settings.ringtone.requestData'`, err);
		return false;
	}
});

rpc.register('phone:settings.ringtone.change', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const { id } = JSON.parse(args);

		// Validate if the provided ringtone ID exists in the list of available ringtones.
		if (!ringtones.find((x) => x.id === id)) return false;

		// Update the 'phoneRingtoneValue' field in the database.
		player.saveInfo({
			phoneRingtoneValue: id
		});

		return true;
	} catch (err) {
		await logError(`phone:settings.ringtone.change`, err);
		return false;
	}
});
