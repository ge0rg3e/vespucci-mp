import React, { useContext, createContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Dependencies
import { logError } from '../../utils/helpers';

// Components
import Callbacks from './components/callbacks';

const Context = createContext<ExpectedAny>({});
export const SocketContext = () => useContext(Context);

const ExportingComponent = (props: ExpectedAny) => {
	const socket = useRef<null | socketConnection>(null);

	const createSocketConnection = async (args: string) => {
		const { address, id } = JSON.parse(args);
		try {
			const connection: ExpectedAny = await new Promise((resolve, reject) => {
				const socketInstance: ExpectedAny = io(address, {
					auth: {
						socketUserId: id // @explanation for this is on the server-side.
					},
					transports: ['polling'] // Fixes a warning on prod cef log.
				});

				socketInstance.on('connect', () => resolve(socketInstance));

				socketInstance.on('connect_error', (err: UndefinedAny) => {
					reject(err);
					window.rpc.triggerServer('socket.io@onConnectionFailure');
				});
			});

			socket.current = connection;
			window.socket = connection;
		} catch (err) {
			await logError(`socket.io@createSocketConnection`, err, { address });
		}
	};

	const setupLocalDevelopment = () => {
		window.socket = {
			fake: true,
			on: (name, callback) => {
				document.addEventListener(`socketEvent:${name}`, (event: ExpectedAny) => {
					callback(event.detail || null);
				});
			},
			// eslint-disable-next-line
			emit: (name, callback) => null,
			join: (name) => null,
			leave: (name) => null,
			to: () => null,
			// eslint-disable-next-line
			off: (name) => null,
			simulateOn: (name, payload) => {
				document.dispatchEvent(
					new CustomEvent(`socketEvent:${name}`, {
						detail: payload
					})
				);
			}
		};
	};

	const onRoomEvent = async (id: string, response: ExpectedAny) => {
		try {
			// Inform the browser that this room received a message.
			document.dispatchEvent(new CustomEvent(`socket.room@${response.event}`, { detail: response.content }));

			// Inform the game and server
			window.rpc.triggerClient(`socket.room@${response.event}`, JSON.stringify(response.content));
			window.rpc.triggerServer(`socket.room@${response.event}`, JSON.stringify(response.content));
		} catch (err) {
			await logError(`socket.io@onRoomEvent`, err, { id, response });
		}
	};

	const joinRoom = async (id: string) => {
		try {
			// Set up the listener.
			socket.current!.on(`room:${id}`, (response: ExpectedAny) => onRoomEvent(id, response));
		} catch (err) {
			await logError(`socket.joinRoom`, err);
			return false;
		}
	};

	const leaveRoom = async (id: string) => {
		try {
			// Turn off the listener for the specific room
			socket.current!.off(`room:${id}`);
		} catch (err) {
			await logError(`socket.joinRoom`, err);
			return false;
		}
	};

	const emitToRoom = async (id: string, event: string, content: ExpectedAny) => {
		try {
			// Emit this to the server so the server will broadcast it to everyone in that room.
			socket.current!.emit(`emitToRoom`, { id, event, content });
		} catch (err) {
			await logError(`socket.emitToRoom`, err);
			return false;
		}
	};

	useEffect(() => {
		window.rpc.on('socket.io@createConnection', createSocketConnection);

		if (window.mp.fake) {
			setupLocalDevelopment();
		}

		return () => {
			window.rpc.off('socket.io@createConnection', createSocketConnection);
		};
	}, []);

	const PassedProps = {
		socket,
		joinRoom,
		leaveRoom,
		emitToRoom
	};

	return (
		<Context.Provider value={PassedProps}>
			<Callbacks />
			<React.Fragment>{props.children}</React.Fragment>
		</Context.Provider>
	);
};

export default ExportingComponent;
