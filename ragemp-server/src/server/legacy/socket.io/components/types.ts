declare global {
	interface PlayerMp {
		socketUserId: string;
		socketId: string;
	}

	interface PlayerVariables {
		socketRooms: Array<string>;
	}
}

export {};
