import * as rpc from 'rage-rpc';
import { isButtonUsedByDialog } from './dialogs';
import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
const player = mp.players.local;
let spectateCamera: CameraMp | null;
let spectateTarget: PlayerMp | null;
export let playerBelt = false;
const M_KEY = 0x4d;

const frozenBySystems: string[] = [];

const houseDoors = [
	{ model: 520341586, x: -14.86892, y: -1441.182, z: 31.19323, locked: true }, // First Franklin House Door
	{ model: 703855057, x: -25.2784, y: -1431.061, z: 30.83955, locked: true }, // First Franklin Garage Door
	{ model: 308207762, x: 8.14589, y: 539.31274, z: 175.73341, locked: true }, // Franklin Vinewood House Door
	{ model: 2052512905, x: 20.06253, y: 548.999816, z: 175.81085, locked: true }, // Franklin Vinewood Garage Door
	{ model: 2608952911, x: -816.37762, y: 177.86744, z: 72.15924, locked: true }, // Michael's House Door Right
	{ model: 159994461, x: -816.98681, y: 179.454544, z: 72.15924, locked: true }, // Michael's House Door Left
	{ model: 1245831483, x: -794.97314, y: 177.691772, z: 72.84523, locked: true }, // Michael's House Back Door 1 Right
	{ model: 2840207166, x: -797.03399, y: 176.90065, z: 72.84523, locked: true }, // Michael's House Back Door 1 Left
	{ model: 1245831483, x: -793.86468, y: 182.09999, z: 72.84523, locked: true }, // Michael's House Back Door 2 Right
	{ model: 2840207166, x: -793.0736, y: 180.039108, z: 72.84523, locked: true } // Michael's House Back Door 2 Left
];

houseDoors.forEach(async (door) => {
	const { model, x, y, z, locked } = door;

	if (!mp.game.object.doesDoorExist(model)) {
		mp.game.object.addDoorToSystem(model, model, x, y, z, false, false, false);
	}

	mp.game.object.doorControl(model, x, y, z, locked, 0, 0, 0);
});

rpc.on(`setGodmode`, (args) => {
	const { toggle } = JSON.parse(args);

	player.setCanBeDamaged(!toggle);
});

rpc.on('showMinimap', (args) => {
	const { show } = JSON.parse(args);

	mp.game.ui.displayRadar(show);
});

rpc.on(`updateDiscordStatus`, (args) => {
	const { actionText } = JSON.parse(args);

	mp.discord.update('VESPUCCI.MP', actionText);
});

rpc.on('setFreeze', (args) => {
	const { systemId, toggle } = JSON.parse(args);

	const frozenBySystemIndex = frozenBySystems.findIndex((f) => f === systemId);

	if (frozenBySystemIndex === -1 && toggle) {
		frozenBySystems.push(systemId);
	} else if (frozenBySystemIndex !== -1 && !toggle) {
		frozenBySystems.splice(frozenBySystemIndex, 1);
	}
});

mp.events.add('render', () => {
	const isFrozenByAnySystem = frozenBySystems.length > 0;

	if (isFrozenByAnySystem) {
		mp.game.controls.disableAllControlActions(0);
		mp.game.controls.disableAllControlActions(1);
		mp.game.controls.disableAllControlActions(2);
	}
});

rpc.on(`setTimecycleModifier`, (args) => {
	const { val } = JSON.parse(args);
	mp.game.graphics.setTimecycleModifier(val);
});

rpc.on(`startScreenEffect`, (args) => {
	const { val, seconds, looped } = JSON.parse(args);
	mp.game.graphics.startScreenEffect(val, seconds * 1000, looped);
});

rpc.register(`getMinimapAnchor`, () => {
	const sfX = 1.0 / 20.0;
	const sfY = 1.0 / 20.0;
	const safeZone = mp.game.graphics.getSafeZoneSize();
	const aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
	const resolution = mp.game.graphics.getScreenActiveResolution(0, 0);

	const scaleX = 1.0 / resolution.x;
	const scaleY = 1.0 / resolution.y;

	const minimap: Record<string, ExpectedAny> = {
		width: scaleX * (resolution.x / (4 * aspectRatio)),
		height: scaleY * (resolution.y / 5.674),
		scaleX: scaleX,
		scaleY: scaleY,
		leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
		bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10)))
	};

	minimap.rightX = minimap.leftX + minimap.width;
	minimap.topY = minimap.bottomY - minimap.height;

	return minimap;
});

rpc.on('spectatePlayer', (args) => {
	const { type, targetId } = JSON.parse(args);
	spectateTarget = targetId !== null ? mp.players.atRemoteId(targetId) : null;

	player.freezePosition(type);

	if (type) {
		spectateCamera = mp.cameras.new('default', new mp.Vector3(spectateTarget!.position.x, spectateTarget!.position.y, spectateTarget!.position.z), mp.game.cam.getGameplayCamRot(0), 80);
		spectateCamera!.setActive(true);
	} else {
		spectateCamera!.setActive(false);
		spectateCamera?.destroy();
		spectateCamera = null;
	}

	mp.game.cam.renderScriptCams(type, false, 0, type, false, 0);
});

mp.events.add('playerQuit', (player) => {
	if (player === spectateTarget && spectateCamera) {
		spectateCamera.setActive(false);
		spectateCamera.destroy();
		spectateCamera = null;
		spectateTarget = null;
		mp.game.cam.renderScriptCams(false, false, 0, false, false, 0);
		mp.players.local.freezePosition(false);
		mp.players.local.setCollision(true, false);

		rpc.callServer('unSpectatePlayer');
	}
});

mp.events.add('render', () => {
	// Spectate
	if (spectateCamera) {
		if (spectateTarget?.vehicle) {
			spectateCamera.attachTo(spectateTarget!.handle, 0, -6, 2.5, true);
		} else {
			spectateCamera.attachTo(spectateTarget!.handle, 0, -2.5, 1, true);
		}

		const targetRotation = spectateTarget!.vehicle ? spectateTarget!.vehicle.getRotation(5) : spectateTarget!.getRotation(5);

		spectateCamera!.setRot(targetRotation!.x, targetRotation!.y, targetRotation!.z, 2);
	}
});

const updateBelt = (state: boolean) => {
	playerBelt = state;
	player.setConfigFlag(32, state);
	rpc.triggerServer('onBeltUpdate', JSON.stringify({ state }));
};

rpc.register('getBeltStatus', () => playerBelt);

mp.keys.bind(M_KEY, true, () => {
	if (isButtonUsedByDialog('M') || !loggedIn || interfacesOpened.length > 0 || !player.vehicle) return;

	updateBelt(!playerBelt);

	return true;
});

mp.events.add('patched:playerLeaveVehicle', () => {
	if (playerBelt) {
		updateBelt(false);
	}
});

rpc.on('loadIpls', (args) => {
	const { ipls } = JSON.parse(args);

	ipls.forEach(async (ipl: string) => mp.game.streaming.requestIpl(ipl));
});

rpc.on('removeIpls', (args) => {
	const { ipls } = JSON.parse(args);

	ipls.forEach(async (ipl: string) => mp.game.streaming.removeIpl(ipl));
});

rpc.register('isInteriorPropLoaded', (args) => {
	const { prop, x, y, z } = JSON.parse(args);
	const intId = mp.game.interior.getInteriorAtCoords(x, y, z);
	const check = mp.game.interior.isInteriorPropEnabled(intId, prop);
	return check;
});

rpc.on('refreshInteriorAt', (args) => {
	const { x, y, z } = JSON.parse(args);
	const intId = mp.game.interior.getInteriorAtCoords(x, y, z);
	mp.game.interior.refreshInterior(intId);
});

rpc.on('loadInteriorProps', (args) => {
	const { props, x, y, z } = JSON.parse(args);
	const intId = mp.game.interior.getInteriorAtCoords(x, y, z);
	props.forEach(async (ent: string) => mp.game.interior.enableInteriorProp(intId, ent));
	mp.game.interior.refreshInterior(intId);
});

rpc.on('removeInteriorProps', (args) => {
	const { props, x, y, z } = JSON.parse(args);
	const intId = mp.game.interior.getInteriorAtCoords(x, y, z);
	props.forEach(async (ent: string) => mp.game.interior.disableInteriorProp(intId, ent));
	mp.game.interior.refreshInterior(intId);
});

rpc.on(`refreshInteriorProps`, (args) => {
	const { x, y, z } = JSON.parse(args);
	const intId = mp.game.interior.getInteriorAtCoords(x, y, z);
	mp.game.interior.refreshInterior(intId);
});

rpc.register('getGroundZPosition', (args) => {
	const { position } = JSON.parse(args);
	return mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
});

rpc.register(`getOffsetFromInWorldCoords`, (args) => {
	const { x, y, z } = JSON.parse(args);
	return player.getOffsetFromInWorldCoords(x, y, z);
});

rpc.on('putVehicleOnGround', (args: ExpectedAny) => {
	const { vehicleId } = JSON.parse(args);

	if (!mp.vehicles.atRemoteId(vehicleId)) return false;

	mp.vehicles.atRemoteId(vehicleId).setOnGroundProperly();

	return false;
});

rpc.on(`brakeVehicle`, async (args) => {
	const { time } = JSON.parse(args);
	if (!player.vehicle) return;
	await player.taskVehicleTempAction(player.vehicle.handle, 24, time);
});

rpc.on(`taskLeaveVehicle`, () => {
	if (!player.vehicle) return false;
	player.taskLeaveVehicle(player.vehicle.handle, 0);
	return true;
});

rpc.register(`setLoadingScreen`, async (args) => {
	const { boolean } = JSON.parse(args);

	if (boolean === true) {
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));
		mp.game.cam.doScreenFadeOut(400);
		await mp.game.waitAsync(400);
	} else {
		mp.game.cam.doScreenFadeIn(1200);
		await mp.game.waitAsync(400);
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));
	}

	return true;
});

rpc.register('isPlayerInWater', () => {
	const check = mp.players.local.isInWater();
	return check;
});

rpc.register('isPlayerInAir', () => {
	const check = mp.players.local.isInAir();
	return check;
});

// This will disable the ambient sounds of the game.

const disableAmbientSounds = () => {
	mp.game.audio.startAudioScene('DLC_MPHEIST_TRANSITION_TO_APT_FADE_IN_RADIO_SCENE');
	mp.game.audio.startAudioScene('DLC_MPHEIST_TRANSITION_TO_APT_FADE_IN_RADIO_SCENE');
	mp.game.audio.setStaticEmitterEnabled('LOS_SANTOS_VANILLA_UNICORN_01_STAGE', false);
	mp.game.audio.setStaticEmitterEnabled('LOS_SANTOS_VANILLA_UNICORN_02_MAIN_ROOM', false);
	mp.game.audio.setStaticEmitterEnabled('LOS_SANTOS_VANILLA_UNICORN_03_BACK_ROOM', false);
	mp.game.audio.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Disabled_Zones', false, true);
	mp.game.audio.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Zones', true, true);
	mp.game.audio.startAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE');
	mp.game.audio.startAudioScene('CHARACTER_CHANGE_IN_SKY_SCENE');
	mp.game.audio.setAudioFlag('PoliceScannerDisabled', true);
	mp.game.audio.setAudioFlag('DisableFlightMusic', true);
};

disableAmbientSounds();
