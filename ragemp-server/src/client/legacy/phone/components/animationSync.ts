import * as rpc from 'rage-rpc';

// External Dependencies
import { loggedIn } from '@client/natives/interfaces';
import { logClientsideError } from '@client/general/errors';
import { getPlayerVariable } from '@client/utils/helpers';

// Internal Dependencies
import { phoneRaised } from './legacy';
import { phoneAnimState } from './types';
import { getAnimationStateDict, isAbleToHoldDeviceInHand, isSpeakingOnPhone, isWritingOnPhone } from './functions';
import { checkAttachmentExists, createAttachment, removeAttachment } from '@client/natives/playerAttachments/components/functions';
import { setLocalPlayerUnarmed } from '@client/natives/playerWeapons/components/functions';

// Variables
let lastCurrentState: phoneAnimState = null; // By default is null.
const player = mp.players.local;

// Interval sync
let intervalTimerId: ExpectedAny = null;
let intervalSyncMs = 1000;

/**
 * This function will make sure that players around have their phone animations synced.
 * @Reminder: We use an interval and not a addDataHandler because we want to check when they stop doing the anim and re-apply it.
 */

const syncAnimations = () => {
	// Not logged in yet.
	if (loggedIn === false) return;

	mp.players.forEach((target) => {
		try {
			// This player is not in our streaming range.
			if (target.handle === 0) return;

			// Is that player logged in
			const isLoggedIn = getPlayerVariable(target.remoteId, 'loggedIn');
			if (!isLoggedIn) return false;

			// Check if he's able to hold phone in hnd
			const canHold = isAbleToHoldDeviceInHand(target);

			// Get his states from the server
			let animState = getPlayerVariable(target.remoteId, `phoneAnimState`) || null; // @Bugfix: IF the interval gets called to soon we may risk  getting undefined here.
			let lastAnimState = target.phoneAnimState || null; // Last cached on player state.

			// If the player can't hold the phone
			if (canHold === false) {
				animState = null;
			}

			// Nothing changed.
			if (animState === lastAnimState) return false;

			// The anim state has been set to null.
			if (animState === null && lastAnimState !== null) {
				// Get last animation playing..
				const lastAnimDict = target.phoneLastAnim;
				if (!lastAnimDict) return;

				// Stop current animation state
				target.stopAnimTask(lastAnimDict.dict, lastAnimDict.name, 3.0);

				// Update his sync animation state.
				target.phoneAnimState = null;
				target.phoneLastAnim = null;

				// Remove attachment if exists
				if (checkAttachmentExists(target, 'phone')) {
					// Take away the attachment
					removeAttachment(target, 'phone');
				}

				return;
			}

			// Requirements..
			const anim = getAnimationStateDict(animState, target); // Get the new animation that should be played.
			const isPlayingAnim = target.isPlayingAnim(anim.dict, anim.name, 3); // Check if ped is doing the right animation.

			// Save current anim var as last state for next iteration.
			target.phoneAnimState = animState;
			target.phoneLastAnim = anim;

			// Is the player doing the animation designed for his current state
			if (!isPlayingAnim) {
				// Task the ped to play the animation..
				target.taskPlayAnim(anim.dict, anim.name, anim.speed, 1.0, -1, anim.flags, 1, false, false, false);
			}

			// Give the phone attachment
			if (!checkAttachmentExists(target, 'phone')) {
				// Give the attachment
				createAttachment(target, 'phone', 'client');

				// If is us let's also switch weapon
				if (target === player) {
					// If boolean is now true let's make sure we don't have a weapon in hand
					setLocalPlayerUnarmed();
				}
			}

			return true;
		} catch (err) {
			logClientsideError(`phone.syncAnimations`, err);
			return false;
		}
	});
};

/**
 * This function will make sure that the server is aware of the local player's anim states with the phone and send it over.
 * Local player sends it to the server and then the server makes sure the player is synced.
 */

const setAnimStates = async () => {
	// Not logged in yet.
	if (loggedIn === false) return;

	try {
		// By default current state is null.
		let newState: phoneAnimState = null;

		// Dependencies required.
		const isHoldingPhone = phoneRaised; // Check if is holding phone.
		const isWriting = phoneRaised ? await isWritingOnPhone() : false;
		const isSpeaking = phoneRaised ? await isSpeakingOnPhone() : false;

		if (isHoldingPhone) {
			newState = 'holding';
		}

		if (isWriting) {
			newState = 'writing';
		}

		if (isSpeaking) {
			newState = 'speaking';
		}

		// Nothing changed.
		if (newState === lastCurrentState) return;

		// Something changed...
		lastCurrentState = newState;
		rpc.triggerServer(`phone:setAnimState`, JSON.stringify({ value: newState }));
	} catch (err) {
		logClientsideError(`phone.checkMyAnimStates`, err);

		// Clear timeout
		if (intervalTimerId !== null) {
			// Temporary stop this to not spam the player too much if the CEF failed to find procedure.
			clearInterval(intervalTimerId);

			// Reset variable
			intervalTimerId = null;
		}

		// Start again in 5 seconds.
		setTimeout(() => {
			intervalTimerId = setInterval(setAnimStates, intervalSyncMs);
		}, 5000);
	}
};

// Starting intervals..
intervalTimerId = setInterval(setAnimStates, intervalSyncMs);
setInterval(syncAnimations, 500);
