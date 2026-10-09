import { getAspectRatioFormatted, loadMinimap } from './functions';

// When they enter in-game
loadMinimap();

// Whenever resolution is changed we need to re-calculate.

let initRes = mp.game.graphics.getScreenActiveResolution(0, 0);
let lastResolution = `${initRes.x}x${initRes.y}`;
let lastRatio = getAspectRatioFormatted();

setInterval(() => {
	const res = mp.game.graphics.getScreenActiveResolution(0, 0);
	const rat = getAspectRatioFormatted();

	if (lastResolution === `${res.x}x${res.y}` && rat === lastRatio) return false;

	// Resolution changed. let's redo the minimap to calculate padding right.
	loadMinimap(null);

	lastResolution = `${res.x}x${res.y}`;
	lastRatio = rat;

	return false;
}, 5000);
