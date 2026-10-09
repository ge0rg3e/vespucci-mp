import * as rpc from 'rage-rpc';
import { hideInterface, quitGame, showPauseMenu } from './functions';
import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';
import { getGameSettings } from '@client/natives/settings';

rpc.on(`pause:showPauseMenu`, async (args) => {
	const { pageId } = JSON.parse(args);

	// Hide cursor and disable the disable controls so they can use the meun (and the cursor is already shown by gta itself)
	setCursorVisible(`pause`, false);
	setControlsDisabled(`pause`, false);

	// Show it..
	showPauseMenu(pageId);
});

rpc.on(`pause:resumeGame`, () => {
	hideInterface();
});

rpc.on(`pause:quit`, () => quitGame());

rpc.register(`settings:getGameSettings`, async () => getGameSettings());

// Cu asta inchidem frontend menu

// // Set frontend active false
// mp.game.invoke('0x745711A75AB09277', false);
