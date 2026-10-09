import { GetVideoResponse } from './responses';

// An instance is a video that plays in the background.
export type Instance = {
	// Is important to have an identifier clear.
	identifier: string; //

	// We need to know the streaming url.
	stream: string;

	// Next video or music to play.
	nextEntryId: string | null;

	// If you want to render the player in a different place other than the current one (by default is in background)
	elementIdDestination: string | null;

	// Data about the controls
	controls: {
		paused: boolean;
		volume: number;
		muted: boolean;
		loop: boolean;
		loaded: boolean;
		error: boolean; // If it fails to load the stream video.
		miniPlayer: boolean;
	};
	// Callbacks helpful
	callbacks: {
		onControlsUpdated?: (newState: Instance['controls']) => void;
	};

	// Metadata is small info about the video that is good to have for display purposes
	metadata: {
		id: string;
		title: string;
		thumbnail: string;
		author: {
			name: string;
		};
	};
};

export type CreateInstanceParams = {
	// An unique identifier for us devs to know what instace is it.
	identifier: string;

	// The id of the video from original source.
	remoteId: string;

	// If you want to render the player in a different place other than the current one (by default is in background)
	elementIdDestination?: string;

	// Controls for the player
	controls: Partial<Instance['controls']>;

	// Callbacks
	callbacks?: Instance['callbacks'];
};

export interface InstanceContext {
	// Data
	instances: Array<Instance>;

	// Functions related to instance data..
	createInstance: (params: CreateInstanceParams) => Promise<{
		response: GetVideoResponse;
		instance: Instance;
	}>;
	deleteInstance: (identifier: string) => void;
	getInstance: (identifier: string, useRef?: boolean) => Instance;
	updateInstance: (identifier: string, payload: Partial<Instance>) => void;
	updateControls: (identifier: string, payload: Partial<Instance['controls']>) => void;
	playNextVideo: (identifier: string) => void;
}

export interface ControlContextTypes {
	setPaused: (identifier: string, state: boolean) => void;
	rollTime: (identifier: string, direction: 'forward' | 'backward') => void;
	setVolume: (identifier: string, volume: number) => void;
	setMuted: (identifier: string, state: boolean) => void;
	getVideoElement: (identifier: string) => ExpectedAny;
}
