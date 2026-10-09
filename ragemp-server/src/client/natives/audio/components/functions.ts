import * as rpc from 'rage-rpc';

// Dependencies
import { playAudioOptions } from './types';
import { getPlayerVariable } from '@client/utils/helpers';

const player = mp.players.local;

export const playAudio = (sourcePath: string, options: playAudioOptions) => {
	// Start the music DJ!
	rpc.triggerBrowsers(
		`services.audio@play`,
		JSON.stringify({
			// The path to the file.
			sourcePath: sourcePath,
			// The options
			options
		})
	);
};

export const playSoundEffect = (sourcePath: string, options: playAudioOptions) => {
	const vars = getPlayerVariable(player.remoteId, 'settings');

	// Check if sound effects are disabled in player settings
	if (vars.soundEffects.enabled === false) return false;

	// Initial volume set by the player (through options.volume)
	const initialVolume = options.volume || 1.0; // If options.volume does not exist, we use 1.0 as the default value

	// Player's individual settings
	const playerVolumeSetting = vars.soundEffects.volume;

	// Calculate the adjusted volume
	const adjustedVolume = initialVolume * (playerVolumeSetting / 100);

	// Play sound
	playAudio(sourcePath, {
		// Use the adjusted volume
		volume: adjustedVolume,
		...options
	});

	return true;
};

export const stopAudio = (identifier: string) => {
	// Start the music DJ!
	rpc.triggerBrowsers(
		`services.audio@stop`,
		JSON.stringify({
			identifier
		})
	);
};

/**
 *
 * @param identifier
 * @param value
 * @param updatePreferences If you need the volume to be updated in instance therefore to be applied in spatial sound.
 */

export const setAudioVolume = (identifier: string, value: number, updatePreferences = false) => {
	// Start the music DJ!
	rpc.triggerBrowsers(
		`services.audio@setVolume`,
		JSON.stringify({
			identifier,
			value,
			updatePreferences
		})
	);
};

export const setAudioPan = (identifier: string, value: number) => {
	// Start the music DJ!
	rpc.triggerBrowsers(
		`services.audio@setPan`,
		JSON.stringify({
			identifier,
			value
		})
	);
};

export const setAudioBiquadFilter = (identifier: string, value: playAudioOptions['biquadFilter']) => {
	// Start the music DJ!
	rpc.triggerBrowsers(
		`services.audio@setBiquadFilter`,
		JSON.stringify({
			identifier,
			value
		})
	);
};
