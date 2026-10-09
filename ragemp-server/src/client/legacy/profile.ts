import * as rpc from 'rage-rpc';

import { interfacesOpened, isPlayerStandingStill, loggedIn, setInterfaceIsOpened, isFullScreenInterfaceOpened, setInterfaceInCooldown, isInterfaceInCooldown } from '@client/natives/interfaces';
import { isButtonUsedByDialog } from '@client/general/dialogs';
import { isWritingOnPhone } from './phone/components/functions';
import { phoneRaised } from './phone/components/legacy';
import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';

export let profileEnabled = false;

rpc.on('onAuthCompleted', () => {
	profileEnabled = true;
});

const setProfileEnabled = (args: ExpectedAny) => {
	const { boolean } = JSON.parse(args);
	rpc.trigger(`onProfileEnabled`, JSON.stringify({ boolean }));
};

const setProfileOpened = async (args: ExpectedAny) => {
	const { boolean, playerId } = JSON.parse(args);
	setCursorVisible(`profile`, boolean);
	setControlsDisabled(`profile`, boolean);
	setInterfaceIsOpened('profile', boolean);
	setInterfaceInCooldown('profile', 2000);

	if (boolean === true) {
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));
		mp.game.ui.displayHud(false);
		mp.game.ui.displayRadar(false);
		mp.game.graphics.startScreenEffect(`SwitchHUDIn`, 200, false);
		await mp.game.waitAsync(250);
		rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/profile` }));
		rpc.triggerServer('requestProfileData', { playerId });
	} else {
		rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/` }));
		mp.game.graphics.stopScreenEffect(`SwitchHUDIn`);
		mp.game.graphics.startScreenEffect(`SwitchHUDOut`, 500, false);
		rpc.triggerServer(`closedProfileScreen`);
		rpc.triggerBrowsers('toasts:clear'); // Hide toasts.
		await mp.game.waitAsync(200);
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));
		mp.game.ui.displayHud(true);
		mp.game.ui.displayRadar(true);
	}
};

rpc.on(`setProfileOpened`, setProfileOpened);
rpc.on(`setProfileEnabled`, setProfileEnabled);

const P_KEY = 0x50; // P
const ESC_KEY = 0x1b; // ESC

mp.keys.bind(P_KEY, true, async () => {
	if (isButtonUsedByDialog('P') || !loggedIn || profileEnabled === false || isInterfaceInCooldown('profile') || !isPlayerStandingStill()) {
		return;
	}

	// If an interface is opened...
	const isInterfaceOpened = isFullScreenInterfaceOpened(['phone']);
	if (isInterfaceOpened) return false;

	// If the phone is raised and is not writing
	const isPhoneWriting = await isWritingOnPhone();

	// Is inventory opened
	const isOpened = interfacesOpened.includes('profile') ? true : false;

	// If is writing into any inpouts from the profile (aka the filter input..)
	const isWriting = await rpc.callBrowsers('isWritingIntoInput');
	if (isWriting) return false;

	// If profile is about to be opened..
	if (!isOpened) {
		// If the phone is raised and they are writing..
		if (phoneRaised && isPhoneWriting) return false;

		// Inform the game we  are about to open a higher priority interface..
		rpc.trigger(`interfaces:mainInterfaceIsOpening`);
	}

	setProfileOpened(JSON.stringify({ boolean: !isOpened, playerId: mp.players.local.remoteId }));

	return true;
});

mp.keys.bind(ESC_KEY, true, () => {
	if (!loggedIn || !profileEnabled || !interfacesOpened.includes('profile') || interfacesOpened.length < 1) {
		return;
	}

	setProfileOpened(JSON.stringify({ boolean: false }));
});

rpc.on('interfaces:forceClose', () => {
	if (interfacesOpened.includes('profile')) {
		setProfileOpened(JSON.stringify({ boolean: false }));
	}
});
