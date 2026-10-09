import { logClientsideError } from '@client/general/errors';
import { calculateMicrophoneVolume, getWorldChatVolumeForPlayer, isDistanceTooFar } from '@client/general/worldChat/components/functions';
import { loggedIn } from '@client/natives/interfaces';
import { getGameSettings } from '@client/natives/settings';
import { getPlayerVariable } from '@client/utils/helpers';

/**
 * This task will adjust the volumes in-game of all players that are connected.
 */

export const adjustVoiceVolumes = async () => {
	try {
		// Not logged in?
		if (!loggedIn) return false; // I'm not logged in yet.

		// Get our settings
		const settings = getGameSettings();
		if (!settings) return false;

		// We check for the players in his range (no point for others.
		mp.players.forEach((target) => {
			// We don't need this task for ourselves.
			if (target === player) return false;

			// Get my vvariables
			const localVoiceChat = getPlayerVariable(player.remoteId, 'voiceChat');
			if (!localVoiceChat) return false;

			// Get his variables
			const targetVoiceChat = getPlayerVariable(target.remoteId, 'voiceChat');
			if (!targetVoiceChat) return false;

			// Variables
			const voiceLines = localVoiceChat.lines;
			const targetChannel = targetVoiceChat.channel;
			const playerChannel = localVoiceChat.channel;

			// We are connected via phone.
			const isPhone = voiceLines.find((c: ExpectedAny) => c.id === 'phone' && c.playerId === target.remoteId);
			const isWalkieTalkie = voiceLines.find((c: ExpectedAny) => c.id.includes('walkieTalkie') && c.playerId === target.remoteId);
			const callMuted = getPlayerVariable(target.remoteId, 'callMuted') || false;

			// We are connected to this player via channels.
			const isChannels = targetChannel && playerChannel && targetChannel === playerChannel;

			// He's nearby ?
			const isTooFar = isDistanceTooFar('normal', player.position, target.position);
			const isSpeaking = targetVoiceChat.active === true ? true : false;

			// If is on phone and he has us on mute.
			if (isPhone && callMuted && isTooFar) {
				target.voiceVolume = 0;
				return true;
			}

			// If is channels and is walkie talkie
			if (isChannels && isWalkieTalkie && isTooFar) {
				target.voiceVolume = settings.walkieTalkie.enabled ? settings.walkieTalkie.volume : 0;
				return true;
			}

			// Is connected to us on channel or phone and is not nearby so let's hear him globally.
			if ((isChannels || isPhone) && isTooFar) {
				target.voiceVolume = calculateMicrophoneVolume(1, target.remoteId);
				return true;
			}

			// Is speaking to us or someone else on world chat or on a voice chat non private.
			if (!isTooFar && isSpeaking && settings.voiceChat.enabled) {
				target.voiceVolume = getWorldChatVolumeForPlayer(target.remoteId);
				return true;
			}

			// If none of the above..
			target.voiceVolume = 0;
			return true;
		});

		return true;
	} catch (err) {
		await logClientsideError(`voice:task.adjustVoiceVolume`, err);
		return false;
	}
};
