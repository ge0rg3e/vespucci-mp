declare global {
	type RegisteredPlayerAttachments = {
		id: string;
		model: number;
		boneId: number; // Can be found here: https://wiki.rage.mp/index.php?title=Bones
		offset: Vector3;
		rotation: Vector3;
	};

	type PlayerAttachment = {
		// Is important to know if is made by client-side or server-side.
		origin: 'server' | 'client'; // If is client it won't be deleted when server updates variables
		entity: ObjectMp;
	};

	interface PlayerMp {
		// This are the objects that we attached to them as an object { id: Object (RAGE) }
		attachments: Record<string, PlayerAttachment> | undefined;
	}
}

// This are only the ids from the server-side to know what they have on them.
export type playerAttachments = Array<string>;

export {};
