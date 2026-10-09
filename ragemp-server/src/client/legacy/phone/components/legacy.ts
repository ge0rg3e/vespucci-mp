import * as rpc from 'rage-rpc';
import { interfacesOpened, isPlayerStandingStill, loggedIn, setInterfaceIsOpened, setInterfaceInCooldown, isInterfaceInCooldown, isInterfaceDisabled } from '@client/natives/interfaces';
import { isButtonUsedByDialog } from '@client/general/dialogs';
import { disableControlWhenUsingKeyboard } from './disableControls';
import { setCursorVisible } from '@client/general/cursor';

// KEYS
const O_KEY = 0x4f; // O

// Global Variables
export let phoneVisible = false;
export let phoneRaised = false;
export let phoneMounted = false;

const setPhoneVisibility = (boolean: boolean) => {
	phoneVisible = boolean;
	rpc.triggerBrowsers('onPhoneIsVisible', JSON.stringify({ boolean }));
};

rpc.on('setPhoneIsVisible', (args) => {
	const { boolean } = JSON.parse(args);
	setPhoneVisibility(boolean);
});

rpc.on('onPhoneMounted', () => {
	phoneMounted = true;
});

const setPhoneRaised = async (boolean: boolean) => {
	// Set internal variable..
	phoneRaised = boolean;

	// Raise the phone up
	rpc.triggerBrowsers('onPhoneIsRaised', JSON.stringify({ boolean }));

	// Show the cursor and make sure to set disable controls false so the other system can manage controls.
	setCursorVisible(`phone`, boolean);

	// We mark the interface opened
	setInterfaceIsOpened('phone', boolean);

	// Disable control when writing on keyboard..
	disableControlWhenUsingKeyboard(boolean);
};

rpc.on('setPhoneIsRaised', (args) => {
	const { boolean } = JSON.parse(args);
	if (interfacesOpened.length > 0 && phoneRaised === false) return;
	setPhoneRaised(boolean);
});

rpc.register('isPhoneRaised', () => phoneRaised);

mp.keys.bind(O_KEY, true, async () => {
	if (isButtonUsedByDialog('O') || loggedIn === false || phoneVisible === false) return true;
	if (phoneRaised === false && interfacesOpened.length < 1 && isInterfaceDisabled('phone') !== true && !isInterfaceInCooldown('phone') && isPlayerStandingStill()) {
		await setPhoneRaised(true);
		setInterfaceInCooldown('phone', 2000);
	} else if (phoneRaised === true) {
		const isWritingIntoInput = await rpc.callBrowsers('isWritingIntoInput');
		if (isWritingIntoInput === true) return false;
		setPhoneRaised(false);
		setInterfaceInCooldown('phone', 1000);
	}
	return true;
});

rpc.on('interfaces:forceClose', () => {
	setPhoneRaised(false);
});
