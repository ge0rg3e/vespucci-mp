export let cursorActive: Array<string> = []; // An array that tells us that the cursor is active for the following systems.
export let controlsDisbled: Array<string> = []; // Same as above.

/**
 * This will set the cursor visible for a specific system.
 * @param systemId
 * @param state
 */

export let setCursorVisible = (systemId: string, state: boolean) => {
	// Check if already exists
	const alreadyEnabled = cursorActive.find((c) => c === systemId);

	// We add it if is never added
	if (state === true && !alreadyEnabled) {
		cursorActive.push(systemId);
	}

	// We remove it if is added
	if (state === false && alreadyEnabled) {
		// Remove
		cursorActive = cursorActive.filter((c) => c !== systemId);
	}
};

/**
 * This will set the controls disabled for a specific system.
 * @param systemId
 * @param state
 */

export let setControlsDisabled = (systemId: string, state: boolean) => {
	// Check if already exists
	const alreadyEnabled = controlsDisbled.find((c) => c === systemId);

	// We add it if is never added
	if (state === true && !alreadyEnabled) {
		controlsDisbled.push(systemId);
	}

	// We remove it if is added
	if (state === false && alreadyEnabled) {
		// Remove
		controlsDisbled = controlsDisbled.filter((c) => c !== systemId);
	}
};

mp.events.add('render', () => {
	if (controlsDisbled.length > 0) {
		mp.game.controls.disableAllControlActions(0); // MOVE
		mp.game.controls.disableAllControlActions(1); // LOOK
		mp.game.controls.disableAllControlActions(2); // WHEEL
	}

	// If cursor is active but not visible yet
	if (cursorActive.length > 0 && !mp.gui.cursor.visible) {
		mp.gui.cursor.show(false, true); // We don't diasble controls through cursor.show, we use mp game controls, is safer.
	}

	// If cursor is not active but visible still.
	if (cursorActive.length < 1 && mp.gui.cursor.visible) {
		mp.gui.cursor.show(false, false);
	}
});
