export type AudioInstance = {
	// Identifier so we can control the audio on demand. (stop, pause etc)
	identifier: string;
	volume: number;

	// Effects currently applied.
	pan?: number;
	biquadFilter?: {
		type: BiquadFilterType;
		qFactor?: number;
		gain?: number;
		frequency?: number;
	};

	// Special for game only.
	spatialSound?: {
		source: 'position' | 'vehicle' | 'object';
		identifier?: ExpectedAny;
		position?: Vector3;
		maxDistance: number;
		payload?: Record<string, ExpectedAny>;
	};
};

export type playAudioOptions = {
	// Identifier so we can control the audio on demand. (stop, pause etc)
	identifier?: string;

	// General controls around the audio
	autoplay?: boolean; // is later turned into "paused"
	volume?: number;
	loop?: boolean;

	// Effects
	pan?: number;
	biquadFilter?: {
		type: BiquadFilterType;
		qFactor?: number;
		gain?: number;
		frequency?: number;
	};

	// By default all sounds are deleted from the entries once they are finished.
	preventCleanup?: boolean;

	// Special for game only.
	position?: Vector3;
};
