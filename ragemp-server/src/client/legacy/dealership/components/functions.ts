import * as rpc from 'rage-rpc';

// Variables
let cam: CameraMp | undefined = undefined;
const player = mp.players.local;
export let vehicle: VehicleMp | null = null;
let vehicleColors: ExpectedAny = null;
let lastScene: ExpectedAny = null;
let lastRotation: ExpectedAny = 0;
export let lastModel = '';

export const getInteriorProps = (scene: string) => {
	if (scene === 'default') {
		const props = [
			// Reminder: we don't load the other crap to make sure the scene is clean.
			// DS Theme
			'entity_set_style_2'
		];

		return props;
	}

	return [];
};

export const loadInterior = (scene: string) => {
	// Setting this here..
	lastScene = scene;
	vehicleColors = null; // to reset colors choices.

	if (scene === 'default') {
		// Coords where the interior is
		const coords = { x: -1357.642, y: 152.553, z: -99.194 };

		// Teleport player to those coords
		player.setCoords(coords.x, coords.y, coords.z, true, false, false, false);

		// Loading the Props..
		const props = getInteriorProps('default');

		rpc.triggerClient(`loadInteriorProps`, JSON.stringify({ props, ...coords }));

		return true;
	}

	return false;
};

export const unloadInterior = (scene: string) => {
	if (scene === 'default') {
		const coords = { x: -1357.642, y: 152.553, z: -99.194 };
		const props = getInteriorProps('default');
		rpc.triggerClient(`removeInteriorProps`, JSON.stringify({ props, ...coords }));
	}
};

export const setCamera = (scene: string) => {
	if (scene === 'default') {
		const cameraCoords = { x: -1334.702001953125, y: 143.74810791015625, z: -98.9416732788086 }; // Y stanga dreapta, X: fata spate
		const rot = { x: 0.9998576045036316, y: 0, z: -90.004505277145653963 };

		mp.game.cam.destroyAllCams(true);

		cam = mp.cameras.new('default', new mp.Vector3(cameraCoords.x, cameraCoords.y, cameraCoords.z), new mp.Vector3(rot.x, rot.y, rot.z), 40);
		cam.setActive(true);

		mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
		return true;
	}
	return false;
};

export const markCameraAsActive = (bool: boolean) => {
	if (!cam) return false;

	cam?.setActive(bool);
	return true;
};

export const destroyCamera = () => {
	mp.game.cam.destroyAllCams(true);
	mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);
};

export const changeCameraZoom = (zoomedIn: boolean) => {
	if (!cam) {
		return;
	}

	const { x, y, z } = cam.getCoord();

	if (lastScene === 'default') {
		// mp.console.logInfo(`zoomedIn: ${zoomedIn ? 'true' : 'false'} - x: ${x}`, true, true); // When pressing F11, you should now see a message saying "example"

		if (!zoomedIn && x + 0.1 < -1340) {
			return;
		}

		if (zoomedIn && x - 0.1 > -1331) {
			return;
		}
	}

	if (lastScene === 'default') {
		const newX = zoomedIn ? x + 0.1 : x - 0.1;
		cam.setCoord(newX, y, z);
	}
};

export const createVehicle = (scene: string, model: string, updatingModel?: boolean) => {
	if (scene === 'default') {
		const vehicleCoords = { x: -1326.8760986328125, y: 143.7648162841797, z: -99.9981115722 };
		const vehicleRotCoords = { x: 0.147088885307312, y: -0.0018407391617074609, z: 65.87179565429688 };

		if (updatingModel) {
			// When changing color the rot must be re-applied.
			vehicleRotCoords.z = lastRotation;
		}

		lastRotation = vehicleRotCoords.z;
		lastModel = model;

		vehicle = mp.vehicles.new(mp.game.joaat(model), new mp.Vector3(vehicleCoords.x, vehicleCoords.y, vehicleCoords.z), {
			heading: vehicleRotCoords.z,
			numberPlate: 'DS',
			color: [
				[255, 255, 255],
				[0, 0, 0]
			],
			dimension: mp.players.local.dimension
		});

		return true;
	}

	return false;
};

export const destroyVehicle = () => {
	if (vehicle === null) return false;
	vehicle.destroy();
	vehicle = null;
	return true;
};

export const changeVehicleModel = async (model: string) => {
	if (vehicle === null) return false;

	vehicle.destroy();
	createVehicle(lastScene, model, true);

	return true;
};

export const changeVehicleColor = (color1: ExpectedAny, color2: ExpectedAny) => {
	if (vehicle === null || color1 === undefined || color2 === undefined) return false;
	vehicle.setCustomPrimaryColour(color1[0], color1[1], color1[2]);
	vehicle.setCustomSecondaryColour(color2[0], color2[1], color2[2]);
	vehicleColors = [color1, color2];
	return true;
};

export const changeVehicleRotation = (rot: number) => {
	if (vehicle === null) return false;
	vehicle?.setHeading(rot);
	lastRotation = rot;
	return true;
};

export const resumeVehicleRotation = () => {
	if (vehicle === null) return false;
	vehicle?.setHeading(lastRotation);
	return true;
};

export const resumeVehicleColor = () => {
	if (vehicle === null) return false;
	if (!vehicleColors) return false;
	changeVehicleColor(vehicleColors[0], vehicleColors[1]);
	return true;
};

export const getVehiclePerformances = () => {
	if (vehicle === null) return { acceleration: 0, braking: 0 };

	return {
		acceleration: mp.game.vehicle.getVehicleModelAcceleration(vehicle.model).toFixed(2),
		maxSpeed: (mp.game.vehicle.getVehicleModelMaxSpeed(vehicle.model) * 3.6).toFixed(0),
		braking: mp.game.vehicle.getVehicleModelMaxBraking(vehicle.model).toFixed(2)
	};
};
