import * as rpc from 'rage-rpc';

// Internal dependencies
import { getAnimationHoldingDict } from './functions';

// External Dependencies
import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import { logClientsideError } from '@client/general/errors';
import { getPlayerVariable } from '@client/utils/helpers';
import { isAbleToHoldDeviceInHand } from '@client/legacy/phone/components/functions';
import { checkAttachmentExists, createAttachment, removeAttachment } from '@client/natives/playerAttachments/components/functions';
import { phoneRaised } from '@client/legacy/phone/components/legacy';
import { setLocalPlayerUnarmed } from '@client/natives/playerWeapons/components/functions';

// Variables
const player = mp.players.local;
let lastLocalIsHolding: boolean = false; // By default is false.

// Interval sync
let intervalSyncMs = 1000; // How often (ms) it should update the server-side about their holding staet

/**
 * This function will make sure that players around have their walkie animations synced.
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
			let variables = getPlayerVariable(target.remoteId, `walkieTalkie`);
			if (!variables) return false;

			// Variables required
			let isHolding = variables.holding || false;
			let lastHoldingState = target.walkieLastHolding || false; // Last cached on player state.

			// If the player can't hold the phone
			if (canHold === false) {
				isHolding = false;
			}

			// Nothing changed.
			if (isHolding === lastHoldingState) return false;

			// The anim state has been set to false.
			if (isHolding === false && lastHoldingState !== false) {
				// Get last animation playing..
				const lastAnimDict = target.walkieLastAnim;
				if (!lastAnimDict) return;

				// Stop current animation state
				target.stopAnimTask(lastAnimDict.dict, lastAnimDict.name, 3.0);

				// Update his states
				target.walkieLastHolding = false;
				target.walkieLastAnim = null;

				// Remove attachment if exists
				if (checkAttachmentExists(target, 'walkieTalkie')) {
					// Take away the attachment
					removeAttachment(target, 'walkieTalkie');
				}
				return;
			}

			// Get the new animation that should be played.
			const anim = getAnimationHoldingDict(target);

			// Save this new variables on the target in client-side.
			target.walkieLastHolding = isHolding;
			target.walkieLastAnim = anim;

			// Task the ped to play the animation..
			target.taskPlayAnim(anim.dict, anim.name, anim.speed, 1.0, -1, anim.flags, 1, false, false, false);

			// Give the phone attachment
			if (!checkAttachmentExists(target, 'walkieTalkie')) {
				// Give the attachment
				createAttachment(target, 'walkieTalkie', 'client');

				// If is us let's also switch weapon
				if (target === player) {
					// If boolean is now true let's make sure we don't have a weapon in hand
					setLocalPlayerUnarmed();
				}
			}

			return true;
		} catch (err) {
			logClientsideError(`walkieTalkie.syncAnimations`, err);
			return false;
		}
	});
};

/**
 * This function will make sure that the server is aware of the local player's anim states with the phone and send it over.
 * Local player sends it to the server and then the server makes sure the player is synced.
 */

const updateHoldingState = async () => {
	// Not logged in yet.
	if (loggedIn === false) return;

	try {
		// By default current state is null.
		let newState: boolean = false;

		// Dependencies required.
		const variables = getPlayerVariable(player.remoteId, `walkieTalkie`);

		if (!variables) return false; // Error.

		const isRaised = interfacesOpened.find((id: string) => id === 'walkieTalkie') ? true : false;
		const isSpeaking = variables.active === true ? true : false; // Is speaking on walkie

		// If now positive..
		if (isRaised || isSpeaking) {
			newState = true;
		}

		// Walkie is a lower priority versus phone.
		if (phoneRaised) {
			newState = false;
		}

		// Nothing changed.
		if (newState === lastLocalIsHolding) return;

		// Something changed...
		lastLocalIsHolding = newState;
		rpc.triggerServer(`walkieTalkie:updateHoldingAnimationState`, JSON.stringify({ holding: newState }));

		return true;
	} catch (err) {
		logClientsideError(`walkieTalkie.setAnimState`, err);
		return false;
	}
};

// Starting intervals..
setInterval(updateHoldingState, intervalSyncMs);
setInterval(syncAnimations, 500);
