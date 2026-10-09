import { green, red } from 'colorette';
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();

export const socketServer = new Server(httpServer, {
	cors: {
		origin: '*',
		allowedHeaders: '*',
		credentials: true
	}
});

if (process.env.SOCKET_IO_PORT === undefined) {
	console.info(`${red('[ERROR]')} This server is missing the environment variable "SOCKET_IO_PORT"`);
	process.exit(1);
}

httpServer.listen(process.env.SOCKET_IO_PORT, () => {
	console.info(`${green('[DONE]')} Socket.io server now running on port ${process.env.SOCKET_IO_PORT}`);
});
