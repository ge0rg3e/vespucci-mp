// requestPlayerList
// closedPlayerList

import * as rpc from 'rage-rpc';

declare global {
	interface PlayerVariables {
		profileListOpened: boolean;
	}
}

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		profileListOpened: false
	});
});

rpc.on(`requestPlayerList`, async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;

	try {
		const { isRefresh } = JSON.parse(args);
		const playersArr: ExpectedAny = [];

		const formatInfo = (p: PlayerMp) => ({
			id: p.info.id,
			username: p.info.username,
			admin: p.getAdminLevel(),
			developer: p.isDeveloper(),
			nearby: p.dist(player.position) < 30
		});

		mp.players.forEachLoggedIn((p: PlayerMp) => {
			if (p === player) return;
			playersArr.push(formatInfo(p));
		});

		player.triggerSocketEvent(`onPlayerListDataReceived`, {
			localInfo: {
				...formatInfo(player)
			},
			list: playersArr
		});

		if (isRefresh !== true) {
			player.updateVars({
				profileListOpened: true
			});

			player.createAmplitudeEvent(`Opened players list`);
		}

		return true;
	} catch (err) {
		return null;
	}
});

rpc.on(`closedPlayerList`, async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return;
	player.updateVars({
		profileListOpened: false
	});
	player.createAmplitudeEvent(`Closed players list`);
});

mp.events.add('playerQuit', (player) => {
	if (player.vars && player.vars.loggedIn) {
		mp.players.forEachLoggedIn((entity: PlayerMp) => {
			if (entity.vars.profileListOpened !== true) return false;
			entity.triggerClientEvent(`refreshPlayerList`);
			return true;
		});
	}
});

export {};
