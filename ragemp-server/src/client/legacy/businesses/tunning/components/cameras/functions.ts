import { getOffsetPosition } from '@client/utils/helpers';

const player = mp.players.local;
export let cam: ExpectedAny = null;

export const setVehicleFirstPersonCamera = async () => {
	// Destroy previous camera..
	if (cam) {
		cam.destroy();
		mp.game.cam.destroyAllCams(true);
		mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);
		cam = null;
	}

	// Set first person..
	mp.game.cam.setFollowVehicleCamViewMode(4);
};

/**
 *
 * @param pos - The name of the starting position
 * @param x - Left Right
 * @param y - Forward Backwards
 * @param z - Up down
 * @returns
 */

export const setVehicleBodyCameraLocation = async (pos: string, x: number, y: number, z: number) => {
	try {
		if (!player.vehicle) return false;

		// Variables
		const d: ExpectedAny = mp.game.gameplay.getModelDimensions(player.vehicle.model).minimum;
		let pointAtCoords = player.vehicle.position;
		const length = d.y * -2,
			width = d.x * -2,
			height = d.z * -2;
		let coords;

		// Reset this
		player.setVisible(true, false);

		if (pos === 'front') {
			coords = player.vehicle.getOffsetFromInWorldCoords(x, length / 2 + y, z);
		}

		if (pos === 'front-top') {
			coords = player.vehicle.getOffsetFromInWorldCoords(x, length / 2 + y, height + z);
		}

		if (pos === 'back') {
			coords = player.vehicle.getOffsetFromInWorldCoords(x, -(length / 2) + y, z);
		}

		if (pos === 'back-top') {
			coords = player.vehicle.getOffsetFromInWorldCoords(x, -(length / 2) + y, height / 2 + z);
		}

		// Bugged!! not working
		if (pos === 'left') {
			// prettier-ignore
			coords = player.vehicle.getOffsetFromInWorldCoords((-(width / 2) + x), y, z);
		}

		if (pos === 'right') {
			// prettier-ignore
			coords = player.vehicle.getOffsetFromInWorldCoords(((width / 2) + x), y, z);
		}

		if (pos === 'roof') {
			// prettier-ignore
			const dimensions = mp.game.gameplay.getModelDimensions(player.vehicle.model);
			const vehicleHeight = dimensions.maximum.z;
			const paddingHeight = vehicleHeight > 1 ? 2 : 1.8;

			// mp.console.logInfo(`Height: ${vehicleHeight} - padding: ${paddingHeight}`);
			coords = player.vehicle.getOffsetFromInWorldCoords(0, -(length / 2) - 2.5, height + paddingHeight);
		}

		// right front wheel
		if (pos === 'wheel_rf') {
			const boneIndex = player.vehicle.getBoneIndexByName('wheel_rf');
			if (boneIndex === -1) return;
			const boneCoords = player.vehicle.getWorldPositionOfBone(boneIndex);

			coords = player.vehicle.getOffsetFromInWorldCoords(x, length / 2 + y, z); // front
			pointAtCoords = boneCoords;
		}

		// left front wheel
		if (pos === 'wheel_lf') {
			const boneIndex = player.vehicle.getBoneIndexByName('wheel_lf');
			if (boneIndex === -1) return;
			const boneCoords = player.vehicle.getWorldPositionOfBone(boneIndex);

			coords = player.vehicle.getOffsetFromInWorldCoords(x, length / 2 + y, z); // front
			pointAtCoords = boneCoords;
		}

		if (pos === 'steeringWheel') {
			const boneIndex = player.vehicle.getBoneIndexByName('steeringwheel');
			if (boneIndex === -1) return;
			const boneCoords = player.vehicle.getWorldPositionOfBone(boneIndex);

			player.setVisible(false, false);

			coords = getOffsetPosition(boneCoords.x, boneCoords.y, boneCoords.z, 0, 0.8, 3.8);
			pointAtCoords = boneCoords;
		}

		// @Bugfix.
		if (pos === 'dials') {
			const boneIndex = player.vehicle.getBoneIndexByName('steeringwheel');
			if (boneIndex === -1) return;
			const boneCoords = player.vehicle.getWorldPositionOfBone(boneIndex);

			player.setVisible(false, false);

			coords = getOffsetPosition(boneCoords.x, boneCoords.y, boneCoords.z, 0, 0.8, 3.8);
			coords.z + 0.07;

			pointAtCoords = boneCoords;
			pointAtCoords.z += 0.07;
		}

		if (pos === 'dashboard') {
			const boneIndex = player.vehicle.getBoneIndexByName('steeringwheel');
			const boneIndex2 = player.vehicle.getBoneIndexByName('engine');
			if (boneIndex === -1 || boneIndex2 === -1) return;

			// Get bone coords for both
			const boneCoords = player.vehicle.getWorldPositionOfBone(boneIndex);
			const boneCoords2 = player.vehicle.getWorldPositionOfBone(boneIndex2);

			// Hide the player..
			player.setVisible(false, false);

			coords = getOffsetPosition(boneCoords.x, boneCoords.y, boneCoords.z, 0, 0.7, 3.9);
			pointAtCoords = boneCoords2;
		}

		// If it can't find..
		if (!coords) {
			mp.console.logError(`Failed to find coords for this ${pos}`);
			return false;
		}

		// Save the old cam to know to delete it later
		const oldCam = cam ? cam : null;

		// Move the camera instance..
		cam = mp.cameras.new('default', new mp.Vector3(coords.x, coords.y, coords.z), new mp.Vector3(0, 0, 0), 35);
		cam.pointAtCoord(pointAtCoords.x, pointAtCoords.y, pointAtCoords.z);

		if (oldCam !== null) {
			cam.setActiveWithInterp(oldCam.handle, 700, 0, 0); // for smooth transition

			// Destroy the oldCam only after the smooth transition is finished.
			setTimeout(() => {
				// We must check it like this in case the user has destroyAllCams() called.
				const entityExists = mp.cameras.atHandle(oldCam.handle);
				if (!entityExists) return;
				oldCam.destroy();
			}, 700);
		} else {
			cam.setActive(true); // for smooth transition
			mp.game.cam.renderScriptCams(true, true, 1000, true, false, 0);
		}

		return true;
	} catch (err) {
		mp.console.logError(`ERROR: ${JSON.stringify(err)}`);
		return false;
	}
};

export const setTransitionCamera = async (coords: ExpectedAny, direction: ExpectedAny, refreshInterior: boolean) => {
	cam = mp.cameras.new('default', new mp.Vector3(coords.x, coords.y, coords.z), new mp.Vector3(direction.x, direction.y, direction.z), 35);
	cam.setActive(true);
	mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

	if (refreshInterior) {
		// @Bugfix: Camera when moving through walls due to interpolation the interior is fucked up.
		refreshInteriorAtCoords(coords);
	}
};

export const resetCameraDependencies = () => {
	// We reset and destroy..
	if (cam !== null) {
		cam.destroy();
	}

	cam = null;

	// Reset this..
	mp.game.cam.setFollowVehicleCamViewMode(2);

	// Reset..
	player.setVisible(true, false);
};

export const refreshInteriorAtCoords = (coords: ExpectedAny) => {
	const interior = mp.game.interior.getInteriorAtCoords(coords.x, coords.y, coords.z);
	mp.game.interior.refreshInterior(interior);
};
