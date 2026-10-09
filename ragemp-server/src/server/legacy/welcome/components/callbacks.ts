import { currentGameTime } from '@server/general/weather/components/gameTime';
import { getCurrentGameWeather } from '@server/general/weather/components/weather';

import * as rpc from 'rage-rpc';
import PackageJSON from '../../../../../package.json';

// DB
import AccountsDb from '@modules/database/game/accounts/repository';
import BusinessDb from '@modules/database/game/businesses/repository';
import HousesDb from '@modules/database/game/houses/repository';

import { Op } from 'sequelize';
import { logError } from '@server/utils/helpers';
import moment from 'moment';
import { getWelcomeConfiguration } from './functions';

rpc.on(`welcome:startGame`, async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;

	// Get welcome screen configuration
	const welcomeScene = await getWelcomeConfiguration();

	// At this point all we need to do is finish the scene and move the camera.
	player.triggerClientEvent('welcome:finishScene', { id: welcomeScene.sceneId });

	// This shows the auth page and a few other bits.
	player.triggerClientEvent('authentication:start');

	// Updating the discord status
	player.updateDiscordStatus('Logging in..');

	// Setting the server's time cycle and weather now..
	player.triggerClientEvent(`setGameTime`, { hour: currentGameTime.hour, minutes: currentGameTime.minutes, seconds: 0 });
	player.triggerClientEvent(`setGameWeather`, { weatherString: getCurrentGameWeather() });

	return true;
});

let lastCachedAt: ExpectedAny = null;
let cachedServerStats: ExpectedAny = null;

rpc.register(`welcome:getServerStats`, async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false;

		// If is cached..
		if (cachedServerStats !== null && moment(new Date()).diff(lastCachedAt, 'minutes') < 5) return cachedServerStats;

		// Get the players online..
		let playersOnline = 0;

		mp.players.forEachLoggedIn(() => {
			playersOnline++;
		});

		// Get accounts registered
		const accountsRegistered = await AccountsDb.count();

		// Get logged in last 24h
		const last24Hours = await AccountsDb.count({
			where: {
				lastLoggedInAt: {
					[Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
				}
			}
		});

		// Get the businesses
		let businesses = await BusinessDb.findAll();
		businesses = businesses.map((e: ExpectedAny) => e.dataValues);

		// Get the businesses
		let houses = await HousesDb.findAll();
		houses = houses.map((e: ExpectedAny) => e.dataValues);

		const data = {
			playersOnline,
			accountsRegistered,
			last24Hours,
			businesses: [businesses.filter((e: ExpectedAny) => e.owned === false).length, businesses.length],
			houses: [houses.filter((e: ExpectedAny) => e.owned === false).length, houses.length],
			version: PackageJSON.version
		};

		// Catching the result..
		cachedServerStats = data;
		lastCachedAt = new Date();

		return data;
	} catch (err) {
		await logError(`GET_SERVER_STATS_FOR_WELCOME`, err);
		return false;
	}
});
