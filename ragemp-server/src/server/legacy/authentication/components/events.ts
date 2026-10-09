import moment from 'moment';
import { getLanguagePack } from '@vmp/i18n';

mp.events.add('playerReady', (player) => {
	// Creating the default object on the player entity..
	player.info = {} as ExpectedAny;
	player.meta = {} as PlayerMeta;
	player.vars = { _keys: [], _infoKeys: [] } as ExpectedAny; // ExpectedAny is to fix an error.

	// Setting a default here to be safe..
	player.client_location = {
		city: '',
		country: '',
		region: '',
		ip: player.ip
	};

	// Load player meta..
	mp.events.call('loadPlayerMeta', player);
});

mp.events.add('playerReady', async (player) => {
	// Add to client-side
	player.addClientsideVariables(`loggedIn`);

	// Update this variable here so it will be updated on the client-side too..
	player.updateVars({ loggedIn: false });

	// Inform the client-side
	player.triggerClientEvent(`setIsLoggedIn`, { boolean: false });
});

mp.events.add('playerQuit', (player, exitType, reason) => {
	if (player.vars && player.vars.loggedIn) {
		player.createAmplitudeEvent(`Disconnected`, { exitType, reason: reason || 'N/A' });
		player.saveInfo({ isOnline: false, socketId: null });

		// Call this event
		mp.events.call('playerLoggedInQuit', player, exitType, reason);
		mp.events.call('onPlayerSaveData', player, true);
	}
});

mp.events.add('onPlayerLogin', (player) => {
	const date = new Date('November 7, 2021 00:00:00').toUTCString();
	const sinceLaunchWeeks = moment(new Date()).diff(date, 'weeks');
	const sinceLaunchMonths = moment(new Date()).diff(date, 'months');
	const lang = getLanguagePack(`onPlayerLogin`, player.info.language);

	// RockstarId
	if (player.rgscId !== player.info.rockstarId) {
		player.createAmplitudeEvent('Logged with another rockstarId', { newRockstarId: player.rgscId, oldRockstarId: player.info.rockstarId });
		player.saveInfo({ rockstarId: player.rgscId });
		player.sendServerMessage('Server', 'system', lang.get('RockstarId'), 'system');
	}

	player.sendServerMessage('Server', 'system', lang.get('MessageJustLoggedIn', { username: player.info.username }), 'system');
	player.sendServerMessage('Server', 'system', lang.get('StartedAgoMessage', { weeks: sinceLaunchWeeks, months: sinceLaunchMonths }), 'system');

	if (player.getAdminLevel() && !player.isDeveloper()) {
		player.sendServerMessage('Server', 'system', lang.get('MessageLoggedInRank', { role: `Admin`, value: player.getAdminLevel() }), 'system');
	}

	if (player.isDeveloper()) {
		player.sendServerMessage('Server', 'system', lang.get('MessageLoggedInRank', { role: `Developer`, value: '' }), 'system');
	}

	// This is used by the welcome screen.
	player.updateMeta({ lastOnline: new Date() });
	return true;
});

mp.events.add('onPlayerRegister', (player) => {
	const lang = getLanguagePack(`onPlayerRegister`, player.info.language);
	player.sendServerMessage('Server', 'system', lang.get('WelcomeMessage', { username: player.info.username }), 'system');
	player.saveInfo({ justRegistered: false });
	mp.chat.sendStaffMessageToAll({
		systemId: 'onPlayerRegister',
		messageId: 'MessageJustRegistered',
		permission: 'game.staffMessages',
		args: () => ({ username: player.info.username })
	});
});

mp.events.add('loadPlayerDefaults', (player) => {
	// Mark these variables to be available in client-side.
	player.addClientsideVariables([`accountId`, `level`, `groups`]);

	// Set defaults
	player.updateVars({
		accountId: player.info.id,
		level: player.info.level,
		groups: player.info.groups
	});

	// Send this to cef..
	player.triggerBrowserEvent(`account:update`, {
		groups: player.info.groups,
		adminLevel: player.getAdminLevel(),
		helperLevel: player.getHelperLevel()
	});
});
