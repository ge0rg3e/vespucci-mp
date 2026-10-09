import { GetSongResponse } from './basic';
import { Song } from './definitions';

type QueueSong = {
	// The id of the song
	id: string;

	// Title of the song
	title: string;

	// Author of the song
	artist: string;

	// Thumbnail
	thumbnail: string | null;

	// Duration of the song
	duration: number;
};

export type Instance = {
	// An unique identifier here.
	identifier: string;

	// To keep track if we're loading the next song.
	loading: boolean;

	// Get the current song playing.
	currentSong: {
		// The ID of what is playing.
		id: string;

		// The Id of the album of this song.
		albumId: string | null;

		// The ID of the artist of this song
		artistId: string;
	};

	// Queue of the ids of the songs we're playing
	queue: Array<QueueSong>;

	// Array of recommendations of songs.
	recommendations: Array<QueueSong>;

	// The controls of this instance.
	controls: {
		repeat: 'off' | 'song' | 'all';
		shuffle: boolean;
		autoplay: boolean;
	};

	// Metadata about what this instance is playing
	metadata: {
		// What is that we're playing
		type: 'song' | 'playlist' | 'album';

		// The remote Id of what this instance is playing.
		remoteId: string;

		// The title of what's playing (It's shown in the Player)
		title: string;

		// Thumbnail
		thumbnail: string | null;
	};

	// Volume pre-set for when song starts
	volume: number;
};

export type createInstanceParams = {
	// Identifier:
	identifier: string;

	// What are we playing
	type: Instance['metadata']['type'];

	// The ID of what we're playing.
	remoteId: string;

	// Pre-set controls for this music instance
	controls: Partial<Instance['controls']>;

	// Volume pre-set for when song starts
	volume: number;
};

export interface InstanceContext {
	// Data
	instances: Array<Instance>;
	instancesRef: { current: Array<Instance> };
	speakers: Array<number>;
	speakersRef: { current: InstanceContext['speakers'] };
	setSpeakers: ExpectedAny;

	// Functions related to instance data..
	createInstance: (params: createInstanceParams) => Promise<
		| {
				currentSong: Instance['currentSong'];
				metadata: Instance['metadata'];
				queue: Instance['queue'];
		  }
		| boolean
	>;
	deleteInstance: (identifier: string) => void;
	getInstance: (identifier: string, useRef?: boolean) => Instance;
	updateInstance: (identifier: string, payload: Partial<Instance>) => void;
	updateControls: (identifier: string, payload: Partial<Instance['controls']>) => void;
}

export interface ControlsContext {
	getCurrentSongFromQueue: (identifier: string) => QueueSong | null;
	getSongByDirection: (identifier: string, dir: 'forward' | 'backward') => QueueSong | null;
	changeSong: (identifier: string, id: string) => Promise<GetSongResponse | null>;
	refreshRecommendations: (identifier: string, song: GetSongResponse) => Promise<boolean>;
}
