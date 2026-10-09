import { waitForObjectToStreamIn } from '@client/utils/events';
import * as rpc from 'rage-rpc';

// Variables..
let cam: CameraMp | null = null;
const player = mp.players.local;
let simulatedObject: ExpectedAny = null;
let activeTargetBone = 'body';
let cameraPos: ExpectedAny = null;

rpc.on('charCreator:SetInitialScene', async () => {
	// Loading ipl
	mp.game.streaming.requestIpl(`ex_dt1_02_office_01c`);
	const int = mp.game.interior.getInteriorAtCoords(pedCoords.x, pedCoords.y, pedCoords.z);
	mp.game.interior.refreshInterior(int);

	// Clear the game focus from the "setCameraFocusAt" from Welcome.
	mp.game.streaming.clearFocus();

	// Remove blur
	mp.game.graphics.setTimecycleModifier('default');

	// Preparations
	player.freezePosition(false);
	player.setVisible(true, true);

	// Spawn the player in the initial location where the char creator starts
	player.setCoords(-128.606, -631.25, 167.82, true, false, false, false);
	player.freezePosition(true);

	player.setHeading(95.106);

	// Create camera to preview the ped..
	setCamera('body');

	// Wait 500 ms to load map ipls to not fall down (happened once?)
	setTimeout(() => player.freezePosition(false), 500);
	await mp.game.waitAsync(500);

	// Start walking to the location of the room
	player.taskGoStraightToCoord(pedCoords.x, pedCoords.y, pedCoords.z, 1.4, 3500, pedCoords.heading, 0);

	// Creating the famous chair for camera zooms
	simulatedObject = mp.objects.new(mp.game.joaat('apa_mp_h_stn_chairarm_23'), new mp.Vector3(pedCoords.x, pedCoords.y, pedCoords.z), {
		rotation: new mp.Vector3(0, 0, pedCoords.heading),
		alpha: 0,
		dimension: player.dimension
	});
	simulatedObject.notifyStreaming = true; // @Bugfix: Needed otherwise stream event not triggered.

	// Wait for the object to be created
	await waitForObjectToStreamIn(simulatedObject.id, false);

	// Set no collision..
	simulatedObject.setCollision(false, false);
});

const setCamera = (bone: string) => {
	const oldCam: CameraMp | null = cam ? cam : null;

	cam = mp.cameras.new(
		'default',
		new mp.Vector3(cameraCoords.body.coords.x, cameraCoords.body.coords.y, cameraCoords.body.coords.z),
		new mp.Vector3(cameraCoords.body.rotation.x, cameraCoords.body.rotation.y, cameraCoords.body.rotation.z),
		35
	);
	cam.setActive(true);
	mp.game.cam.renderScriptCams(true, true, 800, true, false, 0);

	// Saving camera pos for zooms
	cameraPos = { x: cameraCoords.body.coords.x, y: cameraCoords.body.coords.y, z: cameraCoords.body.coords.z };

	// Set bone
	activeTargetBone = bone;

	if (oldCam !== null) {
		// Changing the zoom level..
		zoomsIn = CAMERA_ZOOM_DEFAULT;
		changeZoomLevel(JSON.stringify({ zoomedIn: true }));
	}

	// If there is a point at..
	if (bone !== 'body') {
		// If he's creating cam for head..
		if (bone === 'head') {
			// Get current player pos
			const { x, y, z } = simulatedObject.getOffsetFromInWorldCoords(0, 0, 0.65);

			// Set cam
			cam.setCoord(x, y, z); // z is the right height.

			// Saving camera pos for zooms
			cameraPos = { x, y, z };

			// Changing the zoom level..
			zoomsIn = 1.4;
			changeZoomLevel(JSON.stringify({ zoomedIn: false }));
		}
	}

	if (oldCam) {
		oldCam?.destroy();
	}
};

const changeZoomLevel = async (args: string) => {
	if (!simulatedObject || !cam) return false;
	const { zoomedIn } = JSON.parse(args);

	const MIN_ZOOM_IN = activeTargetBone === 'body' ? 1.6 : activeTargetBone === 'head' ? 0.65 : 1.0;
	const MAX_ZOOM_OUT = 4.2; // when you scroll far away from the body
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

rpc.on('charCreator:pointCamera', async (args) => {
	if (!cam) return;

	const { target } = JSON.parse(args);

	if (target === activeTargetBone) return; // No point in changing the camera now.

	// Change the camera acordidngly..
	setCamera(target);
});

rpc.on('charCreator:onZoom', changeZoomLevel);

rpc.on('charCreator:onRotation', async (args) => {
	const { newAngle } = JSON.parse(args);
	player.setHeading(newAngle);
});

rpc.on('charCreator:DestroyInitialScene', async () => {
	// Destroy the object..
	if (simulatedObject) {
		simulatedObject.destroy();
	}

	// Remove the ipl loaded..
	mp.game.streaming.requestIpl('ex_dt1_02_office_01c');
});

// Variables needed by the code..

const cameraCoords = {
	body: {
		coords: {
			x: -131.86765, // dreapta stanga camera (mai mult mai spre stanga)
			y: -636.804992, // fata spate
			z: 168.98228454589844
		},
		rotation: {
			x: -0.10582665354013443,
			y: 0.99392169713974,
			z: -0.03033742494881153
		}
	}
};

const pedCoords = {
	x: -131.501,
	y: -632.621, // fata
	z: 168.82,
	heading: -185
};

const CAMERA_ZOOM_DEFAULT = 4.2;
let zoomsIn = CAMERA_ZOOM_DEFAULT;
