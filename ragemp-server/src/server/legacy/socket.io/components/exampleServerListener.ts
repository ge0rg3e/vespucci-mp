import { socketServer } from './server';

// @ This file is not imported anywhere is just as an example.
// In this example the server reacts to what the socket.io client sends back with "emit"
// on front-end it was: socketConnection.emit("eventTest", { test: true });

// @Reminder: Clients can emit to the server. They can't emit to other clients (unless in same room)
// @https://socket.io/docs/v3/emit-cheatsheet/

socketServer.on('connection', (socket) => {
	socket.on('eventTest', (params) => {
		console.info('event test called from client-side', params);
	});
});
