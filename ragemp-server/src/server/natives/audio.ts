mp.Player.prototype.playAudio = function (sourcePath, options) {
	this.triggerBrowserEvent('services.audio@play', {
		sourcePath: sourcePath,
		options
	});
};

mp.Player.prototype.stopAudio = function (identifier) {
	this.triggerBrowserEvent('services.audio@stop', {
		identifier
	});
};

mp.Player.prototype.playSoundEffect = function (sourcePath, options) {
	// Check if sound effects are disabled in player settings
	if (this.vars.settings.soundEffects.enabled === false) return false;

	// Initial volume set by the player (through options.volume)
	const initialVolume = options.volume !== undefined ? options.volume : 1.0; // If options.volume does not exist, we use 1.0 as the default value

	// Player's individual settings
	const playerVolumeSetting = this.vars.settings.soundEffects.volume;

	// Get a percent of the audio's volume.
	const percent = initialVolume * 100; // ex: if volume is 0.3 => 30%

	// Get the final volume for this audio
	let finalVolume = (percent / 100) * playerVolumeSetting;

	// Play sound
	this.playAudio(sourcePath, {
		...options,
		// Use the adjusted volume
		volume: finalVolume
	});

	return true;
};

mp.Player.prototype.setAudioVolume = function (identifier, value, updatePreferences = true) {
	this.triggerBrowserEvent(`services.audio@setVolume`, {
		identifier,
		value,
		updatePreferences
	});

	return true;
};

/**
 * Play an audio for all players within that range.
 * @param params
 */

export const playRangedAudio = (params: { sourcePath: string; position: Vector3; range: number; isSoundEffect?: boolean; options: playAudioOptions }) => {
	mp.players.forEachLoggedInRange(params.position, params.range, (entity: PlayerMp) => {
		if (params.isSoundEffect) {
			entity.playSoundEffect(params.sourcePath, params.options);
		} else {
			entity.playAudio(params.sourcePath, params.options);
		}

		return true;
	});
};

/**
 * Stop an audio for all players within that range.
 * @param params
 */

export const stopRangedAudio = (params: { position: Vector3; range: number; identifier: string }) => {
	mp.players.forEachLoggedInRange(params.position, params.range, (entity: PlayerMp) => {
		entity.stopAudio(params.identifier);
	});
};

type playAudioOptions = {
	// Identifier so we can control the audio on demand. (stop, pause etc)
	identifier?: string;

	// General controls around the audio
	autoplay?: boolean; // is later turned into "paused"
	volume?: number;
	loop?: boolean;
	startTime?: number; // If we want this song to start at a specific current time right away.

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

	// Spatial sounds in-game.
	spatialSound?: {
		source: 'position' | 'vehicle' | 'object';
		identifier?: ExpectedAny;
		position?: Vector3;
		maxDistance: number;
		payload?: Record<string, ExpectedAny>;
	};
};

declare global {
	interface PlayerMp {
		playSoundEffect(sourcePath: string, options: playAudioOptions): void;
		playAudio(sourcePath: string, options: playAudioOptions): void;
		setAudioVolume(identifier: string, value: number, updatePreferences: boolean): void;
		stopAudio(identifier: string): void;
	}
}

export {};
