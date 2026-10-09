//  Dependencies
import { safezone, safezoneTypes } from '@server/definitions/safezones';
import { getLanguagePack } from '@vmp/i18n';
import moment from 'moment';

mp.events.add('loadPlayerDefaults', (player) => {
	// Mark that this key should be in client-side.
	player.addClientsideVariables(`isInSafezone`);

	// Set the variables to false..
	player.updateVars({
		isInSafezone: null
	});

	// Create the colshapes..
	safezone.forEach((element: safezoneTypes) => {
		player.createColshape({
			type: 'circle',
			identifier: `safezone:${element.name}`,
			position: new mp.Vector3(element.X, element.Y, element.Z),
			range: element.radius,
			dimension: 0
		});
	});
});

mp.events.add('onPlayerEnterColshape', function (player, c) {
	if (!c.identifier.includes(`safezone:`)) return false;
	player.updateVars({ isInSafezone: c.identifier });
	player.triggerClientEvent('setUnableToDoDamage', { bool: true });
	player.triggerClientEvent(`disableVehiclesCollisions`, { bool: true });
	player.triggerClientEvent(`disablePlayersCollisions`, { bool: true });

	// Let's find out when he logged in.
	const diff = moment(new Date()).diff(new Date(player.info.lastLoggedInAt), 'minutes');

	// We will announce on chat that they entered a safezone IF they played for at least 3 minutes to avoid spamming on chat on spawn.
	if (diff >= 2) {
		const lang = getLanguagePack('safezone', player.lang);
		player.sendServerMessage(`Server`, 'system', lang.get(`onEnter`), 'system');
	}

	return true;
});

mp.events.add('onPlayerExitColshape', (player, c) => {
	if (!c.identifier.includes(`safezone:`)) return false;
	player.updateVars({ isInSafezone: null });
	player.triggerClientEvent('setUnableToDoDamage', { bool: false });
	player.triggerClientEvent(`disableVehiclesCollisions`, { bool: false });
	player.triggerClientEvent(`disablePlayersCollisions`, { bool: false });
	player.triggerClientEvent(`resetVehiclesCollisions`);
	player.triggerClientEvent(`resetPlayersCollisions`);

	// Announce on chat.
	const lang = getLanguagePack('safezone', player.lang);
	player.sendServerMessage(`Server`, 'system', lang.get(`onExit`), 'system');

	return true;
});
