import Audio from '../components/audio';

export interface AudioServiceContext {
	// Data
	instances: Array<Instance>;
	instancesRef: { current: Array<Instance> };

	// Functions related
	playAudio: (sourcePath: string, options: PlayAudioOptions) => Promise<Instance | null>;
	stopAudio: (identifier: string) => boolean;

	// Getting the data..
	getInstance: (identifier: string, useRef?: boolean) => Instance | null;

	// Editing data
	updatePreferences: (identifier: string, payload: Partial<Instance['preferences']>) => void;
	updateInstance: (identifier: string, payload: Partial<Instance>) => void;
	setInstances: ExpectedAny;
}

export interface AudioControlsContext {
	// Setters
	setPaused: (identifier: string, state: boolean) => void;
	setVolume: (identifier: string, volume: number) => void;
	setMuted: (identifier: string, state: boolean) => void;
	setCurrentTime: (identifier: string, value: number) => void;

	// Getters
	getController: (identifier: string, useRef?: boolean) => Audio | null;
}

export type Instance = {
	// The identifier of this song.
	identifier: string;

	// The source is playing
	sourcePath: string;

	// The controller from library through which we can control the audio.
	controller: Audio;

	// How much time has passed from the song
	currentTime: number;

	// Is important to know if this sound has reactive current time (meaning our api setInterval will update the hook state for it)
	reactiveCurrentTime: boolean;

	// Informs us if the song is loaded
	loaded: boolean;

	// Duration of the sound
	duration: number;

	// This will be passed down in-game.
	spatialSound?: Record<string, ExpectedAny>;

	// The preferences set on creation.
	preferences: {
		paused: boolean;
		volume: number;
		muted: boolean;
		loop: boolean;
		preventCleanup: boolean;
	};
};

export type PlayAudioOptions = {
	// Identifier so we can control the audio on demand. (stop, pause etc)
	identifier?: string;

	// General controls around the audio
	autoplay?: boolean; // is later turned into "paused"
	volume?: number;
	muted?: boolean;
	loop?: boolean;
	reactiveCurrentTime?: boolean;
	startTime?: number; // If we want to set the current time of this audio from the start to a specific time

	// This will be passed down in-game.
	spatialSound?: Record<string, ExpectedAny>;

	// Effects
	pan?: number;
	biquadFilter?: BiquadFilterParams;

	// By default all sounds are deleted from the entries once they are finished.
	preventCleanup?: boolean;
};

export type BiquadFilterParams = {
	type: BiquadFilterType;
	qFactor?: number;
	gain?: number;
	frequency?: number;
};

export type primaryNodeIdTitles = 'gain' | 'pan' | 'biquad';

export type AudioClassParams = {
	identifier: string;
	audioContext: AudioContext;
	audioUrl: string;
	// Controls
	loop?: boolean;
	autoplay?: boolean;
	volume?: number;
	muted?: boolean;

	// Special effects
	pan?: number;
	biquadFilter?: BiquadFilterParams;
	startTime?: number; // If we want to set the current time of this audio from the start to a specific time
};
