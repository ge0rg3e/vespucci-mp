// let weatherString = new Date().getUTCMonth() >= 11 ? 'XMAS' : 'CLEAR';
let weatherString = 'CLEAR';
let weatherIndex = 0;

export const weatherRotation = [`CLEAR`, `EXTRASUNNY`, `CLOUDS`, `RAIN`, `THUNDER`, `CLEARING`, `OVERCAST`, `SMOG`, `FOGGY`, 'SNOW', `SNOWLIGHT`, `BLIZZARD`, `XMAS`, 'HALLOWEEN'];

export function getNextWeatherCycle() {
	if (weatherIndex > 9) {
		return;
	}

	weatherIndex++;

	if (weatherIndex === 2) {
		const luck = Math.floor(Math.random() * 100);

		if (luck >= 10) {
			// 10% chance to rain only.
			weatherIndex = 0;
		}
	}

	if (weatherIndex === 9) {
		weatherIndex = 0;
	}

	weatherString = weatherRotation[weatherIndex];
}

export const setGameWeather = (number: number) => {
	weatherIndex = number;
	weatherString = weatherRotation[number];

	syncGameWeatherForAllPlayers();
};

export const syncGameWeatherForAllPlayers = () => {
	// Set the world's weather.
	mp.world.weather = weatherString;

	// We re-apply the players with custom weathers.
	mp.players.forEachLoggedIn((entity: PlayerMp) => {
		entity.triggerClientEvent(`setGameWeather`, { weatherString: entity.vars.ownWeather ? entity.vars.ownWeather : weatherString });
	});
};

export const getCurrentGameWeather = () => weatherString;

mp.events.add('pickNextWeatherInGame', () => {
	getNextWeatherCycle();
	syncGameWeatherForAllPlayers();
});

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		ownWeather: null
	});
});

// Leaving this here to set the right weather when gamemode boots.

mp.world.weather = getCurrentGameWeather();
