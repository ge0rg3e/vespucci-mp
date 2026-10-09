import * as rpc from 'rage-rpc';
import { getPlayerVariable } from '@client/utils/helpers';
import { logClientsideError } from '@client/general/errors';

// Dependencies
import { isButtonUsedByDialog } from '@client/general/dialogs';
import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import { setWalkieIsRaised } from './functions';

let antiSpamKey = false; // To be moved with the others anIntercaeKeyDown. Bug right now: when i pressed n at entrance of house, i couldn't release it cause it had a cooldown from another system too.
let antiSpamControl = false;
let player = mp.players.local;

const isInterfacePreventing = async () => {
	try {
		if (interfacesOpened.filter((c: string) => c !== 'walkieTalkie').length > 0) return true;

		// If is writing into any inpouts from the profile (aka the filter input..)
		const isWriting = await rpc.callBrowsers('isWritingIntoInput');
		if (isWriting) return true;

		// If is used by dialog
		if (isButtonUsedByDialog('B')) return true;

		return false;
	} catch (err) {
		logClientsideError(`walkieTalkie:isInterfacePreventing`, err);
		return false;
	}
};

export const onCommunicationKeyPressed = async () => {
	// General checks
	if (!loggedIn || antiSpamKey) return false;

	// Is prevented by user of interfaces..
	const interfacePrevented = await isInterfacePreventing();
	if (interfacePrevented) return false;

	// Get current variables
	const walkieTalkie = getPlayerVariable(player.remoteId, `walkieTalkie`);
	if (!walkieTalkie) return false;

	// Get current variables
	const voiceChat = getPlayerVariable(player.remoteId, `voiceChat`);
	if (!voiceChat) return false;

	// Is currently speakign on world chat or phone.
	if (voiceChat.active === true) return false; // Already speaks.

	// Safety checks..
	if (walkieTalkie.usable === false) return false; // Not owning one.
	if (walkieTalkie.frequency === null) return false; // Not a valid frequency to speak on.
	if (walkieTalkie.enabled === false) return false; // Not turned on.

	// Trigger server to start speaking
	rpc.triggerServer(`walkieTalkie:startSpeaking`);

	// Anti SPAM..
	antiSpamKey = true;
	setTimeout(() => (antiSpamKey = false), 300);

	return true;
};

export const onCommunicationKeyReleased = () => {
	// General checks
	if (!loggedIn) return false;

	// Get current variables
	const walkieTalkie = getPlayerVariable(player.remoteId, `walkieTalkie`);
	if (!walkieTalkie) return false;

	// It means he hasn't been allowed to speak therefore he didn't speak. Therefore no point in trigger the "finished speaking" event.
	if (walkieTalkie.active === false) return false;

	// Trigger server to stop speaking
	rpc.triggerServer(`walkieTalkie:stopSpeaking`);

	return true;
};

export const onControlKeyPressed = async () => {
	// General checks
	if (!loggedIn || antiSpamControl) return false;

	// Check current state
	const isCurrentlyOpened = interfacesOpened.find((c: string) => c === 'walkieTalkie') ? true : false;

	// Get current variables
	const walkieTalkie = getPlayerVariable(player.remoteId, `walkieTalkie`);
	if (!walkieTalkie) return false;

	if (!walkieTalkie.usable) return false; // Not owning a walkie.

	// Is prevented by user of interfaces..
	const interfacePrevented = await isInterfacePreventing();
	if (!isCurrentlyOpened && interfacePrevented) return false;

	// Set new state
	setWalkieIsRaised(isCurrentlyOpened === false ? true : false);

	// Anti SPAM..
	antiSpamControl = true;
	setTimeout(() => (antiSpamControl = false), 1000);

	return true;
};

export const onEscapeKeyPressed = async () => {
	// General checks
	if (!loggedIn || antiSpamControl) return false;

	// Check current state
	const isCurrentlyOpened = interfacesOpened.find((c: string) => c === 'walkieTalkie') ? true : false;
	if (!isCurrentlyOpened) return false;

	// Set new state
	setWalkieIsRaised(false);

	// Anti SPAM..
	antiSpamControl = true;
	setTimeout(() => (antiSpamControl = false), 1000);

	return true;
};
