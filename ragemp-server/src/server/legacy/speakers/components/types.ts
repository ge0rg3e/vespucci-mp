export type constructorParameters = {
	id: number;
	owner: {
		id: number | null; // If is owned by the server is id null.
		type: 'server' | 'player' | 'vehicle';
		payload: Record<string, ExpectedAny>; // To add the inventory item id.
	};
	// Positioning
	position: Vector3;
	rotation: Vector3;
	dimension: number;
	// The range of music
	range: number;

	// The type of speaker: boombox, speaker music.
	objectType: number;
};

export type createSpeakerParams = {
	owner: constructorParameters['owner'];
	position: Vector3;
	rotation: Vector3;
	dimension: number;
	range: number;
	// The type of speaker: boombox, speaker music.
	objectType: number;
};

export type SpeakerAudio = {
	type: 'song' | 'radio';
	sourcePath: string;
	volume: number;
	paused: boolean;
};

declare global {
	interface PlayerVariables {
		// This tells us what speakers we can listen right now.
		speakersConnected: Array<number>;

		// This tells us what speakers we control.
		speakersControlled: Array<number>;
	}
}

export type classPermissionCheckFunc = ({ player, id }: { player: PlayerMp; id: number }) => boolean;

export {};
