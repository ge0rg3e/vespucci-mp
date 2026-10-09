import * as rpc from 'rage-rpc';
import { interfacesOpened, loggedIn, setInterfaceIsOpened } from '@client/natives/interfaces';

// KEYS

const F7_KEY = 0x76; // F7

export let interfaceHidden = false;

export const hideInterfaces = (boolean: boolean) => {
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean }));
	rpc.triggerBrowsers(`takingScreenshotIngame`, JSON.stringify({ boolean }));
	mp.game.ui.displayRadar(!boolean);
	interfaceHidden = boolean;
	setInterfaceIsOpened('hideHud', boolean);
};

mp.keys.bind(F7_KEY, true, () => {
	if (loggedIn === false) return true;
	if (interfaceHidden === false && interfacesOpened.length < 1) {
		hideInterfaces(true);
	} else if (interfaceHidden === true) {
		hideInterfaces(false);
	}
	return true;
});

rpc.on('toggleGameInterfaces', (args) => {
	const { boolean } = JSON.parse(args);
	hideInterfaces(boolean);
});
