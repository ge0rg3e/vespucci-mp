import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';
import { setInterfaceIsOpened } from '@client/natives/interfaces';
import * as rpc from 'rage-rpc';

rpc.on('shop:show', async () => {
	// Mark it as an interface..
	setInterfaceIsOpened('generalStore', true);

	// Hide the game hud and most native stuff.
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));

	// Radar
	mp.game.ui.displayHud(false);
	mp.game.ui.displayRadar(false);

	// Show cursor
	setCursorVisible(`business:generalStore`, true);
	setControlsDisabled(`business:generalStore`, true);

	// Show the interface..
	rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/businesses/shop` }));

	// Blur
	mp.game.graphics.setTimecycleModifier('hud_def_blur');
});

rpc.on('shop:hide', async () => {
	// Mark it as an interface..
	setInterfaceIsOpened('generalStore', false);

	// Hide the game hud and most native stuff.
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));

	// Radar..
	mp.game.ui.displayHud(true);
	mp.game.ui.displayRadar(true);

	// Show cursor
	setCursorVisible(`business:generalStore`, false);
	setControlsDisabled(`business:generalStore`, false);

	// Show the interface..
	rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/` }));

	// Hide toast
	rpc.triggerBrowsers('toasts:clear'); // Hide toasts.

	// Re-setting timecycle..
	mp.game.graphics.setTimecycleModifier('default');
});
