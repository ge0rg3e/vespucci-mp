import * as rpc from 'rage-rpc';

rpc.on(`setGameWeather`, (args: ExpectedAny) => {
	const { weatherString } = JSON.parse(args) as { weatherString: string };

	// All of this crap is required to make sure GTA 5 won't change their weather randomly.

	mp.game.gameplay.setWeatherTypePersist(weatherString);
	mp.game.gameplay.setWeatherTypeNowPersist(weatherString);
	mp.game.gameplay.setWeatherTypeNow(weatherString);
	mp.game.gameplay.setOverrideWeather(weatherString);
});

rpc.on('setGameTime', (args: ExpectedAny) => {
	const { hour, minutes, seconds } = JSON.parse(args);
	mp.game.time.setClockTime(hour, minutes, seconds);
});
