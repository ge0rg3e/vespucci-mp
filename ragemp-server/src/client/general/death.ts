import { setInterfaceIsOpened } from '@client/natives/interfaces';
import * as rpc from 'rage-rpc';

rpc.on(`showDeathEffect`, async () => {
	mp.game.audio.playSoundFrontend(-1, 'Bed', 'WastedSounds', true);
	mp.game.graphics.startScreenEffect('DeathFailNeutralIn', 0, false);
	mp.game.cam.setCamEffect(1);
	rpc.trigger(`interfaces:forceClose`);
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));
	rpc.triggerBrowsers('toasts:clear'); // Hide toasts.
	mp.game.ui.displayRadar(false);
	setInterfaceIsOpened('deathScreen', true);

	await mp.game.waitAsync(3100);
	mp.game.graphics.stopScreenEffect(`DeathFailNeutralIn`);
	mp.game.cam.setCamEffect(0);
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));
	mp.game.ui.displayRadar(true);
	setInterfaceIsOpened('deathScreen', false);
	rpc.trigger(`interfaces:forceClose`);
});
