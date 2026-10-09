import * as rpc from 'rage-rpc';

import { interfacesOpened, isPlayerStandingStill, loggedIn, setInterfaceIsOpened, isFullScreenInterfaceOpened, setInterfaceInCooldown, isInterfaceInCooldown } from '@client/natives/interfaces';
import { isButtonUsedByDialog } from '@client/general/dialogs';
import { isWritingOnPhone } from './phone/components/functions';
import { phoneRaised } from './phone/components/legacy';
import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';

export let listEnabled = false;

rpc.on('onAuthCompleted', () => {
	listEnabled = true;
});

const setListEnabled = (args: ExpectedAny) => {
	const { boolean } = JSON.parse(args);
	rpc.trigger(`onListEnabled`, JSON.stringify({ boolean }));
};

const setListOpened = async (args: ExpectedAny) => {
	const { boolean } = JSON.parse(args);
	setCursorVisible(`playersList`, boolean);
	setControlsDisabled(`playersList`, boolean);
	setInterfaceIsOpened('playersList', boolean);
	setInterfaceInCooldown('playersList', 1000);

	if (boolean === true) {
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));
		mp.game.ui.displayHud(false);
		mp.game.ui.displayRadar(false);
		mp.game.graphics.startScreenEffect(`SwitchHUDIn`, 300, false);
		await mp.game.waitAsync(350);
		rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/player-list` }));
		rpc.triggerServer('requestPlayerList', JSON.stringify({ isRefresh: false }));
	} else {
		rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/` }));
		mp.game.graphics.stopScreenEffect(`SwitchHUDIn`);
		mp.game.graphics.startScreenEffect(`SwitchHUDOut`, 1000, false);
		rpc.triggerServer(`closedPlayerList`);
		await mp.game.waitAsync(200);
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));
		mp.game.ui.displayHud(true);
		mp.game.ui.displayRadar(true);
	}
};

rpc.on(`setListOpened`, setListOpened);
rpc.on(`setListEnabled`, setListEnabled);

rpc.on(`refreshPlayerList`, () => {
	if (interfacesOpened.includes('playersList') === true) {
		rpc.triggerServer('requestPlayerList', JSON.stringify({ isRefresh: true }));
	}
});

rpc.on(`updateListInterfaceData`, (args) => {
	const data = JSON.parse(args);
	rpc.triggerBrowsers(`onEventReceiveListData`, JSON.stringify(data));
});

const L_KEY = 0x4c; // L
const ESC_KEY = 0x1b; // ESC

mp.keys.bind(L_KEY, true, async () => {
	if (isButtonUsedByDialog('L') || !loggedIn || listEnabled === false || isInterfaceInCooldown('playerList') || !isPlayerStandingStill()) {
		return;
	}

	// If an interface is opened...
	const isInterfaceOpened = isFullScreenInterfaceOpened(['phone']);
	if (isInterfaceOpened) return false;

	// If the phone is raised and is not writing
	const isPhoneWriting = await isWritingOnPhone();

	// Is inventory opened
	const isOpened = interfacesOpened.includes('playersList') ? true : false;

	// If is writing into any inputs (ex: searching from a player with L in name)
	const isWriting = await rpc.callBrowsers('isWritingIntoInput');
	if (isWriting) return false;

	// If profile is about to be opened..
	if (!isOpened) {
		// If the phone is raised and they are writing..
		if (phoneRaised && isPhoneWriting) return false;

		// Inform the game we  are about to open a higher priority interface..
		rpc.trigger(`interfaces:mainInterfaceIsOpening`);
	}

	setListOpened(JSON.stringify({ boolean: !isOpened }));

	return true;
});

mp.keys.bind(ESC_KEY, true, async () => {
	if (!loggedIn || !listEnabled || !interfacesOpened.includes('playersList') || interfacesOpened.length < 1 || isInterfaceInCooldown('playerList')) {
		return;
	}

	setListOpened(JSON.stringify({ boolean: false }));
});

rpc.on('interfaces:forceClose', () => {
	if (interfacesOpened.includes('playersList') === true) {
		setListOpened(JSON.stringify({ boolean: false }));
	}
});
