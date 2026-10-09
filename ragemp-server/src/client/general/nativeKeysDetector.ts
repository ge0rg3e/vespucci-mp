import { interfacesOpened, loggedIn, setInterfaceIsOpened } from '@client/natives/interfaces';
import { setControlsDisabled, setCursorVisible } from './cursor';

export let consoleEnabled = false;
export let serverBrowserEnabled = false;

const F11_KEY = 0x7a;
const F1_KEY = 0x70;

mp.keys.bind(F11_KEY, true, async () => {
	if (loggedIn === false) return false;
	// We will set it as opened only if they press f8 while not being in an interface.

	if (interfacesOpened.length < 1 && consoleEnabled === false) {
		setInterfaceIsOpened('gameConsole', true);
		setCursorVisible('gameConsole', true);
		setControlsDisabled('gameConsole', true);
	}

	if (interfacesOpened.length > 0 && consoleEnabled === true) {
		setInterfaceIsOpened('gameConsole', false);
		setCursorVisible('gameConsole', false);
		setControlsDisabled('gameConsole', false);
	}

	consoleEnabled = !consoleEnabled;

	return false;
});

mp.keys.bind(F1_KEY, true, async () => {
	if (loggedIn === false) return false;
	// We will set it as opened only if they press f8 while not being in an interface.

	if (interfacesOpened.length < 1 && serverBrowserEnabled === false) {
		setInterfaceIsOpened('rageBrowser', true);
		setControlsDisabled('rageBrowser', true);
		setCursorVisible('rageBrowser', true);
	}

	if (interfacesOpened.length > 0 && serverBrowserEnabled === true) {
		setInterfaceIsOpened('rageBrowser', false);
		setControlsDisabled('rageBrowser', false);
		setCursorVisible('rageBrowser', false);
	}

	serverBrowserEnabled = !serverBrowserEnabled;

	return false;
});

// Just for fun

mp.events.add('consoleCommand', (command) => {
	if (command === 'clear') {
		mp.console.logInfo(`‏`, true, true);
		mp.console.logInfo(`‏‏`, true, true);
		mp.console.logInfo(`‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏‏‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏‏‏‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏‏‏‏‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏‏‏‏‏‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏‏‏‏‏‏‏‏‏‏`, true, true);
		mp.console.logInfo(`‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏`, true, true);
		mp.console.logInfo(`Console is now cleared.`, true, true);
	}
});
