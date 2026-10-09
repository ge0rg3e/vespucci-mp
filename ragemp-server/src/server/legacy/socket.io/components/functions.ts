import { socketServer } from './server';

/**
 * Allows you to emit a message to that room.
 * @param roomId
 * @param eventName
 * @param content
 */
export const emitToSocketRoom = (roomId: string, eventName: string, content: ExpectedAny) => {
	// Emit to that specific room id.
	socketServer.emit(`room:${roomId}`, { event, content });
};
