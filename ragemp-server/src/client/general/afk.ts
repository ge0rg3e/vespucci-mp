import { interfacesOpened, loggedIn } from '@client/natives/interfaces';

// Variables
const player = mp.players.local;
let lastAfkStatus = false;

// We will update this once a second to know where they're at so we can compare for differences.
let lastPos: ExpectedAny = {
	camera: mp.cameras.new('gameplay').getCoord(),
	mouse: mp.gui.cursor.visible ? mp.gui.cursor.position : null,
	player: player.position
};

const checkPlayerAFKActivity = () => {
	try {
		// He's not yet logged in. We don't check yet.
		if (!loggedIn) return;

		// Dependencies
		const newPos: ExpectedAny = {
			camera: mp.cameras.new('gameplay').getCoord(),
			mouse: mp.gui.cursor.visible ? mp.gui.cursor.position : null,
			player: player.position
		};

		// Has the player moved his cursor? We learn that by checking the mp.gui.cursor.position which returns the position of the mouse from the user's screen.
		const mouseMoved = lastPos.mouse && newPos.mouse ? (newPos.mouse[0] !== lastPos.mouse[0] || newPos.mouse[1] !== lastPos.mouse[1] ? true : false) : false;

		// We now will check if the player's position in the world has changed.
		const poses = { l: lastPos.player, n: newPos.player };
		const distance = mp.game.gameplay.getDistanceBetweenCoords(poses.l.x, poses.l.y, poses.l.z, poses.n.x, poses.n.y, poses.n.z, true);
		const playerMoved = distance > 1 ? true : false;

		// Is he a passenger?
		const inVehiclePasssenger = player.vehicle && !player.vehicle.getPedInSeat(-1);

		// We will now check if they've changed their camera at least?
		const hasCameraMoved = newPos.camera.x !== lastPos.camera.x || newPos.camera.y !== lastPos.camera.y || lastPos.camera.z !== newPos.camera.z;

		// This function will now decide if the player is AFK or not..
		const state = isAFK({ hasCameraMoved, playerMoved, mouseMoved, inVehiclePasssenger });

		// We now will update the "lastPos known"
		lastPos = newPos;

		// If he was active and now he's still active we don't need to spam the server with 'he's active!!'
		if (lastAfkStatus === false && state === false) return;

		// We inform the server about his status now.
		mp.events.callRemote(`awayFromKeyboard:${state ? 'active' : 'inactive'}`);

		// We update this last afk status
		lastAfkStatus = state;
	} catch (err: ExpectedAny) {
		mp.console.logError(`ERROR AFK CHECKER: ${err.message}`);
	}
};

const isAFK = (factors: FixableAny) => {
	// If the player is moving in-game and is not a passenger.
	if (factors.playerMoved && !factors.inVehiclePasssenger) return false;

	// Interfaces that are NOT considered AFK Worthy.
	const invalidInterfaces = [
		// RAGE:MP NAtives
		'gameConsole',
		'rageBrowser',
		// HUD Elements
		'dialog',
		'chat',
		// Other systems that are not considered afk worthy..
		'hideHud',
		'testDriveBlankScreen'
	];

	// Interfaces that are considered AFK Worthy.
	const interfaces = interfacesOpened.filter((e: ExpectedAny) => !invalidInterfaces.includes(e));

	// If they moved their mouse and is in an interface
	if (factors.mouseMoved && interfaces.length > 0) return false;

	// If he moved his camera around aka he looked around the camera
	if (factors.hasCameraMoved) return false;

	// IF none of the above..
	return true;
};

// We set the interval now..
setInterval(checkPlayerAFKActivity, 1000);
