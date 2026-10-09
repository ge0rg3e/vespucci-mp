import React, { useEffect } from 'react';

//  Dependencies
import { logError } from '@/utils/helpers';

// Context
import { SocketContext } from '..';

const Component = () => {
	const { joinRoom, leaveRoom, emitToRoom } = SocketContext();

	const onJoinRoom = async (args: string) => {
		try {
			const { id } = JSON.parse(args);

			// Socket join room.
			joinRoom(id);
		} catch (err) {
			await logError(`socket.callbacks.onJoinRoom`, err);
			return false;
		}
	};

	const onLeaveRoom = async (args: string) => {
		try {
			const { id } = JSON.parse(args);

			// Socket leave room.
			leaveRoom(id);
		} catch (err) {
			await logError(`socket.callbacks.onLeaveRoom`, err);
			return false;
		}
	};

	const onEmitToRoom = async (args: string) => {
		try {
			const { id, event, content } = JSON.parse(args);

			// Socket leave room.
			emitToRoom(id, event, content);
		} catch (err) {
			await logError(`socket.callbacks.onEmitToRoom`, err);
			return false;
		}
	};

	useEffect(() => {
		window.rpc.on(`socket:joinRoom`, onJoinRoom);
		window.rpc.on(`socket:leaveRoom`, onLeaveRoom);
		window.rpc.on(`socket:emitToRoom`, onEmitToRoom);

		return () => {
			window.rpc.off(`socket:joinRoom`, onJoinRoom);
			window.rpc.off(`socket:leaveRoom`, onLeaveRoom);
			window.rpc.off(`socket:emitToRoom`, onEmitToRoom);
		};
	}, []);

	return null;
};

export default Component;
