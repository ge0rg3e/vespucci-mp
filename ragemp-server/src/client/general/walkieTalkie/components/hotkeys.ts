import { onCommunicationKeyPressed, onCommunicationKeyReleased, onControlKeyPressed, onEscapeKeyPressed } from './hotkeys.functions';

// Variables
let keysPressed = { ctrl: false, b: false };

// Definitions
const B_KEY = 0x42; // Reminder: In onComPressed functon there is a dialog check with KEY string.
const LEFT_CTRL_KEY = 0xa2;
const ESC_KEY = 0x1b;

// When they press B to speak.
mp.keys.bind(B_KEY, true, () => {
	// It means they were about to press CTRL to open the interface.
	if (keysPressed['ctrl']) return false;

	// Start speaking
	onCommunicationKeyPressed();
	return true;
});

// Stop speaking (We check without CTRL here. is fine.)
mp.keys.bind(B_KEY, false, () => onCommunicationKeyReleased());
mp.keys.bind(ESC_KEY, true, () => onEscapeKeyPressed());

// Detect when they press the keys so we can do a combo of CTRL + B
mp.keys.bind(LEFT_CTRL_KEY, true, () => (keysPressed['ctrl'] = true));
mp.keys.bind(LEFT_CTRL_KEY, false, () => (keysPressed['ctrl'] = false));
mp.keys.bind(B_KEY, false, () => (keysPressed['b'] = false));

mp.keys.bind(B_KEY, true, () => {
	keysPressed['b'] = true;

	// They pressed now CTRL + B.
	if (keysPressed['ctrl'] === true) return onControlKeyPressed();

	return true;
});
