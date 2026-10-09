import * as rpc from 'rage-rpc';

// Dependencies
import { logClientsideError } from '@client/general/errors';
import { setInterfaceInCooldown, setInterfaceIsOpened } from '@client/natives/interfaces';
import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';

// Is important to know when pause menu "is meant" to be visible.
// So we can close it IF they find a way to close the pause menu by bug abuse.

export let pauseMenuVisible = false;

export const showInterface = async () => {
	try {
		// Show cursor
		setCursorVisible(`pause`, true);
		setControlsDisabled(`pause`, true);
		setInterfaceIsOpened('pause', true);
		setInterfaceInCooldown('pause', 800);

		// Hide hud
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));

		// Hide GTA HUD
		mp.game.ui.displayHud(false);
		mp.game.ui.displayRadar(false);

		// Prepare fade in for pause menu
		mp.game.graphics.startScreenEffect(`SwitchHUDIn`, 500, false);
		await mp.game.waitAsync(300);

		// Show pause menu
		rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/pause` }));
	} catch (err) {
		await logClientsideError(`escapeMenu.showInterface`, err);
	}
};

export const hideInterface = async () => {
	try {
		// Set these
		setCursorVisible(`pause`, false);
		setControlsDisabled(`pause`, false);
		setInterfaceIsOpened('pause', false);

		if (pauseMenuVisible) {
			pauseMenuVisible = false;
		}

		// Close page
		rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/` }));

		// Cooldown to avoid spamming the escape menu
		setInterfaceInCooldown('pause', 800);

		mp.game.graphics.stopScreenEffect(`SwitchHUDIn`);
		mp.game.graphics.startScreenEffect(`SwitchHUDOut`, 400, false);
		await mp.game.waitAsync(300);

		// Hide hud
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));

		// Hide GTA HUD
		mp.game.ui.displayHud(true);
		mp.game.ui.displayRadar(true);
	} catch (err) {
		await logClientsideError(`escapeMenu.showInterface`, err);
	}
};

/**
 *
 * @param pageId Can be -1 which means map or 6 which is settinsg.
 * More pageid here: https://pastebin.com/qxuhwjPT (1000 minus. aka if is says 1006, use pageId 6)
 */

export const showPauseMenu = async (pageId: -1 | 6) => {
	mp.game.ui.activateFrontendMenu(mp.game.joaat('FE_MENU_VERSION_SP_PAUSE'), true, pageId);

	pauseMenuVisible = true;
};

/**
 * This tells you if game's native pause menu is active or not.
 * @returns Boolean
 */

export const isGamePauseMenuActive = () => mp.game.ui.isPauseMenuActive();

/**
 * This crashes the game with no error on purpose for a clean exit.
 * @Reminder: It crashes because in order to use trains you need to preload their model. 666 shouldn't be matching with anything.
 */

export const quitGame = () => {
	// Create the wrong train
	let train = mp.game.vehicle.createMissionTrain(666, 247.9364, -1198.597, 37.4482, true);

	// If one dark day they fix the bug and make our function stop working..
	setTimeout(() => {
		// Delete it
		mp.game.vehicle.deleteMissionTrain(train);

		// Log error in server
		logClientsideError(`pause:quit`, new Error('Quit game no longer works through crashing because of trains'));
	}, 5000);
};
