import { getBlockedNumbersByCreator, registerBlockedNumber, removeBlockedNumber } from './functions';
import { logError, sliceIntoChunks } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

rpc.register('phone:contacts.blockNumber', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.

	try {
		// Extract variables
		const { phoneNumber } = JSON.parse(args);

		// If the phone number is yours
		if (phoneNumber === player.info.phoneNumber) return 'YOUR_NUMBER';

		await registerBlockedNumber(player.info.id, phoneNumber);

		return true;
	} catch (err) {
		// Log and handle errors
		await logError('phone:contacts.blockNumber', err);
		return false;
	}
});

rpc.register('phone:contacts.unblockNumber', async (args, { player }: rpc.ProcedureInfo) => {
	// Check if player exists
	if (!player) return false; // Avoiding TS Error.

	try {
		// Extract variables
		const { phoneNumber } = JSON.parse(args);

		await removeBlockedNumber(phoneNumber);

		return true;
	} catch (err) {
		// Log and handle errors
		await logError(`phone:contacts.unblockNumber`, err);
		return false;
	}
});

rpc.on('phone:getBlockedNumbers', async (_, { player }: rpc.ProcedureInfo) => {
	// Check if player exists
	if (!player) return false; // Avoiding TS Error.

	try {
		// Get the array of contacts into chunks.
		const chunks = sliceIntoChunks(getBlockedNumbersByCreator(player.info.id), 1000);
		chunks.forEach((chunk: ExpectedAny) => player.triggerSocketEvent('phone:blockedNumbers.receivedData', chunk));

		return true;
	} catch (err) {
		// Log and handle errors
		await logError(`phone:getBlockedNumbers`, err);
		return false;
	}
});
