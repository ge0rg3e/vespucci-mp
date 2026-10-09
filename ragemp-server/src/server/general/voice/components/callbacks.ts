import { logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

/**
 * This event is called when the player presses and holds down N and wants to speak.
 * It's the moment when we will connect him to all the player nearby him or from his channel.
 */

rpc.on('voiceChat:startSpeaking', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		// If the player is muted we don't allow him to speak.
		if (player.info.muteMinutes > 0) return;

		// Mark that the player is speaking right now..
		player.updateVoiceSettings({ active: true });

		// Invoke this event which is informing  us that this player started speaking
		// So we can do code in different places which is about connecting the player to the correct targets.
		mp.events.call(`voiceChat:startedSpeaking`, player);

		return true;
	} catch (err) {
		await logError(`voiceChat:startSpeaking`, err);
		return false;
	}
});

/**
 * This event is called when the player stops holding N and wants to stop speaking.
 * It's the moment when we will disconnect him from the players that listened to him.
 */

rpc.on('voiceChat:stopSpeaking', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		// Mark that the player is not speaking anymore..
		player.updateVoiceSettings({ active: false });

		// Invoke this event which is informing  us that this player stopped speaking
		mp.events.call(`voiceChat:stoppedSpeaking`, player);
		return true;
	} catch (err) {
		await logError(`voiceChat:stopSpeaking`, err);
		return false;
	}
});
