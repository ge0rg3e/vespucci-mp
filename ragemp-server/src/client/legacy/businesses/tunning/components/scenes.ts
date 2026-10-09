import * as rpc from 'rage-rpc';

import { setInterfaceIsOpened } from '@client/natives/interfaces';
import { waitForArrivingAtLocation } from './scriptedDriving';
import { resetCameraDependencies } from './cameras/functions';
import { setCursorVisible } from '@client/general/cursor';

// Variables
const player = mp.players.local;
let disableControlsTunning = false;
let allowHonk = false;

rpc.on('tunning:startEntranceScene', async (args: string) => {
	const { camera, sceneCoords } = JSON.parse(args);

	// Mark it as an interface..
	setInterfaceIsOpened('carTunning', true);

	// Hide the game hud and most native stuff.
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));
	mp.game.ui.displayHud(false);
	mp.game.ui.displayRadar(false);

	// Hide cursor temporary
	setCursorVisible(`tunning`, false);

	disableControlsTunning = true;

	// A few tweaks to the player himself..
	player.setInvincible(true);

	// Create camera
	mp.game.cam.destroyAllCams(true);

	// Close the garage door..
	rpc.trigger('tunning:switchStateGarageDoor', JSON.stringify({ state: false }));

	// Show the camera at entrance..
	rpc.triggerClient(`tunning:showTransitionCamera`, JSON.stringify({ camera, type: 'entrance' }));

	// Make vehicle invincible to not have damage during entrance scene (just in case)
	player.vehicle.setInvincible(true);

	// Bugfix: We use forcefully close and if by an chance it has been reset to false.
	setInterfaceIsOpened('carTunning', true);

	// Wait..
	await waitForArrivingAtLocation({ coords: sceneCoords });

	// Now is ok..
	player.vehicle.setInvincible(false);

	// Wait a few extra seconds for a nicer entrance.
	await mp.game.waitAsync(1000);

	// Set the camera now..
	rpc.triggerClient(`tunning:setCamera`, JSON.stringify({ name: 'idle' }));

	// show cursor
	setCursorVisible(`tunning`, true);

	disableControlsTunning = true;

	// Show the interface..
	rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/businesses/tunning` }));
});

rpc.on('tunning:startDepartureScene', async (args: string) => {
	const { camera, finalDestination, isDriver, isExit = false } = JSON.parse(args);

	if (isExit) {
		// Destroy any cam if existing before showing the intro / outro.
		resetCameraDependencies();
	}

	// Show the camera..
	rpc.triggerClient(`tunning:showTransitionCamera`, JSON.stringify({ camera, type: 'exit' }));

	// Hide the interface now..
	rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/` }));
	rpc.triggerBrowsers('toasts:clear'); // Hide toasts.

	// Open the garage door..
	rpc.trigger('tunning:switchStateGarageDoor', JSON.stringify({ state: true }));

	// If he is the driver..
	if (isDriver) {
		await waitForArrivingAtLocation({ coords: finalDestination });
		rpc.triggerServer(`tunning:finishedDepartureScene`);
	}

	// Close the garage door..
	rpc.trigger('tunning:switchStateGarageDoor', JSON.stringify({ state: false }));
});

rpc.on('tunning:finishedDepartureScene', async () => {
	// Mark it as an interface..
	setInterfaceIsOpened('carTunning', false);

	// Hide the game hud and most native stuff.
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));

	// Hide the interface now..
	rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/` }));

	// Natives
	mp.game.ui.displayHud(true);
	mp.game.ui.displayRadar(true);

	disableControlsTunning = false;

	// A few tweaks to the player himself..
	player.setInvincible(false);

	// Stop camera
	rpc.triggerClient(`tunning:destroyCameras`);

	// Reset for exists
	resetCameraDependencies();
});

rpc.on('tunning:showCursor', async (args: string) => {
	const { value } = JSON.parse(args);

	// Hide or show cursor but keep taking away their control..
	setCursorVisible(`tunning`, value);
});

rpc.on(`tunning:allowHorn`, async (args) => {
	const { value } = JSON.parse(args);
	allowHonk = value;
});

mp.events.add('render', () => {
	if (disableControlsTunning) {
		mp.game.controls.disableAllControlActions(0);
		mp.game.controls.disableAllControlActions(1);
		mp.game.controls.disableAllControlActions(2);

		if (allowHonk) {
			mp.game.controls.enableControlAction(2, 86, true);
		}
	}
});
