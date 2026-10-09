import accounts from '@modules/database/game/accounts/repository';
import { createRouter } from '@natives/router';

const route = createRouter('players');

route.set({
	path: '/list/online',
	method: 'GET',
	options: {},
	handler: async (req, res) => {
		const page = Number(req.query.page) || 1;

		const count = await accounts.count({
			where: {
				isOnline: true
			}
		});

		const offset = (page - 1) * 5;

		const list = await accounts.findAll({
			where: {
				isOnline: true
			},
			attributes: ['username', 'level', 'connectedTime', 'groups'],
			limit: 5,
			offset
		});

		res.sendResponse(200, {
			pages: Math.ceil(count / 5),
			rows: count,
			list
		});
	}
});

export default route;
