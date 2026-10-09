import { logClientsideError } from '@client/general/errors';
import { instances, updateInstance } from '../components/data';
import { AudioInstance, playAudioOptions } from '../components/types';
import { setAudioBiquadFilter, setAudioPan, setAudioVolume } from '../components/functions';
import { getGameSettings } from '@client/natives/settings';

// Create a new camera for this function to calculate.
const camera = mp.cameras.new('gameplay');
const player = mp.players.local;

/**
 *
 * @param targetPosition Vector3
 * @returns The panning value that decides which speaker (left/right/center) will hear the most of the sound.
 */

export const calculatePanFromPosition = (position: Vector3) => {
	try {
		// Get our camera position and direction.
		let camPos = camera.getCoord();
		let camVector = camera.getDirection();

		// Calculate vector of position based off our camera pos
		let targetVector: ExpectedAny = { x: position.x - camPos.x, y: position.y - camPos.y };

		// Calculate these numbers
		let dx = targetVector.x * camVector.x + targetVector.y * camVector.y;
		let dy = mp.game.system.sqrt(camVector.x * camVector.x + camVector.y * camVector.y) * mp.game.system.sqrt(targetVector.x * targetVector.x + targetVector.y * targetVector.y);

		// calculates where point is left/right
		let s = camVector.x * (position.y - camPos.y) - camVector.y * (position.x - camPos.x);
		let a = 1;
		if (s > 0) a = -1;
		else if (s < 0) a = 1;
		else a = 0;

		// Calculating the pan effect..
		// @ts-ignore
		let pan = Math.sqrt(1 - (dx / dy).toFixed(3) * (dx / dy).toFixed(3)) * a;

		// @Tweaking: If is too small we don't want to set it for more better effects.
		if ((pan < 1 && Math.abs(pan) < 0.2) || (pan > 0 && pan < 0.2)) return 0;

		return pan;
	} catch (err) {
		logClientsideError(`audios.calculatePanFromPosition`, err, { position });
		return 0;
	}
};

/**
 *
 * @returns The instances of audio that have spatial sound attached to it. A simple way to filter.
 */

export const getAudioSourcesWithSpatialSound = () => instances.filter((c) => c.spatialSound !== undefined);

/**
 *
 * @param spatialSound
 * @returns The game position of where the sound is now.
 */

export const getPositionOfSpatialSound = (spatialSound: AudioInstance['spatialSound']) => {
	try {
		// If source is a position (easy peazy)
		if (spatialSound!.source === 'position') return spatialSound!.position;

		// If spatial sound is a vehicle (server-side)
		if (spatialSound!.source === 'vehicle') {
			// Get entity
			const vehicle = mp.vehicles.atRemoteId(spatialSound!.identifier);
			if (!vehicle) return null;

			// Return it..
			return vehicle.position;
		}

		// If spatial sound is an object (server-side)
		if (spatialSound!.source === 'object') {
			// Get entity
			const object = mp.objects.atRemoteId(spatialSound!.identifier);
			if (!object) return null;

			// Return it..
			return object.position;
		}

		return null;
	} catch (err) {
		logClientsideError(`getPositionOfSpatialSound`, err, spatialSound);
		return null;
	}
};

export const getDistanceFromPosition = (position: Vector3) =>
	mp.game.gameplay.getDistanceBetweenCoords(player.position.x, player.position.y, player.position.z, position!.x, position!.y, position!.z, true);

/**
 *
 * @param spatialSound
 * @returns The vehicle attached to this sound.
 */

export const getVehicleOfSpatialSound = (spatialSound: AudioInstance['spatialSound']) => {
	try {
		// If spatial sound is a vehicle (server-side)
		if (spatialSound!.source === 'vehicle') {
			// Get entity
			const vehicle = mp.vehicles.atRemoteId(spatialSound!.identifier);
			if (!vehicle) return null;

			// Return it..
			return vehicle;
		}

		return null;
	} catch (err) {
		logClientsideError(`getVehicleOfSpatialSound`, err, spatialSound);
		return null;
	}
};

/**
 * Checks if this vehicle has any doors opened.
 * @param vehicle
 * @returns
 */

export const isVehicleDoorOpened = (vehicle: VehicleMp) => {
	let isOpened = false;

	[0, 1, 2, 3, 4, 5, 6, 7].forEach((doorIndex) => {
		const ratio = vehicle.getDoorAngleRatio(doorIndex);

		if (ratio > 0) {
			isOpened = true;
		}
	});

	return isOpened;
};

/**
 *
 * @param distance How far the player is from location.
 * @param maxDistance The max distance they can be away from us.
 * This will tell us how loud the player should be to us, based on their distance from us.
 */

// !@Reminder: The params are different from the voice one.

export const calculateVolumeBasedOnDistance = (distance: number, maxDistance: number, maxVolume: number) => {
	const minDistance = 0.01; // Minimum distance to start applying volume changers.
	const minVolume = 0.001; // Lowest volume

	// Calculate the volume based on the distance
	let volume;
	if (distance <= minDistance) {
		// If the distance is less than or equal to the minimum distance,
		// set the volume to the maximum volume
		volume = maxVolume;
	} else if (distance >= maxDistance) {
		// If the distance is between the minimum and maximum distances,
		// calculate the normalized distance between 0 and 1
		volume = minVolume;
	} else {
		// If the distance is between the minimum and maximum distances,
		// calculate the normalized distance between 0 and 1
		const normalizedDistance = (distance - minDistance) / (maxDistance - minDistance);

		// Interpolate the volume between maxVolume and minVolume based on the normalized distance
		// The closer the distance is to the maximum distance, the lower the volume will be
		// The formula used here is linear interpolation
		volume = maxVolume - normalizedDistance * (maxVolume - minVolume);
	}

	return volume;
};

/**
 * The point of these helper functions is to avoid spamming the client-side by setting the volume the same value over and over again.
 * @param audio
 * @returns
 */

export const getSpatialAudioHelperFunctions = (audio: AudioInstance) => {
	return {
		setVolume: (value: number) => {
			// We will not allow the client-side to spam the CEF with the same value.
			if (audio.volume === value) return false;

			// Set volume
			setAudioVolume(audio.identifier, value, false);

			return true;
		},
		setPan: (value: number) => {
			if (audio.pan === value) return false;

			// Set pan
			setAudioPan(audio.identifier, value);

			// Update instance on local data
			updateInstance(audio.identifier, {
				pan: value
			});

			return true;
		},
		setBiquadFilter: (value: playAudioOptions['biquadFilter']) => {
			if (audio.biquadFilter === value) return false;

			// Update biquad filter
			setAudioBiquadFilter(audio.identifier, value);

			return true;
		},
		/**
		 * A simple function to temporary mute the sound.
		 */
		muteAudio: () => {
			// If he has special effects we need to clear them
			if (audio.pan !== 0) setAudioPan(audio.identifier, 0);
			if (audio.biquadFilter) setAudioBiquadFilter(audio.identifier, undefined);

			// Set audio volume to zero.
			setAudioVolume(audio.identifier, 0, false);
		}
	};
};

/**
 *
 * @param audio AudioInstance
 * @returns The volume for the speaker according to the audio's volume and user's preference of volume.
 */

export const calculateSpeakerVolume = async (audio: AudioInstance) => {
	try {
		// Get game settings
		const settings = getGameSettings();
		if (!settings) return 0; // Skipping yet. We need to wait for the settings.

		// Get position of the sound
		const position = getPositionOfSpatialSound(audio.spatialSound);

		// Calculate distance from position
		const distance = position ? getDistanceFromPosition(position) : 0;

		// Calculate volume of distance according to their preferred audio settings.
		const volumeCalculated = calculateVolumeBasedOnDistance(distance, audio.spatialSound!.maxDistance, settings.speakers.volume);

		// Get a percent of the audio's volume.
		const percent = audio.volume * 100; // ex: if vespify app volume is 0.3 => 30%

		// Get the final volume for this audio
		let finalVolume = (percent / 100) * volumeCalculated;

		return finalVolume;
	} catch (err) {
		await logClientsideError(`calculateSpeakerVolume`, err);
		return 0;
	}
};
