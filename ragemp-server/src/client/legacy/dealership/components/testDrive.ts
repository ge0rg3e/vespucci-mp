import { setInterfaceIsDisabled, setInterfaceIsOpened } from '@client/natives/interfaces';
import * as rpc from 'rage-rpc';
import { dealershipActiveScene } from './callbacks';
import { createVehicle, destroyCamera, destroyVehicle, lastModel, loadInterior, resumeVehicleColor, resumeVehicleRotation, setCamera, unloadInterior, vehicle as DealershipVehicle } from './functions';
import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';

// Dependencies
let vehicleTestDrive: VehicleMp | null = null;
let testDriveTimerId: ExpectedAny = null;
let leaveVehicleTimerId: ExpectedAny = null;

const player = mp.players.local;
const testDriveLocation = {
	pos: new mp.Vector3(1111.539, 184.967, 81.366),
	heading: 147
};

// Functions
export let vehicleTestDriveFuel: ExpectedAny = 100; // This is used by the speedometer
export let vehicleTestDriveModel: ExpectedAny = null;

export const isTestDriveDealershipInProgress = () => (vehicleTestDrive !== null ? true : false);

rpc.on('testDriveDealership', async (args) => {
	const { enabled, colors, model, fuel } = JSON.parse(args);

	if (enabled === true) {
		// Just a sanity check against suckers.
		if (vehicleTestDrive !== null) return false;
		if (!dealershipActiveScene) return false;

		// Hide toasts..
		rpc.triggerBrowsers('toasts:clear'); // Hide toasts.

		// Fade out...
		mp.game.cam.doScreenFadeOut(400);
		await mp.game.waitAsync(400);

		// Hide the interface.
		setInterfaceIsOpened('testDriveBlankScreen', true);
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));

		// Native huds...
		mp.game.ui.displayHud(true);
		mp.game.ui.displayRadar(true);
		setCursorVisible(`business:dealership`, false);
		setControlsDisabled(`business:dealership`, false);

		// Other tweaks..
		player.setInvincible(true);
		player.setVisible(true, true);

		// Unfreeze him
		player.freezePosition(false);

		// Destroy the camera..
		destroyCamera();

		// Unload the interior
		unloadInterior(dealershipActiveScene!);

		// Destroy the vehicle
		destroyVehicle();

		// Teleport
		player.setCoords(testDriveLocation.pos.x, testDriveLocation.pos.y, testDriveLocation.pos.z, true, false, false, false);

		// Create the vehicle
		vehicleTestDrive = mp.vehicles.new(mp.game.joaat(model), testDriveLocation.pos, {
			heading: testDriveLocation.heading,
			numberPlate: 'TEST DS',
			dimension: mp.players.local.dimension
		});

		// Setting this here for the speedometer
		vehicleTestDriveFuel = fuel;
		vehicleTestDriveModel = model;

		// Wait 50 ms for car to be spawned
		await mp.game.waitAsync(50);

		// Set the colors right
		if (colors.type === 'normal') {
			vehicleTestDrive.setColours(colors.values[0], colors.values[1]);
		} else {
			const color1 = colors.values[0],
				color2 = colors.values[1];

			vehicleTestDrive.setCustomPrimaryColour(color1[0], color1[1], color1[2]);
			vehicleTestDrive.setCustomSecondaryColour(color2[0], color2[1], color2[2]);
		}

		// Make vehicle invincible..
		vehicleTestDrive.setInvincible(true);

		// Put the player in this vehicle..
		player.setIntoVehicle(vehicleTestDrive.handle, -1);

		// Start the engine right away..
		vehicleTestDrive.setEngineOn(true, true, true);

		// Disabling certain interfaces
		setInterfaceIsDisabled('inventory', true);

		// Fade in...
		mp.game.cam.doScreenFadeIn(1200);
		await mp.game.waitAsync(200);

		// Start the timer and informing the server when it's done. Let's not spam Serverside for nothing.
		testDriveTimerId = setTimeout(async () => {
			// Brake before ending..
			if (player.vehicle) {
				await player.taskVehicleTempAction(player.vehicle.handle, 24, 1500);
				await mp.game.waitAsync(1500);
			}

			rpc.triggerServer(
				'testDriveDealershipEnded',
				JSON.stringify({
					reason: '60 minutes passed'
				})
			);

			// Reset timer id
			testDriveTimerId = null;
		}, 1 * 60 * 1000);

		return true;
	}

	if (enabled === false) {
		// Jsut a sanity check.
		if (vehicleTestDrive === null) return false;

		// Kill the timer if exists
		if (testDriveTimerId !== null) {
			// Clear
			clearTimeout(testDriveTimerId);

			// REset variable
			testDriveTimerId = null;
		}

		// Native huds...
		mp.game.ui.displayHud(false);
		mp.game.ui.displayRadar(false);

		// Fade out...
		mp.game.cam.doScreenFadeOut(400);
		await mp.game.waitAsync(400);

		// Show the interface.
		setInterfaceIsOpened('testDriveBlankScreen', false);
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));

		// Other tweaks..
		player.setInvincible(true);
		player.setVisible(false, false);

		// Getting the last scene
		const scene = dealershipActiveScene;
		if (!scene) return false;

		// Let's now load the interior (coords, props, ipls)..
		loadInterior(scene);

		// After he's been moved to the coords let's freeze him
		player.freezePosition(true);

		// Setting the camera view
		setCamera(scene);

		// Create the vehicle
		createVehicle(scene, lastModel, true);

		// Destroy the test drive vehicle
		if (vehicleTestDrive) {
			vehicleTestDrive.destroy();
			vehicleTestDrive = null;
		}

		// Setting this here for the speedometer
		vehicleTestDriveFuel = null;

		// Enabling certain interfaces
		setInterfaceIsDisabled('inventory', false);

		// Fade in...
		mp.game.cam.doScreenFadeIn(1200);
		await mp.game.waitAsync(200);

		// Marking interface as active again..
		rpc.triggerBrowsers(
			'setDealershipInterfaceActiveState',
			JSON.stringify({
				boolean: true
			})
		);

		// Show cursor now..
		setCursorVisible(`business:dealership`, true);
		setControlsDisabled(`business:dealership`, true);

		return true;
	}

	return false;
});

rpc.on('endTestDriveWhenDealershipIsDeleted', () => {
	// Check if vehicle exists..
	if (vehicleTestDrive) {
		vehicleTestDrive.destroy();
		vehicleTestDrive = null;
	}

	// If they just left their vehicle..
	if (leaveVehicleTimerId !== null) {
		// Clear timeout
		clearTimeout(leaveVehicleTimerId);

		// Reset timeout variable id
		leaveVehicleTimerId = null;
	}

	// End test drive timer..
	if (testDriveTimerId !== null) {
		// Clear timeout
		clearTimeout(testDriveTimerId);

		// Reset timeout variable id
		testDriveTimerId = null;
	}

	// Setting this here for the speedometer
	vehicleTestDriveFuel = null;

	// Enabling certain interfaces
	setInterfaceIsDisabled('inventory', false);
});

mp.events.add('patched:playerLeaveVehicle', async (vehicle) => {
	if (vehicleTestDrive === null) return false;
	if (vehicle === vehicleTestDrive) {
		// If he has another timer already by any mistake..
		if (leaveVehicleTimerId !== null) {
			// Clear timeout
			clearTimeout(leaveVehicleTimerId);

			// Reset variable
			leaveVehicleTimerId = null;
		}

		leaveVehicleTimerId = setTimeout(() => {
			// Call server
			rpc.triggerServer(
				'testDriveDealershipEnded',
				JSON.stringify({
					reason: 'Left vehicle during test drive'
				})
			);

			// Reset timer id variable
			leaveVehicleTimerId = null;
		}, 2500);
	}
	return true;
});

mp.events.add('patched:playerEnterVehicle', async (vehicle) => {
	if (leaveVehicleTimerId !== null && vehicle === vehicleTestDrive) {
		// Clear timeout
		clearTimeout(leaveVehicleTimerId);

		// Reset variable
		leaveVehicleTimerId = null;
	}
});

mp.events.add('playerQuit', () => {
	if (vehicleTestDrive === null) return false;
	vehicleTestDrive.destroy();
	return true;
});

mp.events.add('entityStreamIn', (entity) => {
	if (dealershipActiveScene === null) return false;

	if (entity.type === 'vehicle' && entity === DealershipVehicle) {
		resumeVehicleRotation();
		resumeVehicleColor();
	}

	return true;
});
