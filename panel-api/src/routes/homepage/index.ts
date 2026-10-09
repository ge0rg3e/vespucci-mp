import { createRouter } from '@natives/router';
import { getCache, setCache } from '@src/utils/cache';

const route = createRouter('homepage');

// Databases
import { getMetrics, getPlayersOnlineChartData, loadActions } from './components/functions';

route.set({
	path: '/',
	method: 'GET',
	options: {},
	handler: async (_, res) => {
		// Return cache if possible
		const cache = await getCache(`homepage`);

		// If there is a cache return it..
		if (cache) return res.sendResponse(200, cache);

		// Getting the information needed..
		const chartData = await getPlayersOnlineChartData();
		const metrics = await getMetrics();
		const actions = await loadActions();

		// Prepare the result..
		const responseData = {
			chartData,
			metrics,
			actions
		};

		// Cache it for the next user..
		await setCache(`homepage`, responseData, 5 * 60);

		// Return it..
		return res.sendResponse(200, responseData);
	}
});

export default route;
