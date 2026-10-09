import * as rpc from 'rage-rpc';
import {
	interfacesOpened,
	isInterfaceDisabled,
	isPlayerStandingStill,
	loggedIn,
	setInterfaceIsOpened,
	isFullScreenInterfaceOpened,
	setInterfaceInCooldown,
	isInterfaceInCooldown
} from '@client/natives/interfaces';
import { isButtonUsedByDialog } from '@client/general/dialogs';
import { isWritingOnPhone } from './phone/components/functions';
import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';

export let inventoryEnabled = false;

// KEYS

const I_KEY = 0x49; // I
const ESC_KEY = 0x1b; // ESC

rpc.on('onAuthCompleted', () => {
	inventoryEnabled = true;
});

const setInventoryEnabled = (args: ExpectedAny) => {
	const { boolean } = JSON.parse(args);
	rpc.trigger(`onInventoryEnabled`, JSON.stringify({ boolean }));
};

const setInventoryOpened = async (args: ExpectedAny) => {
	const { boolean, remoteId = mp.players.local.remoteId } = JSON.parse(args);
	setCursorVisible(`inventory`, boolean);
	setControlsDisabled(`inventory`, boolean);
	setInterfaceIsOpened('inventory', boolean);
	setInterfaceInCooldown(`inventory`, 1000);

	if (boolean === true) {
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));
		mp.game.ui.displayHud(false);
		mp.game.ui.displayRadar(false);
		mp.game.graphics.startScreenEffect(`SwitchHUDIn`, 300, false);
		rpc.triggerServer(`openInventory`);
		await mp.game.waitAsync(350);
		rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/inventory` }));
		rpc.triggerServer('requestInventoryData', { remoteId });
	} else {
		rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/` }));
		mp.game.graphics.stopScreenEffect(`SwitchHUDIn`);
		mp.game.graphics.startScreenEffect(`SwitchHUDOut`, 1000, false);
		rpc.triggerBrowsers('toasts:clear'); // Hide toasts.
		rpc.triggerServer(`closedInventory`);
		await mp.game.waitAsync(200);
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));
		mp.game.ui.displayHud(true);
		mp.game.ui.displayRadar(true);
	}
};

rpc.on(`setInventoryOpened`, setInventoryOpened);
rpc.on(`setInventoryEnabled`, setInventoryEnabled);

mp.keys.bind(I_KEY, true, async () => {
	if (isButtonUsedByDialog('I') || !loggedIn || isInterfaceDisabled('inventory') || inventoryEnabled === false || isInterfaceInCooldown('inventory') || !isPlayerStandingStill()) {
		return;
	}

	// If an interface is opened...
	const isInterfaceOpened = isFullScreenInterfaceOpened(['phone']);
	if (isInterfaceOpened) return false;

	// If the phone is raised and is not writing
	const isWriting = await isWritingOnPhone();
	if (isWriting) return false;

	// Is inventory opened
	const isOpened = interfacesOpened.includes('inventory') ? true : false;

	// If inventory is about to be opened..
	if (!isOpened) {
		// Inform the game we  are about to open a higher priority interface..
		rpc.trigger(`interfaces:mainInterfaceIsOpening`);
	}

	setInventoryOpened(JSON.stringify({ boolean: !isOpened }));

	return true;
});

mp.keys.bind(ESC_KEY, true, () => {
	if (!loggedIn || !inventoryEnabled || !interfacesOpened.includes('inventory') || interfacesOpened.length < 1 || isInterfaceInCooldown('inventory')) {
		return;
	}

	setInventoryOpened(JSON.stringify({ boolean: false }));
});

rpc.on('interfaces:forceClose', () => {
	if (interfacesOpened.includes('inventory') === true) {
		setInventoryOpened(JSON.stringify({ boolean: false }));
	}
});

rpc.on('announceInventoryOpened', () => {
	mp.events.callRemote('onInventoryOpened');
});
