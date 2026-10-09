import { cefAboveGameInterface, getLanguage } from '@client/natives/browser';
import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import * as rpc from 'rage-rpc';

const F8_KEY = 0x77;
let notificationCooldown = false;
let notificationCooldownTimer: UndefinedAny = null;

mp.keys.bind(F8_KEY, true, () => {
	if (loggedIn !== true) return false;
	rpc.trigger('ScreenshotTaken');
	return true;
});

const onScreenshotTaken = async () => {
	const date = new Date();

	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDay();
	const hour = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	cefAboveGameInterface(true); // Sometimes the CEF instance becomes not active, so we need to make sure is active before the screenshot.

	mp.gui.takeScreenshot(`vespucci_${day}_${month}_${year}_${hour}_${minutes}_${seconds}.png`, 1, 100, 0);

	if (interfacesOpened.length < 1 && notificationCooldown === false) {
		rpc.triggerBrowsers(
			'alerts:create',
			JSON.stringify({
				message: getLanguage() === 'EN' ? `Capture saved in screenshots folder from rage:mp` : `Captură salvată in folderul screenshots de la rage:mp`,
				type: `success`
			})
		);
		notificationCooldown = true;

		// If the timeout is not null
		if (notificationCooldownTimer !== null) {
			// Clear timeout
			clearTimeout(notificationCooldownTimer);

			// Reset timeout variable id
			notificationCooldownTimer = null;
		}

		notificationCooldownTimer = setTimeout(() => {
			// Reset variable
			notificationCooldown = false;

			// Reset timeout variable id
			notificationCooldownTimer = null;
		}, 5000);
	}
};

rpc.on('ScreenshotTaken', onScreenshotTaken);
