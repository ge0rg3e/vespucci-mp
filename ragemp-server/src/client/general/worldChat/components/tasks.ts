import { addSpeakerOnWorldChat, isConnectedOnWorldChat, isDistanceTooFar, playersInSameCar, removeSpeakerFromWorldChat } from './functions';
import { getPlayerVariable } from '@client/utils/helpers';
import { logClientsideError } from '@client/general/errors';
import { getGameSettings } from '@client/natives/settings';

// Variables
const player = mp.players.local;

/**
 * This task will check what other players have voice chat enabled
 * And then we will check their distance from us. And if they're OK, we will connect them to us.
 * So we will be able to hear them. And in reverse, they will do the same check and operation on their computer.
 */

export const worldChat = async () => {
	try {
		const settings = getGameSettings();
		if (!settings) return;

		// Connect and disconnect nearby players.
		mp.players.forEach((target) => {
			// We can't speak to ourselves. We're not crazy!
			if (target === player) return false;

			// Get our player variables and his.
			const localVoiceChat = getPlayerVariable(player.remoteId, `voiceChat`);
			const targetVoiceChat = getPlayerVariable(target.remoteId, `voiceChat`);

			// Missing variables (also not logged in)
			if (!localVoiceChat || !targetVoiceChat) return false;

			// Variables required
			const farAway = isDistanceTooFar(targetVoiceChat.range, player.position, target.position);
			let compatible = true; // By default we'll say yes.

			// They don't speak on their microphone.
			if (targetVoiceChat.active === false) {
				compatible = false;
			}

			// Not in the same dimension.
			if (target.dimension !== player.dimension) {
				compatible = false;
			}

			// The distance between us and that player is too far.
			if (targetVoiceChat.range !== 'car' && farAway === true) {
				compatible = false;
			}

			// The speaker voice range is "car only" and we're not in his car
			if (targetVoiceChat.range === 'car' && !playersInSameCar(player, target)) {
				compatible = false;
			}

			// If we disabled voice chat.
			if (settings.voiceChat.enabled === false) {
				compatible = false;
			}

			// If we're not compatible then we'll disconnect us from them.
			if (compatible === false && isConnectedOnWorldChat(target.remoteId)) {
				// Ask the server to disconnect.
				removeSpeakerFromWorldChat(target.remoteId);
				return false;
			}

			// He passed all checks and he's valid and we should hear him.
			if (!isConnectedOnWorldChat(target.remoteId)) {
				addSpeakerOnWorldChat(target.remoteId);
			}

			return true;
		});
	} catch (err) {
		await logClientsideError(`worldChat:Connections`, err);
	}
};
