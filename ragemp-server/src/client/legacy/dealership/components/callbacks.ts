import { loggedIn, setInterfaceIsOpened } from '@client/natives/interfaces';
import * as rpc from 'rage-rpc';
import {
	changeCameraZoom,
	changeVehicleColor,
	changeVehicleModel,
	changeVehicleRotation,
	createVehicle,
	destroyCamera,
	destroyVehicle,
	getVehiclePerformances,
	loadInterior,
	setCamera,
	unloadInterior
} from './functions';
import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';

// Variables
const player = mp.players.local;
export let dealershipActiveScene: string | null = null;
let interfaceHidden = false;

// KEYS

const F7_KEY = 0x76; // F7

export const isDealershipOpened = dealershipActiveScene !== null ? true : false;

rpc.register(`loadDealershipScene`, async (args: ExpectedAny) => {
	const { scene, defaultVehicleModel } = JSON.parse(args);

	// Saving this as a variable to re-use later..
	dealershipActiveScene = scene;

	// Mark the interface as opened already..
	setInterfaceIsOpened('dealership', true);

	// Hide the game hud and most native stuff.
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));
	mp.game.ui.displayHud(false);
	mp.game.ui.displayRadar(false);
	setCursorVisible(`business:dealership`, false);
	setControlsDisabled(`business:dealership`, false);

	// Fade out...
	mp.game.cam.doScreenFadeOut(400);
	await mp.game.waitAsync(400);

	// A few tweaks to the player himself..
	player.setInvincible(true);
	player.setVisible(false, false);

	// Let's now load the interior (coords, props, ipls)..
	loadInterior(scene);

	// After he's been moved to the coords let's freeze him
	player.freezePosition(true);

	// Setting the camera view
	setCamera(scene);

	// Generate the vehicle preview model client-side
	createVehicle(scene, defaultVehicleModel);
	await mp.game.waitAsync(200); // Waiting for vehicle to be spawned right.

	// Fade in...
	mp.game.cam.doScreenFadeIn(1200);
	await mp.game.waitAsync(200);

	// Unfading and showing the cursor now..
	setCursorVisible(`business:dealership`, true);
	setControlsDisabled(`business:dealership`, true);
});

rpc.register(`leaveDealershipScene`, async (args: ExpectedAny) => {
	const { lastCoords } = JSON.parse(args);

	// Mark the interface as closed
	setInterfaceIsOpened('dealership', false);

	// Change his page back to normal..
	rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/` }));

	// Fade out...
	mp.game.cam.doScreenFadeOut(400);
	await mp.game.waitAsync(400);

	// Destroy the camera
	destroyCamera();

	// Destroy the vehicle created for previews
	destroyVehicle();

	// Unload the interior props
	unloadInterior(dealershipActiveScene!);

	// Unfreeze the player
	player.freezePosition(false);

	if (lastCoords) {
		// When dying we don't teleport them back.
		// Teleport the user back where he was
		player.setCoords(lastCoords.x, lastCoords.y, lastCoords.z, true, false, false, false);
	}

	// Removing the tweaks..
	player.setInvincible(false);
	player.setVisible(true, true);

	// Hide toasts..
	rpc.triggerBrowsers('toasts:clear'); // Hide toasts.

	// Fade in...
	mp.game.cam.doScreenFadeIn(1200);
	await mp.game.waitAsync(200);

	// Show the game hud and most native stuff.
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));
	mp.game.ui.displayHud(true);
	mp.game.ui.displayRadar(true);
	setCursorVisible(`business:dealership`, false);
	setControlsDisabled(`business:dealership`, false);
});

rpc.on('onDealershipPreviewModelChanged', async (args) => {
	const { model } = JSON.parse(args);
	changeVehicleModel(model);
});

rpc.on('vehicleDealershipColorChanged', async (args) => {
	const { colors } = JSON.parse(args);
	changeVehicleColor(colors[0], colors[1]);
});

rpc.on('onDealershipZoomChange', (args) => {
	const { zoomedIn } = JSON.parse(args);
	changeCameraZoom(zoomedIn);
});

rpc.on('onDealershipVehRotate', (args) => {
	const { newAngle } = JSON.parse(args);
	changeVehicleRotation(newAngle);
});

rpc.register('getVehicleDealershipPerformances', () => getVehiclePerformances());

mp.keys.bind(F7_KEY, true, () => {
	if (loggedIn === false || dealershipActiveScene === null) return true;
	rpc.triggerBrowsers('hideDealershipInterface', JSON.stringify({ bool: !interfaceHidden }));
	interfaceHidden = !interfaceHidden;
	return true;
});
