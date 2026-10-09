mp.events.add('gamemodeStarted', () => {
	// Adding default chat message types..

	mp.chat.addMessageType({
		id: 'unknown',
		color: 'red',
		icon: 'fa-solid fa-question',
		translations: {
			EN: 'Unknown',
			RO: 'Unknown'
		}
	});

	mp.chat.addMessageType({
		id: 'local',
		color: 'grey',
		icon: 'fa-solid fa-comments',
		translations: {
			EN: 'Local',
			RO: 'Local'
		}
	});

	mp.chat.addMessageType({
		id: 'global',
		icon: 'fa-solid fa-globe',
		color: 'white',
		translations: {
			EN: 'Global',
			RO: 'Global'
		}
	});

	mp.chat.addMessageType({
		id: 'system',
		icon: 'fa-solid fa-circle-info',
		color: '#838383',
		translations: {
			EN: 'System',
			RO: 'Sistem'
		}
	});

	mp.chat.addMessageType({
		id: 'staffAlerts',
		icon: 'fa-solid fa-shield',
		color: '#FF6347',
		translations: {
			EN: 'Staff Alerts',
			RO: 'Alerte Staff'
		}
	});

	mp.chat.addMessageType({
		id: 'adminsChat',
		icon: 'fa-solid fa-shield',
		color: '#FC427B',
		translations: {
			EN: 'Admin Chat',
			RO: 'Admin Chat'
		}
	});

	mp.chat.addMessageType({
		id: 'roleplayAction',
		icon: 'fa-solid fa-mask',
		color: '#C2A2DA',
		translations: {
			EN: 'Roleplay Action',
			RO: 'Actiune Roleplay'
		}
	});
});
