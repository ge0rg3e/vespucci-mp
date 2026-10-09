import { logClientsideError } from '@client/general/errors';
import { onVoiceKeyPressedDown, onVoiceKeyReleased } from './functions';

// Variables
const player = mp.players.local;
const N_KEY = 0x4e;

// When they press N
mp.keys.bind(N_KEY, true, onVoiceKeyPressedDown); // Start speaking
mp.keys.bind(N_KEY, false, onVoiceKeyReleased); // Stopped speaking

mp.events.addDataHandler('@voiceSettings', function (entity: PlayerMp, newValue, oldValue) {
	try {
		if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return false; // Data has not changed but it has been triggered by shitty RAGEMP Triggers.

		// We need to check only for our own player.
		if (entity !== player) return false;

		// Variables..
		const isSpeaking = newValue.active === true ? true : false;
		const wasSpeaking = oldValue && oldValue.active === true ? true : false;

		// If is us and we started speaking we need to update this variable
		if (entity === player) {
			// @Mandatory: This is needed for the voice chat to work.
			mp.voiceChat.muted = isSpeaking ? false : true;
		}

		// Started speaking on voice
		if (!wasSpeaking && isSpeaking) {
			entity.playFacialAnim('mic_chatter', 'mp_facial');
		}

		// Is no longer speaking but was speaking..
		if (!isSpeaking && wasSpeaking) {
			entity.playFacialAnim('mood_normal_1', 'facials@gen_male@variations@normal');
		}

		return true;
	} catch (err) {
		logClientsideError(`@voiceSettings - Data handler for Speaking`, err);
		return false;
	}
});
