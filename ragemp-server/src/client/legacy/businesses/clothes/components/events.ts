import { setInterfaceInCooldown, setInterfaceIsOpened } from '@client/natives/interfaces';
import * as rpc from 'rage-rpc';
import gameHashes from '@client/utils/gameHashes';
import { waitForObjectToStreamIn } from '@client/utils/events';
import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';

// Variables
let cam: UndefinedAny = null;
let tempCam: UndefinedAny = null;

const player = mp.players.local;
const CAMERA_ZOOM_DEFAULT = 4;

const bones: Record<string, number> = {
	body: 56604,
	foot: 35502,
	head: 12844
};

let simulatedObject: ExpectedAny = null;
let cameraPos: ExpectedAny = null;
let activeTargetBone: ExpectedAny = null;
let defaultRotation: ExpectedAny = null;

rpc.on('clothesBusines:SetScene', async (args: string) => {
	const { position, heading } = JSON.parse(args);

	// Clearing tasks for smooth walking in.
	player.clearTasksImmediately();

	// Mark it as an interface..
	setInterfaceIsOpened('clothesStore', true);

	// Hide the game hud and most native stuff.
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));
	mp.game.ui.displayHud(false);
	mp.game.ui.displayRadar(false);

	// Show cursor
	setCursorVisible(`business:clothesStore`, true);
	setControlsDisabled(`business:clothesStore`, true);

	// A few tweaks to the player himself..
	player.setInvincible(true);

	// @Reminder: This ped is created so we can use it for the camera tricks :)
	simulatedObject = mp.objects.new(mp.game.joaat('apa_mp_h_stn_chairarm_23'), position, {
		rotation: new mp.Vector3(0, 0, heading),
		alpha: 0,
		dimension: player.dimension
	});

	simulatedObject.notifyStreaming = true; // @Bugfix: Needed otherwise stream event not triggered.

	// Wait for the object to be created
	await waitForObjectToStreamIn(simulatedObject.id, false);

	// Set no collision..
	simulatedObject.setCollision(false, false);

	// Get current player pos
	const objPos = simulatedObject.getOffsetFromInWorldCoords(0, CAMERA_ZOOM_DEFAULT, 0); // 3 meters in front of the player position. (x = stanga, dreapta, y = fata / spate, z = sus , jos)

	// Bone pos
	const bonePos = player.getBoneCoords(bones.head, 0, 0, 0);

	// Saving camera pos
	cameraPos = { x: objPos.x, y: objPos.y, z: bonePos.z };
	activeTargetBone = 'body';

	// Create camera..
	mp.game.cam.destroyAllCams(true);
	cam = mp.cameras.new('default', new mp.Vector3(cameraPos.x, cameraPos.y, cameraPos.z), new mp.Vector3(0, 0, 0), 35);
	cam.setActive(true);

	// Start walking
	player.taskGoStraightToCoord(position.x, position.y, position.z, 1.4, 1500, heading, 0.5);

	// Point camera to his body..
	cam.pointAtPedBone(mp.players.local.handle, bones.body, 0, 0, 0, true);
	mp.game.cam.renderScriptCams(true, true, 800, true, false, 0);
});

rpc.on('clothesBusiness:PointCamera', async (args) => {
	if (!cam) return false;

	const { target } = JSON.parse(args);

	if (target === 'foot') {
		const camBonePos = player.getBoneCoords(bones['foot'], 0, 0, 0);
		cam.pointAtCoord(camBonePos.x, camBonePos.y, camBonePos.z);
	} else {
		cam.pointAtPedBone(mp.players.local.handle, bones[target], 0, 0, 0, true);
	}

	const targetChanged = activeTargetBone !== target;

	if (targetChanged) {
		// If it wasn't head , but now it is we need to change the zoom
		if (target === 'body' && activeTargetBone !== 'body') {
			zoomsIn = CAMERA_ZOOM_DEFAULT;
			changeZoomLevel(JSON.stringify({ zoomedIn: true }));
		}

		// If is now head let's zoom in.
		if (target === 'head' || target == 'foot') {
			zoomsIn = 1.1;
			changeZoomLevel(JSON.stringify({ zoomedIn: false }));
		}
		activeTargetBone = target;
	}
	return true;
});

rpc.on('clothesBusiness:SetCameraFov', async (args) => {
	const { value } = JSON.parse(args);
	if (!cam) return false;
	cam.setFov(value);

	return true;
});

rpc.on('clothesBusiness:SetDefaultRotation', async (args) => {
	const { value } = JSON.parse(args);
	defaultRotation = value;
});

rpc.register('clothesBusiness:GetDefaultRotation', () => defaultRotation);

rpc.on('clothesBusiness:RotatePed', async (args) => {
	const { newAngle } = JSON.parse(args);
	player.setHeading(newAngle);
});

let zoomsIn = CAMERA_ZOOM_DEFAULT;

const changeZoomLevel = async (args: string) => {
	if (!simulatedObject) return false;
	const { zoomedIn } = JSON.parse(args);

	const MIN_ZOOM_IN = activeTargetBone === 'body' ? 1.6 : 1.0;
	const MAX_ZOOM_OUT = 4; // when you scroll far away from the body
	if (zoomedIn && zoomsIn - 0.1 < MIN_ZOOM_IN) return false;
	if (!zoomedIn && zoomsIn + 0.1 > MAX_ZOOM_OUT) return false;

	if (zoomedIn) {
		zoomsIn -= 0.1;
	} else {
		zoomsIn += 0.1;
	}

	// Get current player pos
	const { x, y } = simulatedObject.getOffsetFromInWorldCoords(0, zoomsIn, 0); // 3 meters in front of the player position. (x = stanga, dreapta, y = fata / spate, z = sus , jos)

	cam.setCoord(x, y, cameraPos.z); // z is the right height.

	// Saving camera pos
	cameraPos = { x, y, z: cameraPos.z };
	return true;
};

rpc.on('clothesBusiness:Zoom', changeZoomLevel);

rpc.on('clothesBusines:DestroyScene', async () => {
	if (!simulatedObject) return false;

	// Destroy cameras
	mp.game.cam.destroyAllCams(true);
	mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);

	// Saving this for later
	const { x, y } = simulatedObject.getOffsetFromInWorldCoords(0, -1.1, 0); // the with x: 0 is just in case of bug. // 3 meters in front of the player position. (x = stanga, dreapta, y = fata / spate, z = sus , jos)
	const bonePos = player.getBoneCoords(bones.head, 0, 0, 0);
	const camPos = { x, y, z: bonePos.z + 0.7 };

	// Make temporary camera for nice fade out
	const camTimeout = 1500;
	tempCam = mp.cameras.new('default', new mp.Vector3(camPos.x, camPos.y, camPos.z), new mp.Vector3(0, 0, 0), 35);
	tempCam.setActive(true);
	tempCam.pointAtPedBone(mp.players.local.handle, bones.head, 0, 0, 0, true);
	mp.game.cam.renderScriptCams(true, true, camTimeout, true, false, 0);

	// destroy camera after
	setTimeout(() => {
		mp.game.cam.destroyAllCams(true);
		mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);
		// Reset camera to set it behind player..
		mp.game.cam.setFollowPedCamViewMode(0); // just to make sure it's close.
		mp.game.invoke(gameHashes.SET_GAMEPLAY_CAM_RELATIVE_HEADING, 0);
	}, camTimeout);

	// Destroy simulated object
	if (simulatedObject) {
		simulatedObject.destroy();
		simulatedObject = null;
	}

	// Mark it as an interface..
	setInterfaceIsOpened('clothesStore', false);

	// Show game hud and most native stuff.
	rpc.triggerBrowsers('toasts:clear'); // Hide toasts.
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));
	mp.game.ui.displayHud(true);
	mp.game.ui.displayRadar(true);

	// Hide cursor
	setCursorVisible(`business:clothesStore`, false);
	setControlsDisabled(`business:clothesStore`, false);

	// A few tweaks to the player himself..
	player.setInvincible(false);

	// // Set default heading
	player.setHeading(defaultRotation);

	// Hide interface
	rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/` }));

	return true;
});

// Disabling props knocking off.

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const SetPedCanLosePropsOnDamage = `0xe861d0b05c7662b8`;

mp.events.add('playerReady', () => {
	// Make sure the player itself is not gonna lose his props.
	mp.game.invoke(SetPedCanLosePropsOnDamage, player.handle, false, 0);
});

mp.events.add('entityStreamIn', async (entity: PlayerMp) => {
	if (entity.type !== 'player') return;
	mp.game.invoke(SetPedCanLosePropsOnDamage, entity.handle, false, 0);
});
