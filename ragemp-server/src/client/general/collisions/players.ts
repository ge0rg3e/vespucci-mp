import { logClientsideError } from '@client/general/errors';
import * as rpc from 'rage-rpc';

let disablePlayers = false;
const player = mp.players.local;
let ccPlayertoPlayer: Record<string, ExpectedAny> = {};

// Ambele sensuri si aici.

const disablePlayersCollisions = () => {
	try {
		if (disablePlayers === false) return false;

		mp.players.forEachInStreamRange((entity) => {
			if (!entity.handle) return;
			if (!mp.game.entity.isAnEntity(entity.handle)) return;

			if (entity.remoteId === mp.players.local.remoteId) return;
			if (ccPlayertoPlayer[entity.remoteId] === false) return; // Already appplied;
			entity.setNoCollision(player.handle, false);
			player.setNoCollision(entity.handle, false);

			if (entity.vehicle) {
				entity.vehicle.setNoCollision(player.handle, false);
				player.setNoCollision(entity.vehicle.handle, false);
			}

			if (player.vehicle) {
				player.vehicle.setNoCollision(entity.handle, false);
				entity.setNoCollision(player.vehicle.handle, false);
			}
		});

		return true;
	} catch (err) {
		logClientsideError(`disablePlayersCollisions`, err);
		return false;
	}
};

rpc.on(`disablePlayersCollisions`, (args) => {
	const { bool } = JSON.parse(args);
	disablePlayers = bool;
});

rpc.on(`resetPlayersCollisions`, () => {
	mp.players.forEach((entity: PlayerMp) => {
		if (!entity.handle) return;
		if (!mp.game.entity.isAnEntity(entity.handle)) return;

		entity.setNoCollision(player.handle, true);
		player.setNoCollision(entity.handle, true);

		if (entity.vehicle) {
			entity.vehicle.setNoCollision(player.handle, true);
			player.setNoCollision(entity.vehicle.handle, true);
		}

		if (player.vehicle) {
			player.vehicle.setNoCollision(entity.handle, true);
			entity.setNoCollision(player.vehicle.handle, true);
		}
	});
	ccPlayertoPlayer = {};
});

// Timers required

setInterval(() => {
	disablePlayersCollisions();
}, 1000);
