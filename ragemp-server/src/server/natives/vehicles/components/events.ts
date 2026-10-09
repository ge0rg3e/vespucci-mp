import * as rpc from 'rage-rpc';
import { getVehicleNativeInfo } from './core';
import { logError } from '@server/utils/helpers';
import { playRangedAudio } from '@server/natives/audio';

rpc.register('vehicles:getModelNativeInfo', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { model } = JSON.parse(args);
		const res = getVehicleNativeInfo({ model });
		if (!res) return null;

		return res;
	} catch (err) {
		await logError(`GET_MODEL_NATIVE_INFO_RPC`, err);
		return null;
	}
});

rpc.on('onBeltUpdate', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const { state } = JSON.parse(args);

		const vehicle = player.vehicle;
		if (!vehicle) return false;

		// Play a sound effect
		player.playSoundEffect(`${'__ASSETS__'}/audios/systems/vehicle/belt_${state ? 'on' : 'off'}.mp3`, {
			volume: 0.6,
			spatialSound: {
				source: 'vehicle',
				identifier: vehicle.id,
				maxDistance: 10
			}
		});

		return true;
	} catch (err) {
		await logError(`ON_BELT_UPDATE`, err);
		return false;
	}
});
