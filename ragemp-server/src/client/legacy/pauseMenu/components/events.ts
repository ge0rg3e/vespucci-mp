import { interfacesOpened, isInterfaceInCooldown, isInterfaceOpen, loggedIn } from '@client/natives/interfaces';
import { hideInterface, isGamePauseMenuActive, pauseMenuVisible, showInterface } from './functions';
import { isEscapeKeyDisabled } from '@client/general/disableEscape';

const ESC_KEY = 0x1b; // ESC

mp.keys.bind(ESC_KEY, true, () => {
	if (!loggedIn) return;

	// Someone just pressed Escape.
	if (isInterfaceInCooldown('pause')) return false;

	// Check if is opened
	const isOpened = isInterfaceOpen('pause');

	// If we're open we close it on ESC.
	if (isOpened) return hideInterface();

	// We don't want to respond to GTA's Pause Menu - Settings Escapes (while we browse there we need Escape)
	if (isGamePauseMenuActive()) return false;

	// If no other interface (big) is opened we open the escape menu.
	if (interfacesOpened.length < 1 && !isEscapeKeyDisabled()) return showInterface();

	return true;
});

mp.events.add('render', () => {
	// @Bugfix: When they open the game map, but then press "Right click" (twice to close the pause menu.
	if (pauseMenuVisible && !isGamePauseMenuActive()) {
		hideInterface();
	}
});
