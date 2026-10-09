import { socketServer } from './server';

socketServer.on('connection', (socket) => {
	// @Reminder: Socket.io has rooms with join and leave but is not able to allow us to catch in client-side ANY event.
	// Therefore we had to come up with our own invention of rooms. We simply allow client-side to "emit" therefore the clients can emit
	// And then the server broadcasts it to everyone else in that room.

	socket.on('emitToRoom', ({ id, event, content }) => {
		// Emit to that specific room id.
		socketServer.emit(`room:${id}`, { event, content });
	});
});
