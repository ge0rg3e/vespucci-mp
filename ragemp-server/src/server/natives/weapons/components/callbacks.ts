import { logError } from '@server/utils/helpers';
import { getNativeWeapon } from './core';
import * as rpc from 'rage-rpc';

rpc.register('weapons@getModelNativeInfo', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id } = JSON.parse(args);
		const res = getNativeWeapon({ id });
		if (!res) return null;

		return res;
	} catch (err) {
		await logError(`weapons@getModelNativeInfo`, err);
		return null;
	}
});
