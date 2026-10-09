import * as rpc from 'rage-rpc';

import { loggedIn } from '@client/natives/interfaces';
import { getGameSettings } from '@client/natives/settings';

class FPSCalculator {
	private fps = 0;

	constructor() {
		let lastFrameCount = this.getFrameCount();
		setInterval(() => {
			this.fps = this.getFrameCount() - lastFrameCount;
			lastFrameCount = this.getFrameCount();
		}, 1000);
	}

	public get(): number {
		return this.fps;
	}

	private getFrameCount(): number {
		return mp.game.invoke('0xFC8202EFC642E6F2') as number; // '0xFC8202EFC642E6F2' is a method of GTA5 which returns the frame count since the game was started (see http://www.dev-c.com/nativedb/func/info/fc8202efc642e6f2 for ref.)
	}
}

const FPS = new FPSCalculator();

mp.events.add('render', () => {
	if (!loggedIn) return false;

	// Get settings
	const settings = getGameSettings();
	if (!settings) return false;

	if (settings?.showFPS) {
		rpc.triggerBrowsers(`hud:setFPS`, JSON.stringify({ value: FPS.get() }));
	}

	return true;
});
