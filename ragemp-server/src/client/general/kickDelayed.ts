import * as rpc from 'rage-rpc';
import { setControlsDisabled, setCursorVisible } from './cursor';

const player = mp.players.local;
let cam: CameraMp | undefined = undefined;

const coords = { x: -68.9711380005, y: -915.3568725586, z: 323.0156555176 };
const rot = { x: -0.3556745648, y: -0.9145975709, z: -0.1923716664 };

rpc.on('showKickedScenery', async (args) => {
	mp.game.cam.destroyAllCams(true);

	cam = mp.cameras.new('default', new mp.Vector3(coords.x, coords.y, coords.z), new mp.Vector3(rot.x, rot.y, rot.z), 90);
	cam.setActive(true);

	mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

	// Game native interface & other stuff
	mp.game.ui.displayHud(false);
	mp.game.ui.displayRadar(false);
	mp.game.ui.displayAreaName(false);
	mp.game.ui.displayCash(false);
	mp.game.ui.deleteWaypoint();

	player.freezePosition(true);
	player.setInvincible(true);
	player.setVisible(false, false);
	player.setCoords(coords.x, coords.y, coords.z, true, false, false, false);

	setCursorVisible(`kickScreen`, true);
	setControlsDisabled(`kickScreen`, true);

	mp.gui.chat.show(false);
	mp.gui.chat.activate(false);

	mp.game.graphics.setTimecycleModifier('hud_def_blur');
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));
	rpc.triggerBrowsers('toasts:clear'); // Hide toasts.
	rpc.trigger('setBrowserPage', JSON.stringify({ page: `/kick-screen` }));

	await mp.game.waitAsync(400);
	const data = JSON.parse(args);
	rpc.triggerBrowsers('updateKickInformation', JSON.stringify(data));
});
