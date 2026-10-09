import * as rpc from 'rage-rpc';
import { resetCameraDependencies, setTransitionCamera, setVehicleBodyCameraLocation } from './functions';

const player = mp.players.local;

rpc.on('tunning:showTransitionCamera', async (args) => {
	const { type, camera } = JSON.parse(args);
	const { coords, direction } = camera;

	// Reminder: we refresh the interior only when entering. Don't refresh on exit to avoid damaging vehicles.
	setTransitionCamera(coords, direction, type === 'entrance' ? true : false);
});

rpc.on(`tunning:setCamera`, async (args) => {
	const { name } = JSON.parse(args);

	const veh = player.vehicle;
	if (!veh) return false;

	if (name === 'idle') {
		// We set the camera.
		setVehicleBodyCameraLocation('front', -2.5, 4.5, 0.8);
	}

	if (name === 'neons') {
		setVehicleBodyCameraLocation('front', 5.5, 0, 3);
	}

	if (name === 'wheels') {
		// Special support for motorcycles -- they don't have wheels.
		if (player.vehicle.getClass() === 8) {
			setVehicleBodyCameraLocation('right', 4, 0, 0);
			return false;
		}
		setVehicleBodyCameraLocation('wheel_rf', 4, 0.5, 0);
	}

	const mod = name.split('mods:')[1];

	if (mod === 'plate' || name === 'plate' || mod === 'plateHolders') {
		setVehicleBodyCameraLocation('back', 0, -1.8, 0.5);
	}

	if (mod === 'steeringWheel') {
		setVehicleBodyCameraLocation('steeringWheel', 0, 0, 0);
	}
	if (['ornaments', 'shiftLever'].includes(mod)) {
		setVehicleBodyCameraLocation('dashboard', 0, 0, 0);
	}

	if (mod === 'dialDesign') {
		setVehicleBodyCameraLocation('dials', 0, 0, 0);
	}

	if (['spoiler', 'plaques'].includes(mod)) {
		setVehicleBodyCameraLocation('back', 2, -3, 0.95);
	}

	if (['frontBumper', 'grille'].includes(mod)) {
		setVehicleBodyCameraLocation('front', 0, 3.8, 0.2);
	}

	if (mod === 'hood') {
		setVehicleBodyCameraLocation('front', 0, 4, 3);
	}

	if (['rearBumper', 'exhaust'].includes(mod)) {
		setVehicleBodyCameraLocation('back', 0, -2.5, 0);
	}

	if (['roof'].includes(mod)) {
		setVehicleBodyCameraLocation('roof', 0, 0, 0);
	}

	if (mod === 'sideSkirt') {
		setVehicleBodyCameraLocation('right', 4, 0, 0);
	}

	if (mod === 'windowTint') {
		setVehicleBodyCameraLocation('right', 4, 1.5, 1.5);
	}

	if (mod === 'leftFender') {
		setVehicleBodyCameraLocation('wheel_lf', -5, 2.5, 2);
	}

	if (mod === 'rightFender') {
		setVehicleBodyCameraLocation('right', 4, 2.5, 1.5);
	}

	return true;
});

rpc.on('tunning:destroyCameras', async () => {
	// Stop camera
	mp.game.cam.destroyAllCams(true);
	mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);
	resetCameraDependencies();
});
