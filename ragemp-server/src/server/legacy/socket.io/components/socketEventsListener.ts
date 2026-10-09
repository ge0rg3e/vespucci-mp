import { logError } from '@server/utils/helpers';
import { socketServer } from './server';
import { registeredSocketEvents } from './socketEvents';

socketServer.on('connection', (socket) => {
	registeredSocketEvents.forEach((ev) => {
		socket.on(ev.eventName, async (params) => {
			const player = mp.players.toArray().find((p) => p.socketId === socket.id);

			if (!player) return false;
			if (ev.loggedInOnly && !player?.info.username) return false;
			try {
				await ev.handler(player, params);
				return true;
			} catch (err) {
				await logError(`UNCAUGHT_SOCKETIO_CALLBACK`, {
					eventName: ev.eventName,
					player: player.info.username ? player.info.username : `Not logged in.`
				});
				return false;
			}
		});
	});
});
