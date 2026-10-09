// Timers Events

import { getServerTime } from '@server/utils/helpers';

let lastMinute = getServerTime().minutes;
let lastHour = getServerTime().hour;

setInterval(() => {
	let hourPassed = false,
		minutePassed = false;

	const { hour, minutes } = getServerTime();

	if (hour !== lastHour) {
		lastHour = hour;
		hourPassed = true;
	}

	if (minutes !== lastMinute) {
		lastMinute = minutes;
		minutePassed = true;
	}

	mp.players.forEachLoggedIn((entity: PlayerMp) => {
		if (hourPassed) {
			mp.events.call(`everyHourForPlayerTimer`, entity);
		}

		if (minutePassed) {
			mp.events.call(`everyMinuteForPlayerTimer`, entity);
		}

		mp.events.call(`everySecondForPlayerTimer`, entity);
	});
}, 1000);
