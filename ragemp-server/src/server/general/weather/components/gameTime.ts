// Variables

import { getServerTime } from '@server/utils/helpers';

export const SECONDS_TO_MINUTES_IN_GAME = 3600; // How many seconds in real life will amount to a minute in game.

// How to calculate a different duration for a day:
// Formula to calculate another second to minutes in-game: 2 * 60 * 24
// Explanation: 2 seconds * 60 minutes * 24 hours = 48 minutes.
// Example calc: 2 * 60 * 24 = (google this) {result} seconds to minutes = how many minutes for a day.)

export const currentGameTime = {
	hour: getServerTime().hour, // defaults to server launching hour.
	minutes: getServerTime().minutes
};

export let daysCountUntilNextWeather = 0;

// Function

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

		// Increasing the count to change weather in-game every 3 hours (irl)
		daysCountUntilNextWeather++;

		// If it's been 4 hours then we need to change the weather.
		if (daysCountUntilNextWeather === 4) {
			mp.events.call('pickNextWeatherInGame');
			daysCountUntilNextWeather = 0;
		}

		// Setting up the game time for later players that will join the game later.
		mp.world.time.set(currentGameTime.hour, currentGameTime.minutes, 0);
	}
};

setInterval(timePassing, SECONDS_TO_MINUTES_IN_GAME);

// Leaving this here to set up the default world time when server boots.
mp.world.time.set(currentGameTime.hour, currentGameTime.minutes, 0);

mp.events.add('loadPlayerDefaults', (player: PlayerMp) => {
	player.triggerClientEvent(`startGameTimePassing`, {
		SECONDS_TO_MINUTES_IN_GAME,
		currentServerGameTime: currentGameTime
	});
});
