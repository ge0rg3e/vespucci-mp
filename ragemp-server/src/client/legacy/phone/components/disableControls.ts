import * as rpc from 'rage-rpc';

// Dependencies
import { loggedIn } from '@client/natives/interfaces';
import { logClientsideError } from '@client/general/errors';

// Variables needed...
let isUsingKeyboard: boolean | null = null;
let intervalTimerId: ExpectedAny = null;
const CHECK_TIMER_MS = 100;

let enabled = false;

export const disableControlWhenUsingKeyboard = (state: boolean) => (enabled = state);

const eventHandler = () => {
	// Not of interest.
	if (!loggedIn) return false;

	// If is not raised we do not care.
	if (!enabled) return false;

	// Disable camera controls looking around..
	mp.game.controls.disableControlAction(1, 1, true); // Disable looking left and right
	mp.game.controls.disableControlAction(1, 2, true); // Disable looking up and down

	// Disable clicking and hitting players
	mp.game.controls.disableControlAction(1, 24, true); //left click
	mp.game.controls.disableControlAction(1, 25, true); // right click

	// Disable mouse weapon wheel (when they scroll down through messages on iphone for example)
	mp.game.controls.disableControlAction(1, 16, true); // scroll up
	mp.game.controls.disableControlAction(1, 17, true); // scroll down

	// Disable mouse weapon wheel in vehicle
	mp.game.controls.disableControlAction(0, 99, true);
	mp.game.controls.disableControlAction(0, 100, true);

	// Jump keys
	mp.game.controls.disableControlAction(1, 22, true); // JUMP Key

	//  Disable everything if they're writing
	if (isUsingKeyboard) {
		mp.game.controls.disableAllControlActions(0); // MOVE
		mp.game.controls.disableAllControlActions(1); // LOOK
		mp.game.controls.disableAllControlActions(2); // WHEEL
	}

	// Disable weapon selector on scroll
	mp.game.controls.disableControlAction(1, 16, true);
	mp.game.controls.disableControlAction(1, 17, true);

	return true;
};

const regularCheck = async () => {
	try {
		if (!loggedIn || !enabled) return;

		const res = await rpc.callBrowsers('isWritingIntoInput');

		// Save result..
		isUsingKeyboard = res;
	} catch (err) {
		await logClientsideError(`phone.disableControls.regularCheck`, err);

		// If this gets an error from that nasty callBrowsers and we run it at 100ms we'll spam the fuck out of the player

		if (intervalTimerId !== null) {
			// Clear interval
			clearInterval(intervalTimerId); // stop the current timer

			// Reset timer id
			intervalTimerId = null;
		}

		setTimeout(() => {
			intervalTimerId = setInterval(regularCheck, CHECK_TIMER_MS);
		}, 30000);
	}
};

// Set the mp events
mp.events.add('render', eventHandler);

// Set the interval up..
intervalTimerId = setInterval(regularCheck, CHECK_TIMER_MS);
