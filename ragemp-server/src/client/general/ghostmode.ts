import { interfaceHidden } from '@client/legacy/hideHud';
import { interfacesOpened } from '@client/natives/interfaces';
import { getPlayerVariable } from '@client/utils/helpers';
import * as rpc from 'rage-rpc';

const player = mp.players.local;
let ghostCamera: CameraMp | null;

const getNormalizedVector = (vector: Vector3) => {
	const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);

	vector.x = vector.x / mag;
	vector.y = vector.y / mag;
	vector.z = vector.z / mag;
	return vector;
};

const getCrossProduct = (v1: Vector3, v2: Vector3) => {
	const vector = new mp.Vector3(0, 0, 0);
	vector.x = v1.y * v2.z - v1.z * v2.y;
	vector.y = v1.z * v2.x - v1.x * v2.z;
	vector.z = v1.x * v2.y - v1.y * v2.x;
	return vector;
};

rpc.on('setGhostmode', (args) => {
	const { ghostmode } = JSON.parse(args);

	const ghostCamposition = new mp.Vector3(player.position.x, player.position.y, player.position.z);
	const ghostCamRot = mp.game.cam.getGameplayCamRot(2);

	ghostCamera = mp.cameras.new('default', ghostCamposition, ghostCamRot, 40);
	ghostCamera.setActive(ghostmode);
	mp.game.cam.renderScriptCams(ghostmode, false, 0, ghostmode, false, 0);
	player.freezePosition(ghostmode);

	// Get variable..
	const isGodmode = getPlayerVariable(player.remoteId, `godmode`);

	// Is in ghost mode
	if (!isGodmode) player.setInvincible(ghostmode);

	if (ghostmode === false && ghostCamera) {
		player.position = ghostCamera.getCoord();
		player.setHeading(ghostCamera.getRot(2).z);
		ghostCamera.destroy(true);
		ghostCamera = null;
	}
});

const KEY_SHIFT = 16;

mp.events.add('render', () => {
	if (interfacesOpened.length > 0 && interfaceHidden === false) return false;
	if (ghostCamera) {
		if (mp.game.ui.isPauseMenuActive()) return false;
		let speedY = 1;
		let speedX = 0.5;

		if (mp.keys.isDown(KEY_SHIFT)) {
			speedY = 3;
		}
		if (mp.keys.isDown(18)) {
			speedY = 0.1;
			speedX = 0.05;
		}

		const rot = ghostCamera!.getRot(2);
		const rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);
		const rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);
		const leftAxisX = mp.game.controls.getDisabledControlNormal(0, 218);
		const leftAxisY = mp.game.controls.getDisabledControlNormal(0, 219);
		const position = ghostCamera!.getCoord();
		const direction = ghostCamera!.getDirection();
		const vector = new mp.Vector3(direction.x * leftAxisY * speedY, direction.y * leftAxisY * speedY, direction.z * leftAxisY * speedY);
		player.heading = direction.z;
		const upVector = new mp.Vector3(0, 0, 1);
		const rightVector = getCrossProduct(getNormalizedVector(direction), getNormalizedVector(upVector));

		rightVector.x *= leftAxisX * speedX;
		rightVector.y *= leftAxisX * speedX;
		rightVector.z *= leftAxisX * speedX;

		player.position = new mp.Vector3(position.x + vector.x + 1, position.y + vector.y + 1, position.z + vector.z + 1);

		ghostCamera!.setCoord(position.x - vector.x + rightVector.x, position.y - vector.y + rightVector.y, position.z - vector.z + rightVector.z);

		ghostCamera!.setRot(rot.x + rightAxisY * -5.0, 0.0, rot.z + rightAxisX * -5.0, 2);
	}

	return true;
});

rpc.register('getCamPos', () => {
	const direction = ghostCamera?.getRot(2);
	const coords = ghostCamera?.getCoord();

	return [direction, coords];
});

rpc.on('ghost:setCamPos', (args) => {
	const { direction, coords } = JSON.parse(args);
	ghostCamera!.setCoord(coords.x, coords.y, coords.z);
	ghostCamera!.setRot(direction.x, direction.y, direction.z, 2);
});

rpc.on('setGhostCameraPos', (args) => {
	const { x, y, z } = JSON.parse(args);

	ghostCamera!.setCoord(x, y, z);
});
