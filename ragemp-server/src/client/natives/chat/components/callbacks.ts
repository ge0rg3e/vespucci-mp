import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';
import { setInterfaceIsOpened } from '@client/natives/interfaces';
import * as rpc from 'rage-rpc';

// Variables
export let disableChatAffectiveKeys = false;
export let disableMovement = false;

// Timers
let keysTimerId: ExpectedAny = null;
let movementTimerId: ExpectedAny = null;

rpc.on('chatbox:open', () => {
	// Clear timeouts if there are any..
	if (keysTimerId !== null) {
		// Clear timeout
		clearTimeout(keysTimerId);

		// Reset variable timer id
		keysTimerId = null;
	}

	if (movementTimerId !== null) {
		// Clear timeout
		clearTimeout(movementTimerId);

		// Reset variable timer id
		movementTimerId = null;
	}

	// Disable chat affected keys and movement
	disableChatAffectiveKeys = true;
	disableMovement = true;

	// Show cursor..
	setCursorVisible(`chat`, true);
	setControlsDisabled(`chat`, true);

	// Show chatbox input..
	rpc.triggerBrowsers(`chatbox:showInput`, JSON.stringify({ boolean: true }));

	// Mark interface opened
	setInterfaceIsOpened('chat', true);
});

rpc.on('chatbox:close', async () => {
	// Set out timers
	keysTimerId = setTimeout(() => {
		// Set variable
		disableChatAffectiveKeys = false;

		// Reset timer id
		keysTimerId = null;

		// Mark interface closed
		setInterfaceIsOpened('chat', false);
	}, 800);

	movementTimerId = setTimeout(() => {
		// Set variable
		disableMovement = false;

		// Reset timer id
		movementTimerId = null;
	}, 300);

	// Show cursor..
	setControlsDisabled(`chat`, false);
	setCursorVisible(`chat`, false);

	// Show chatbox input..
	rpc.triggerBrowsers(`chatbox:showInput`, JSON.stringify({ boolean: false }));
});

rpc.on('interfaces:forceClose', () => rpc.trigger('chatbox:close'));
