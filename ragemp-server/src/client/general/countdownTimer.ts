import * as rpc from 'rage-rpc';

// Timeouts
let intervalTimerId: UndefinedAny = null;

// Variables
let startCount: number;
let active = false;

mp.events.add('render', () => {
	// draw countdown timer
	if (active) {
		mp.game.graphics.drawText(`${startCount}`, [0.5, 0.05], {
			font: 7,
			color: [255, 255, 255, 255],
			scale: [2.0, 2.0],
			outline: true
		});
	}
});

/** Timer with sound and screen text for [time] seconds, return true when finish */
async function startTimer(time: number) {
	if (time === 0) return;

	// Set as true..
	active = true;

	// Set number..
	startCount = time;

	// If count starst with 5..
	if (startCount === 5) mp.game.audio.playSoundFrontend(-1, '5s', 'MP_MISSION_COUNTDOWN_SOUNDSET', true); // if time is 5 seconds, start the sound effect

	// If there's an interval..
	if (intervalTimerId !== null) {
		// Clear
		clearInterval(intervalTimerId);

		// Reset variable
		intervalTimerId = null;
	}

	intervalTimerId = setInterval(() => {
		startCount--;

		// if the time was more than 5 seconds, it will start the sound when it reaches 5.
		if (startCount === 5) mp.game.audio.playSoundFrontend(-1, '5s', 'MP_MISSION_COUNTDOWN_SOUNDSET', true);

		// If count is now zero..
		if (startCount === 0) {
			// If there's an interval..
			if (intervalTimerId !== null) {
				// Clear
				clearInterval(intervalTimerId);

				// Reset variable
				intervalTimerId = null;
			}

			active = false;
			mp.game.graphics.startScreenEffect('MP_SmugglerCheckpoint', 1000, false);
		}
	}, 1000);
}

rpc.on('showCountdownTimer', (args) => {
	const { number } = JSON.parse(args);
	startTimer(number);
});
