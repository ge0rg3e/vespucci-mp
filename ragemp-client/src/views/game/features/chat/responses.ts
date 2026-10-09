import { ChatData } from './components/types';

const Response: ChatData = {
	// The messages..
	messages: [
		{
			uuid: '1',
			date: new Date('2023-08-05T14:50:42.364Z'),
			channel: 'general',
			type: {
				text: 'Global',
				icon: 'fa-solid fa-globe',
				color: 'white'
			},
			sender: 'Server',
			read: false,
			content: {
				type: 'text',
				data: '{ffffff}You have logged in-game.'
			}
		},
		{
			uuid: '2',
			date: new Date('2023-08-05T14:55:42.364Z'),
			channel: 'general',
			type: {
				color: 'grey',
				text: 'Local',
				icon: 'fa-solid fa-comments'
			},
			sender: 'Vatto',
			read: false,
			content: {
				type: 'text',
				data: 'Ce faci, vrei sa te ajut? Lorem ipsum solus message test.'
			}
		},
		{
			uuid: '3',
			date: new Date('2023-08-05T14:55:42.364Z'),
			channel: 'staff',
			type: {
				text: 'Global',
				icon: 'fa-solid fa-globe',
				color: 'white'
			},
			sender: 'Vatto',
			read: false,
			content: {
				type: 'text',
				data: 'Now this is a test..'
			}
		},

		{
			uuid: '4',
			date: new Date('2023-08-05T14:55:42.364Z'),
			channel: 'staff',
			type: {
				text: 'Global',
				icon: 'fa-solid fa-globe',
				color: 'white'
			},
			sender: 'Vatto',
			read: false,
			content: {
				type: 'text',
				data: 'Now this is a test..'
			}
		},
		{
			uuid: '5',
			date: new Date('2023-08-05T14:55:42.364Z'),
			channel: 'staff',
			type: {
				text: 'Global',
				icon: 'fa-solid fa-globe',
				color: 'white'
			},
			sender: 'Vatto',
			read: false,
			content: {
				type: 'text',
				data: 'Now this is a test..'
			}
		},
		{
			uuid: '6',
			date: new Date('2023-08-05T14:55:42.364Z'),
			channel: 'staff',
			type: {
				text: 'Global',
				icon: 'fa-solid fa-globe',
				color: 'white'
			},
			sender: 'Vatto',
			read: false,
			content: {
				type: 'text',
				data: 'Now this is a test..'
			}
		}
	]
};

export default Response;
