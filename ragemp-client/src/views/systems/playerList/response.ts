import { AccountData } from '../profile/response';

export default {
	localInfo: {
		...AccountData,
		groups: '',
		helper: 0,
		admin: 0,
		agent: 0,
		username: 'John Doe'
	},

	list: [
		{
			...AccountData,
			id: 1,
			username: 'Barry Allen',
			nearby: true,
			groups: '',
			helper: 0,
			admin: 0,
			agent: 0
		},

		{
			...AccountData,
			id: 2,
			username: 'Bruce Wayne',
			developer: true
		}
	]
};
