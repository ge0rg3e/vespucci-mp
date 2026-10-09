import * as rpc from 'rage-rpc';

const player = mp.players.local;

export const getMovementClipsetBasedOnLevel = (level: number) => {
	if (level > 30) {
		return `MOVE_M@DRUNK@MODERATEDRUNK`;
	} else if (level > 60) {
		return `MOVE_M@DRUNK@VERYDRUNK`;
	} else {
		return `MOVE_M@DRUNK@SLIGHTLYDRUNK`;
	}
};

export function hasElapsedSeconds(date: Date, seconds: number) {
	// Get the current time in milliseconds since Jan 1, 1970 (Unix timestamp)
	const currentTime = Date.now();

	// Get the input date in milliseconds since Jan 1, 1970 (Unix timestamp)
	const inputTime = date.getTime();

	// Calculate the difference in seconds between current time and input time
	const elapsedSeconds = (currentTime - inputTime) / 1000;

	// Compare with the provided seconds
	return elapsedSeconds >= seconds;
}

// Variables
let lastFall: ExpectedAny = null;
let lastBlackout: ExpectedAny = null;

export const makePlayerFallRandomly = () => {
	// Check if we falling..
	const chanceOfFall = player.isRunning() ? 0.3 : 0.05; // 30% or 5% chance
	const isFalling = Math.random() <= chanceOfFall;
	const isMoving = player.isWalking() || player.isRunning() ? true : false;

	if (!isFalling || !isMoving) return false;

	if (lastFall && !hasElapsedSeconds(lastFall, 180)) return false;

	// Make him fall..
	player.setToRagdoll(3000, 3000, 0, false, false, false);

	lastFall = new Date();
};

export const makePlayerHaveRandomBlackouts = async () => {
	const chanceOfBlackout = 0.05; // 5%
	const hasBlackOut = Math.random() <= chanceOfBlackout;

	if (!hasBlackOut) return false; //not this time.

	// Check
	if (lastBlackout && !hasElapsedSeconds(lastBlackout, 480)) return false;

	lastBlackout = new Date();

	if (!player.vehicle) {
		// Fall
		player.setToRagdoll(4500, 4500, 0, false, false, false);
	}

	// hide
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: true }));

	// Black
	mp.game.cam.doScreenFadeOut(800);

	// Let him see..
	setTimeout(() => {
		mp.game.cam.doScreenFadeIn(1000);
		rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));
	}, 3000);

	return true;
};
