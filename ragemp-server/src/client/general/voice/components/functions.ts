import * as rpc from 'rage-rpc';

import { isButtonUsedByDialog } from '@client/general/dialogs';
import { isFullScreenInterfaceOpened, loggedIn } from '@client/natives/interfaces';
import { getPlayerVariable } from '@client/utils/helpers';
import { logClientsideError } from '@client/general/errors';

// Variables
const player = mp.players.local;
let antiSpamKey = false; // To be moved with the others anIntercaeKeyDown. Bug right now: when i pressed n at entrance of house, i couldn't release it cause it had a cooldown from another system too.

const isInterfacePreventing = async () => {
	try {
		const interfaceOpened = isFullScreenInterfaceOpened(['chat', 'phone', 'dialog']);
		if (interfaceOpened) return true;

		// If is writing into any inpouts from the profile (aka the filter input..)
		const isWriting = await rpc.callBrowsers('isWritingIntoInput');
		if (isWriting) return true;

		// If is used by dialog
		if (isButtonUsedByDialog('V')) return true;

		return false;
	} catch (err) {
		logClientsideError(`isInterfacePreventingVoiceKey`, err);
		return false;
	}
};

export const onVoiceKeyPressedDown = async () => {
	// General checks
	if (!loggedIn || antiSpamKey) return false;

	// Is prevented by user of interfaces..
	const interfacePrevented = await isInterfacePreventing();

	if (interfacePrevented) return false;

	// Get current variables
	const walkieTalkie = getPlayerVariable(player.remoteId, `walkieTalkie`);
	if (!walkieTalkie) return false;

	// Already speaks on walkie talkie
	if (walkieTalkie.active === true) return false;

	// Trigger server to start speaking
	rpc.triggerServer(`voiceChat:startSpeaking`);

	antiSpamKey = true;

	setTimeout(() => (antiSpamKey = false), 300);

	return true;
};

export const onVoiceKeyReleased = () => {
	// General checks
	if (!loggedIn) return false;

	// Get current variables
	const voiceChat = getPlayerVariable(player.remoteId, `voiceChat`);
	if (!voiceChat) return false;

	// It means he hasn't been allowed to speak therefore he didn't speak. Therefore no point in trigger the "finished speaking" event.
	if (voiceChat.active === false) return false;

	// Trigger server to stop speaking
	rpc.triggerServer(`voiceChat:stopSpeaking`);

	return true;
};
