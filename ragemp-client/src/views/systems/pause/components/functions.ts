import { logError } from '@/utils/helpers';

/**
 * A simple function to get the game settings from the client.
 * @returns The settings or null.
 */

export const getGameSettings = async () => {
	try {
		// Get the settings from the client
		const response = await window.rpc.callClient(`settings:getGameSettings`);
		if (response === null) throw new Error(`Failed to get settings from the game.`);

		return response;
	} catch (err) {
		await logError(`getGameSettings`, err);
		return null;
	}
};
