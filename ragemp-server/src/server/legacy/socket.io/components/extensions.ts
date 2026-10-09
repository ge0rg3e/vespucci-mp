import { socketServer } from './server';

mp.Player.prototype.triggerSocketEvent = function (eventName, payload) {
	if (!this.socketId) return false;
	socketServer.to(`SocketId:${this.socketId}`).emit(eventName, payload);
	return true;
};

mp.Player.prototype.joinSocketRoom = function (id) {
	this.triggerBrowserEvent(`socket:joinRoom`, { id });
	this.updateVars({ socketRooms: [...this.vars.socketRooms, id] });
};

mp.Player.prototype.leaveSocketRoom = function (id) {
	this.triggerBrowserEvent(`socket:leaveRoom`, { id });
	this.updateVars({ socketRooms: [...this.vars.socketRooms.filter((c) => c !== id)] });
};

mp.Player.prototype.emitToSocketRoom = function (roomId, eventName, content) {
	this.triggerBrowserEvent(`socket:emitToRoom`, { id: roomId, event: eventName, content });
};

declare global {
	interface PlayerMp {
		triggerSocketEvent(eventName: string, payload: string | object | number | boolean): void;
		joinSocketRoom(id: string): void;
		leaveSocketRoom(id: string): void;
		emitToSocketRoom(roomId: string, eventName: string, content: ExpectedAny): void;
	}
}

export {};
