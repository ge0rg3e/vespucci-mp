import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';
import * as rpc from 'rage-rpc';
const player = mp.players.local;

rpc.register(`welcome:start`, () => {
	// Destroy all cameras (just in case)
	mp.game.cam.destroyAllCams(true);

	// GTA 5 Natives that must be hidden or deleted.
	mp.game.ui.displayHud(false);
	mp.game.ui.displayRadar(false);
	mp.game.ui.displayAreaName(false);
	mp.game.ui.displayCash(false);
	mp.game.ui.deleteWaypoint();
	mp.gui.chat.show(false);
	mp.gui.chat.activate(false);

	// For the player..
	player.setInvincible(true);
	player.setVisible(false, false);
	player.freezePosition(true);

	// Hide the "joining server" player notify from server
	mp.game.invoke('0xA8FDB297A8D25FBA');

	// Re-setting timecycle..
	mp.game.graphics.setTimecycleModifier('default');

	// Hide the map "north" blip
	const handle = mp.game.hud.getNorthRadarBlip();
	mp.game.hud.setBlipAlpha(handle, 0);

	// Make sure to mark the game hud as hidden..
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));

	// We now show the mouse so they can click continue etc.
	setCursorVisible(`authentication`, true);
	setControlsDisabled(`authentication`, true);

	// Start the welcome page..
	rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/welcome` }));
});
