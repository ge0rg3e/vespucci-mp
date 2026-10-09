import Accounts from '@modules/database/game/accounts/repository';
import { v4 as uuidv4 } from 'uuid';
import { socketServer } from './server';

// Whenever the gamemode starts we need to reset the socket Id for the
mp.events.add('gamemodeStarted', async () => {
	await Accounts.update(
		{
			isOnline: false,
			socketId: null
		},
		{
			where: {} // Everyone!
		}
	);
});

mp.events.add('onBrowserLoaded', (player) => {
	// @explanation:
	// We will tell the CEF how to connect to the socket.io and we sent this socket temp user id.
	// When our socket server will detect a connection has been made, in the headers it will include this socket user id
	// That's how we then know "this player" is this socket id.

	player.socketUserId = uuidv4();

	// Now let's send it to the browser and make a socket connection
	player.triggerBrowserEvent(`socket.io@createConnection`, {
		address: process.env.SOCKET_IO_ADDRESS,
		id: player.socketUserId
	});
});

// Middleware for the security of our socket server -- is invoked whenever a connection is made.

socketServer.use((socket, next) => {
	const { secretAccessToken, socketUserId } = socket.handshake.auth;

	// If they connected using a secret access token (Example: The panel API will most likely use that.)
	if (secretAccessToken === process.env.SOCKET_IO_SECRET_ACCESS_TOKEN) return next();

	// Reminder: p.socketUserId is an socket id randomly generated so we know "this socket id is this player"
	// p.socketId is a socket id that was already allocated to player.

	// If they connect using a socket user id.
	if (socketUserId) {
		const playerWithThisSocketAllocated = mp.players.toArray().find((p) => p.socketId === socketUserId);
		const player = mp.players.toArray().find((p) => p.socketUserId === socketUserId);
		if (player && !playerWithThisSocketAllocated) {
			// Let's update the player too since we got him for the first time
			player.socketId = socket.id;
			return next();
		}
	}

	return next(new Error('Not Authorized'));
});

mp.events.add('loadPlayerDefaults', (player) => {
	player.saveInfo({
		socketId: player.socketId
	});
	player.updateVars({ socketRooms: [] });
});

socketServer.on('connection', (socket) => {
	socket.join(`SocketId:${socket.id}`); // They join a room where only they're there. So we can later from server emit directly to the player only.
	socket.join('AllSockets'); // a room where all of them are present so we can emit to all players at once easily.
});
