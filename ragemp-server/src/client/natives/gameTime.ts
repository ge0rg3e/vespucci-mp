import * as rpc from 'rage-rpc';

export let currentGameTime = {
	hour: 12,
	minutes: 0
};

let customGameHour: ExpectedAny | number = null;
let timerIntervalId: ExpectedAny = null;

const timePassing = async () => {
	// Adding an minute..
	currentGameTime.minutes++;

	// 60 Minutes passed
	if (currentGameTime.minutes >= 60) {
		// Adding an hour
		currentGameTime.hour++;

		// Resetting minutes
		currentGameTime.minutes = 0;
	}

	// 24 hours passed
	if (currentGameTime.hour > 23 && currentGameTime) {
		// Resetting the day
		currentGameTime.hour = 0;
	}

	// Setting the in-game time.
	// If they set a custom game hour we will display that in-game hour otherwise the normal one

	if (customGameHour !== null) {
		mp.game.time.setClockTime(customGameHour, 0, 0);
	} else {
		mp.game.time.setClockTime(currentGameTime.hour, currentGameTime.minutes, 0);
	}
};

rpc.on('setGameTimePassing', async (args: string) => {
	const { SECONDS_TO_MINUTES_IN_GAME, currentServerGameTime } = JSON.parse(args);

	currentGameTime = currentServerGameTime;

	// If the timer has never been initiated let's intiate it.
	if (timerIntervalId === null) {
		timerIntervalId = setInterval(timePassing, SECONDS_TO_MINUTES_IN_GAME);
	}
});

rpc.register(`getGameClientTime`, async () => currentGameTime);

rpc.on(`setCustomGameHour`, (args: string) => {
	const { hour } = JSON.parse(args);
	customGameHour = hour;
});
