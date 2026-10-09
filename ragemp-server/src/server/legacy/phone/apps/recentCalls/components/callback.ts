import { logError, sliceIntoChunks } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

rpc.on('phone:recentCalls.requestData', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Get the array of recent calls into chunks.
		const chunks = sliceIntoChunks(player.meta.recentCalls, 1000);
		chunks.forEach((chunk: ExpectedAny) => player.triggerSocketEvent('phoneRecentCalls.receivedData', chunk));

		return true;
	} catch (err) {
		await logError(`phone:recentCalls.requestData`, err);
		return false;
	}
});

rpc.on('phone:recentCalls.deleteLog', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const { uuid } = JSON.parse(args);

		// Delete it
		player.deleteRecentCall(uuid);

		return true;
	} catch (err) {
		await logError(`phone:recentCalls.deleteLog`, err);
		return false;
	}
});

rpc.on('phone:recentCalls.deleteAllLogs', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Delete all logs.
		player.updateMeta({ recentCalls: [] });

		return true;
	} catch (err) {
		await logError(`phone:recentCalls.deleteAllLogs`, err);
		return false;
	}
});

rpc.on('phone:recentCalls.deleteLog', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const { uuid } = JSON.parse(args);

		// Delete log from array
		const recentCalls = player.meta.recentCalls.filter((x) => x.uuid !== uuid);

		// Update logs
		player.updateMeta({ recentCalls });

		return true;
	} catch (err) {
		await logError(`phone:recentCalls.deleteLog`, err);
		return false;
	}
});
