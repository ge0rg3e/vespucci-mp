import { logClientsideError } from '@client/general/errors';

// Dependencies
import {
	calculatePanFromPosition,
	calculateSpeakerVolume,
	calculateVolumeBasedOnDistance,
	getAudioSourcesWithSpatialSound,
	getDistanceFromPosition,
	getPositionOfSpatialSound,
	getSpatialAudioHelperFunctions,
	getVehicleOfSpatialSound,
	isVehicleDoorOpened
} from './spatialSound.funcs';
import { getGameSettings } from '@client/natives/settings';

// Variables
let timerId: ExpectedAny = null;
const intervalTiming = 300;
const player = mp.players.local;

/**
 * This task will go through your audios and set the right audio effects based where they come from.
 */

const TaskFunction = async () => {
	try {
		// Get all sources that have spatial sound attached.
		const sources = getAudioSourcesWithSpatialSound();

		// Get game settings
		const settings = getGameSettings();
		if (!settings) return; // Skipping yet. We need to wait for the settings.

		// Iterate and execute..
		for (const audio of sources) {
			try {
				// Get helper functionss that help us avoid memory leaks and excessive CEF calls.
				const { setVolume, setPan, setBiquadFilter, muteAudio } = getSpatialAudioHelperFunctions(audio);

				// Get position of the sound
				const position = getPositionOfSpatialSound(audio.spatialSound);

				// Calculate distance from position
				const distance = position ? getDistanceFromPosition(position) : 0;

				// If we can't find the position or if we're too far away from it we mute it.
				if (!position || distance > audio.spatialSound!.maxDistance) {
					// Set volume to zero
					setVolume(0);

					// Continue..
					continue;
				}

				// Calculate panning of sound
				const pan = calculatePanFromPosition(position);

				// Now we'll apply the special effects but they can be different based if is a vehicle or an object or position
				if (audio.spatialSound!.source === 'vehicle') {
					// Get his vehicle
					const vehicle = getVehicleOfSpatialSound(audio.spatialSound!);
					if (!vehicle) continue; // Bug. Next iteration will set volume to zero.

					// If he's now inside vehicle
					if (player.vehicle === vehicle) {
						// If they have this disabled
						if (settings.carSpeakers.enabled === false) {
							// Mute audio and clear all effects.
							muteAudio();

							// Skip..
							continue;
						}

						// If he has special effects we need to clear them
						if (audio.pan !== 0) setPan(0);
						if (audio.biquadFilter) setBiquadFilter(undefined);

						// Set audio volume to normal.
						setVolume(settings.carSpeakers.volume);

						// All good let's skip now.
						continue;
					} else {
						// Check if door is opened
						const doorOpened = isVehicleDoorOpened(vehicle);

						// If they don't use the car surround system.
						if (settings.carSurroundSound.enabled === false) {
							// Mute this audio
							muteAudio();

							// Skip..
							continue;
						}

						// Calculate volume
						const volumeCalculated = calculateVolumeBasedOnDistance(distance, audio.spatialSound!.maxDistance, settings.carSurroundSound.volume); //

						// If door is now opened.
						if (doorOpened) {
							// If he had biquad filter let's remove it
							if (audio.biquadFilter) setBiquadFilter(undefined);

							// Set just a pan accordingly..
							setPan(pan);

							// Set audio volume according to distance.
							setVolume(volumeCalculated);
						} else {
							// Remove pan if they had.
							if (audio.pan !== 0) setPan(0);

							// Reduce sound by 40%
							const reduction = volumeCalculated * 0.4;
							const reducedVolume = volumeCalculated - reduction;

							// Set muffled sound
							setBiquadFilter({
								type: 'lowpass',
								frequency: 400,
								qFactor: 10
							});

							// Set audio volume according to distance.
							setVolume(reducedVolume);
						}
					}
				}

				// If the audio source is a defined position it means is a sound effect.
				if (audio.spatialSound!.source === 'position') {
					// If they have sound effects disabled
					if (settings.soundEffects.enabled === false) {
						// Mute this audio
						muteAudio();

						continue;
					}

					// Calculate volume based of audio setting
					const isNotSoundEffect = audio.spatialSound!.payload && audio.spatialSound!.payload.notSoundEffect ? true : false;
					const volumeCalculated = calculateVolumeBasedOnDistance(distance, audio.spatialSound!.maxDistance, isNotSoundEffect ? 1 : settings.soundEffects.volume);

					// Set the new panning
					setPan(pan);

					// Set volume based off distance
					setVolume(volumeCalculated);
				}

				// If the audio source is an object
				if (audio.spatialSound!.source === 'object') {
					// By default the volume coming from objects are sound effects.
					let volumeCalculated = settings.soundEffects.volume;

					// Calculating the audio volume for speakers.
					if (audio.spatialSound?.payload && audio.spatialSound.payload.isSpeaker) {
						// If they don't want to hear the speakers.
						if (settings.speakers.enabled === false) {
							// Mute this audio
							muteAudio();

							// Skip..
							continue;
						}

						// Calculate volume using this function specially made for calculating speaker voluem.
						volumeCalculated = await calculateSpeakerVolume(audio);
					}

					// Set the new panning
					setPan(pan);

					// Set volume based off distance
					setVolume(volumeCalculated);
				}
			} catch (err) {
				await logClientsideError(`natives.audio.spatialSound.iterate`, err, { audio });
			}
		}

		return true;
	} catch (err) {
		await logClientsideError(`natives.audio.task.spatialSound`, err);
		return true;
	}
};

/**
 * Starts the task of checking for spatial sound for audios.
 */

export const startTask = () => {
	// Just in case
	stopTask();

	// Set new task..
	timerId = setInterval(TaskFunction, intervalTiming);
};

/**
 * Stops the task of checking for spatial sounds for audios.
 */

export const stopTask = () => {
	if (timerId !== null) {
		clearInterval(timerId);
		timerId = null;
	}
};

export const isTaskRunning = () => (timerId === null ? false : true);
